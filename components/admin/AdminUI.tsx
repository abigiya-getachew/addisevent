import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 rounded-full bg-[#102442] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d1e38]"
        >
          {action.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "bg-[#F0F4FF] text-[#102442]",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="mt-2 font-heading text-3xl font-bold text-charcoal">{value}</p>
        </div>
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      {sub && <p className="mt-3 text-xs text-text-muted">{sub}</p>}
    </article>
  );
}

export function AdminTable({
  headers,
  children,
  empty,
}: {
  headers: string[];
  children: ReactNode;
  empty?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-[#faf8f4]">
              {headers.map((h) => (
                <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
        {!children && empty && (
          <p className="px-5 py-10 text-center text-sm text-text-secondary">{empty}</p>
        )}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    sent: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    completed: "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200",
    draft: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    pending: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    processing: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    reserved: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200",
    failed: "bg-red-50 text-red-700 ring-1 ring-red-200",
    refunded: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    suspended: "bg-red-50 text-red-700 ring-1 ring-red-200",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] ?? "bg-zinc-100 text-zinc-600"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
