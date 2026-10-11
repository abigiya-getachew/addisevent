import type { ReactNode } from "react";
import { headers } from "next/headers";
import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";

export default async function LocaleLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? headersList.get("x-invoke-path") ?? "";
  const isAdmin = /\/admin(\/|$)/.test(pathname);

  return (
    <AuthProvider>
      {!isAdmin && <Header />}
      <main className="flex-grow">{children}</main>
      {!isAdmin && <Footer />}
    </AuthProvider>
  );
}
