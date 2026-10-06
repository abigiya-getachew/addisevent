import { eq, or } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import bcrypt from "bcryptjs";
import { db, schema } from "../../db/index.js";
import type { NewUser, User } from "../../db/schema.js";

const BCRYPT_ROUNDS = 12;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterInput {
  email?: string;
  phone?: string;
  name: string;
  password: string;
  role?: "attendee" | "organizer";
  locale?: string;
}

export interface LoginInput {
  email?: string;
  phone?: string;
  password: string;
}

export type SafeUser = Omit<User, "passwordHash">;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSafeUser(user: User): SafeUser {
  const { passwordHash: _, ...safe } = user;
  return safe;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function registerUser(input: RegisterInput): Promise<SafeUser> {
  if (!input.email && !input.phone) {
    throw new HTTPException(400, {
      message: "At least one of email or phone is required",
    });
  }

  // Check for existing account
  const existing = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(
      or(
        input.email ? eq(schema.users.email, input.email) : undefined,
        input.phone ? eq(schema.users.phone, input.phone) : undefined
      )
    )
    .limit(1);

  if (existing.length > 0) {
    throw new HTTPException(409, {
      message: "An account with this email or phone already exists",
    });
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const newUser: NewUser = {
    email: input.email ?? null,
    phone: input.phone ?? null,
    name: input.name,
    passwordHash,
    role: input.role ?? "attendee",
    locale: input.locale ?? "en",
  };

  const [created] = await db
    .insert(schema.users)
    .values(newUser)
    .returning();

  if (!created) {
    throw new HTTPException(500, { message: "Failed to create user" });
  }

  return toSafeUser(created);
}

export async function loginUser(input: LoginInput): Promise<SafeUser> {
  if (!input.email && !input.phone) {
    throw new HTTPException(400, {
      message: "Email or phone is required",
    });
  }

  const [user] = await db
    .select()
    .from(schema.users)
    .where(
      input.email
        ? eq(schema.users.email, input.email)
        : eq(schema.users.phone, input.phone!)
    )
    .limit(1);

  if (!user || !user.passwordHash) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }

  return toSafeUser(user);
}

export async function getUserById(id: string): Promise<SafeUser | null> {
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);

  return user ? toSafeUser(user) : null;
}

export async function updateUserLocale(
  userId: string,
  locale: string
): Promise<void> {
  await db
    .update(schema.users)
    .set({ locale, updatedAt: new Date() })
    .where(eq(schema.users.id, userId));
}
