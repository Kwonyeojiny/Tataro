'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { layerPopup } from '@common/layerPopup';

const ReviewFormAuthGuard = ({
  userId,
  children,
}: {
  userId: number;
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  if (!user) {
    layerPopup({
      type: 'alert',
      content: '로그인이 필요한 기능입니다.',
      onConfirmClick: () => {
        router.push('/login');
      },
    });
    return null;
  }
  if (user.user_id !== userId) {
    layerPopup({
      type: 'alert',
      content: '리뷰 작성 권한이 없습니다.',
      onConfirmClick: () => {
        router.push('/');
      },
    });
    return null;
  }
  return <>{children}</>;
};

export default ReviewFormAuthGuard;
