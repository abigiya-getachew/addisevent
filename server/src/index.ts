import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { prettyJSON } from "hono/pretty-json";

import { authRoutes } from "./modules/auth/auth.routes.js";
import { eventsRoutes } from "./modules/events/events.routes.js";
import { bookingsRoutes } from "./modules/bookings/bookings.routes.js";
import { ticketsRoutes } from "./modules/tickets/tickets.routes.js";
import { paymentsRoutes } from "./modules/payments/payments.routes.js";
import { searchRoutes } from "./modules/search/search.routes.js";

const app = new Hono();

// ─── Global Middleware ────────────────────────────────────────────────────────

app.use("*", logger());
app.use("*", secureHeaders());
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Idempotency-Key"],
    credentials: true,
  })
);
app.use("*", prettyJSON());

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ─── API Routes ───────────────────────────────────────────────────────────────

const api = app.basePath("/api/v1");

api.route("/auth", authRoutes);
api.route("/events", eventsRoutes);
api.route("/bookings", bookingsRoutes);
api.route("/tickets", ticketsRoutes);
api.route("/payments", paymentsRoutes);
api.route("/search", searchRoutes);

// ─── 404 Fallback ─────────────────────────────────────────────────────────────

app.notFound((c) =>
  c.json({ error: "Not found", path: c.req.path }, 404)
);

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.onError((err, c) => {
  console.error("[Unhandled Error]", err);

  let cause: unknown = err;
  while (cause instanceof Error) {
    if ("code" in cause && cause.code === "28P01") {
      return c.json(
        {
          error: "Database authentication failed.",
          hint: "Reset the database password in the Supabase Dashboard, then use that new password in DATABASE_URL. Updating .env alone does not change the password Supabase expects. Copy the complete Session pooler string and URL-encode reserved password characters.",
        },
        503
      );
    }

    if (
      "code" in cause &&
      typeof cause.code === "string" &&
      ["ECONNREFUSED", "ENETUNREACH", "EHOSTUNREACH", "ENOTFOUND", "ETIMEDOUT"].includes(
        cause.code
      )
    ) {
      return c.json(
        {
          error: "The database is unreachable.",
          hint: "For an IPv4-only network, use the Supabase Session pooler connection string in DATABASE_URL.",
        },
        503
      );
    }
    cause = cause.cause;
  }

  return c.json(
    {
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development" ? err.message : undefined,
    },
    500
  );
});

// ─── Start Server ─────────────────────────────────────────────────────────────

const port = Number(process.env.API_PORT ?? 5000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`🚀 AddisEvent API running on http://localhost:${info.port}`);
});

export default app;
