import { Hono } from "hono";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db, schema } from "../../db/index.js";
import { confirmBooking } from "../bookings/bookings.service.js";
import { initiateTelebirrPayment, verifyTelebirrWebhook } from "./telebirr.service.js";
import { initiateCbeBirrPayment, verifyCbeBirrWebhook } from "./cbebirr.service.js";
import { checkIdempotency, saveIdempotencyResult } from "../../utils/idempotency.js";
import { optionalAuth } from "../../middleware/auth.middleware.js";
import { apiRateLimit } from "../../middleware/rate-limit.js";
import { validateBody } from "../../middleware/validate.js";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const InitiatePaymentSchema = z.object({
  bookingId: z.string().uuid(),
  gateway: z.enum(["telebirr", "cbebirr"]),
  returnUrl: z.string().url().optional(),
});

// ─── Router ───────────────────────────────────────────────────────────────────

export const paymentsRoutes = new Hono();

/**
 * POST /api/v1/payments/initiate
 * Initiate a payment for a confirmed booking via Telebirr or CBE Birr.
 * Supports idempotency via X-Idempotency-Key header.
 */
paymentsRoutes.post(
  "/initiate",
  optionalAuth,
  apiRateLimit,
  validateBody(InitiatePaymentSchema),
  async (c) => {
    const { bookingId, gateway, returnUrl } = c.get("validatedBody") as z.infer<
      typeof InitiatePaymentSchema
    >;

    const idempotencyKey = c.req.header("X-Idempotency-Key");

    // Return cached result if idempotency key was seen before
    if (idempotencyKey) {
      const cached = await checkIdempotency(idempotencyKey);
      if (cached) return c.json(cached);
    }

    const [booking] = await db
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.id, bookingId))
      .limit(1);

    if (!booking) throw new HTTPException(404, { message: "Booking not found" });

    if (booking.status !== "reserved" && booking.status !== "pending") {
      throw new HTTPException(409, {
        message: `Booking is in status "${booking.status}" and cannot be paid`,
      });
    }

    // Fetch the event title for payment subject
    const [event] = await db
      .select({ title: schema.events.title })
      .from(schema.events)
      .where(eq(schema.events.id, booking.eventId))
      .limit(1);

    const subject = `${event?.title ?? "Event"} — ${booking.quantity} ticket(s)`;

    let result: { paymentUrl: string; referenceId: string };

    if (gateway === "telebirr") {
      const res = await initiateTelebirrPayment({
        bookingId,
        amount: String(booking.totalAmount),
        currency: booking.currency,
        subject,
        returnUrl,
      });
      result = { paymentUrl: res.paymentUrl, referenceId: res.outTradeNo };
    } else {
      const res = await initiateCbeBirrPayment({
        bookingId,
        amount: String(booking.totalAmount),
        currency: booking.currency,
        description: subject,
        returnUrl,
      });
      result = { paymentUrl: res.paymentUrl, referenceId: res.referenceId };
    }

    // Persist payment record
    await db.insert(schema.payments).values({
      bookingId,
      gateway,
      gatewayRequestId: result.referenceId,
      amount: String(booking.totalAmount),
      currency: booking.currency,
      status: "pending",
      idempotencyKey: idempotencyKey ?? result.referenceId,
    });

    const response = { paymentUrl: result.paymentUrl, referenceId: result.referenceId };

    if (idempotencyKey) {
      await saveIdempotencyResult(idempotencyKey, response);
    }

    return c.json(response);
  }
);

/**
 * POST /api/v1/payments/webhook/telebirr
 * Telebirr webhook callback — verify signature and confirm booking.
 */
paymentsRoutes.post("/webhook/telebirr", async (c) => {
  const body = await c.req.json<Record<string, string>>();
  const receivedSign = body["sign"] ?? "";

  const payload = verifyTelebirrWebhook(body, receivedSign);

  if (payload.tradeStatus !== "TRADE_SUCCESS") {
    return c.json({ code: "0", message: "Acknowledged non-success status" });
  }

  await handlePaymentSuccess(payload.outTradeNo, payload.tradeNo, "telebirr", body);
  return c.json({ code: "0", message: "OK" });
});

/**
 * POST /api/v1/payments/webhook/cbebirr
 * CBE Birr webhook callback — verify signature and confirm booking.
 */
paymentsRoutes.post("/webhook/cbebirr", async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header("X-Signature") ?? "";

  const payload = verifyCbeBirrWebhook(rawBody, signature);

  if (payload.status !== "SUCCESS") {
    return c.json({ success: true, message: "Acknowledged non-success status" });
  }

  await handlePaymentSuccess(payload.referenceId, payload.transactionId, "cbebirr", JSON.parse(rawBody));
  return c.json({ success: true });
});

// ─── Shared webhook handler ───────────────────────────────────────────────────

async function handlePaymentSuccess(
  gatewayRequestId: string,
  transactionId: string,
  gateway: "telebirr" | "cbebirr",
  webhookPayload: unknown
) {
  await db.transaction(async (tx) => {
    const [payment] = await tx
      .select()
      .from(schema.payments)
      .where(eq(schema.payments.gatewayRequestId, gatewayRequestId))
      .limit(1)
      .for("update");

    if (!payment) {
      console.warn(`[Payment] Unknown gatewayRequestId: ${gatewayRequestId}`);
      return;
    }

    // Idempotent — already processed
    if (payment.status === "completed") return;

    await tx
      .update(schema.payments)
      .set({
        status: "completed",
        transactionId,
        webhookPayload: webhookPayload as Record<string, unknown>,
        processedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.payments.id, payment.id));

    await confirmBooking(payment.bookingId);
  });
}
