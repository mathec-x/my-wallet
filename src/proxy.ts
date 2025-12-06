import { NextResponse } from 'next/server';
import { privateRoutes } from './server/infra/routes/privateRoutes';

export function proxy(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  const cookieHeader = request.headers.get('cookie') ?? '';
  const isAuthenticated = cookieHeader.includes('auth=');

  if (searchParams.has('logout')) {
    searchParams.delete('logout');

    const redirectUrl = new URL(url);
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('auth', '', { path: '/', expires: new Date(0) });
    return response;
  }

  if (!isAuthenticated && privateRoutes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon|manifest.webmanifest|pwa|service-worker).*)',
  ],
};
