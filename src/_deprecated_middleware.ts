import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { privateRoutes } from './server/infra/routes/privateRoutes';

export async function middleware(request: NextRequest) {
  let isAuthenticated = request.cookies.get('auth');
  const { pathname, searchParams } = request.nextUrl;

  if (searchParams.has('logout')) {
    (await cookies()).delete('auth');
    isAuthenticated = undefined;

    const url = request.nextUrl.clone();
    url.searchParams.delete('logout');
    const response = NextResponse.redirect(url);
    response.cookies.delete('auth');
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};