import NextAuth, { type DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import {
  users,
  accounts,
  sessions,
  verificationTokens,
  authenticators,
} from '@/server/src/db/schema';

// ─── Local type declarations (avoid cross-boundary import from schema enums) ──

type Role = 'attendee' | 'organizer' | 'admin';

// ─── TypeScript module augmentation ──────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role: Role;
      phone?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    role?: Role;
    phone?: string | null;
  }
}

// ─── NextAuth configuration ───────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),

  session: { strategy: 'jwt' },

  secret: process.env.AUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!identifier || !password) return null;

        const isEmail = identifier.includes('@');

        const [user] = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            phone: users.phone,
            role: users.role,
            passwordHash: users.passwordHash,
          })
          .from(users)
          .where(
            isEmail
              ? eq(users.email, identifier)
              : eq(users.phone, identifier)
          )
          .limit(1);

        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email ?? null,
          phone: user.phone ?? null,
          role: user.role as Role,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      // For Google sign-ins: if the adapter just created the user and role is
      // null/default, ensure role is set to 'attendee'.
      if (account?.provider === 'google' && profile?.email) {
        const [existingUser] = await db
          .select({ id: users.id, role: users.role })
          .from(users)
          .where(eq(users.email, profile.email))
          .limit(1);

        if (existingUser && !existingUser.role) {
          await db
            .update(users)
            .set({ role: 'attendee' })
            .where(eq(users.id, existingUser.id));
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      // On sign-in, user object is present — persist custom fields to token.
      // Pass-through (token.role ?? existing) runs unconditionally so token
      // rotation and update() calls do not silently drop these fields.
      if (user) {
        token.id = user.id ?? undefined;
        token.accessToken = user.id ?? undefined; // Bearer token sent to Hono
        if (user.name) token.name = user.name;
      }
      token.role = ((user as { role?: Role } | undefined)?.role ?? token.role) as Role | undefined;
      token.phone = ((user as { phone?: string | null } | undefined)?.phone ?? token.phone) as string | null | undefined;
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = (token.id as string | undefined) ?? token.sub ?? '';
        session.user.role = token.role as Role;
        session.user.phone = (token.phone as string | null | undefined) ?? null;
        if (token.name) session.user.name = token.name as string;
        session.accessToken = (token.accessToken as string | undefined) ?? token.sub;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Role-based redirect is handled client-side after signIn.
      // Allow relative URLs and same-origin absolute URLs; fallback to baseUrl.
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
      },
    },
  },
});
