import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const role = session?.user?.role;

  if (role === 'organizer') redirect(`/${locale}/organizer`);
  if (role === 'admin') redirect(`/${locale}/admin`);

  // attendee (default)
  redirect(`/${locale}/dashboard/user`);
}
