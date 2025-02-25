import { getSession } from 'next-auth/react';

export const getAccessToken = async (): Promise<string | undefined> => {
  const session = await getSession();

  if (!session) return;

  const { access_token } = session;

  return access_token;
};
