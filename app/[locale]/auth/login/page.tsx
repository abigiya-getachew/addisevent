import type { Metadata } from "next";
import { LoginForm } from "../../../../components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log In | AddisEvent",
  description: "Log in to your AddisEvent account to manage tickets and events.",
};

export default function LoginPage() {
  return <LoginForm />;
}
