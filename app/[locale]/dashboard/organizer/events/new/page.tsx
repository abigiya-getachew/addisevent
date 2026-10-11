import type { Metadata } from "next";
import { EventForm } from "@/components/dashboard/EventForm";

export const metadata: Metadata = { title: "Create Event | AddisEvent" };

export default async function OrganizerNewEventPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">Create New Event</h1>
      <p className="mt-1 mb-8 text-sm text-text-secondary">Fill in the details to publish your event.</p>
      <EventForm locale={locale} />
    </main>
  );
}
