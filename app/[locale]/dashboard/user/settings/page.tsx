import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | AddisEvent",
};

export default function UserSettingsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Profile &amp; Settings</h1>
      <p className="mt-2 text-sm text-text-secondary">Update your profile, language, and notification preferences.</p>
    </main>
  );
}
