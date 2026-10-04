import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard | AddisEvent",
};

export default function UserDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-charcoal">My Dashboard</h1>
      <p className="mt-2 text-sm text-text-secondary">Welcome back. Your upcoming events and tickets are here.</p>
    </main>
  );
}
