import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/midtrans";
import logger from "@/lib/logger";

/**
 * POST /api/apps/register
 * Mendaftarkan aplikasi baru dan mendapatkan API Key
 *
 * Body: { name: string, appCode: string, webhookUrl?: string }
 * - name: Nama aplikasi (contoh: "Aplikasi 1")
 * - appCode: Kode unik aplikasi (contoh: "APK1") - akan digunakan di order_id
 * - webhookUrl: URL endpoint aplikasi Anda untuk menerima notifikasi status transaksi
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, appCode, webhookUrl } = body;

    // Validasi input
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Field 'name' is required and must be a string" },
        { status: 400 }
      );
    }

    if (!appCode || typeof appCode !== "string") {
      return NextResponse.json(
        { error: "Field 'appCode' is required and must be a string" },
        { status: 400 }
      );
    }

    // Validasi format appCode (hanya alfanumerik dan underscore)
    if (!/^[A-Za-z0-9_]+$/.test(appCode)) {
      return NextResponse.json(
        { error: "appCode must only contain alphanumeric characters and underscores" },
        { status: 400 }
      );
    }

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

    // Cek apakah appCode sudah terdaftar
    const existingApp = await prisma.app.findUnique({
      where: { appCode },
    });

    if (existingApp) {
      return NextResponse.json(
        { error: `App with appCode '${appCode}' already exists` },
        { status: 409 }
      );
    }

    // Generate API Key
    const apiKey = generateApiKey();

    // Simpan ke database
    const app = await prisma.app.create({
      data: {
        name,
        appCode,
        apiKey,
        ...(webhookUrl ? { webhookUrl } : {}),
      },
    });

    logger.info({ appId: app.id, appCode, hasWebhook: !!webhookUrl }, "New app registered");

    return NextResponse.json(
      {
        success: true,
        data: {
          id: app.id,
          name: app.name,
          appCode: app.appCode,
          apiKey: app.apiKey,
          webhookUrl: app.webhookUrl,
          isActive: app.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error({ error }, "Error registering app");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/apps/register
 * Mendapatkan daftar semua aplikasi yang terdaftar
 */
export async function GET(request: NextRequest) {
  try {
    const apps = await prisma.app.findMany({
      select: {
        id: true,
        name: true,
        appCode: true,
        isActive: true,
        createdAt: true,
        // Jangan expose apiKey di list
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: apps,
    });
  } catch (error) {
    logger.error({ error }, "Error listing apps");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
