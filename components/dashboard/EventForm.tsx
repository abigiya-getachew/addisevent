"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { saveOrganizerEvent } from "@/app/[locale]/organizer/actions";
import type { Event, TicketTier } from "@/server/src/db/schema";

type Tier = {
  id?: string;
  name: string;
  nameAm: string;
  price: string;
  totalQuantity: number;
  maxPerBooking: number;
  saleStartAt: string;
  saleEndAt: string;
};

const CATEGORIES = ["Music", "Festival", "Workshop", "Community", "Sports", "Other"] as const;
const STEPS = ["Basic Info", "When & Where", "Ticket Tiers", "Publishing"] as const;

function emptyTier(): Tier {
  return { name: "", nameAm: "", price: "0", totalQuantity: 100, maxPerBooking: 10, saleStartAt: "", saleEndAt: "" };
}

function toDatetimeLocal(d: Date | null | undefined) {
  if (!d) return "";
  const dt = new Date(d);
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  return dt.toISOString().slice(0, 16);
}

export function EventForm({
  locale,
  event,
  existingTiers,
}: {
  locale: string;
  event?: Event;
  existingTiers?: TicketTier[];
}) {
  const [step, setStep] = useState(0);
  const [tiers, setTiers] = useState<Tier[]>(
    existingTiers?.length
      ? existingTiers.map((t) => ({
          id: t.id,
          name: t.name,
          nameAm: t.nameAm ?? "",
          price: t.price,
          totalQuantity: t.totalQuantity,
          maxPerBooking: t.maxPerBooking,
          saleStartAt: toDatetimeLocal(t.saleStartAt),
          saleEndAt: toDatetimeLocal(t.saleEndAt),
        }))
      : [emptyTier()],
  );

  const [state, formAction, pending] = useActionState(saveOrganizerEvent, {});

  function updateTier(i: number, field: keyof Tier, value: string | number) {
    setTiers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));
  }

  const inputCls =
    "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-text-muted focus:border-brand-red focus:outline-none";
  const labelCls = "mb-1.5 block text-sm font-semibold text-charcoal";

  return (
    <form action={formAction}>
      {/* Hidden fields */}
      {event && <input type="hidden" name="eventId" value={event.id} />}
      <input type="hidden" name="tiers" value={JSON.stringify(tiers)} />

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              i === step
                ? "bg-brand-red text-white"
                : i < step
                  ? "bg-emerald-50 text-emerald-700"
                  : "border border-border bg-white text-text-secondary"
            }`}
          >
            <span
              className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                i === step ? "bg-white/20" : i < step ? "bg-emerald-200" : "bg-border"
              }`}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Step 1 — Basic Info */}
      {step === 0 && (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className={labelCls}>Event Title (English) *</label>
              <input id="title" name="title" required className={inputCls} defaultValue={event?.title} placeholder="e.g. Jazz Night at Hibret Studio" />
            </div>
            <div>
              <label htmlFor="titleAm" className={labelCls}>Event Title (Amharic)</label>
              <input id="titleAm" name="titleAm" className={inputCls} defaultValue={event?.titleAm ?? ""} placeholder="ለምሳሌ፦ ጃዝ ምሽት" dir="auto" />
            </div>
          </div>

          <div>
            <label htmlFor="category" className={labelCls}>Category *</label>
            <select id="category" name="category" required className={inputCls} defaultValue={event?.category ?? ""}>
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="description" className={labelCls}>Short Description (English)</label>
              <textarea id="description" name="description" rows={3} className={inputCls} defaultValue={event?.description ?? ""} placeholder="Brief overview of the event…" />
            </div>
            <div>
              <label htmlFor="descriptionAm" className={labelCls}>Short Description (Amharic)</label>
              <textarea id="descriptionAm" name="descriptionAm" rows={3} className={inputCls} defaultValue={event?.descriptionAm ?? ""} placeholder="አጭር መግለጫ…" dir="auto" />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className={labelCls}>Event Image / Banner URL</label>
            <input id="imageUrl" name="imageUrl" type="url" className={inputCls} defaultValue={event?.imageUrl ?? ""} placeholder="https://…" />
            <p className="mt-1 text-xs text-text-muted">Paste a public image URL. Direct upload coming soon.</p>
          </div>
        </div>
      )}

      {/* Step 2 — When & Where */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="startAt" className={labelCls}>Start Date & Time *</label>
              <input id="startAt" name="startAt" type="datetime-local" required className={inputCls} defaultValue={toDatetimeLocal(event?.startAt)} />
            </div>
            <div>
              <label htmlFor="endAt" className={labelCls}>End Date & Time (optional)</label>
              <input id="endAt" name="endAt" type="datetime-local" className={inputCls} defaultValue={toDatetimeLocal(event?.endAt)} />
            </div>
          </div>

          <div>
            <label htmlFor="venue" className={labelCls}>Venue Name</label>
            <input id="venue" name="venue" className={inputCls} defaultValue={event?.venue ?? ""} placeholder="e.g. Hibret Studio" />
          </div>

          <div>
            <label htmlFor="venueAddress" className={labelCls}>Full Address</label>
            <input id="venueAddress" name="venueAddress" className={inputCls} defaultValue={event?.venueAddress ?? ""} placeholder="e.g. Kazanchis, near Bole Road" />
          </div>

          <div>
            <label htmlFor="city" className={labelCls}>City</label>
            <input id="city" name="city" className={inputCls} defaultValue={event?.city ?? "Addis Ababa"} />
          </div>
        </div>
      )}

      {/* Step 3 — Ticket Tiers */}
      {step === 2 && (
        <div className="space-y-6">
          {tiers.map((tier, i) => (
            <div key={i} className="relative rounded-2xl border border-border bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-charcoal">Tier {i + 1}</h3>
                {tiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setTiers((prev) => prev.filter((_, idx) => idx !== i))}
                    className="flex size-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                    aria-label="Remove tier"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Tier Name (English) *</label>
                  <input required className={inputCls} value={tier.name} onChange={(e) => updateTier(i, "name", e.target.value)} placeholder="e.g. General Admission" />
                </div>
                <div>
                  <label className={labelCls}>Tier Name (Amharic)</label>
                  <input className={inputCls} value={tier.nameAm} onChange={(e) => updateTier(i, "nameAm", e.target.value)} placeholder="ለምሳሌ፦ ጠቅላላ" dir="auto" />
                </div>
                <div>
                  <label className={labelCls}>Price (ETB) *</label>
                  <input required type="number" min="0" step="0.01" className={inputCls} value={tier.price} onChange={(e) => updateTier(i, "price", e.target.value)} placeholder="0" />
                </div>
                <div>
                  <label className={labelCls}>Total Quantity *</label>
                  <input required type="number" min="1" className={inputCls} value={tier.totalQuantity} onChange={(e) => updateTier(i, "totalQuantity", Number(e.target.value))} />
                </div>
                <div>
                  <label className={labelCls}>Max Per Person</label>
                  <input type="number" min="1" max="100" className={inputCls} value={tier.maxPerBooking} onChange={(e) => updateTier(i, "maxPerBooking", Number(e.target.value))} />
                </div>
                <div />
                <div>
                  <label className={labelCls}>Sale Start (optional)</label>
                  <input type="datetime-local" className={inputCls} value={tier.saleStartAt} onChange={(e) => updateTier(i, "saleStartAt", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Sale End (optional)</label>
                  <input type="datetime-local" className={inputCls} value={tier.saleEndAt} onChange={(e) => updateTier(i, "saleEndAt", e.target.value)} />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setTiers((prev) => [...prev, emptyTier()])}
            className="inline-flex items-center gap-2 rounded-full border border-dashed border-brand-gold px-5 py-2.5 text-sm font-semibold text-[#8A6A2C] transition hover:bg-[#fff4db]"
          >
            <Plus className="size-4" />
            Add Another Tier
          </button>
        </div>
      )}

      {/* Step 4 — Publishing */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h3 className="font-heading text-lg font-bold text-charcoal">Ready to go?</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Save as a draft to finish later, or publish immediately to make it live.
            </p>
            {event && (
              <a
                href={`/${locale}/events/${event.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-red hover:underline"
              >
                Preview public page ↗
              </a>
            )}
          </div>

          {state?.error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              name="intent"
              value="draft"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-brand-gold disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save as Draft"}
            </button>
            <button
              type="submit"
              name="intent"
              value="publish"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(224,64,56,0.2)] transition hover:bg-[#c93630] disabled:opacity-60"
            >
              {pending ? "Publishing…" : "Publish Event"}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:border-brand-gold disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
          Back
        </button>
        {step < STEPS.length - 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a3a3a]"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>
    </form>
  );
}
