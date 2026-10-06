/**
 * Seed script for local development.
 * Run with: npm run db:seed (from the server/ directory)
 */
import { db, schema } from "./index.js";

const {
  users,
  events,
  ticketTiers,
} = schema;

async function seed() {
  console.log("🌱 Seeding database...");

  // ── Users ──────────────────────────────────────────────────────────────────

  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@addisevent.et",
      name: "Admin User",
      role: "admin",
      locale: "en",
      emailVerified: new Date(),
      isEmailVerified: true,
    })
    .returning();

  const [organizer] = await db
    .insert(users)
    .values({
      email: "organizer@addisevent.et",
      name: "Demo Organizer",
      phone: "+251911000001",
      role: "organizer",
      locale: "en",
      emailVerified: new Date(),
      isEmailVerified: true,
      phoneVerified: true,
    })
    .returning();

  const [attendee] = await db
    .insert(users)
    .values({
      email: "attendee@addisevent.et",
      name: "Demo Attendee",
      phone: "+251911000002",
      role: "attendee",
      locale: "en",
      emailVerified: new Date(),
      isEmailVerified: true,
    })
    .returning();

  console.log(
    `✓ Created users: admin=${admin.id}, organizer=${organizer.id}, attendee=${attendee.id}`
  );

  // ── Events ─────────────────────────────────────────────────────────────────

  const startAt = new Date();
  startAt.setDate(startAt.getDate() + 14); // 2 weeks from now

  const [event] = await db
    .insert(events)
    .values({
      organizerId: organizer.id,
      title: "Addis Music Fest 2026",
      titleAm: "አዲስ ሙዚቃ ፌስት 2026",
      description:
        "The biggest music festival in Addis Ababa featuring local and international artists.",
      descriptionAm: "በአዲስ አበባ ትልቁ የሙዚቃ ፌስቲቫል።",
      category: "music",
      venue: "Meskel Square",
      venueAddress: "Meskel Square, Addis Ababa",
      city: "Addis Ababa",
      startAt,
      totalCapacity: 5000,
      availableCapacity: 5000,
      isFree: false,
      status: "published",
      tags: ["music", "festival", "live"],
    })
    .returning();

  console.log(`✓ Created event: ${event.id}`);

  // ── Ticket Tiers ───────────────────────────────────────────────────────────

  await db.insert(ticketTiers).values([
    {
      eventId: event.id,
      name: "General",
      nameAm: "ጠቅላላ",
      price: "500.00",
      currency: "ETB",
      totalQuantity: 4000,
      availableQuantity: 4000,
      maxPerBooking: 5,
    },
    {
      eventId: event.id,
      name: "VIP",
      nameAm: "ቪአይፒ",
      price: "1500.00",
      currency: "ETB",
      totalQuantity: 1000,
      availableQuantity: 1000,
      maxPerBooking: 2,
    },
  ]);

  console.log("✓ Created ticket tiers");
  console.log("✅ Seeding complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
