import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Event | AddisEvent",
};

export default function OrganizerNewEventPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Create New Event</h1>
      <p className="mt-2 text-sm text-text-secondary">Fill in the details to publish your event.</p>
    </main>
  );
}
