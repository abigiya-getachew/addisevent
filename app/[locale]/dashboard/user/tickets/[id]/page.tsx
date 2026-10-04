import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticket | AddisEvent",
};

export default async function UserTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Ticket #{id}</h1>
      <p className="mt-2 text-sm text-text-secondary">Your ticket details and QR code.</p>
    </main>
  );
}
