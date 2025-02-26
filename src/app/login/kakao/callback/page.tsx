'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import useUserQueries from '@/hooks/useUserQueries';

import LoadingSpinner from '@common/loadingSpinner';

const KakaoCallback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const { login } = useUserQueries();

  useEffect(() => {
    if (!code) return;

    login({ OAuthProvider: 'kakao', code });
  }, [code, login]);

  return <LoadingSpinner />;
};

const KakaoCallbackWithSuspense = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <KakaoCallback />
    </Suspense>
  );
};

export default KakaoCallbackWithSuspense;
