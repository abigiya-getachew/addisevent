import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { SignOutForm } from "@/components/auth/SignOutForm";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Bookings", href: "/admin/bookings", icon: BookOpen },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/en/dashboard");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-[#102442] lg:flex">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
          <Shield className="size-4 text-brand-gold" aria-hidden="true" />
          <span className="font-heading text-sm font-bold text-white">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-0.5 p-3" aria-label="Admin navigation">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4 space-y-2">
          <p className="text-xs text-white/40">Logged in as admin</p>
          <SignOutForm className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white">
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            Log Out
          </SignOutForm>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto bg-background">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-border bg-[#102442] px-4 py-3 lg:hidden">
          <Shield className="size-4 text-brand-gold" aria-hidden="true" />
          <span className="font-heading text-sm font-bold text-white">Admin Panel</span>
          <nav className="ml-auto flex gap-1 overflow-x-auto">
            {NAV.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
