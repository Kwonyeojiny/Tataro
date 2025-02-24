import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';

import { authOptions } from '@/lib/auth/authOptions';
import { refreshAccessToken } from '@/lib/auth/refreshAccessToken';

import { TIME_BEFORE_EXPIRATION } from '@/app/login/constants';

const isTokenExpired = (expiresAt: number) => Date.now() >= expiresAt - TIME_BEFORE_EXPIRATION;

export const POST = async (req: NextRequest) => {
  let token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = await getServerSession(authOptions);

  const { url, options } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isTokenExpired(token.expires_at)) {
    try {
      token = await refreshAccessToken(token);

      if (session) {
        session.access_token = token.access_token;
        session.expires = new Date(token.expires_at).toISOString();
      }
    } catch (error) {
      return NextResponse.json({ error }, { status: 401 });
    }
  }

  const headers = new Headers(options?.headers || {});
  headers.set('Authorization', `Bearer ${token.access_token}`);

  try {
    const response = await fetch(url, {
      method: options?.method || 'GET',
      headers,
      body: options?.body ? options.body : undefined,
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
