import { BookmarkX } from "lucide-react";
import { removeSavedEvent, startSavedEventBooking } from "@/app/[locale]/dashboard/user/actions";

export function SavedEventActions({
  eventId,
  locale,
  canBook,
}: {
  eventId: string;
  locale: string;
  canBook: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {canBook ? (
        <form action={startSavedEventBooking.bind(null, eventId, locale)}>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c93630]"
          >
            Book now
          </button>
        </form>
      ) : (
        <span className="inline-flex min-h-10 items-center rounded-full bg-[#f8f6f2] px-4 py-2 text-sm font-semibold text-text-muted">
          Sold out
        </span>
      )}
      <form action={removeSavedEvent.bind(null, eventId)}>
        <button
          type="submit"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-error hover:text-error"
        >
          <BookmarkX aria-hidden="true" className="size-4" />
          Remove
        </button>
      </form>
    </div>
  );
}
