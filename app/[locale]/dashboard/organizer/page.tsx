import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizer Overview | AddisEvent",
};

export default function OrganizerDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Overview</h1>
      <p className="mt-2 text-sm text-text-secondary">Sales stats, recent activity, and quick actions.</p>
    </main>
  );
}
