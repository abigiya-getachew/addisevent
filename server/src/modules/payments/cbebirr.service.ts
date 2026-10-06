import { HTTPException } from "hono/http-exception";
import crypto from "crypto";

/**
 * CBE Birr Merchant API integration.
 *
 * Required env vars:
 *   CBEBIRR_MERCHANT_ID      - Merchant ID assigned by CBE
 *   CBEBIRR_API_KEY          - API key for request signing
 *   CBEBIRR_API_BASE         - Base URL (sandbox vs production)
 *   CBEBIRR_NOTIFY_URL       - Webhook callback URL
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CbeBirrInitiateInput {
  bookingId: string;
  amount: string;     // e.g. "500.00"
  currency: string;   // "ETB"
  description: string;
  notifyUrl?: string;
  returnUrl?: string;
}

export interface CbeBirrInitiateResult {
  paymentUrl: string;
  referenceId: string;
  rawResponse: unknown;
}

export interface CbeBirrWebhookPayload {
  referenceId: string;
  transactionId: string;
  status: string;       // "SUCCESS" | "FAILED" | "PENDING"
  amount: string;
  phoneNumber?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getConfig() {
  const { CBEBIRR_MERCHANT_ID, CBEBIRR_API_KEY, CBEBIRR_NOTIFY_URL } = process.env;

  if (!CBEBIRR_MERCHANT_ID || !CBEBIRR_API_KEY) {
    throw new HTTPException(500, { message: "CBE Birr credentials not configured" });
  }

  return {
    merchantId: CBEBIRR_MERCHANT_ID,
    apiKey: CBEBIRR_API_KEY,
    notifyUrl: CBEBIRR_NOTIFY_URL ?? "",
    apiBase: process.env.CBEBIRR_API_BASE ?? "https://api.cbebirr.com/v1",
  };
}

function buildHmacSignature(
  data: string,
  secret: string
): string {
  return crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex");
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Initiate a CBE Birr payment.
 */
export async function initiateCbeBirrPayment(
  input: CbeBirrInitiateInput
): Promise<CbeBirrInitiateResult> {
  const cfg = getConfig();

  const referenceId = `CBE-${input.bookingId}-${Date.now()}`;
  const timestamp = new Date().toISOString();

  const requestBody = {
    merchantId: cfg.merchantId,
    referenceId,
    amount: input.amount,
    currency: input.currency,
    description: input.description,
    notifyUrl: input.notifyUrl ?? cfg.notifyUrl,
    returnUrl: input.returnUrl ?? "",
    timestamp,
  };

  // Sign the canonical JSON body
  const signature = buildHmacSignature(
    JSON.stringify(requestBody),
    cfg.apiKey
  );

  const response = await fetch(`${cfg.apiBase}/payment/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Merchant-Id": cfg.merchantId,
      "X-Signature": signature,
      "X-Timestamp": timestamp,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new HTTPException(502, { message: "CBE Birr API request failed" });
  }

  const data = (await response.json()) as {
    success: boolean;
    message?: string;
    paymentUrl?: string;
  };

  if (!data.success || !data.paymentUrl) {
    throw new HTTPException(502, {
      message: `CBE Birr error: ${data.message ?? "Unknown error"}`,
    });
  }

  return {
    paymentUrl: data.paymentUrl,
    referenceId,
    rawResponse: data,
  };
}

/**
 * Verify an incoming CBE Birr webhook.
 */
export function verifyCbeBirrWebhook(
  rawBody: string,
  receivedSignature: string
): CbeBirrWebhookPayload {
  const cfg = getConfig();

  const expectedSignature = buildHmacSignature(rawBody, cfg.apiKey);
  if (!crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(receivedSignature, "hex")
  )) {
    throw new HTTPException(400, { message: "Invalid CBE Birr webhook signature" });
  }

  const body = JSON.parse(rawBody) as CbeBirrWebhookPayload;
  return body;
}
