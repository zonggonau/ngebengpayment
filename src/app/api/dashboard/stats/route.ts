import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import logger from "@/lib/logger";

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const [totalTransactions, totalApps, revenueResult, recentTransactions] =
      await Promise.all([
        prisma.transaction.count(),
        prisma.app.count(),
        prisma.transaction.aggregate({
          _sum: { grossAmount: true },
          where: { transactionStatus: "settlement" },
        }),
        prisma.transaction.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { app: { select: { name: true } } },
        }),
      ]);

    return NextResponse.json({
      totalTransactions,
      totalApps,
      totalRevenue: Number(revenueResult._sum.grossAmount || 0),
      recentTransactions: recentTransactions.map((tx) => ({
        ...tx,
        grossAmount: tx.grossAmount.toString(),
      })),
    });
  } catch (error) {
    logger.error({ error }, "Error fetching dashboard stats");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
