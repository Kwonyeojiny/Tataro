import { getAccessToken } from '@/utils/auth';

import { API } from './constants';

export const getNoticeList = async (content: string, page: number = 1, size: number = 4) => {
  const accessToken = await getAccessToken();
  const url = new URL(`${API.BASE_URL}${API.ENDPOINTS.NOTICE.ALL_NOTICE}`);
  url.searchParams.append('content', content);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('size', size.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) throw new Error('공지 목록 조회 실패');
  return response.json();
};

export const getNoticeDetail = async (noticeId: string) => {
  const accessToken = await getAccessToken();
  const url = new URL(`${API.BASE_URL}${API.ENDPOINTS.NOTICE.NOTICE_DETAIL(noticeId)}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) throw new Error('공지사항 조회 실패');
  return response.json();
};

export const postNotificationRead = async (notificationId: string) => {
  const accessToken = await getAccessToken();
  const url = new URL(`${API.BASE_URL}${API.ENDPOINTS.NOTICE.NOTICE_READ}`);
  console.log(notificationId);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ notification_id: notificationId }),
  });

  if (!response.ok) throw new Error('mark as read 실패');
  return response.json();
};
