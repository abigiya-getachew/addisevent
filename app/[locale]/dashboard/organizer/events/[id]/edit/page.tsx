import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Event | AddisEvent",
};

export default async function OrganizerEditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Edit Event</h1>
      <p className="mt-2 text-sm text-text-secondary">Update the details for event {id}.</p>
    </main>
  );
}
