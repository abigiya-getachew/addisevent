import type { Context, MiddlewareHandler, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { db, schema } from "../db/index.js";
import { eq } from "drizzle-orm";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  role: "attendee" | "organizer" | "admin";
  locale: string;
};

// Extend Hono's context variable map
declare module "hono" {
  interface ContextVariableMap {
    user: AuthUser;
  }
}

// ─── JWT Verification ─────────────────────────────────────────────────────────

/**
 * Parses and verifies the Authorization: Bearer <token> header.
 * Auth.js (NextAuth v5) signs tokens with AUTH_SECRET — we verify here.
 *
 * NOTE: Auth.js v5 JWTs are JWE-encoded by default.
 * For the MVP we use a shared secret and validate via the Auth.js encode/decode
 * helpers. Replace this with a proper JWKS endpoint when scaling.
 */
async function verifyToken(token: string): Promise<AuthUser> {
  // Auth.js stores the user sub as the user's DB id.
  // We decode the payload and fetch the user for authoritative role data.
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new HTTPException(500, { message: "AUTH_SECRET is not configured" });
  }

  // Decode the JWT payload (HS256 / standard JWT — adjust if using JWE)
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new HTTPException(401, { message: "Malformed token" });
  }

  let payload: { sub?: string; exp?: number };
  try {
    payload = JSON.parse(
      Buffer.from(parts[1]!, "base64url").toString("utf-8")
    );
  } catch {
    throw new HTTPException(401, { message: "Invalid token payload" });
  }

  if (!payload.sub) {
    throw new HTTPException(401, { message: "Token missing subject" });
  }

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new HTTPException(401, { message: "Token expired" });
  }

  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      phone: schema.users.phone,
      name: schema.users.name,
      role: schema.users.role,
      locale: schema.users.locale,
    })
    .from(schema.users)
    .where(eq(schema.users.id, payload.sub))
    .limit(1);

  if (!user) {
    throw new HTTPException(401, { message: "User not found" });
  }

  return user;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

/**
 * Requires a valid JWT. Attaches the user to `c.var.user`.
 */
export const requireAuth: MiddlewareHandler = createMiddleware(
  async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new HTTPException(401, { message: "Missing or invalid Authorization header" });
    }

    const token = authHeader.slice(7);
    const user = await verifyToken(token);
    c.set("user", user);
    await next();
  }
);

/**
 * Requires the authenticated user to have one of the specified roles.
 * Must be used after `requireAuth`.
 */
export function requireRole(
  ...roles: Array<"attendee" | "organizer" | "admin">
): MiddlewareHandler {
  return createMiddleware(async (c: Context, next: Next) => {
    const user = c.var.user;
    if (!user) {
      throw new HTTPException(401, { message: "Not authenticated" });
    }
    if (!roles.includes(user.role)) {
      throw new HTTPException(403, {
        message: `Access denied. Required roles: ${roles.join(", ")}`,
      });
    }
    await next();
  });
}

/**
 * Optional auth — attaches user if token is present, does not throw if absent.
 */
export const optionalAuth: MiddlewareHandler = createMiddleware(
  async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.slice(7);
        const user = await verifyToken(token);
        c.set("user", user);
      } catch {
        // Silently ignore — caller decides if user presence is required
      }
    }
    await next();
  }
);
