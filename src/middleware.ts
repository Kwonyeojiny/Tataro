import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const membersOnlyRoutes = ['/mypage', '/tarotReading'];
const guestsOnlyRoutes = ['/login'];

export const middleware = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = request.nextUrl;

  if (!token?.access_token && membersOnlyRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token?.access_token && guestsOnlyRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/mypage', '/tarotReading', '/login'],
};
