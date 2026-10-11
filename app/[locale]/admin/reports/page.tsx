import type { Metadata } from "next";
import { BarChart3, Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminUI";

export const metadata: Metadata = { title: "Reports | AddisEvent" };

const REPORTS = [
  { title: "Sales Summary", desc: "Daily/weekly revenue and tickets sold", icon: BarChart3 },
  { title: "Organizer Performance", desc: "Top creators, most events, revenue per organizer", icon: FileText },
  { title: "Attendee Demographics", desc: "Repeat buyers, locations, booking patterns", icon: FileText },
  { title: "Payment Methods", desc: "Telebirr vs CBE Birr vs Chapa usage breakdown", icon: FileText },
  { title: "Events by City", desc: "Growth across Addis, Adama, Hawassa and more", icon: FileText },
  { title: "System Health", desc: "Errors, login attempts, webhook status", icon: FileText },
] as const;

const PRESETS = ["Today", "This Week", "This Month", "Last Month", "Custom"] as const;

export default function AdminReportsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Reports" description="Data exports and platform trends." />

      {/* Date range */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-charcoal">Date range:</span>
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${p === "This Month" ? "bg-[#102442] text-white" : "border border-border bg-white text-charcoal hover:border-[#102442]"}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Report cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map(({ title, desc, icon: Icon }) => (
          <article
            key={title}
            className="flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)] transition hover:border-[#102442]"
          >
            <div>
              <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#102442]">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-base font-bold text-charcoal">{title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{desc}</p>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-charcoal transition hover:border-[#102442]"
              >
                <Download className="size-3.5" aria-hidden="true" />
                CSV
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-charcoal transition hover:border-brand-gold"
              >
                <Download className="size-3.5" aria-hidden="true" />
                Excel
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-text-muted">
        Report generation connects to live data. Export functionality requires backend integration.
      </p>
    </div>
  );
}
