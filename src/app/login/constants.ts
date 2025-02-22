import { OAuthProviderType } from '@root/next-auth';

export const OAUTH_PROVIDERS: OAuthProviderType[] = ['kakao', 'naver'];

export const OAUTH_PROVIDERS_KOR = { kakao: '카카오', naver: '네이버' };

export const ACCESS_TOKEN_EXPIRY = 1000 * 60 * 60;

export const TIME_BEFORE_EXPIRATION = 1000 * 60 * 5;
