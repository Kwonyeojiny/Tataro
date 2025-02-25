import { OAuthProviderType } from '@/types/user';
import { userSessionSchema } from '@/types/userSchema';

import 'next-auth';
import 'next-auth/jwt';

export type UserSessionType = z.infer<typeof userSessionSchema>;

declare module 'next-auth' {
  interface Session {
    user: UserSessionType | null;
    access_token: string;
    refresh_token: string;
    oauth_provider: OAuthProviderType | null;
    expires: string;
  }

  interface User {
    id: number;
    user: UserSessionType;
    access_token: string;
    refresh_token: string;
    oauth_provider: OAuthProviderType | null;
    expires_at: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: UserSessionType | null;
    access_token: string;
    refresh_token: string;
    oauth_provider: OAuthProviderType | null;
    expires_at: number;
  }
}
