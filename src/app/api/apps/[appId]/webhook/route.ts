import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

/**
 * PATCH /api/apps/[appId]/webhook
 * Update webhook URL untuk aplikasi tertentu
 *
 * Body: { webhookUrl: string | null }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  try {
    const { appId } = await params;
    const id = parseInt(appId, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid app ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { webhookUrl } = body;

    // Validasi webhookUrl jika ada
    if (webhookUrl && typeof webhookUrl === "string") {
      try {
        new URL(webhookUrl);
      } catch {
        return NextResponse.json(
          { error: "Field 'webhookUrl' must be a valid URL" },
          { status: 400 }
        );
      }
    }

    // Cek apakah app exists
    const existingApp = await prisma.app.findUnique({
      where: { id },
    });

    if (!existingApp) {
      return NextResponse.json(
        { error: "App not found" },
        { status: 404 }
      );
    }

    // Update webhook URL
    const app = await prisma.app.update({
      where: { id },
      data: {
        webhookUrl: webhookUrl && typeof webhookUrl === "string" && webhookUrl.trim()
          ? webhookUrl.trim()
          : null,
      },
    });

    logger.info({ appId: app.id, appCode: app.appCode }, "Webhook URL updated");

    return NextResponse.json({
      success: true,
      data: {
        id: app.id,
        name: app.name,
        appCode: app.appCode,
        webhookUrl: app.webhookUrl,
      },
    });
  } catch (error) {
    logger.error({ error }, "Error updating webhook URL");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
