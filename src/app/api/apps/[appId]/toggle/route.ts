import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

/**
 * PATCH /api/apps/:appId/toggle
 * Toggle app active status
 */
export async function PATCH(
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

  const updated = await prisma.app.update({
    where: { id: app.id },
    data: { isActive: !app.isActive },
  });

  return NextResponse.json({ app: updated });
}
