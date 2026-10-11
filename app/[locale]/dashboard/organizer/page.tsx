import type { Metadata } from "next";
import { OrganizerOverview } from "@/components/dashboard/OrganizerOverview";

export const metadata: Metadata = { title: "Organizer Dashboard | AddisEvent" };

export default function OrganizerDashboardPage() {
  return <OrganizerOverview />;
}
