"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, User, Phone, Smartphone } from "lucide-react";

type AccountType = "attendee" | "organizer";

// ── Social / quick-signup options ────────────────────────────────────────────
const QUICK_OPTIONS = [
  {
    id: "sms",
    label: "Phone SMS",
    icon: <Smartphone aria-hidden="true" className="size-5 text-brand-red" />,
  },
  {
    id: "google",
    label: "Google",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
  },
];

export function RegisterForm() {
  const [accountType, setAccountType] = useState<AccountType>("attendee");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md">
      {/* ── Hero ── */}
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
          Join AddisEvent
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary sm:text-base">
          Start discovering events or creating your own in 2 minutes
        </p>
      </div>

      {/* ── Account type selector ── */}
      <fieldset className="mb-6">
        <legend className="mb-3 block text-sm font-semibold text-charcoal">
          Choose your lane
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {/* Attendee */}
          <label
            className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 transition duration-150 ${
              accountType === "attendee"
                ? "border-brand-red bg-brand-red/5"
                : "border-soft-stone bg-white hover:border-brand-gold/50"
            }`}
          >
            <input
              type="radio"
              name="account-type"
              value="attendee"
              checked={accountType === "attendee"}
              onChange={() => setAccountType("attendee")}
              className="sr-only"
            />
            <span className="text-sm font-bold text-charcoal">
              I&apos;m Attending
            </span>
            <span className="text-xs leading-5 text-text-secondary">
              Find &amp; book events
            </span>
            {/* Selection dot */}
            <span
              aria-hidden="true"
              className={`absolute right-3 top-3 size-4 rounded-full border-2 transition ${
                accountType === "attendee"
                  ? "border-brand-red bg-brand-red"
                  : "border-soft-stone bg-white"
              }`}
            />
          </label>

          {/* Organizer */}
          <label
            className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 transition duration-150 ${
              accountType === "organizer"
                ? "border-brand-red bg-brand-red/5"
                : "border-soft-stone bg-white hover:border-brand-gold/50"
            }`}
          >
            <input
              type="radio"
              name="account-type"
              value="organizer"
              checked={accountType === "organizer"}
              onChange={() => setAccountType("organizer")}
              className="sr-only"
            />
            <span className="text-sm font-bold text-charcoal">
              I&apos;m an Organizer
            </span>
            <span className="text-xs leading-5 text-text-secondary">
              Publish &amp; manage events
            </span>
            {/* Selection dot */}
            <span
              aria-hidden="true"
              className={`absolute right-3 top-3 size-4 rounded-full border-2 transition ${
                accountType === "organizer"
                  ? "border-brand-red bg-brand-red"
                  : "border-soft-stone bg-white"
              }`}
            />
          </label>
        </div>
      </fieldset>

      {/* ── Signup form ── */}
      <form className="space-y-5" noValidate>
        {/* Full name */}
        <div>
          <label
            htmlFor="register-name"
            className="mb-1.5 block text-sm font-semibold text-charcoal"
          >
            Full Name
          </label>
          <div className="relative">
            <User
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted"
            />
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Abebe Girma"
              className="w-full rounded-xl border border-soft-stone bg-white py-3 pl-10 pr-4 text-sm text-charcoal placeholder:text-text-muted focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition"
            />
          </div>
        </div>

        {/* Phone number */}
        <div>
          <label
            htmlFor="register-phone"
            className="mb-1.5 block text-sm font-semibold text-charcoal"
          >
            Phone Number
            <span className="ml-1.5 text-xs font-normal text-text-muted">
              (for SMS tickets)
            </span>
          </label>
          <div className="relative">
            <Phone
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted"
            />
            <input
              id="register-phone"
              type="tel"
              autoComplete="tel"
              placeholder="09..."
              className="w-full rounded-xl border border-soft-stone bg-white py-3 pl-10 pr-4 text-sm text-charcoal placeholder:text-text-muted focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="register-password"
            className="mb-1.5 block text-sm font-semibold text-charcoal"
          >
            Create Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-soft-stone bg-white py-3 pl-4 pr-12 text-sm text-charcoal placeholder:text-text-muted focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-charcoal transition"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="size-4" />
              ) : (
                <Eye aria-hidden="true" className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-full bg-brand-red py-3.5 font-heading font-extrabold text-white shadow-[0_6px_24px_rgb(224_64_56/30%)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#c0312a] hover:shadow-[0_10px_32px_rgb(224_64_56/40%)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none"
        >
          Create Account
        </button>
      </form>

      {/* ── Divider ── */}
      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-soft-stone" />
        <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          Or sign up faster with
        </span>
        <span className="h-px flex-1 bg-soft-stone" />
      </div>

      {/* ── Quick signup ── */}
      <div className="grid grid-cols-2 gap-3">
        {QUICK_OPTIONS.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-soft-stone bg-white py-3 px-4 text-sm font-semibold text-charcoal shadow-[0_2px_8px_rgb(42_42_42/5%)] transition duration-150 hover:border-brand-gold/50 hover:shadow-[0_4px_14px_rgb(212_160_60/12%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* ── Already have account ── */}
      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="inline-flex items-center gap-1 font-bold text-brand-red hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
        >
          Log In
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </p>

      {/* ── Footer note ── */}
      <p className="mt-8 text-center text-xs leading-5 text-text-muted">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline hover:text-charcoal">
          Terms
        </Link>{" "}
        &amp;{" "}
        <Link href="/privacy" className="underline hover:text-charcoal">
          Privacy
        </Link>
        .
      </p>
    </div>
  );
}
