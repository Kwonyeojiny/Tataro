export const getAccessToken = async (): Promise<string | undefined> => {
  const response = await fetch('/api/auth/token');

  if (!response.ok) {
    console.error('Failed to fetch access token');
    return undefined;
  }

  const data = await response.json();

  return data.access_token;
};
