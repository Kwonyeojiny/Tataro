import { OAuthProviderType } from '@root/next-auth';

import { ProfileFormType } from '@/components/myPage/profile/types';
import { API } from './constants';

export const fetchLoginRedirectUrl = async (OAuthProvider: OAuthProviderType) => {
  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.USER.REDIRECT(OAuthProvider)}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) throw new Error('Failed to fetch the redirect URL');

  const { auth_url: loginRedirectUrl } = await response.json();

  return loginRedirectUrl;
};

export const updateUserProfile = async (userProfileData: ProfileFormType) => {
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
};

export const deleteAccount = async (refresh_token: string) => {
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

  const { status } = await response.json();

  return status;
};
