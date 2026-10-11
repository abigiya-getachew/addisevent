"use client";

import { useActionState } from "react";
import { changeAttendeePassword, updateAttendeeProfile } from "@/app/[locale]/dashboard/user/actions";

const INTERESTS = [
  "Live music",
  "Festivals",
  "Workshops",
  "Community",
  "Arts & culture",
  "Food & drink",
  "Outdoors",
  "Nightlife",
];

type ActionState = { error?: string; success?: string };
const initialState: ActionState = {};

export function ProfileForms({
  locale,
  profile,
}: {
  locale: string;
  profile: {
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    interests: string[];
    emailNotifications: boolean;
    smsReminders: boolean;
    hasPassword: boolean;
  };
}) {
  const [profileState, profileAction, isSavingProfile] = useActionState(
    updateAttendeeProfile,
    initialState,
  );
  const [passwordState, passwordAction, isSavingPassword] = useActionState(
    changeAttendeePassword,
    initialState,
  );

  return (
    <div className="space-y-6">
      <form action={profileAction} className="space-y-6">
        <input type="hidden" name="locale" value={locale} />
        <section className="rounded-2xl border border-border bg-white p-5 shadow-(--shadow-1) sm:p-7">
          <SectionHeading title="Personal information" description="Your contact details for tickets and event updates." />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-charcoal">
              Full name
              <input
                name="name"
                defaultValue={profile.name}
                required
                maxLength={255}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-charcoal">
              Email address
              <input
                value={profile.email}
                readOnly
                className={`${inputClass} cursor-not-allowed bg-[#f8f6f2]`}
              />
              <span className="mt-1 block text-xs font-normal text-text-muted">
                Contact support to change your sign-in email.
              </span>
            </label>
            <label className="block text-sm font-medium text-charcoal">
              Phone number
              <input
                name="phone"
                defaultValue={profile.phone}
                type="tel"
                minLength={9}
                maxLength={20}
                autoComplete="tel"
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-normal text-text-muted">
                Used for Telebirr/CBE Birr receipts and SMS reminders.
              </span>
            </label>
            <label className="block text-sm font-medium text-charcoal">
              Profile photo URL
              <input
                name="avatarUrl"
                defaultValue={profile.avatarUrl}
                type="url"
                placeholder="https://example.com/photo.jpg"
                className={inputClass}
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-(--shadow-1) sm:p-7">
          <SectionHeading title="Preferences" description="Choose what you’re interested in and how we contact you." />
          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-charcoal">Your interests</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <label
                  key={interest}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-2 text-sm text-charcoal has-checked:border-brand-red has-checked:bg-brand-primary-soft has-checked:text-brand-red"
                >
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest}
                    defaultChecked={profile.interests.includes(interest)}
                    className="accent-brand-red"
                  />
                  {interest}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4">
              <input
                type="checkbox"
                name="emailNotifications"
                defaultChecked={profile.emailNotifications}
                className="mt-0.5 size-4 accent-brand-red"
              />
              <span>
                <span className="block text-sm font-semibold text-charcoal">Email notifications</span>
                <span className="mt-1 block text-xs leading-5 text-text-secondary">Event and booking updates by email.</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4">
              <input
                type="checkbox"
                name="smsReminders"
                defaultChecked={profile.smsReminders}
                className="mt-0.5 size-4 accent-brand-red"
              />
              <span>
                <span className="block text-sm font-semibold text-charcoal">SMS reminders</span>
                <span className="mt-1 block text-xs leading-5 text-text-secondary">Reminders sent to your phone number.</span>
              </span>
            </label>
          </div>
          <div className="mt-5 rounded-xl bg-[#f8f6f2] px-4 py-3 text-sm text-text-secondary">
            Preferred currency <span className="ml-1 font-semibold text-charcoal">ETB</span>
          </div>
          <ActionMessage state={profileState} />
          <button
            type="submit"
            disabled={isSavingProfile}
            className="mt-5 rounded-full bg-brand-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c93630] disabled:opacity-60"
          >
            {isSavingProfile ? "Saving…" : "Save profile"}
          </button>
        </section>
      </form>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-(--shadow-1) sm:p-7">
        <SectionHeading title="Security" description="Change your password or review connected sign-in methods." />
        {profile.hasPassword ? (
          <form action={passwordAction} className="mt-5 grid gap-4 sm:grid-cols-3">
            <input type="hidden" name="locale" value={locale} />
            <label className="text-sm font-medium text-charcoal">
              Current password
              <input name="currentPassword" type="password" autoComplete="current-password" required className={inputClass} />
            </label>
            <label className="text-sm font-medium text-charcoal">
              New password
              <input name="newPassword" type="password" minLength={8} maxLength={128} autoComplete="new-password" required className={inputClass} />
            </label>
            <label className="text-sm font-medium text-charcoal">
              Confirm new password
              <input name="confirmPassword" type="password" minLength={8} maxLength={128} autoComplete="new-password" required className={inputClass} />
            </label>
            <div className="sm:col-span-3">
              <ActionMessage state={passwordState} />
              <button
                type="submit"
                disabled={isSavingPassword}
                className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-charcoal transition hover:border-brand-gold disabled:opacity-60"
              >
                {isSavingPassword ? "Updating…" : "Change password"}
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-5 rounded-xl bg-[#f8f6f2] p-4 text-sm text-text-secondary">
            This account uses social sign-in. A password cannot be changed here.
          </p>
        )}
      </section>
    </div>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-charcoal">{title}</h2>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
  );
}

function ActionMessage({ state }: { state: ActionState }) {
  if (!state.error && !state.success) return null;
  return (
    <p
      role={state.error ? "alert" : "status"}
      className={`mt-4 rounded-xl px-4 py-3 text-sm ${
        state.error ? "bg-error-soft text-error" : "bg-success-soft text-success"
      }`}
    >
      {state.error ?? state.success}
    </p>
  );
}

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm text-charcoal outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-primary-soft";
