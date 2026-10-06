import { Worker, Queue, QueueEvents, type Job } from "bullmq";
import { Redis } from "ioredis";

/**
 * BullMQ SMS & notification worker.
 *
 * Handles:
 *   - ticket-confirmed  → send QR ticket SMS to attendee
 *   - event-reminder    → send reminder SMS 24h before event
 *   - booking-expired   → notify user that reservation expired
 *
 * Required env vars:
 *   REDIS_URL
 *   SMS_PROVIDER           "africastalking" | "ethiotelecom"
 *   AFRICASTALKING_API_KEY
 *   AFRICASTALKING_USERNAME
 *   AFRICASTALKING_SENDER_ID (optional)
 */

// ─── Queue names ──────────────────────────────────────────────────────────────

export const SMS_QUEUE = "sms";
export const REMINDER_QUEUE = "event-reminders";

// ─── Job payload types ────────────────────────────────────────────────────────

export interface TicketConfirmedJob {
  type: "ticket-confirmed";
  phone: string;
  name: string;
  eventTitle: string;
  ticketId: string;
  qrUuid: string;
  eventDate: string;
  venue?: string;
}

export interface EventReminderJob {
  type: "event-reminder";
  phone: string;
  name: string;
  eventTitle: string;
  eventDate: string;
  venue?: string;
}

export interface BookingExpiredJob {
  type: "booking-expired";
  phone: string;
  name: string;
  eventTitle: string;
}

export type SmsJob = TicketConfirmedJob | EventReminderJob | BookingExpiredJob;

// ─── Redis connection ─────────────────────────────────────────────────────────

function createRedisConnection(): Redis {
  if (!process.env.REDIS_URL) throw new Error("REDIS_URL is not set");
  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
  });
}

// ─── Queue instances (for enqueueing from other modules) ──────────────────────

export function getSmsQueue(): Queue<SmsJob> {
  return new Queue<SmsJob>(SMS_QUEUE, {
    connection: createRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 5_000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 200 },
    },
  });
}

// ─── SMS sender ───────────────────────────────────────────────────────────────

async function sendSms(to: string, message: string): Promise<void> {
  const provider = process.env.SMS_PROVIDER ?? "africastalking";

  if (provider === "africastalking") {
    const { AFRICASTALKING_API_KEY, AFRICASTALKING_USERNAME, AFRICASTALKING_SENDER_ID } =
      process.env;

    if (!AFRICASTALKING_API_KEY || !AFRICASTALKING_USERNAME) {
      throw new Error("Africa's Talking credentials not configured");
    }

    const params = new URLSearchParams({
      username: AFRICASTALKING_USERNAME,
      to,
      message,
      ...(AFRICASTALKING_SENDER_ID ? { from: AFRICASTALKING_SENDER_ID } : {}),
    });

    const response = await fetch(
      "https://api.africastalking.com/version1/messaging",
      {
        method: "POST",
        headers: {
          apiKey: AFRICASTALKING_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Africa's Talking SMS failed: ${text}`);
    }
  } else {
    // Ethio Telecom Bulk SMS — placeholder for when credentials are available
    console.warn(`[SMS] Provider "${provider}" not fully implemented. Message: ${message}`);
  }
}

// ─── Message builders ─────────────────────────────────────────────────────────

function buildMessage(job: SmsJob): string {
  switch (job.type) {
    case "ticket-confirmed":
      return (
        `Hi ${job.name}! Your ticket for "${job.eventTitle}" is confirmed.\n` +
        `Date: ${job.eventDate}\n` +
        `${job.venue ? `Venue: ${job.venue}\n` : ""}` +
        `Ticket ID: ${job.ticketId}\n` +
        `Show this message at entry or scan your QR code in the app.`
      );

    case "event-reminder":
      return (
        `Reminder: "${job.eventTitle}" is tomorrow!\n` +
        `Date: ${job.eventDate}\n` +
        `${job.venue ? `Venue: ${job.venue}` : ""}`
      );

    case "booking-expired":
      return (
        `Hi ${job.name}, your reservation for "${job.eventTitle}" has expired ` +
        `because payment was not completed in time. You can book again on AddisEvent.`
      );
  }
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export function startSmsWorker(): Worker<SmsJob> {
  const worker = new Worker<SmsJob>(
    SMS_QUEUE,
    async (job: Job<SmsJob>) => {
      const { data } = job;
      const phone = data.phone;
      const message = buildMessage(data);

      console.log(`[SMS Worker] Sending "${data.type}" to ${phone}`);
      await sendSms(phone, message);
      console.log(`[SMS Worker] Sent "${data.type}" to ${phone}`);
    },
    {
      connection: createRedisConnection(),
      concurrency: 5,
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[SMS Worker] Job ${job?.id} failed:`, err.message);
  });

  worker.on("error", (err) => {
    console.error("[SMS Worker] Worker error:", err);
  });

  console.log("[SMS Worker] Started");
  return worker;
}

// ─── Enqueue helpers (used by other services) ─────────────────────────────────

const _queue = getSmsQueue();

export async function enqueueSms(job: SmsJob, opts?: { delay?: number }) {
  await _queue.add(job.type, job, { delay: opts?.delay });
}
