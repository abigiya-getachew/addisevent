"use client";

import { useActionState } from "react";
import { saveOrganizerPayoutAccount } from "@/app/[locale]/organizer/actions";
import type { organizerPayoutAccounts } from "@/server/src/db/schema";

type PayoutAccount = typeof organizerPayoutAccounts.$inferSelect;

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-text-muted focus:border-brand-red focus:outline-none";
const labelCls = "mb-1.5 block text-sm font-semibold text-charcoal";

export function PayoutAccountForm({ existing }: { existing: PayoutAccount | null }) {
  const [state, formAction, pending] = useActionState(saveOrganizerPayoutAccount, {});

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="method" className={labelCls}>Preferred Method *</label>
        <select id="method" name="method" required className={inputCls} defaultValue={existing?.method ?? ""}>
          <option value="" disabled>Select method</option>
          <option value="telebirr">Telebirr</option>
          <option value="cbebirr">CBE Birr</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
      </div>

      <div>
        <label htmlFor="accountHolderName" className={labelCls}>Account Holder Name *</label>
        <input
          id="accountHolderName"
          name="accountHolderName"
          required
          className={inputCls}
          defaultValue={existing?.accountHolderName ?? ""}
          placeholder="Full name as registered"
        />
      </div>

      <div>
        <label htmlFor="accountNumber" className={labelCls}>Phone / Account Number *</label>
        <input
          id="accountNumber"
          name="accountNumber"
          required
          className={inputCls}
          defaultValue={existing?.accountNumber ?? ""}
          placeholder="e.g. 0911 234 567"
        />
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
        {pending ? "Saving…" : "Save & Verify"}
      </button>
    </form>
  );
}
