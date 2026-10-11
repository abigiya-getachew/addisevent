"use client";

import { Download } from "lucide-react";

export function ReceiptDownloadButton({
  receipt,
}: {
  receipt: {
    reference: string;
    event: string;
    amount: string;
    date: string;
    method: string;
    status: string;
  };
}) {
  function downloadReceipt() {
    const lines = [
      "AddisEvent payment receipt",
      "",
      `Booking reference: ${receipt.reference}`,
      `Event: ${receipt.event}`,
      `Amount: ${receipt.amount}`,
      `Date: ${new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Africa/Addis_Ababa",
      }).format(new Date(receipt.date))}`,
      `Payment method: ${receipt.method}`,
      `Status: ${receipt.status}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `addisevent-receipt-${receipt.reference}.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <button
      type="button"
      onClick={downloadReceipt}
      aria-label={`Download receipt for ${receipt.event}`}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-charcoal transition hover:border-brand-gold hover:bg-[#fbf9f5]"
    >
      <Download aria-hidden="true" className="size-4" />
    </button>
  );
}
