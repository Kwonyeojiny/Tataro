'use client';

import { useParams } from 'next/navigation';

import ReviewForm from '@/components/reviews/reviewForm';
import ReviewFormAuthGuard from '@/components/reviews/reviewFormAuthGuard';

import ContentBox from '@common/contentBox';

const ReviewCreate = () => {
  const params = useParams();
  const userId = Number(params.userId);

  return (
    <ReviewFormAuthGuard userId={userId}>
      <div className="flex justify-center items-center w-full h-full font-gMedium text-purple">
        <ContentBox size="max-w-3xl max-h-[800px]" layout="w-full h-full">
          <ReviewForm mode="create" />
        </ContentBox>
      </div>
    </ReviewFormAuthGuard>
  );
};

export default ReviewCreate;
