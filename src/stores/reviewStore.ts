import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Review } from '@/components/reviews/types';

type ReviewStoreState = {
  currentReview: Review | null;
  setCurrentReview: (review: Review) => void;
  clearCurrentReview: () => void;
};

export const useReviewStore = create<ReviewStoreState>()(
  persist(
    set => ({
      currentReview: null,
      setCurrentReview: (review: Review) => set({ currentReview: review }),
      clearCurrentReview: () => set({ currentReview: null }),
    }),
    {
      name: 'review_Storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
