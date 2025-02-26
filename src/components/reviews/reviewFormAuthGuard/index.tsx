'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { layerPopup } from '@common/layerPopup';
import LoadingSpinner from '@common/loadingSpinner';

type ReviewFormAuthGuardProps = {
  children: ReactNode;
  userId: number;
};
const ReviewFormAuthGuard = ({ userId, children }: ReviewFormAuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    const user = session?.user;

    if (!user) {
      layerPopup({
        type: 'alert',
        content: '로그인이 필요한 기능입니다.',
        onConfirmClick: () => {
          router.push('/login');
        },
      });
      setIsAuthorized(false);
      return;
    }

    if (user.user_id !== userId) {
      layerPopup({
        type: 'alert',
        content: '리뷰 작성 권한이 없습니다.',
        onConfirmClick: () => {
          router.push('/');
        },
      });
      setIsAuthorized(false);
      return;
    }
    setIsAuthorized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, userId]);

  if (status === 'loading' || isAuthorized === null) {
    return <LoadingSpinner />;
  }
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ReviewFormAuthGuard;
