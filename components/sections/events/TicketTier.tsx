"use client";

import { useState } from "react";
import { Minus, Plus, Ticket } from "lucide-react";

export function TicketTier({
  name = "General admission",
  price,
}: {
  name?: string;
  price: number;
}) {
  const [quantity, setQuantity] = useState(0);

  return (
    <section
      aria-labelledby="ticket-tiers-heading"
      id="ticket-tiers"
      className="rounded-2xl border border-border bg-white p-5 shadow-(--shadow-1) sm:p-6"
    >
      <div className="mb-5">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
          <Ticket aria-hidden="true" className="size-4" />
          Tickets
        </p>
        <h2
          id="ticket-tiers-heading"
          className="mt-2 font-heading text-2xl font-bold tracking-tight text-charcoal"
        >
          Choose your tickets
        </h2>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-[#e9e2d5] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h3 className="font-heading text-lg font-bold text-charcoal">{name}</h3>
          <p className="mt-1 text-sm text-text-secondary">
            {price === 0 ? "Free" : `${price.toLocaleString()} ETB`} per ticket
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <span className="text-sm font-semibold text-charcoal">
            {price === 0 ? "Free" : `${(price * quantity).toLocaleString()} ETB`}
          </span>
          <div className="inline-flex items-center gap-3">
            <button
              type="button"
              aria-label={`Remove one ${name} ticket`}
              disabled={quantity === 0}
              onClick={() => setQuantity((current) => Math.max(0, current - 1))}
              className="grid size-9 place-items-center rounded-full border border-border text-charcoal transition hover:border-brand-red hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus aria-hidden="true" className="size-4" />
            </button>
            <output
              aria-label={`${quantity} tickets selected`}
              className="min-w-5 text-center text-sm font-bold text-charcoal"
            >
              {quantity}
            </output>
            <button
              type="button"
              aria-label={`Add one ${name} ticket`}
              onClick={() => setQuantity((current) => current + 1)}
              className="grid size-9 place-items-center rounded-full bg-brand-red text-white transition hover:bg-[#c93630]"
            >
              <Plus aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </div>
      <p aria-live="polite" className="mt-4 text-right text-sm text-text-secondary">
        {quantity} {quantity === 1 ? "ticket" : "tickets"} selected
        {quantity > 0 && price > 0
          ? ` · Total ${ (price * quantity).toLocaleString()} ETB`
          : ""}
      </p>
    </section>
  );
}

export default TicketTier;
