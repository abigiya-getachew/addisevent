"use client";

import { useActionState, useEffect } from "react";
import { initiateAttendeePayment } from "@/app/[locale]/dashboard/user/actions";

const initialState: { error?: string; paymentUrl?: string } = {};

export function CheckoutPaymentForm({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState(
    initiateAttendeePayment,
    initialState,
  );

  useEffect(() => {
    if (state.paymentUrl) window.location.assign(state.paymentUrl);
  }, [state.paymentUrl]);

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="bookingId" value={bookingId} />
      <fieldset>
        <legend className="text-sm font-semibold text-charcoal">
          Choose a payment method
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            ["telebirr", "Telebirr"],
            ["cbebirr", "CBE Birr"],
          ].map(([value, label], index) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 text-sm font-medium text-charcoal has-[:checked]:border-brand-red has-[:checked]:bg-brand-primary-soft"
            >
              <input
                type="radio"
                name="gateway"
                value={value}
                required
                defaultChecked={index === 0}
                className="accent-[#df4039]"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      {state.error && (
        <p role="alert" className="text-sm font-medium text-error">
          {state.error}
        </p>
      )}
      {state.paymentUrl && (
        <p role="status" className="text-sm text-text-secondary">
          Redirecting to the secure payment provider…
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c93630] disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Connecting…" : "Continue to payment"}
      </button>
    </form>
  );
}
