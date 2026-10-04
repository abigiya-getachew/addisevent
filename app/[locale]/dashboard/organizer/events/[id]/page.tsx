import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Stats | AddisEvent",
};

export default async function OrganizerEventStatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Event Stats</h1>
      <p className="mt-2 text-sm text-text-secondary">Performance and sales overview for event {id}.</p>
    </main>
  );
}
