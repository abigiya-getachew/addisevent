import { HTTPException } from "hono/http-exception";
import crypto from "crypto";

/**
 * Telebirr Merchant API integration.
 *
 * Docs reference: Telebirr H5 Web Pay & Direct Merchant API
 * All values come from environment variables — never hardcode credentials.
 *
 * Required env vars:
 *   TELEBIRR_APP_ID        - Merchant app ID
 *   TELEBIRR_APP_KEY       - Merchant app key (for signing)
 *   TELEBIRR_SHORT_CODE    - Merchant short code
 *   TELEBIRR_PUBLIC_KEY    - Telebirr public key (RSA, for encrypting ussd_push params)
 *   TELEBIRR_NOTIFY_URL    - Webhook callback URL
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TelebirrInitiateInput {
  bookingId: string;
  amount: string;       // e.g. "500.00"
  currency: string;     // "ETB"
  subject: string;      // e.g. "Addis Music Fest — General x2"
  notifyUrl?: string;
  returnUrl?: string;
}

export interface TelebirrInitiateResult {
  paymentUrl: string;
  outTradeNo: string;   // Our idempotency ref
  rawResponse: unknown;
}

export interface TelebirrWebhookPayload {
  outTradeNo: string;
  tradeNo: string;      // Telebirr transaction ID
  tradeStatus: string;  // "TRADE_SUCCESS" | "TRADE_CLOSED" | ...
  totalAmount: string;
  msisdn?: string;      // Payer phone
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getConfig() {
  const { TELEBIRR_APP_ID, TELEBIRR_APP_KEY, TELEBIRR_SHORT_CODE, TELEBIRR_PUBLIC_KEY, TELEBIRR_NOTIFY_URL } =
    process.env;

  if (!TELEBIRR_APP_ID || !TELEBIRR_APP_KEY || !TELEBIRR_SHORT_CODE || !TELEBIRR_PUBLIC_KEY) {
    throw new HTTPException(500, { message: "Telebirr credentials not configured" });
  }

  return {
    appId: TELEBIRR_APP_ID,
    appKey: TELEBIRR_APP_KEY,
    shortCode: TELEBIRR_SHORT_CODE,
    publicKey: TELEBIRR_PUBLIC_KEY,
    notifyUrl: TELEBIRR_NOTIFY_URL ?? "",
    apiBase: process.env.TELEBIRR_API_BASE ?? "https://196.188.120.3:38443/apiaccess",
  };
}

/**
 * Build the HMAC-SHA256 signature for the Telebirr request.
 * The signature covers specific fields joined by "&" then hashed with the app key.
 */
function buildSignature(params: Record<string, string>, appKey: string): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHmac("sha256", appKey).update(sorted).digest("hex").toUpperCase();
}

/**
 * Encrypt the ussd_push parameter object with Telebirr's RSA public key.
 * The plaintext is JSON-stringified, encrypted with PKCS1_OAEP.
 */
function encryptPayload(payload: object, publicKeyPem: string): string {
  const plaintext = JSON.stringify(payload);
  const encrypted = crypto.publicEncrypt(
    { key: publicKeyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    Buffer.from(plaintext, "utf-8")
  );
  return encrypted.toString("base64");
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Initiate a Telebirr payment.
 * Returns the payment URL to redirect the user to.
 */
export async function initiateTelebirrPayment(
  input: TelebirrInitiateInput
): Promise<TelebirrInitiateResult> {
  const cfg = getConfig();

  const timestamp = Date.now().toString();
  const outTradeNo = `TB-${input.bookingId}-${timestamp}`;

  const innerPayload = {
    appId: cfg.appId,
    shortCode: cfg.shortCode,
    outTradeNo,
    subject: input.subject,
    totalAmount: input.amount,
    timeoutExpress: "30",           // 30 minutes expiry
    notifyUrl: input.notifyUrl ?? cfg.notifyUrl,
    returnUrl: input.returnUrl ?? "",
    nonce: crypto.randomBytes(8).toString("hex"),
    timestamp,
  };

  const ussdPush = encryptPayload(innerPayload, cfg.publicKey);

  const reqParams: Record<string, string> = {
    appId: cfg.appId,
    sign: buildSignature({ appId: cfg.appId, timestamp, ussdPush }, cfg.appKey),
    timestamp,
    ussdPush,
  };

  const response = await fetch(`${cfg.apiBase}/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqParams),
  });

  if (!response.ok) {
    throw new HTTPException(502, { message: "Telebirr API request failed" });
  }

  const data = (await response.json()) as { code: string; message: string; data?: { toPayUrl: string } };

  if (data.code !== "0" || !data.data?.toPayUrl) {
    throw new HTTPException(502, {
      message: `Telebirr error: ${data.message ?? "Unknown error"}`,
    });
  }

  return {
    paymentUrl: data.data.toPayUrl,
    outTradeNo,
    rawResponse: data,
  };
}

/**
 * Verify an incoming Telebirr webhook callback.
 * Returns the parsed payload if the signature is valid, throws otherwise.
 */
export function verifyTelebirrWebhook(
  body: Record<string, string>,
  receivedSign: string
): TelebirrWebhookPayload {
  const cfg = getConfig();

  const { sign: _omit, ...signable } = body;
  const expectedSign = buildSignature(signable as Record<string, string>, cfg.appKey);

  if (expectedSign !== receivedSign) {
    throw new HTTPException(400, { message: "Invalid Telebirr webhook signature" });
  }

  return {
    outTradeNo: body["outTradeNo"]!,
    tradeNo: body["tradeNo"]!,
    tradeStatus: body["tradeStatus"]!,
    totalAmount: body["totalAmount"]!,
    msisdn: body["msisdn"],
  };
}
