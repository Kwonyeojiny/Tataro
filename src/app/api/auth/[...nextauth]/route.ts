import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { refreshAccessToken } from '@/utils/auth';

import { BaseAuthUser, LoginResponseType, OAuthProviderType } from '@/app/login/types';
import { API } from '@/api/constants';
import { ACCESS_TOKEN_EXPIRY, TIME_BEFORE_EXPIRATION } from '@/app/login/constants';

declare module 'next-auth' {
  interface Session extends BaseAuthUser {
    expires: string;
  }

  interface User extends BaseAuthUser {
    id: string;
    expires_at: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends BaseAuthUser {
    expires_at: number;
  }
}

const authOptions: NextAuthOptions = {
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

        const expires_at = Date.now() + ACCESS_TOKEN_EXPIRY;

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
    async jwt({ token, user, trigger, session }): Promise<JWT> {
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

      if (trigger === 'update' && session) {
        const { user } = session;
        token.user = user;
      }

      if (token?.expires_at - TIME_BEFORE_EXPIRATION < Date.now()) {
        const updatedToken = await refreshAccessToken(token);
        if (updatedToken) return updatedToken;
        else return {} as JWT;
      }

      return token;
    },

    async session({ session, token }): Promise<Session> {
      if (token) {
        session.user = token.user;
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.oauth_provider = token.oauth_provider;
        session.expires = new Date(token.expires_at).toISOString();
      }

      if (!token || Object.keys(token).length === 0) {
        return {} as Session;
      }

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
