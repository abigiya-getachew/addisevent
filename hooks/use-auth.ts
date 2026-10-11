'use client';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import type { AuthUser, Role } from '@/context/AuthContext';

export type { AuthUser, Role };

export function useAuth() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id as string,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        phone: (session.user as { phone?: string | null }).phone ?? null,
        role: (session.user as { role?: AuthUser['role'] }).role as AuthUser['role'],
      }
    : null;

  const role: Role = user?.role ?? 'guest';

  return {
    user,
    role,
    loading,
    accessToken: (session as { accessToken?: string } | null)?.accessToken ?? null,
    signOut: () => nextAuthSignOut({ callbackUrl: '/' }),
    /** @deprecated alias for signOut — kept for backward compatibility */
    clearSession: () => nextAuthSignOut({ callbackUrl: '/' }),
  };
}
