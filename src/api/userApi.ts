import {
  GetHeartResponseType,
  HeartUsageHistoryType,
  LoginRedirectUrlType,
  OAuthProviderType,
  UserType,
} from '@/types/user';

import { ProfileFormType } from '@/components/myPage/profile/types';
import { API } from './constants';
import { PER_PAGE } from '@/components/myPage/payment/constants';

export const fetchLoginRedirectUrl = async (
  OAuthProvider: OAuthProviderType,
): Promise<LoginRedirectUrlType> => {
  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.USER.REDIRECT(OAuthProvider)}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) throw new Error('Failed to fetch the redirect URL');

  const data: LoginRedirectUrlType = await response.json();

  return data;
};

export const updateUserProfile = async (userProfileData: ProfileFormType): Promise<UserType> => {
  const url = `${API.BASE_URL}${API.ENDPOINTS.USER.BASE}`;

  const response = await fetch('/api/auth/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      options: {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfileData),
      },
    }),
  });

  if (!response.ok) throw new Error('Failed to edit profile');

  const data: UserType = await response.json();

  return data;
};

export const deleteAccount = async (refresh_token: string): Promise<string> => {
  const url = `${API.BASE_URL}${API.ENDPOINTS.USER.BASE}`;

  const response = await fetch('/api/auth/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      options: {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token }),
      },
    }),
  });

  if (!response.ok) throw new Error('Failed to delete the user');

  const { status }: { status: string } = await response.json();

  return status;
};

export const getHeartCount = async (): Promise<GetHeartResponseType> => {
  const url = `${API.BASE_URL}${API.ENDPOINTS.USER.BASE}`;

  const response = await fetch('/api/auth/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      options: { headers: { Accept: 'application/json' } },
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch heart count');

  const data: GetHeartResponseType = await response.json();

  return data;
};

export const getHeartUsageHistory = async (page: number): Promise<HeartUsageHistoryType> => {
  const url = `${API.BASE_URL}${API.ENDPOINTS.USER.HEART}?page=${page}&size=${PER_PAGE}`;

  const response = await fetch('/api/auth/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      options: { headers: { Accept: 'application/json' } },
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch heart count');

  const data: HeartUsageHistoryType = await response.json();

  return data;
};

export const spendHeart = async (): Promise<GetHeartResponseType> => {
  const url = `${API.BASE_URL}${API.ENDPOINTS.USER.HEART}`;

  const response = await fetch('/api/auth/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      options: {
        method: 'PUT',
        headers: { Accept: 'application/json' },
      },
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch heart count');

  const data: GetHeartResponseType = await response.json();

  return data;
};
