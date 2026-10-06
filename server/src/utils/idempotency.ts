import { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";

/**
 * Idempotency key utilities.
 *
 * Idempotency keys prevent duplicate booking and payment confirmations
 * when clients retry failed requests. Keys are stored in Redis with a TTL.
 *
 * Key space: idempotency:<key>
 * TTL: 24 hours (86_400 seconds)
 */

const IDEMPOTENCY_TTL_SEC = 86_400; // 24 h
const KEY_PREFIX = "idempotency";

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    if (!process.env.REDIS_URL) throw new Error("REDIS_URL is not set");
    _redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: true,
    });
  }
  return _redis;
}

// ─── Generate ─────────────────────────────────────────────────────────────────

/**
 * Generate a new idempotency key (UUID v4).
 * Used internally when the client does not supply one.
 */
export function generateIdempotencyKey(): string {
  return uuidv4();
}

// ─── Check ────────────────────────────────────────────────────────────────────

/**
 * Check if an idempotency key has already been used.
 * Returns the cached response body if found, null otherwise.
 */
export async function checkIdempotency(key: string): Promise<unknown | null> {
  try {
    const redis = getRedis();
    const cached = await redis.get(`${KEY_PREFIX}:${key}`);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch (err) {
    // Fail open — log and let the request proceed
    console.error("[Idempotency] Redis read error:", err);
    return null;
  }
}

// ─── Save ─────────────────────────────────────────────────────────────────────

/**
 * Persist the result of a request under the given idempotency key.
 * Subsequent requests with the same key will receive this cached response.
 */
export async function saveIdempotencyResult(
  key: string,
  result: unknown
): Promise<void> {
  try {
    const redis = getRedis();
    await redis.set(
      `${KEY_PREFIX}:${key}`,
      JSON.stringify(result),
      "EX",
      IDEMPOTENCY_TTL_SEC
    );
  } catch (err) {
    console.error("[Idempotency] Redis write error:", err);
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Remove an idempotency key (e.g. after a confirmed failure
 * that the client should be able to retry with a fresh attempt).
 */
export async function clearIdempotencyKey(key: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.del(`${KEY_PREFIX}:${key}`);
  } catch (err) {
    console.error("[Idempotency] Redis delete error:", err);
  }
}
