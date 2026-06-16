"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken, verifyToken } from "@/lib/auth";
import logger from "@/lib/logger";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { error: "Invalid username or password" };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { error: "Invalid username or password" };
    }

    const token = generateToken({
      userId: String(user.id),
      username: user.username,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    logger.info({ username }, "User logged in via server action");

    return { success: true, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
  } catch (error) {
    logger.error({ error }, "Login action error");
    return { error: "Internal server error" };
  }
}

export async function registerAction(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!username || !email || !password) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      return { error: "Username or email already exists" };
    }

    const { hashPassword } = await import("@/lib/auth");
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, role: "admin" },
      select: { id: true, username: true, email: true, role: true, createdAt: true },
    });

    logger.info({ username, email }, "New user registered via server action");

    return { success: true, user };
  } catch (error) {
    logger.error({ error }, "Register action error");
    return { error: "Internal server error" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return { success: true };
}

export async function getSessionAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { user: null };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return { user: null };
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      select: { id: true, username: true, email: true, role: true },
    });

    return { user };
  } catch {
    return { user: null };
  }
}
