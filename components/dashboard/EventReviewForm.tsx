"use client";

import { useActionState } from "react";
import { submitEventReview } from "@/app/[locale]/dashboard/user/actions";

const initialState: { error?: string; success?: string } = {};

export function EventReviewForm({
  eventId,
  initialRating,
  initialReview,
}: {
  eventId: string;
  initialRating?: number;
  initialReview?: string | null;
}) {
  const [state, action, pending] = useActionState(
    submitEventReview,
    initialState,
  );

  return (
    <form action={action} className="mt-4 space-y-3">
      <input type="hidden" name="eventId" value={eventId} />
      <label className="block text-sm font-medium text-charcoal">
        Your rating
        <select
          name="rating"
          defaultValue={initialRating ?? ""}
          required
          className="mt-1.5 block min-h-11 w-full rounded-xl border border-border bg-white px-3 text-sm"
        >
          <option value="" disabled>
            Choose a rating
          </option>
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating} {rating === 1 ? "star" : "stars"}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-charcoal">
        Review <span className="font-normal text-text-muted">(optional)</span>
        <textarea
          name="review"
          defaultValue={initialReview ?? ""}
          maxLength={2000}
          rows={3}
          className="mt-1.5 block w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm text-success">
          {state.success}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-charcoal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-red disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save review"}
      </button>
    </form>
  );
}
