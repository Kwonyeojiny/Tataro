import 'next-auth';
import 'next-auth/jwt';

export type UserDataType = {
  user_id: number;
  email?: string;
  nickname: string;
  birthday: string | null;
  gender: 'male' | 'female' | null;
  social_type?: 'KAKAO' | 'NAVER';
};

export type LoginResponseType = {
  access_token: string;
  refresh_token: string;
  created: boolean;
  message: string;
  user_id: number;
  user_data: UserDataType;
};

export type OAuthProviderType = 'kakao' | 'naver';

declare module 'next-auth' {
  interface Session {
    user: UserDataType | null;
    access_token: string;
    refresh_token: string;
    oauth_provider: OAuthProviderType | null;
    expires: string;
  }

  interface User {
    id: number;
    user: UserDataType;
    access_token: string;
    refresh_token: string;
    oauth_provider: OAuthProviderType | null;
    expires_at: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: UserDataType | null;
    access_token: string;
    refresh_token: string;
    oauth_provider: OAuthProviderType | null;
    expires_at: number;
  }
}
