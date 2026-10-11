import type { ReactNode } from "react";
import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </AuthProvider>
  );
}
