import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino/file",
          options: { destination: 1 }, // stdout
        }
      : undefined,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers['x-api-key']",
      "req.headers.cookie",
      "body.token",
      "body.password",
      "body.currentPassword",
      "body.newPassword",
    ],
    censor: "[REDACTED]",
  },
  // In production, pino outputs JSON by default (no transport needed)
  // This is ideal for log aggregation systems (CloudWatch, DataDog, etc.)
});

export default logger;
