import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { createReview, deleteReview, updateReview } from '@/api/reviewApi';

import { layerPopup } from '@common/layerPopup';

import { REVIEW_MESSAGES } from './constants';

export const useReviewMutations = () => {
  const router = useRouter();

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      layerPopup({
        type: 'alert',
        content: REVIEW_MESSAGES.CREATE.SUCCESS,
        onConfirmClick: () => {
          router.push('/mypage');
        },
      });
    },
    onError: () => {
      layerPopup({
        type: 'alert',
        content: REVIEW_MESSAGES.CREATE.ERROR,
      });
    },
  });
  const updateReviewMutation = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      layerPopup({
        type: 'alert',
        content: REVIEW_MESSAGES.UPDATE.SUCCESS,
        onConfirmClick: () => {
          router.push('/mypage');
        },
      });
    },
    onError: () => {
      layerPopup({
        type: 'alert',
        content: REVIEW_MESSAGES.UPDATE.ERROR,
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      layerPopup({
        type: 'alert',
        content: REVIEW_MESSAGES.DELETE.SUCCESS,
        onConfirmClick: () => {
          router.push('/mypage');
        },
      });
    },
    onError: () => {
      layerPopup({
        type: 'alert',
        content: REVIEW_MESSAGES.DELETE.ERROR,
      });
    },
  });
  return {
    createReviewMutation,
    updateReviewMutation,
    deleteReviewMutation,
  };
};
