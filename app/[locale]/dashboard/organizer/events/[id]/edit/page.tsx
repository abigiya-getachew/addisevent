import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { events, ticketTiers } from "@/server/src/db/schema";
import { EventForm } from "@/components/dashboard/EventForm";

export const metadata: Metadata = { title: "Edit Event | AddisEvent" };

export default async function OrganizerEditEventPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/auth/login`);

  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, id), eq(events.organizerId, session.user.id)))
    .limit(1);

  if (!event) notFound();

  const tiers = await db
    .select()
    .from(ticketTiers)
    .where(and(eq(ticketTiers.eventId, id), eq(ticketTiers.isActive, true)));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">Edit Event</h1>
      <p className="mt-1 mb-8 text-sm text-text-secondary">Update the details for <strong>{event.title}</strong>.</p>
      <EventForm locale={locale} event={event} existingTiers={tiers} />
    </main>
  );
}
