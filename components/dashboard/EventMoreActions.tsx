"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  cancelOrganizerEvent,
  deleteOrganizerDraft,
  duplicateOrganizerEvent,
} from "@/app/[locale]/organizer/actions";

export function EventMoreActions({
  eventId,
  status,
}: {
  eventId: string;
  status: "draft" | "published" | "completed" | "cancelled";
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <details className="group relative shrink-0">
      <summary
        aria-label="More event actions"
        className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-border text-charcoal transition hover:border-brand-gold [&::-webkit-details-marker]:hidden"
      >
        <MoreHorizontal className="size-5" aria-hidden="true" />
      </summary>
      <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-border bg-white p-2 shadow-xl">
        <form action={duplicateOrganizerEvent}>
          <input type="hidden" name="eventId" value={eventId} />
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-charcoal hover:bg-[#faf8f4]">
            Duplicate as draft
          </button>
        </form>
        {status === "draft" && (
          <form
            action={deleteOrganizerDraft}
            onSubmit={(event) => {
              if (!window.confirm("Delete this draft event? This cannot be undone.")) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="eventId" value={eventId} />
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">
              Delete draft
            </button>
          </form>
        )}
        {(status === "draft" || status === "published") && (
          <form
            action={cancelOrganizerEvent}
            onSubmit={(event) => {
              if (!window.confirm("Cancel this event? This changes its status but does not automatically notify buyers or issue refunds.")) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="eventId" value={eventId} />
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">
              Cancel event
            </button>
          </form>
        )}
        {error && <p role="alert" className="px-3 py-2 text-xs text-red-700">{error}</p>}
      </div>
    </details>
  );
}
