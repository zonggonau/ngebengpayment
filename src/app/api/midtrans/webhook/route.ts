import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMidtransSignature, getAppCodeFromOrderId } from "@/lib/midtrans";
import type { MidtransNotification } from "@/lib/midtrans";
import logger from "@/lib/logger";

/**
 * POST /api/midtrans/webhook
 * Menerima notifikasi dari Midtrans
 * URL ini didaftarkan di dashboard Midtrans:
 * - Payment Notification URL: https://bangparjo.shop/api/midtrans/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body: MidtransNotification = await request.json();
    logger.info({ orderId: body.order_id, status: body.transaction_status }, "Received Midtrans notification");

    // 1. Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      logger.error("MIDTRANS_SERVER_KEY is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const isValid = verifyMidtransSignature(body, serverKey);
    if (!isValid) {
      logger.warn({ orderId: body.order_id }, "Invalid signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // 2. Get app code from order_id
    const appCode = getAppCodeFromOrderId(body.order_id);
    if (!appCode) {
      logger.warn({ orderId: body.order_id }, "Invalid order_id format");
      return NextResponse.json(
        { error: "Invalid order_id format" },
        { status: 400 }
      );
    }

    // 3. Find app by app_code
    const app = await prisma.app.findUnique({
      where: { appCode: appCode },
    });

    if (!app) {
      logger.warn({ appCode, orderId: body.order_id }, "App not found");
      return NextResponse.json(
        { error: "App not found" },
        { status: 400 }
      );
    }

    if (!app.isActive) {
      logger.warn({ appCode, orderId: body.order_id }, "App is inactive");
      return NextResponse.json(
        { error: "App is inactive" },
        { status: 400 }
      );
    }

    // 4. Extract VA number if available
    let vaNumber: string | null = null;
    if (body.va_numbers && body.va_numbers.length > 0) {
      vaNumber = body.va_numbers[0].va_number;
    }

    // 5. Upsert transaction
    const existingTransaction = await prisma.transaction.findUnique({
      where: { orderId: body.order_id },
    });

    const previousStatus = existingTransaction?.transactionStatus ?? null;

    const transaction = await prisma.transaction.upsert({
      where: { orderId: body.order_id },
      update: {
        transactionStatus: body.transaction_status,
        paymentType: body.payment_type,
        transactionTime: body.transaction_time
          ? new Date(body.transaction_time)
          : undefined,
        settlementTime: body.settlement_time
          ? new Date(body.settlement_time)
          : undefined,
        fraudStatus: body.fraud_status,
        bank: body.bank,
        vaNumber: vaNumber,
        billKey: body.bill_key,
        billerCode: body.biller_code,
        signatureKey: body.signature_key,
        statusCode: body.status_code,
        rawResponse: body as any,
      },
      create: {
        orderId: body.order_id,
        appId: app.id,
        grossAmount: body.gross_amount ? parseFloat(body.gross_amount) : 0,
        transactionStatus: body.transaction_status,
        paymentType: body.payment_type,
        transactionTime: body.transaction_time
          ? new Date(body.transaction_time)
          : null,
        settlementTime: body.settlement_time
          ? new Date(body.settlement_time)
          : null,
        fraudStatus: body.fraud_status,
        bank: body.bank,
        vaNumber: vaNumber,
        billKey: body.bill_key,
        billerCode: body.biller_code,
        signatureKey: body.signature_key,
        statusCode: body.status_code,
        rawResponse: body as any,
      },
    });

    // 6. Log status change
    if (previousStatus !== body.transaction_status) {
      await prisma.transactionLog.create({
        data: {
          transactionId: transaction.id,
          previousStatus: previousStatus,
          newStatus: body.transaction_status,
          metadata: {
            notification: body,
            previousStatus,
          } as any,
        },
      });

      logger.info(
        {
          orderId: body.order_id,
          from: previousStatus,
          to: body.transaction_status,
        },
        "Transaction status changed"
      );
    }

    // 7. Forward notification to app's webhook URL (if configured)
    if (app.webhookUrl) {
      // Payload sederhana: hanya order_id dan transaction_status
      // Untuk detail lengkap, aplikasi bisa panggil GET /api/transactions?order_id=xxx
      const payload = {
        order_id: transaction.orderId,
        transaction_status: transaction.transactionStatus,
      };

      logger.info(
        { orderId: body.order_id, webhookUrl: app.webhookUrl },
        "Forwarding notification to app webhook"
      );

      // Fire and forget - jangan block response
      fetch(app.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": app.apiKey,
          "User-Agent": "NgebengPayment-Webhook/1.0",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) {
            logger.warn(
              {
                orderId: body.order_id,
                webhookUrl: app.webhookUrl,
                statusCode: res.status,
              },
              "App webhook responded with error"
            );
          } else {
            logger.info(
              { orderId: body.order_id, webhookUrl: app.webhookUrl },
              "App webhook forwarded successfully"
            );
          }
        })
        .catch((error) => {
          logger.error(
            { orderId: body.order_id, webhookUrl: app.webhookUrl, error },
            "Failed to forward notification to app webhook"
          );
        });
    }

    logger.info({ orderId: body.order_id }, "Transaction processed successfully");

    return NextResponse.json({
      success: true,
      message: "OK",
    });
  } catch (error) {
    logger.error({ error }, "Error processing Midtrans notification");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
