import crypto from "crypto";

/**
 * Midtrans notification payload interface
 */
export interface MidtransNotification {
  transaction_id?: string;
  order_id: string;
  gross_amount?: string;
  transaction_status: string;
  payment_type?: string;
  transaction_time?: string;
  settlement_time?: string;
  fraud_status?: string;
  bank?: string;
  va_numbers?: Array<{ bank: string; va_number: string }>;
  bill_key?: string;
  biller_code?: string;
  signature_key?: string;
  status_code?: string;
  [key: string]: unknown;
}

/**
 * Verify Midtrans notification signature
 * Signature = SHA512(order_id + status_code + gross_amount + server_key)
 */
export function verifyMidtransSignature(
  notification: MidtransNotification,
  serverKey: string
): boolean {
  const { order_id, status_code, gross_amount, signature_key } = notification;

  if (!order_id || !status_code || !gross_amount || !signature_key) {
    return false;
  }

  const hash = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  return hash === signature_key;
}

/**
 * Get the app code from order_id
 * Format: {app_code}_{unique_number}
 * Example: APK1_20260612_0001
 */
export function getAppCodeFromOrderId(orderId: string): string | null {
  const parts = orderId.split("_");
  if (parts.length < 2) return null;
  return parts[0];
}

/**
 * Generate a unique API key
 */
export function generateApiKey(): string {
  return `ngebeng_${crypto.randomBytes(32).toString("hex")}`;
}
