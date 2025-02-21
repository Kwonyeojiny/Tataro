import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { LoginResponseType, OAuthProviderType } from '@/app/login/types';
import { API } from '@/api/constants';

type UserDataType = {
  id?: string;
  email?: string;
  nickname: string;
  birthday: string | null;
  gender: 'male' | 'female' | null;
  social_type?: 'KAKAO' | 'NAVER';
};

declare module 'next-auth' {
  interface Session {
    user: UserDataType | null;
    access_token: string;
    refresh_token: string;
    oauth_provider: OAuthProviderType | null;
    expires: string;
  }

  interface User {
    id: string;
    user: UserDataType | null;
    access_token: string;
    refresh_token: string;
    expires_at: number;
    oauth_provider: OAuthProviderType | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: UserDataType | null;
    access_token: string;
    refresh_token: string;
    expires_at: number;
    oauth_provider: OAuthProviderType | null;
  }
}

export const ACCESS_TOKEN_EXPIRY = 3600;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'OAuth Login',
      credentials: {
        OAuthProvider: { label: 'OAuthProvider', type: 'text' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        const { OAuthProvider, code } = credentials as {
          OAuthProvider: OAuthProviderType;
          code: string;
        };

        const response = await fetch(
          `${API.BASE_URL}${API.ENDPOINTS.USER.LOGIN(OAuthProvider, code)}`,
          { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } },
        );

        if (!response.ok) throw new Error('Failed to login');

        const {
          user_id: id,
          user_data: user,
          access_token,
          kakao_refresh_token,
          naver_refresh_token,
        }: LoginResponseType = await response.json();

        const expires_at = Date.now() + ACCESS_TOKEN_EXPIRY * 1000;

        return {
          id: id + '',
          user,
          access_token,
          refresh_token: kakao_refresh_token || naver_refresh_token,
          expires_at,
          oauth_provider: OAuthProvider,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        return {
          ...token,
          id: user.id,
          user: user.user,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          expires_at: user.expires_at,
          oauth_provider: user.oauth_provider,
        };
      }

      return token;
    },

    async session({ session, token }): Promise<Session> {
      const expires = new Date(token.expires_at).toISOString();

      session.user = token.user;
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      session.oauth_provider = token.oauth_provider;
      session.expires = expires;
      return session;
    },

    async redirect() {
      return '/';
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
