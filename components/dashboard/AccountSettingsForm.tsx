"use client";

import { useActionState } from "react";
import { saveOrganizerAccountSettings } from "@/app/[locale]/organizer/actions";

type UserData = { name: string | null; phone: string | null; email: string | null; locale: string } | null;

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-text-muted focus:border-brand-red focus:outline-none";
const labelCls = "mb-1.5 block text-sm font-semibold text-charcoal";

export function AccountSettingsForm({ user }: { user: UserData }) {
  const [state, formAction, pending] = useActionState(saveOrganizerAccountSettings, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className={labelCls}>Full Name *</label>
        <input id="name" name="name" required className={inputCls} defaultValue={user?.name ?? ""} placeholder="Your name" />
      </div>

      <div>
        <label htmlFor="phone" className={labelCls}>Phone</label>
        <input id="phone" name="phone" type="tel" className={inputCls} defaultValue={user?.phone ?? ""} placeholder="0911 234 567" />
      </div>

      <div>
        <label className={labelCls}>Email</label>
        <input className={`${inputCls} cursor-not-allowed opacity-60`} value={user?.email ?? ""} readOnly disabled />
        <p className="mt-1 text-xs text-text-muted">Email cannot be changed here.</p>
      </div>

      <div>
        <label htmlFor="locale" className={labelCls}>Language Preference</label>
        <select id="locale" name="locale" className={inputCls} defaultValue={user?.locale ?? "en"}>
          <option value="en">English</option>
          <option value="am">አማርኛ (Amharic)</option>
        </select>
      </div>

      {state?.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      {state?.success && (
        <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{state.success}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c93630] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
