import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role: 'attendee' | 'organizer' | 'admin';
      phone?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    role?: 'attendee' | 'organizer' | 'admin';
    phone?: string | null;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: string;
    role?: 'attendee' | 'organizer' | 'admin';
    phone?: string | null;
    accessToken?: string;
  }
}
