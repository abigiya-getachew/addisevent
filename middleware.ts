import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth(function middleware(req) {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!session?.user;
  const role = (session?.user as { role?: string } | undefined)?.role;

  // Locale-prefixed route guards
  const isAdminRoute = /^\/[^/]+\/admin(\/|$)/.test(pathname);
  const isOrganizerRoute = /^\/[^/]+\/organizer(\/|$)/.test(pathname);
  const isDashboardRoute = /^\/[^/]+\/dashboard(\/|$)/.test(pathname);

  if (isDashboardRoute || isOrganizerRoute || isAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/en/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isOrganizerRoute) {
    if (role !== 'organizer' && role !== 'admin') {
      return NextResponse.redirect(new URL('/en/dashboard', req.url));
    }
  }

  if (isAdminRoute) {
    if (role !== 'admin') {
      const dest = role === 'organizer' ? '/en/organizer' : '/en/dashboard';
      return NextResponse.redirect(new URL(dest, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
