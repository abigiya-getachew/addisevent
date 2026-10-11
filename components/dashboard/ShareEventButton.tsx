"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareEventButton({ path }: { path: string }) {
  const [shared, setShared] = useState(false);

  async function shareEvent() {
    const url = `${window.location.origin}${path}`;
    if (navigator.share) {
      await navigator.share({ url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setShared(true);
    window.setTimeout(() => setShared(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={shareEvent}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold"
    >
      {shared ? <Check className="size-4" aria-hidden="true" /> : <Share2 className="size-4" aria-hidden="true" />}
      {shared ? "Copied" : "Share"}
    </button>
  );
}
