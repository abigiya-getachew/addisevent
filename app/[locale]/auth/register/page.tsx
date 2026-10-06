import type { Metadata } from "next";
import { RegisterForm } from "../../../../components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | AddisEvent",
  description: "Join AddisEvent to discover and book events in Addis Ababa.",
};

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <RegisterForm locale={locale} />;
}
