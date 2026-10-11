import { redirect } from "next/navigation";

export default async function UserSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard/profile`);
}
