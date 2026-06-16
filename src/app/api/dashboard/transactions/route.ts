import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/**
 * GET /api/dashboard/transactions
 * Get all transactions for dashboard
 */
export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { app: { select: { name: true, appCode: true } } },
  });

  return NextResponse.json({
    transactions: transactions.map((tx) => ({
      ...tx,
      grossAmount: tx.grossAmount.toString(),
    })),
  });
}
