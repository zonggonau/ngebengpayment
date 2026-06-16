import { prisma } from "@/lib/prisma";
import type { App } from "@/generated/prisma/client";

/**
 * Validate an API key and return the associated app.
 * Returns null if the API key is invalid or the app is inactive.
 */
export async function validateApiKey(apiKey: string): Promise<App | null> {
  const app = await prisma.app.findUnique({
    where: { apiKey },
  });

  if (!app || !app.isActive) {
    return null;
  }

  return app;
}

/**
 * Get authenticated app from request headers.
 * The middleware sets x-api-key-authenticated header after basic validation.
 * This function does the actual database lookup.
 */
export async function getAuthenticatedApp(
  request: Request
): Promise<{ app: App } | { error: Response }> {
  const apiKey = request.headers.get("x-api-key-authenticated");

  if (!apiKey) {
    return {
      error: new Response(
        JSON.stringify({ error: "Unauthorized - API Key is required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  const app = await validateApiKey(apiKey);

  if (!app) {
    return {
      error: new Response(
        JSON.stringify({ error: "Invalid or inactive API Key" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  return { app };
}
