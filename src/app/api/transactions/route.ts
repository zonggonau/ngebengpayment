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
