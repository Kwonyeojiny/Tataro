import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const GET = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  return NextResponse.json({ access_token: token?.access_token ?? null });
};
