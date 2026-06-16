import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedApp } from "@/lib/api-auth";
import logger from "@/lib/logger";

/**
 * GET /api/transactions
 * Mendapatkan daftar transaksi (untuk Pull API oleh apps)
 *
 * Query params:
 * - order_id: string (optional) - Filter by order_id
 * - status: string (optional) - Filter by transaction_status
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 *
 * Headers:
 * - X-API-Key: API Key aplikasi
 */
/**
 * POST /api/transactions
 * Membuat transaksi baru (Snap Redirect) untuk aplikasi klien
 *
 * Body (JSON):
 * - order_id: string (required) - ID unik pesanan dari aplikasi
 * - gross_amount: number (required) - Jumlah pembayaran
 * - customer_details: object (optional) - Detail pelanggan
 *   - first_name: string
 *   - last_name: string
 *   - email: string
 *   - phone: string
 *
 * Headers:
 * - X-API-Key: API Key aplikasi
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API Key
    const auth = await getAuthenticatedApp(request);
    if ("error" in auth) {
      return auth.error;
    }
    const app = auth.app;

    // Parse request body
    const body = await request.json();
    const { order_id, gross_amount, customer_details } = body;

    // Validate required fields
    if (!order_id || !gross_amount) {
      return NextResponse.json(
        { error: "order_id and gross_amount are required" },
        { status: 400 }
      );
    }

    // Check for duplicate order_id
    const existing = await prisma.transaction.findUnique({
      where: { orderId: order_id },
    });

    if (existing) {
      return NextResponse.json(
        { error: "order_id already exists" },
        { status: 409 }
      );
    }

    // Determine Midtrans API URL (sandbox vs production based on server key prefix)
    const isSandbox = process.env.MIDTRANS_SERVER_KEY?.startsWith("SB-");
    const midtransApiUrl = isSandbox
      ? "https://app.sandbox.midtrans.com"
      : "https://app.midtrans.com";

    // Generate Snap Redirect URL via Midtrans
    const authString = Buffer.from(
      process.env.MIDTRANS_SERVER_KEY + ":"
    ).toString("base64");

    const midtransPayload = {
      transaction_details: {
        order_id,
        gross_amount,
      },
      customer_details: customer_details || {
        first_name: "Customer",
        email: "customer@example.com",
      },
      credit_card: {
        secure: true,
      },
    };

    const midtransResponse = await fetch(
      `${midtransApiUrl}/snap/v1/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(midtransPayload),
      }
    );

    const midtransData = await midtransResponse.json();

    if (!midtransResponse.ok) {
      logger.error(
        { midtransError: midtransData, order_id, status: midtransResponse.status },
        "Midtrans transaction creation failed"
      );
      return NextResponse.json(
        { error: "Failed to create transaction", details: midtransData },
        { status: 502 }
      );
    }

    // Save transaction to database
    const transaction = await prisma.transaction.create({
      data: {
        orderId: order_id,
        appId: app.id,
        grossAmount: gross_amount,
        transactionStatus: "pending",
        transactionTime: new Date(),
        rawResponse: midtransData,
      },
    });

    logger.info(
      { order_id, appCode: app.appCode, transactionId: transaction.id },
      "Transaction created"
    );

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        order_id: transaction.orderId,
        redirect_url: midtransData.redirect_url,
        token: midtransData.token,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error creating transaction");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Validate API Key
    const auth = await getAuthenticatedApp(request);
    if ("error" in auth) {
      return auth.error;
    }
    const app = auth.app;

    // Parse query params
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {
      appId: app.id,
    };

    if (orderId) {
      where.orderId = orderId;
    }

    if (status) {
      where.transactionStatus = status;
    }

    // Get transactions
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: where as any,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          orderId: true,
          grossAmount: true,
          transactionStatus: true,
          paymentType: true,
          transactionTime: true,
          settlementTime: true,
          fraudStatus: true,
          bank: true,
          vaNumber: true,
          createdAt: true,
        },
      }),
      prisma.transaction.count({
        where: where as any,
      }),
    ]);

    logger.info(
      { appCode: app.appCode, total, page },
      "Transactions fetched"
    );

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error({ error }, "Error fetching transactions");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
