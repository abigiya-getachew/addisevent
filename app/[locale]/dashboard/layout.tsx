import type { ReactNode } from "react";

// Protected area — all routes under /[locale]/dashboard/ require auth.
// Add auth guard / session check here when auth is wired up.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
