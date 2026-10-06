import {
  pgTable,
  pgEnum,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  uuid,
  jsonb,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "attendee",
  "organizer",
  "admin",
]);

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "published",
  "cancelled",
  "completed",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "reserved",
  "paid",
  "failed",
  "expired",
  "refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "telebirr",
  "cbebirr",
  "chapa",
  "pay_at_gate",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "issued",
  "scanned",
  "cancelled",
]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).unique(),
    phone: varchar("phone", { length: 20 }).unique(),
    name: varchar("name", { length: 255 }),
    passwordHash: text("password_hash"),
    role: userRoleEnum("role").notNull().default("attendee"),
    locale: varchar("locale", { length: 10 }).notNull().default("en"),
    emailVerified: timestamp("email_verified_at", { withTimezone: true }),
    isEmailVerified: boolean("email_verified").notNull().default(false),
    phoneVerified: boolean("phone_verified").notNull().default(false),
    // Used by NextAuth adapter (OAuth profile images)
    image: text("image"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("users_role_idx").on(t.role),
  ]
);

// ─── Events ───────────────────────────────────────────────────────────────────

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizerId: uuid("organizer_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 255 }).notNull(),
    titleAm: varchar("title_am", { length: 255 }), // Amharic title
    description: text("description"),
    descriptionAm: text("description_am"),
    category: varchar("category", { length: 100 }).notNull(),
    venue: varchar("venue", { length: 255 }),
    venueAddress: text("venue_address"),
    city: varchar("city", { length: 100 }).notNull().default("Addis Ababa"),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }),
    imageUrl: text("image_url"),
    totalCapacity: integer("total_capacity").notNull().default(0),
    availableCapacity: integer("available_capacity").notNull().default(0),
    isFree: boolean("is_free").notNull().default(false),
    status: eventStatusEnum("status").notNull().default("draft"),
    tags: text("tags").array(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("events_organizer_idx").on(t.organizerId),
    index("events_status_idx").on(t.status),
    index("events_category_idx").on(t.category),
    index("events_start_at_idx").on(t.startAt),
  ]
);

// ─── Ticket Tiers ─────────────────────────────────────────────────────────────

export const ticketTiers = pgTable(
  "ticket_tiers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(), // e.g. "General", "VIP"
    nameAm: varchar("name_am", { length: 100 }),
    price: numeric("price", { precision: 12, scale: 2 }).notNull().default("0"),
    currency: varchar("currency", { length: 3 }).notNull().default("ETB"),
    totalQuantity: integer("total_quantity").notNull(),
    availableQuantity: integer("available_quantity").notNull(),
    maxPerBooking: integer("max_per_booking").notNull().default(10),
    saleStartAt: timestamp("sale_start_at", { withTimezone: true }),
    saleEndAt: timestamp("sale_end_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("ticket_tiers_event_idx").on(t.eventId)]
);

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    // Guest checkout: store phone directly when no user account
    guestPhone: varchar("guest_phone", { length: 20 }),
    guestName: varchar("guest_name", { length: 255 }),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "restrict" }),
    tierId: uuid("tier_id")
      .notNull()
      .references(() => ticketTiers.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("ETB"),
    paymentMethod: paymentMethodEnum("payment_method"),
    status: bookingStatusEnum("status").notNull().default("pending"),
    // Idempotency key for the checkout session
    idempotencyKey: varchar("idempotency_key", { length: 255 }).unique(),
    reservedUntil: timestamp("reserved_until", { withTimezone: true }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("bookings_user_idx").on(t.userId),
    index("bookings_event_idx").on(t.eventId),
    index("bookings_status_idx").on(t.status),
    index("bookings_idempotency_idx").on(t.idempotencyKey),
  ]
);

// ─── Tickets ──────────────────────────────────────────────────────────────────

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "restrict" }),
    qrUuid: uuid("qr_uuid").notNull().unique().defaultRandom(),
    // Seat or gate assignment — nullable for general admission
    seatLabel: varchar("seat_label", { length: 50 }),
    status: ticketStatusEnum("status").notNull().default("issued"),
    issuedAt: timestamp("issued_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    scannedAt: timestamp("scanned_at", { withTimezone: true }),
    scannedBy: uuid("scanned_by").references(() => users.id, {
      onDelete: "set null",
    }),
    gateNotes: text("gate_notes"),
  },
  (t) => [
    index("tickets_booking_idx").on(t.bookingId),
    index("tickets_qr_uuid_idx").on(t.qrUuid),
    index("tickets_status_idx").on(t.status),
  ]
);

// ─── Payments ─────────────────────────────────────────────────────────────────

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "restrict" }),
    gateway: paymentMethodEnum("gateway").notNull(),
    // Gateway-specific reference / merchant request ID
    gatewayRequestId: varchar("gateway_request_id", { length: 255 }),
    // Transaction ID returned after payment
    transactionId: varchar("transaction_id", { length: 255 }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("ETB"),
    status: paymentStatusEnum("status").notNull().default("pending"),
    // Raw webhook / callback payload for audit
    webhookPayload: jsonb("webhook_payload"),
    idempotencyKey: varchar("idempotency_key", { length: 255 }).unique(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("payments_booking_idx").on(t.bookingId),
    index("payments_status_idx").on(t.status),
    index("payments_transaction_idx").on(t.transactionId),
  ]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
  bookings: many(bookings),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  tiers: many(ticketTiers),
  bookings: many(bookings),
}));

export const ticketTiersRelations = relations(ticketTiers, ({ one, many }) => ({
  event: one(events, {
    fields: [ticketTiers.eventId],
    references: [events.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [bookings.eventId],
    references: [events.id],
  }),
  tier: one(ticketTiers, {
    fields: [bookings.tierId],
    references: [ticketTiers.id],
  }),
  tickets: many(tickets),
  payments: many(payments),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  booking: one(bookings, {
    fields: [tickets.bookingId],
    references: [bookings.id],
  }),
  scannedByUser: one(users, {
    fields: [tickets.scannedBy],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));

// ─── NextAuth Adapter Tables ──────────────────────────────────────────────────
// Required by @auth/drizzle-adapter for OAuth sessions & account linking.

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(),
    provider: varchar("provider", { length: 100 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 50 }),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("accounts_user_id_idx").on(t.userId),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => [index("sessions_user_id_idx").on(t.userId)]
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

export const authenticators = pgTable(
  "authenticators",
  {
    credentialID: text("credential_id").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    credentialPublicKey: text("credential_public_key").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: varchar("credential_device_type", { length: 32 }).notNull(),
    credentialBackedUp: boolean("credential_backed_up").notNull(),
    transports: varchar("transports", { length: 255 }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.credentialID] })]
);

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type TicketTier = typeof ticketTiers.$inferSelect;
export type NewTicketTier = typeof ticketTiers.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

// NextAuth adapter types
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type Authenticator = typeof authenticators.$inferSelect;
