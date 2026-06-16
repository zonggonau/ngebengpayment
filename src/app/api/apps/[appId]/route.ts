import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/**
 * DELETE /api/apps/:appId
 * Delete an app and all its related transactions & logs
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { appId } = await params;

  const app = await prisma.app.findUnique({
    where: { id: parseInt(appId) },
  });

  if (!app) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  // Delete related transaction logs first, then transactions, then the app
  await prisma.$transaction(async (tx) => {
    // Get all transaction IDs for this app
    const transactions = await tx.transaction.findMany({
      where: { appId: app.id },
      select: { id: true },
    });

    const transactionIds = transactions.map((t) => t.id);

    // Delete logs for those transactions
    if (transactionIds.length > 0) {
      await tx.transactionLog.deleteMany({
        where: { transactionId: { in: transactionIds } },
      });
    }

    // Delete transactions
    await tx.transaction.deleteMany({
      where: { appId: app.id },
    });

    // Delete the app
    await tx.app.delete({
      where: { id: app.id },
    });
  });

  return NextResponse.json({ success: true });
}
