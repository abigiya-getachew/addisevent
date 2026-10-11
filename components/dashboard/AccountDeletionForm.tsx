import { deleteAttendeeAccount } from "@/app/[locale]/dashboard/user/actions";

export function AccountDeletionForm({ locale }: { locale: string }) {
  return (
    <form action={deleteAttendeeAccount} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
      <input type="hidden" name="locale" value={locale} />
      <label className="block text-sm font-medium text-charcoal">
        Type DELETE to confirm
        <input
          name="confirmation"
          required
          pattern="DELETE"
          autoComplete="off"
          className="mt-1.5 block w-full rounded-xl border border-border px-3.5 py-3 text-sm outline-none focus:border-error sm:w-64"
        />
      </label>
      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-error px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a81f1f]"
      >
        Delete my account
      </button>
    </form>
  );
}
