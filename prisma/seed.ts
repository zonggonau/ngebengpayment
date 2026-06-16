import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "crypto";

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

function generateApiKey(): string {
  return `ngebeng_${crypto.randomBytes(32).toString("hex")}`;
}

async function main() {
  console.log("Seeding database...");

  // Seed default admin user
  const existingUser = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (!existingUser) {
    // Hash password menggunakan bcrypt
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@ngebengpayment.com",
        password: hashedPassword,
        role: "admin",
      },
    });
    console.log("Created admin user: admin / admin123");
  } else {
    console.log("Admin user already exists");
  }

  // Seed default apps
  const apps = [
    { name: "Aplikasi 1", appCode: "APK1" },
    { name: "Aplikasi 2", appCode: "APK2" },
    { name: "Aplikasi 3", appCode: "APK3" },
  ];

  for (const appData of apps) {
    const existing = await prisma.app.findUnique({
      where: { appCode: appData.appCode },
    });

    if (!existing) {
      const app = await prisma.app.create({
        data: {
          ...appData,
          apiKey: generateApiKey(),
        },
      });
      console.log(`Created app: ${app.name} (${app.appCode})`);
      console.log(`  API Key: ${app.apiKey}`);
    } else {
      console.log(`App already exists: ${appData.appCode}`);
    }
  }

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
