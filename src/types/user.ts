import { z } from 'zod';

import {
  getHeartResponseSchema,
  heartUsageHistorySchema,
  loginResponseSchema,
  usedHeartDetailsSchema,
  userDataSchema,
  userSessionSchema,
} from './userSchema';

export type OAuthProviderType = 'kakao' | 'naver';

export type LoginRedirectUrlType = { auth_url: string };

export type OAuthProviderAndCodeType = { OAuthProvider: OAuthProviderType; code: string };

export type UserType = z.infer<typeof userDataSchema>;

export type LoginResponseType = z.infer<typeof loginResponseSchema>;

export type UserSessionType = z.infer<typeof userSessionSchema>;

export type GetHeartResponseType = z.infer<typeof getHeartResponseSchema>;

export type UsedHeartsDetailsType = z.infer<typeof usedHeartDetailsSchema>;

export type HeartUsageHistoryType = z.infer<typeof heartUsageHistorySchema>;
