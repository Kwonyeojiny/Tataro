'use client';

import { useParams } from 'next/navigation';

import ReviewForm from '@/components/reviews/reviewForm';
import ReviewFormAuthGuard from '@/components/reviews/reviewFormAuthGuard';
import { useReviewStore } from '@/stores/reviewStore';

import ContentBox from '@common/contentBox';

const ReviewEdit = () => {
  const params = useParams();
  const reviewId = Number(params.reviewId);
  const userId = Number(params.userId);
  const currentReview = useReviewStore(state => state.currentReview);
  const initialData = currentReview
    ? {
        title: currentReview.title,
        content: currentReview.content,
        img_url: currentReview.img_url,
      }
    : null;

  return (
    <ReviewFormAuthGuard userId={userId}>
      <div className="flex justify-center items-center w-full h-full font-gMedium text-purple">
        <ContentBox size="max-w-3xl max-h-[800px]" layout="w-full h-full">
          <ReviewForm mode="edit" initialData={initialData} reviewId={reviewId} />
        </ContentBox>
      </div>
    </ReviewFormAuthGuard>
  );
};

export default ReviewEdit;
