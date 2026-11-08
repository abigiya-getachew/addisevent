"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, User, Mail } from "lucide-react";

type AccountType = "attendee" | "organizer";

type RegisterResponse = {
  user?: { id: string };
  error?: string;
  message?: string;
};

export function RegisterForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("attendee");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: accountType }),
      });

      const data = (await res.json()) as RegisterResponse;
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      router.push(`/${locale}/auth/login?registered=true`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  }

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
      <form className="space-y-5" onSubmit={handleSubmit}>
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
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Abebe Girma"
              className="w-full rounded-xl border border-soft-stone bg-white py-3 pl-10 pr-4 text-sm text-charcoal placeholder:text-text-muted focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="register-email"
            className="mb-1.5 block text-sm font-semibold text-charcoal"
          >
            Email
          </label>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted"
            />
            <input
              id="register-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
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
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
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
        {error && (
          <p role="alert" className="text-sm font-medium text-brand-red">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-brand-red py-3.5 font-heading font-extrabold text-white shadow-[0_6px_24px_rgb(224_64_56/30%)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#c0312a] hover:shadow-[0_10px_32px_rgb(224_64_56/40%)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

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
