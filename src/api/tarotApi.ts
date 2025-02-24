import { getAccessToken } from '@/utils/auth';

import { API } from '@/api/constants';

export const initTarot = async (content: string) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.TAROT.INIT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to initialize tarot');
  }

  return response.json();
};

export const reinitTarot = async (roomId: string, content: string) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.TAROT.REINIT(roomId)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to reinitialize tarot');
  }

  return response.json();
};

export const consultTarot = async (roomId: string) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.TAROT.CONSULT(roomId)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to consult tarot');
  }

  return response.json();
};

export const paginatedTarotChatHistory = async (page: number, perPage: number) => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${API.BASE_URL}${API.ENDPOINTS.TAROT.ALL_TAROT}?page=${page}&size=${perPage}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch chat history list');
  }

  return response.json();
};

export const getTarotChatHistory = async (roomId: string) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.TAROT.TAROT_LOGS(roomId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch chat history');
  }
  return response.json();
};

export const getFirstTarotChatHistory = async () => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.TAROT.RECENT_TAROT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch first chat history');
  }
  return response.json();
};

export const getPreviousTarotChatHistory = async (roomId: string) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.TAROT.PREVIOUS_TAROT(roomId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch previous chat history');
  }
};
