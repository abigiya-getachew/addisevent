'use client';
import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

export type Role = 'guest' | 'attendee' | 'organizer' | 'admin';

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: 'attendee' | 'organizer' | 'admin';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Legacy export — components that import useAuth from AuthContext still work
export { useAuth } from '@/hooks/use-auth';
