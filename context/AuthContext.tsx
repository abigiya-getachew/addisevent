'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/auth-js';
import { supabaseBrowser } from '@/lib/auth';

export type Role = 'guest' | 'attendee' | 'organizer' | 'admin';

interface AuthContextValue {
  user: User | null;
  role: Role;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: 'guest',
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('guest');

  useEffect(() => {
    // Initialise from existing session
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const metaRole = session.user.user_metadata?.role as Role | undefined;
        setRole(metaRole ?? 'attendee');
      } else {
        setUser(null);
        setRole('guest');
      }
    });

    // Keep in sync with auth state changes
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          const metaRole = session.user.user_metadata?.role as Role | undefined;
          setRole(metaRole ?? 'attendee');
        } else {
          setUser(null);
          setRole('guest');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
