import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream-ivory">
      {/* Subtle gold cross-pattern background */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern
              id="auth-cross"
              x="0"
              y="0"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <rect x="20" y="22" width="8" height="4" rx="1" fill="#D4A03C" />
              <rect x="22" y="20" width="4" height="8" rx="1" fill="#D4A03C" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-cross)" />
        </svg>
      </div>

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 sm:py-24">
        {/* Card */}
        <div className="w-full max-w-md rounded-2xl border border-soft-stone bg-white px-7 py-10 shadow-[0_12px_40px_rgb(42_42_42/8%)] sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
