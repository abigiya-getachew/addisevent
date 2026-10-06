import type { Context, MiddlewareHandler, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { Redis } from "ioredis";

// Lazy Redis client — avoids import-time crashes when Redis is not yet ready
let _redis: Redis | null = null;
let redisUnavailable = false;

function getRedis(): Redis {
  if (!_redis) {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is not set");
    }
    _redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: true,
    });
    _redis.on("error", (err) => {
      if (!redisUnavailable) {
        console.error(
          "[RateLimit] Redis is unavailable; requests will use the fail-open path.",
          err
        );
        redisUnavailable = true;
      }
    });
    _redis.on("ready", () => {
      if (redisUnavailable) {
        console.info("[RateLimit] Redis connection restored.");
        redisUnavailable = false;
      }
    });
  }
  return _redis;
}

// ─── Core sliding-window rate limiter ─────────────────────────────────────────

interface RateLimitOptions {
  /** Key prefix, e.g. "auth:login" */
  prefix: string;
  /** Max requests allowed within the window */
  max: number;
  /** Window size in seconds */
  windowSec: number;
  /**
   * Function to derive the bucket identifier from the request context.
   * Defaults to the client IP address.
   */
  keyFn?: (c: Context) => string;
}

/**
 * Redis-based sliding-window rate limiter middleware.
 *
 * Uses the INCR + EXPIRE pattern. For very high-scale needs, replace
 * with a Lua-based sliding-window or token bucket.
 */
export function rateLimit(opts: RateLimitOptions): MiddlewareHandler {
  const { prefix, max, windowSec, keyFn } = opts;

  return createMiddleware(async (c: Context, next: Next) => {
    const identifier = keyFn
      ? keyFn(c)
      : (c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown");

    const key = `rl:${prefix}:${identifier}`;
    const redis = getRedis();

    let count: number;
    try {
      count = await redis.incr(key);
      if (count === 1) {
        // First request in window — set TTL
        await redis.expire(key, windowSec);
      }
    } catch (err) {
      // Redis unavailable — fail open to avoid blocking legitimate traffic
      if (!redisUnavailable) {
        console.error("[RateLimit] Redis request failed; failing open:", err);
      }
      await next();
      return;
    }

    const remaining = Math.max(0, max - count);

    c.res.headers.set("X-RateLimit-Limit", String(max));
    c.res.headers.set("X-RateLimit-Remaining", String(remaining));
    c.res.headers.set("X-RateLimit-Window", String(windowSec));

    if (count > max) {
      throw new HTTPException(429, {
        message: "Too many requests. Please slow down.",
      });
    }

    await next();
  });
}

// ─── Preset limiters ──────────────────────────────────────────────────────────

/** Strict limiter for login and registration — 10 attempts / 60 s per IP */
export const authRateLimit = rateLimit({
  prefix: "auth",
  max: 10,
  windowSec: 60,
});

/** Standard API limiter — 120 requests / 60 s per IP */
export const apiRateLimit = rateLimit({
  prefix: "api",
  max: 120,
  windowSec: 60,
});

/** Per-user booking limiter — 5 booking attempts / 60 s per user ID */
export const bookingRateLimit = rateLimit({
  prefix: "booking",
  max: 5,
  windowSec: 60,
  keyFn: (c) => c.var.user?.id ?? c.req.header("x-forwarded-for") ?? "anon",
});
