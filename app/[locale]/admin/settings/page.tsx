import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/AdminUI";

export const metadata: Metadata = { title: "System Settings | AddisEvent" };

const inputCls = "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-charcoal focus:border-[#102442] focus:outline-none";
const labelCls = "mb-1.5 block text-sm font-semibold text-charcoal";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      <h2 className="mb-5 font-heading text-lg font-bold text-charcoal border-b border-border pb-3">{title}</h2>
      {children}
    </section>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader title="System Settings" description="Platform configuration — admin only." />

      <div className="space-y-6">
        <Section title="Platform">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Site Name</label>
              <input className={inputCls} defaultValue="AddisEvent" />
            </div>
            <div>
              <label className={labelCls}>Default Currency</label>
              <input className={inputCls} defaultValue="ETB" />
            </div>
            <div>
              <label className={labelCls}>Supported Cities (comma-separated)</label>
              <input className={inputCls} defaultValue="Addis Ababa, Adama, Hawassa, Bahir Dar, Dire Dawa" />
            </div>
            <div>
              <label className={labelCls}>Announcement Banner</label>
              <input className={inputCls} placeholder="Leave blank to hide banner" />
            </div>
          </div>
        </Section>

        <Section title="Fees & Pricing">
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Platform Commission (%)</label>
              <input type="number" min="0" max="100" step="0.1" className={inputCls} defaultValue="5" />
            </div>
            <div>
              <label className={labelCls}>Minimum Ticket Price (ETB)</label>
              <input type="number" min="0" className={inputCls} defaultValue="0" />
            </div>
            <div>
              <label className={labelCls}>Minimum Payout Threshold (ETB)</label>
              <input type="number" min="0" className={inputCls} defaultValue="500" />
            </div>
          </div>
        </Section>

        <Section title="Payment Gateways">
          <div className="space-y-4">
            {[
              { label: "Telebirr API Key", placeholder: "<telebirr_api_key>" },
              { label: "CBE Birr Credentials", placeholder: "<cbebirr_credential>" },
              { label: "Chapa Secret Key", placeholder: "<chapa_secret_key>" },
            ].map(({ label, placeholder }) => (
              <div key={label}>
                <label className={labelCls}>{label}</label>
                <input type="password" className={inputCls} placeholder={placeholder} />
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-[#faf8f4] px-4 py-3">
              <span className="text-sm font-semibold text-charcoal">Mode:</span>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input type="radio" name="gateway_mode" value="test" defaultChecked /> Test
              </label>
              <label className="flex items-center gap-2 text-sm text-text-secondary">
                <input type="radio" name="gateway_mode" value="live" /> Live
              </label>
            </div>
          </div>
        </Section>

        <Section title="Security">
          <div className="space-y-3">
            {[
              "View active sessions",
              "Rate-limit settings",
              "IP restrictions",
              "Admin activity log",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <span className="text-sm text-charcoal">{item}</span>
                <span className="text-xs text-text-muted">Coming soon</span>
              </div>
            ))}
          </div>
        </Section>

        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-full bg-[#102442] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d1e38]"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
