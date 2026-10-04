import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendees | AddisEvent",
};

export default async function OrganizerAttendeesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Check-in List</h1>
      <p className="mt-2 text-sm text-text-secondary">Attendee check-in list for event {id}.</p>
    </main>
  );
}
