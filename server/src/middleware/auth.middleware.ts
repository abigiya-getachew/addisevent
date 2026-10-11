import type { Context, MiddlewareHandler, Next } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { db, schema } from "../db/index.js";
import { eq } from "drizzle-orm";
import { jwtVerify } from "jose";

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

// ─── Token Verification ───────────────────────────────────────────────────────

/**
 * Verifies the Authorization: Bearer <token> header.
 *
 * Accepts HS256 JWTs signed with AUTH_SECRET (issued by auth.routes.ts for
 * API/mobile clients). Verifies signature and expiry via jose's jwtVerify,
 * then fetches authoritative user/role data from the DB using token.sub.
 */
async function verifyToken(token: string): Promise<AuthUser> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new HTTPException(500, { message: "AUTH_SECRET is not configured" });
  }

  let sub: string;
  try {
    const secretBytes = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretBytes, {
      algorithms: ["HS256"],
    });
    if (!payload.sub) {
      throw new HTTPException(401, { message: "Token missing subject" });
    }
    sub = payload.sub;
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    throw new HTTPException(401, { message: "Invalid or expired token" });
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
    .where(eq(schema.users.id, sub))
    .limit(1);

  if (!user) {
    throw new HTTPException(401, { message: "User not found" });
  }

  return user;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

/**
 * Requires a valid Bearer token. Attaches the user to `c.var.user`.
 */
export const requireAuth: MiddlewareHandler = createMiddleware(
  async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new HTTPException(401, {
        message: "Missing or invalid Authorization header",
      });
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
