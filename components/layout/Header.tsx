'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Sparkle,
  Ticket,
  Bookmark,
  BarChart2,
  Calendar,
  Plus,
  DollarSign,
  Users,
  FileText,
  Search,
  Cog,
} from 'lucide-react';
import { SignOutForm } from '@/components/auth/SignOutForm';
import { useAuth } from '@/hooks/use-auth';
import { LanguageSwitcher } from './LanguageSwitcher';

// ── helpers ────────────────────────────────────────────────────────────────────

function getDisplayName(user: { name?: string | null; email?: string | null; phone?: string | null } | null): string {
  if (!user) return '';
  if (user.name) return user.name;
  if (user.email) return user.email.split('@')[0];
  if (user.phone) return user.phone;
  return 'Account';
}

// ── Logo ───────────────────────────────────────────────────────────────────────

function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2" aria-label="AddisEvent home">
      <Sparkle aria-hidden="true" className="size-5 fill-brand-gold text-brand-gold" />
      <span className="font-bold text-lg">
        <span className="text-brand-red">Addis</span>
        <span className="text-brand-blue">Event</span>
      </span>
    </Link>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────────

function Divider() {
  return <hr className="my-2 border-gray-100" />;
}

// ── Main component ─────────────────────────────────────────────────────────────

export function Header() {
  const { user, role, loading } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Keyboard navigation: Escape closes dropdown; arrow keys move focus within menu
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!dropdownOpen) return;
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const menu = dropdownMenuRef.current;
        if (!menu) return;
        const items = Array.from(
          menu.querySelectorAll<HTMLElement>('[role="menuitem"]')
        );
        const active = document.activeElement as HTMLElement;
        const idx = items.indexOf(active);
        if (e.key === 'ArrowDown') {
          items[(idx + 1) % items.length]?.focus();
        } else {
          items[(idx - 1 + items.length) % items.length]?.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dropdownOpen]);

  // Close mobile menu on route change / resize
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  const displayName = getDisplayName(user);
  const locale = pathname.match(/^\/(en|am)(?:\/|$)/)?.[1] ?? 'en';
  const logoHref =
    role === 'attendee'
      ? `/${locale}/dashboard/user`
      : role === 'organizer'
        ? `/${locale}/dashboard/organizer`
        : role === 'admin'
          ? `/${locale}/admin`
          : '/';

  // ── Role-specific center nav items ──────────────────────────────────────────

  function CenterNav() {
    if (role === 'guest') {
      return (
        <>
          <Link href="/events" className="hover:text-brand-red transition-colors">Events</Link>
          <Link href="/organizer" className="hover:text-brand-red transition-colors">For Organizers</Link>
          <Link href="/about" className="hover:text-brand-red transition-colors">About</Link>
        </>
      );
    }

    if (role === 'attendee') {
      return (
        <>
          <Link href="/events" className="hover:text-brand-red transition-colors">Events</Link>
          <Link href={`/${locale}/dashboard/user/tickets`} className="flex items-center gap-1 hover:text-brand-red transition-colors">
            <Ticket className="size-4" aria-hidden="true" />My Tickets
          </Link>
          <Link href={`/${locale}/dashboard/user/saved`} className="flex items-center gap-1 hover:text-brand-red transition-colors">
            <Bookmark className="size-4" aria-hidden="true" />Saved
          </Link>
          <Link href="/about" className="hover:text-brand-red transition-colors">About</Link>
        </>
      );
    }

    if (role === 'organizer') {
      return (
        <>
          <Link href="/events" className="hover:text-brand-red transition-colors">Events</Link>
          <Link href="/organizer" className="flex items-center gap-1 hover:text-brand-red transition-colors">
            <BarChart2 className="size-4" aria-hidden="true" />Dashboard
          </Link>
          <Link href="/organizer/events" className="flex items-center gap-1 hover:text-brand-red transition-colors">
            <Calendar className="size-4" aria-hidden="true" />My Events
          </Link>
          <Link href="/organizer/events/new" className="flex items-center gap-1 hover:text-brand-red transition-colors">
            <Plus className="size-4" aria-hidden="true" />Create Event
          </Link>
          <Link href="/organizer/settings#payouts" className="flex items-center gap-1 hover:text-brand-red transition-colors">
            <DollarSign className="size-4" aria-hidden="true" />Payouts
          </Link>
        </>
      );
    }

    // admin
    return (
      <>
        <Link href="/events" className="hover:text-brand-red transition-colors">Events</Link>
        <Link href="/admin/users" className="flex items-center gap-1 hover:text-brand-red transition-colors">
          <Users className="size-4" aria-hidden="true" />Users
        </Link>
        <Link href="/admin/events" className="flex items-center gap-1 hover:text-brand-red transition-colors">
          <FileText className="size-4" aria-hidden="true" />All Events
        </Link>
        <Link href="/admin/reports" className="flex items-center gap-1 hover:text-brand-red transition-colors">
          <Search className="size-4" aria-hidden="true" />Reports
        </Link>
        <Link href="/admin/settings" className="flex items-center gap-1 hover:text-brand-red transition-colors">
          <Cog className="size-4" aria-hidden="true" />System
        </Link>
      </>
    );
  }

  // ── Role-specific dropdown items ────────────────────────────────────────────

  function DropdownItems() {
    if (role === 'attendee') {
      return (
        <>
          <Link
            href={`/${locale}/dashboard/user`}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-red transition-colors"
            onClick={() => setDropdownOpen(false)}
            role="menuitem"
            tabIndex={-1}
          >
            <User className="size-4" aria-hidden="true" />My Dashboard
          </Link>
          <Link
            href={`/${locale}/dashboard/profile`}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-red transition-colors"
            onClick={() => setDropdownOpen(false)}
            role="menuitem"
            tabIndex={-1}
          >
            <User className="size-4" aria-hidden="true" />Profile
          </Link>
          <Link
            href={`/${locale}/dashboard/profile`}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-red transition-colors"
            onClick={() => setDropdownOpen(false)}
            role="menuitem"
            tabIndex={-1}
          >
            <Settings className="size-4" aria-hidden="true" />Settings
          </Link>
          <Divider />
          <SignOutForm
            menuItem
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
          >
              <LogOut className="size-4" aria-hidden="true" />Log Out
          </SignOutForm>
        </>
      );
    }

    if (role === 'organizer') {
      return (
        <>
          <Link
            href="/organizer/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-red transition-colors"
            onClick={() => setDropdownOpen(false)}
            role="menuitem"
            tabIndex={-1}
          >
            <Settings className="size-4" aria-hidden="true" />Organizer Settings
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-red transition-colors"
            onClick={() => setDropdownOpen(false)}
            role="menuitem"
            tabIndex={-1}
          >
            <User className="size-4" aria-hidden="true" />Switch to Attendee
          </Link>
          <Divider />
          <SignOutForm
            menuItem
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
          >
              <LogOut className="size-4" aria-hidden="true" />Log Out
          </SignOutForm>
        </>
      );
    }

    if (role === 'admin') {
      return (
        <>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-red transition-colors"
            onClick={() => setDropdownOpen(false)}
            role="menuitem"
            tabIndex={-1}
          >
            <User className="size-4" aria-hidden="true" />Switch → Attendee
          </Link>
          <Link
            href="/organizer"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-red transition-colors"
            onClick={() => setDropdownOpen(false)}
            role="menuitem"
            tabIndex={-1}
          >
            <BarChart2 className="size-4" aria-hidden="true" />Switch → Organizer
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-red transition-colors"
            onClick={() => setDropdownOpen(false)}
            role="menuitem"
            tabIndex={-1}
          >
            <Cog className="size-4" aria-hidden="true" />Admin Panel
          </Link>
          <Divider />
          <SignOutForm
            menuItem
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
          >
              <LogOut className="size-4" aria-hidden="true" />Log Out
          </SignOutForm>
        </>
      );
    }

    return null;
  }

  // ── Mobile role-specific items ───────────────────────────────────────────────

  function MobileNavItems() {
    if (role === 'guest') {
      return (
        <>
          <Link href="/events" className="block px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>Events</Link>
          <Link href="/organizer" className="block px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>For Organizers</Link>
          <Link href="/about" className="block px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>About</Link>
        </>
      );
    }

    if (role === 'attendee') {
      return (
        <>
          <Link href="/events" className="block px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>Events</Link>
          <Link href={`/${locale}/dashboard/user/tickets`} className="flex items-center gap-2 px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
            <Ticket className="size-4" aria-hidden="true" />My Tickets
          </Link>
          <Link href={`/${locale}/dashboard/user/saved`} className="flex items-center gap-2 px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
            <Bookmark className="size-4" aria-hidden="true" />Saved
          </Link>
          <Link href="/about" className="block px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>About</Link>
        </>
      );
    }

    if (role === 'organizer') {
      return (
        <>
          <Link href="/events" className="block px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>Events</Link>
          <Link href="/organizer" className="flex items-center gap-2 px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
            <BarChart2 className="size-4" aria-hidden="true" />Dashboard
          </Link>
          <Link href="/organizer/events" className="flex items-center gap-2 px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
            <Calendar className="size-4" aria-hidden="true" />My Events
          </Link>
          <Link href="/organizer/events/new" className="flex items-center gap-2 px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
            <Plus className="size-4" aria-hidden="true" />Create Event
          </Link>
          <Link href="/organizer/settings#payouts" className="flex items-center gap-2 px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
            <DollarSign className="size-4" aria-hidden="true" />Payouts
          </Link>
        </>
      );
    }

    // admin
    return (
      <>
        <Link href="/events" className="block px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>Events</Link>
        <Link href="/admin/users" className="flex items-center gap-2 px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
          <Users className="size-4" aria-hidden="true" />Users
        </Link>
        <Link href="/admin/events" className="flex items-center gap-2 px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
          <FileText className="size-4" aria-hidden="true" />All Events
        </Link>
        <Link href="/admin/reports" className="flex items-center gap-2 px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
          <Search className="size-4" aria-hidden="true" />Reports
        </Link>
        <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
          <Cog className="size-4" aria-hidden="true" />System
        </Link>
      </>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* === LEFT: Logo === */}
        <Logo href={logoHref} />

        {/* === CENTER: Desktop Navigation === */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <CenterNav />
        </nav>

        {/* === RIGHT: Language + Auth === */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {loading ? (
            // Prevent flash of guest nav while session initialises
            <div className="hidden sm:block h-9 w-28 rounded-full bg-gray-100 animate-pulse" aria-hidden="true" />
          ) : role === 'guest' ? (
            <>
              <Link
                href={`/${locale}/auth/login`}
                className="hidden sm:inline px-4 py-2 text-sm text-brand-red border border-brand-red rounded-full hover:bg-brand-red hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="hidden sm:inline px-4 py-2 text-sm bg-brand-red text-white rounded-full hover:bg-opacity-90 transition-colors"
              >
                Create Account
              </Link>
            </>
          ) : (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-full border border-brand-gold text-sm font-medium hover:bg-brand-gold/10 transition-colors"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <User className="size-4 text-brand-red" aria-hidden="true" />
                <span className="max-w-[120px] truncate">{displayName}</span>
                <ChevronDown className={`size-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                  role="menu"
                  aria-label="User menu"
                  ref={dropdownMenuRef}
                >
                  <DropdownItems />
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen
              ? <X aria-hidden="true" className="size-6" />
              : <Menu aria-hidden="true" className="size-6" />
            }
          </button>
        </div>
      </div>

      {/* === MOBILE MENU === */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white pb-4" role="navigation" aria-label="Mobile navigation">
          {/* Logo */}
          <div className="px-4 py-3">
            <Logo href={logoHref} />
          </div>

          <Divider />

          {/* Role-specific nav links */}
          <MobileNavItems />

          <Divider />

          {/* Language */}
          <div className="px-4 py-2">
            <LanguageSwitcher />
          </div>

          <Divider />

          {/* Auth section */}
          {loading ? null : role === 'guest' ? (
            <div className="px-4 flex flex-col gap-2 pt-1">
              <Link
                href={`/${locale}/auth/login`}
                className="block text-center px-4 py-2 text-sm text-brand-red border border-brand-red rounded-full hover:bg-brand-red hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="block text-center px-4 py-2 text-sm bg-brand-red text-white rounded-full hover:bg-opacity-90 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Create Account
              </Link>
            </div>
          ) : (
            <div className="px-4 flex flex-col gap-1 pt-1">
              <p className="px-0 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {displayName}
              </p>
              {role === 'attendee' && (
                <>
                  <Link href={`/${locale}/dashboard/user`} className="flex items-center gap-2 py-2 text-sm hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
                    <User className="size-4" aria-hidden="true" />My Dashboard
                  </Link>
                  <Link href={`/${locale}/dashboard/profile`} className="flex items-center gap-2 py-2 text-sm hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
                    <User className="size-4" aria-hidden="true" />Profile
                  </Link>
                  <Link href={`/${locale}/dashboard/profile`} className="flex items-center gap-2 py-2 text-sm hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
                    <Settings className="size-4" aria-hidden="true" />Settings
                  </Link>
                </>
              )}
              {role === 'organizer' && (
                <>
                  <Link href="/organizer/settings" className="flex items-center gap-2 py-2 text-sm hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
                    <Settings className="size-4" aria-hidden="true" />Organizer Settings
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-2 py-2 text-sm hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
                    <User className="size-4" aria-hidden="true" />Switch to Attendee
                  </Link>
                </>
              )}
              {role === 'admin' && (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 py-2 text-sm hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
                    <User className="size-4" aria-hidden="true" />Switch → Attendee
                  </Link>
                  <Link href="/organizer" className="flex items-center gap-2 py-2 text-sm hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
                    <BarChart2 className="size-4" aria-hidden="true" />Switch → Organizer
                  </Link>
                  <Link href="/admin" className="flex items-center gap-2 py-2 text-sm hover:text-brand-red transition-colors" onClick={() => setMobileOpen(false)}>
                    <Cog className="size-4" aria-hidden="true" />Admin Panel
                  </Link>
                </>
              )}
              <SignOutForm
                formClassName="mt-1"
                className="flex items-center gap-2 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                  <LogOut className="size-4" aria-hidden="true" />Log Out
              </SignOutForm>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
