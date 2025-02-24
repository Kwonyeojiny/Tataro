import { JWT } from 'next-auth/jwt';

import { API } from '@/api/constants';
import { ACCESS_TOKEN_EXPIRY } from '@/app/login/constants';

export const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  const { refresh_token, oauth_provider } = token;

  if (!refresh_token || !oauth_provider) throw new Error('No refresh token or oauth provider data');

  try {
    const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.USER.REISSUE(oauth_provider)}`, {
      method: 'POST',
      headers: { accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token }),
    });

    if (!response.ok) throw new Error('Failed to reissue access token');

    const { access_token } = await response.json();

    const expires_at = Date.now() + ACCESS_TOKEN_EXPIRY;

    return {
      ...token,
      access_token,
      expires_at,
    };
  } catch (error) {
    console.error(error);

    return {
      ...token,
      access_token: '',
      refresh_token: '',
      expires_at: 0,
      user: null,
      error: 'Login session expired',
    };
  }
};
