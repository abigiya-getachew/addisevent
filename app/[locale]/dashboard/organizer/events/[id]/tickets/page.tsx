import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders & Payouts | AddisEvent",
};

export default async function OrganizerEventTicketsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Orders &amp; Payouts</h1>
      <p className="mt-2 text-sm text-text-secondary">Ticket orders and payout breakdown for event {id}.</p>
    </main>
  );
}
