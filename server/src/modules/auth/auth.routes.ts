import { Hono } from "hono";
import { z } from "zod";
import { registerUser, loginUser, getUserById } from "./auth.service.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { authRateLimit } from "../../middleware/rate-limit.js";
import { validateBody } from "../../middleware/validate.js";

// ─── Validators ───────────────────────────────────────────────────────────────

const RegisterSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(9).max(20).optional(),
    name: z.string().min(1).max(255),
    password: z.string().min(8).max(128),
    role: z.enum(["attendee", "organizer"]).optional().default("attendee"),
    locale: z.enum(["en", "am"]).optional().default("en"),
  })
  .refine((d) => d.email || d.phone, {
    message: "At least one of email or phone is required",
  });

const LoginSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(9).max(20).optional(),
    password: z.string().min(1),
  })
  .refine((d) => d.email || d.phone, {
    message: "Email or phone is required",
  });

// ─── Routes ───────────────────────────────────────────────────────────────────

export const authRoutes = new Hono();

/**
 * POST /api/v1/auth/register
 * Create a new attendee or organizer account.
 */
authRoutes.post(
  "/register",
  authRateLimit,
  validateBody(RegisterSchema),
  async (c) => {
    const body = c.get("validatedBody") as z.infer<typeof RegisterSchema>;
    const user = await registerUser(body);
    return c.json({ user }, 201);
  }
);

/**
 * POST /api/v1/auth/login
 * Authenticate and return user data.
 * Token issuance is handled by Auth.js on the Next.js side;
 * this endpoint exists for API clients and mobile.
 */
authRoutes.post(
  "/login",
  authRateLimit,
  validateBody(LoginSchema),
  async (c) => {
    const body = c.get("validatedBody") as z.infer<typeof LoginSchema>;
    const user = await loginUser(body);
    return c.json({ user });
  }
);

/**
 * GET /api/v1/auth/me
 * Return the currently authenticated user's profile.
 */
authRoutes.get("/me", requireAuth, async (c) => {
  const { id } = c.var.user;
  const user = await getUserById(id);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }
  return c.json({ user });
});
