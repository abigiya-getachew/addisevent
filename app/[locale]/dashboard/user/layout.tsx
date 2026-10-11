import type { ReactNode } from "react";
import { UserDashboardNavigation } from "@/components/dashboard/UserDashboardNavigation";

export default async function UserDashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1600px]">
      <UserDashboardNavigation locale={locale} />
      <div className="min-w-0 flex-1 pb-24 md:pb-0">{children}</div>
    </div>
  );
}
