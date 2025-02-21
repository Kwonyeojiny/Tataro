'use client';

import { useSession } from 'next-auth/react';

export const useFetchWithAuth = () => {
  const { data: session } = useSession();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);

    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  };

  return fetchWithAuth;
};
