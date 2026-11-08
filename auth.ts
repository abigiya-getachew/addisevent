import NextAuth, { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role: 'attendee' | 'organizer' | 'admin';
  }

  interface Session {
    user: { id: string; role: 'attendee' | 'organizer' | 'admin' } & DefaultSession['user'];
  }
}
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/server/src/db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [found] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);

        if (!found || !found.passwordHash) return null;

        const match = await bcrypt.compare(
          credentials.password as string,
          found.passwordHash
        );

        if (!match) return null;

        return {
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role,
        };
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'attendee' | 'organizer' | 'admin';
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
});