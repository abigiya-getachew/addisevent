import {
  pgTable, pgEnum,
  varchar, text, integer, numeric, boolean,
  timestamp, jsonb, uuid, primaryKey
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// ENUMS — Match your SQL types
// ==========================================
export const eventStatusEnum = pgEnum('event_status', [
  'draft', 'published', 'cancelled', 'completed'
]);

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending', 'reserved', 'paid', 'failed', 'expired', 'refunded'
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'telebirr', 'cbebirr', 'chapa', 'pay_at_gate'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', 'completed', 'failed', 'refunded'
]);

export const ticketStatusEnum = pgEnum('ticket_status', [
  'issued', 'scanned', 'cancelled'
]);

export const userRoleEnum = pgEnum('user_role', [
  'attendee', 'organizer', 'admin'
]);

// ==========================================
// USERS TABLE
// ==========================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 20 }).unique(),
  email: varchar('email', { length: 255 }).unique(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  image: text('image'),
  avatarUrl: text('avatar_url'),
  passwordHash: varchar('password_hash', { length: 255 }),
  role: userRoleEnum('role').default('attendee').notNull(),
  locale: varchar('locale', { length: 10 }).default('en').notNull(),
  interests: text('interests').array(),
  emailNotifications: boolean('email_notifications').default(true).notNull(),
  smsReminders: boolean('sms_reminders').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// EVENTS TABLE
// ==========================================
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizerId: uuid('organizer_id').references(() => users.id, { onDelete: 'restrict' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  titleAm: varchar('title_am', { length: 255 }),
  description: text('description'),
  descriptionAm: text('description_am'),
  category: varchar('category', { length: 100 }).notNull(),
  venue: varchar('venue', { length: 255 }),
  venueAddress: text('venue_address'),
  city: varchar('city', { length: 100 }).default('Addis Ababa').notNull(),
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  endAt: timestamp('end_at', { withTimezone: true }),
  imageUrl: text('image_url'),
  totalCapacity: integer('total_capacity').default(0).notNull(),
  availableCapacity: integer('available_capacity').default(0).notNull(),
  isFree: boolean('is_free').default(false).notNull(),
  status: eventStatusEnum('status').default('draft').notNull(),
  tags: text('tags').array(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// TICKET TIERS TABLE
// ==========================================
export const ticketTiers = pgTable('ticket_tiers', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  nameAm: varchar('name_am', { length: 100 }),
  price: numeric('price', { precision: 12, scale: 2 }).default('0').notNull(),
  currency: varchar('currency', { length: 3 }).default('ETB').notNull(),
  totalQuantity: integer('total_quantity').notNull(),
  availableQuantity: integer('available_quantity').notNull(),
  maxPerBooking: integer('max_per_booking').default(10).notNull(),
  saleStartAt: timestamp('sale_start_at', { withTimezone: true }),
  saleEndAt: timestamp('sale_end_at', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// BOOKINGS TABLE
// ==========================================
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  guestPhone: varchar('guest_phone', { length: 20 }),
  guestName: varchar('guest_name', { length: 255 }),
  eventId: uuid('event_id').references(() => events.id, { onDelete: 'restrict' }).notNull(),
  tierId: uuid('tier_id').references(() => ticketTiers.id, { onDelete: 'restrict' }).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('ETB').notNull(),
  paymentMethod: paymentMethodEnum('payment_method'),
  status: bookingStatusEnum('status').default('pending').notNull(),
  idempotencyKey: varchar('idempotency_key', { length: 255 }).unique(),
  reservedUntil: timestamp('reserved_until', { withTimezone: true }),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// TICKETS TABLE
// ==========================================
export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'restrict' }).notNull(),
  qrUuid: uuid('qr_uuid').defaultRandom().unique().notNull(),
  seatLabel: varchar('seat_label', { length: 50 }),
  status: ticketStatusEnum('status').default('issued').notNull(),
  issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow().notNull(),
  scannedAt: timestamp('scanned_at', { withTimezone: true }),
  scannedBy: uuid('scanned_by').references(() => users.id, { onDelete: 'set null' }),
  gateNotes: text('gate_notes'),
});

// ==========================================
// PAYMENTS TABLE
// ==========================================
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'restrict' }).notNull(),
  gateway: paymentMethodEnum('gateway').notNull(),
  gatewayRequestId: varchar('gateway_request_id', { length: 255 }),
  transactionId: varchar('transaction_id', { length: 255 }),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('ETB').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  webhookPayload: jsonb('webhook_payload'),
  idempotencyKey: varchar('idempotency_key', { length: 255 }).unique(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// AUTH.JS TABLES (Accounts, Sessions, etc.)
// ==========================================
export const accounts = pgTable('accounts', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  provider: varchar('provider', { length: 100 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 50 }),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (table) => ({
  pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}));

export const sessions = pgTable('sessions', {
  sessionToken: varchar('session_token', { length: 255 }).primaryKey().notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.identifier, table.token] }),
}));

// ==========================================
// RELATIONS — For easy joins
// ==========================================
export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, { fields: [events.organizerId], references: [users.id] }),
  ticketTiers: many(ticketTiers),
  bookings: many(bookings),
}));

export const ticketTiersRelations = relations(ticketTiers, ({ one, many }) => ({
  event: one(events, { fields: [ticketTiers.eventId], references: [events.id] }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  event: one(events, { fields: [bookings.eventId], references: [events.id] }),
  ticketTier: one(ticketTiers, { fields: [bookings.tierId], references: [ticketTiers.id] }),
  tickets: many(tickets),
  payments: many(payments),
}));

// ==========================================
// MISSING TABLES — Add for frontend compatibility
// ==========================================

export const authenticators = pgTable('authenticators', {
  credentialID: text('credential_id').notNull().unique(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  providerAccountId: text('provider_account_id').notNull(),
  credentialPublicKey: text('credential_public_key').notNull(),
  counter: integer('counter').notNull(),
  credentialDeviceType: varchar('credential_device_type', { length: 32 }).notNull(),
  credentialBackedUp: boolean('credential_backed_up').notNull(),
  transports: varchar('transports', { length: 255 }),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.credentialID] }),
}));

export const savedEvents = pgTable('saved_events', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  savedAt: timestamp('saved_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.eventId] }),
}));

export const eventReviews = pgTable('event_reviews', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  review: text('review'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.eventId] }),
}));

export const organizerPayoutAccounts = pgTable('organizer_payout_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountName: varchar('account_name', { length: 255 }).notNull(),
  accountNumber: varchar('account_number', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const organizerPayouts = pgTable('organizer_payouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  payoutAccountId: uuid('payout_account_id').references(() => organizerPayoutAccounts.id),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('ETB').notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  periodStart: timestamp('period_start', { withTimezone: true }),
  periodEnd: timestamp('period_end', { withTimezone: true }),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type TicketTier = typeof ticketTiers.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type OrganizerPayoutAccount = typeof organizerPayoutAccounts.$inferSelect;
export type OrganizerPayout = typeof organizerPayouts.$inferSelect;