import { NextRequest, NextResponse } from 'next/server';
import { privateRoutes } from './server/infra/routes/privateRoutes';

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth');
  const { pathname } = request.nextUrl;


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