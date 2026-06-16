import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

/**
 * GET /api/cron/notify-webhooks
 *
 * Cron job untuk mengirim notifikasi webhook ke aplikasi klien
 * secara periodik. Panggil endpoint ini setiap 1-5 menit dari:
 * - Vercel Cron Jobs
 * - Uptime monitor (cron-job.org, etc.)
 * - Atau dari dalam aplikasi dengan setInterval
 *
 * Cara kerja:
 * 1. Cari transaksi dengan status TIDAK "pending" yang webhooknya
 *    belum pernah dikirim (berdasarkan transaction_log)
 * 2. Kirim notifikasi ke webhook URL aplikasi
 * 3. Catat pengiriman di transaction_log
 */
export async function GET() {
  try {
    logger.info("Cron job: Checking for pending webhook notifications");

    // Cari transaksi yang sudah memiliki status final (bukan "pending")
    // dan belum pernah dikirim notifikasi webhooknya
    const transactions = await prisma.transaction.findMany({
      where: {
        transactionStatus: {
          not: "pending",
        },
        app: {
          webhookUrl: { not: null },
          isActive: true,
        },
      },
      include: {
        app: {
          select: {
            id: true,
            name: true,
            appCode: true,
            apiKey: true,
            webhookUrl: true,
          },
        },
        logs: {
          where: {
            metadata: {
              path: ["webhook_sent"],
              not: undefined,
            },
          },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });

    // Filter: hanya transaksi yang BELUM pernah dikirim webhooknya
    const pendingNotifications = transactions.filter(
      (tx) => tx.logs.length === 0
    );

    if (pendingNotifications.length === 0) {
      logger.info("Cron job: No pending webhook notifications");
      return NextResponse.json({
        success: true,
        processed: 0,
        message: "No pending notifications",
      });
    }

    logger.info(
      { count: pendingNotifications.length },
      "Cron job: Processing pending webhook notifications"
    );

    const results: Array<{
      orderId: string;
      appCode: string;
      status: "sent" | "failed";
      error?: string;
    }> = [];

    for (const transaction of pendingNotifications) {
      const app = transaction.app;
      if (!app.webhookUrl) continue;

      const payload = {
        event: "payment.update",
        order_id: transaction.orderId,
        transaction_status: transaction.transactionStatus,
        payment_type: transaction.paymentType,
        gross_amount: transaction.grossAmount.toString(),
        transaction_time: transaction.transactionTime?.toISOString(),
        settlement_time: transaction.settlementTime?.toISOString(),
        fraud_status: transaction.fraudStatus,
        bank: transaction.bank,
        va_number: transaction.vaNumber,
      };

      try {
        const res = await fetch(app.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": app.apiKey,
            "X-Webhook-Event": "payment.update",
            "User-Agent": "NgebengPayment-CronWebhook/1.0",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          // Catat bahwa webhook sudah terkirim
          await prisma.transactionLog.create({
            data: {
              transactionId: transaction.id,
              previousStatus: transaction.transactionStatus,
              newStatus: transaction.transactionStatus,
              metadata: {
                webhook_sent: true,
                webhook_url: app.webhookUrl,
                sent_at: new Date().toISOString(),
                via: "cron",
              } as any,
            },
          });

          logger.info(
            {
              orderId: transaction.orderId,
              appCode: app.appCode,
            },
            "Cron job: Webhook sent successfully"
          );

          results.push({
            orderId: transaction.orderId,
            appCode: app.appCode,
            status: "sent",
          });
        } else {
          const errorText = await res.text();
          logger.warn(
            {
              orderId: transaction.orderId,
              appCode: app.appCode,
              statusCode: res.status,
              response: errorText,
            },
            "Cron job: Webhook failed"
          );

          results.push({
            orderId: transaction.orderId,
            appCode: app.appCode,
            status: "failed",
            error: `HTTP ${res.status}: ${errorText}`,
          });
        }
      } catch (error) {
        logger.error(
          {
            orderId: transaction.orderId,
            appCode: app.appCode,
            error,
          },
          "Cron job: Webhook request failed"
        );

        results.push({
          orderId: transaction.orderId,
          appCode: app.appCode,
          status: "failed",
          error: String(error),
        });
      }
    }

    const sentCount = results.filter((r) => r.status === "sent").length;
    const failedCount = results.filter((r) => r.status === "failed").length;

    logger.info(
      { sent: sentCount, failed: failedCount },
      "Cron job: Finished processing webhook notifications"
    );

    return NextResponse.json({
      success: true,
      processed: results.length,
      sent: sentCount,
      failed: failedCount,
      results,
    });
  } catch (error) {
    logger.error({ error }, "Cron job: Error processing webhook notifications");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
