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

// ─── Token Verification ───────────────────────────────────────────────────────

/**
 * Verifies the Authorization: Bearer <token> header.
 *
 * Auth.js v5 stores the user's UUID as token.sub and exposes it as
 * session.accessToken. The client sends this UUID as the Bearer value.
 * We treat it as a user ID — look it up in the DB directly for authoritative
 * role data. This sidesteps JWE complexity entirely for the MVP.
 *
 * UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 chars)
 */
async function verifyToken(token: string): Promise<AuthUser> {
  // Basic sanity check: must look like a UUID (36-char hex with hyphens)
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(token)) {
    throw new HTTPException(401, { message: "Malformed token" });
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
    .where(eq(schema.users.id, token))
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
