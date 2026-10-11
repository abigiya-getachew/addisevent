import { redirect } from "next/navigation";
export default async function OrganizerEditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/en/organizer/events/${id}/edit`);
}
