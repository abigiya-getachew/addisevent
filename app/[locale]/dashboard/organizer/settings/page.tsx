import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizer Settings | AddisEvent",
};

export default function OrganizerSettingsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Payout Accounts</h1>
      <p className="mt-2 text-sm text-text-secondary">Manage your Telebirr and CBE Birr payout accounts.</p>
    </main>
  );
}
