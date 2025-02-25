import { getAccessToken } from '@/utils/auth';

import { API } from './constants';

export const paginatedReviewList = async (sortType: string, page: number, perPage: number) => {
  const accessToken = await getAccessToken();

  let sortParams;
  if (sortType === 'new') {
    sortParams = '&sort_by=date';
  }

  const response = await fetch(
    `${API.BASE_URL}${API.ENDPOINTS.REVIEW.ALL_REVIEW}?page=${page}&size=${perPage}${sortType === 'best' ? '' : sortParams}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  return response.json();
};

export const createReview = async (formData: FormData) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REVIEW.CREATE_REVIEW}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create review');
  }
  return response.json();
};

export const getReviewDetail = async (reviewId: number) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REVIEW.REVIEW_DETAIL(reviewId)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to detail review');
  }
  return response.json();
};

export const updateReview = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  const reviewId = Number(formData.get('reviewId'));

  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REVIEW.UPDATE_REVIEW(reviewId)}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to update review');
  }
  return response.json();
};

export const deleteReview = async (reviewId: number) => {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REVIEW.DELETE_REVIEW(reviewId)}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete review');
  }
};
