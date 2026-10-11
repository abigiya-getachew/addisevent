"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { signOut } from "next-auth/react";

export function SignOutForm({
  className,
  formClassName,
  menuItem = false,
  children,
}: {
  className: string;
  formClassName?: string;
  menuItem?: boolean;
  children: ReactNode;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setPending(true);
    setError(null);
    try {
      await signOut({ redirectTo: "/" });
    } catch {
      setError("Could not log out. Please try again.");
      setPending(false);
    }
  }

  return (
    <form
      className={formClassName}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSignOut();
      }}
    >
      <button
        type="submit"
        disabled={pending}
        className={className}
        role={menuItem ? "menuitem" : undefined}
        tabIndex={menuItem ? -1 : undefined}
        aria-busy={pending}
      >
        {children}
      </button>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
