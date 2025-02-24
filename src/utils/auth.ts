import { getSession } from 'next-auth/react';

export const getAccessToken = async (): Promise<string | undefined> => {
  const session = await getSession();
  if (!session) return;

  const response = await fetch('/api/auth/token/');

  if (!response.ok) throw new Error('Failed to fetch access token');

  const { access_token } = await response.json();

  return access_token;
};
