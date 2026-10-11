"use client";

import { useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { removeSavedEvent, saveEvent } from "@/app/[locale]/dashboard/user/actions";

export function SaveEventButton({
  eventId,
  isSaved,
}: {
  eventId: string;
  isSaved: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      aria-label={isSaved ? "Remove event from saved" : "Save event"}
      aria-pressed={isSaved}
      onClick={() =>
        startTransition(() =>
          isSaved ? removeSavedEvent(eventId) : saveEvent(eventId),
        )
      }
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-brand-red transition hover:border-brand-red disabled:opacity-50"
    >
      {isSaved ? (
        <BookmarkCheck aria-hidden="true" className="size-4" />
      ) : (
        <Bookmark aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}
