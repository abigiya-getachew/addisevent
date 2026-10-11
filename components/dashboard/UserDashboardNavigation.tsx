"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutForm } from "@/components/auth/SignOutForm";
import {
  Bookmark,
  CalendarDays,
  Clock3,
  LogOut,
  Ticket,
  UserRound,
} from "lucide-react";

const navigation = [
  { label: "My tickets", icon: Ticket, destination: "tickets" },
  { label: "Upcoming", icon: CalendarDays, destination: "upcoming" },
  { label: "Past events", icon: Clock3, destination: "past" },
  { label: "Saved", icon: Bookmark, destination: "saved" },
  { label: "Profile", icon: UserRound, destination: "settings" },
] as const;

export function UserDashboardNavigation({ locale }: { locale: string }) {
  const pathname = usePathname();
  const base = `/${locale}/dashboard/user`;

  function getHref(destination: (typeof navigation)[number]["destination"]) {
    switch (destination) {
      case "tickets":
        return `${base}/tickets`;
      case "upcoming":
        return `/${locale}/dashboard/upcoming`;
      case "past":
        return `/${locale}/dashboard/past`;
      case "saved":
        return `${base}/saved`;
      case "settings":
        return `/${locale}/dashboard/profile`;
    }
  }

  function isActive(destination: (typeof navigation)[number]["destination"]) {
    if (destination === "upcoming") {
      return pathname === base || pathname === `/${locale}/dashboard/upcoming`;
    }
    if (destination === "past") return pathname === `/${locale}/dashboard/past`;
    if (destination === "tickets") return pathname.startsWith(`${base}/tickets`);
    if (destination === "saved") return pathname.startsWith(`${base}/saved`);
    return pathname === `/${locale}/dashboard/profile` || pathname.startsWith(`${base}/settings`);
  }

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-border bg-white px-4 py-7 md:block">
        <p className="px-3 text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
          Your account
        </p>
        <nav aria-label="Attendee dashboard" className="mt-4 space-y-1">
          {navigation.map(({ label, icon: Icon, destination }) => (
            <Link
              key={destination}
              href={getHref(destination)}
              aria-current={isActive(destination) ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                isActive(destination)
                  ? "bg-brand-primary-soft text-brand-red"
                  : "text-text-secondary hover:bg-[#f8f6f2] hover:text-charcoal"
              }`}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <SignOutForm
          formClassName="mt-7"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary transition hover:bg-error-soft hover:text-error"
        >
            <LogOut aria-hidden="true" className="size-4" />
            Log out
        </SignOutForm>
      </aside>

      <nav
        aria-label="Attendee dashboard"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-border bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-4px_20px_rgb(42_42_42_/6%)] backdrop-blur md:hidden"
      >
        {navigation.map(({ label, icon: Icon, destination }) => (
          <Link
            key={destination}
            href={getHref(destination)}
            aria-current={isActive(destination) ? "page" : undefined}
            className={`flex min-w-0 flex-col items-center gap-1 rounded-lg px-0.5 py-1.5 text-[9px] font-semibold leading-tight ${
              isActive(destination) ? "text-brand-red" : "text-text-muted"
            }`}
          >
            <Icon aria-hidden="true" className="size-5" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
        <SignOutForm
          className="flex min-w-0 flex-col items-center gap-1 rounded-lg px-0.5 py-1.5 text-[9px] font-semibold leading-tight text-text-muted hover:text-error"
        >
            <LogOut aria-hidden="true" className="size-5" />
            <span className="truncate">Log out</span>
        </SignOutForm>
      </nav>
    </>
  );
}
