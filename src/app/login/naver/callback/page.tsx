'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import useUserQueries from '@/hooks/useUserQueries';

import LoadingSpinner from '@common/loadingSpinner';

const NaverCallback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const { login } = useUserQueries();

  useEffect(() => {
    if (!code) return;

    login({ OAuthProvider: 'naver', code });
  }, [code, login]);

  return <LoadingSpinner />;
};

const NaverCallbackWithSuspense = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NaverCallback />
    </Suspense>
  );
};

export default NaverCallbackWithSuspense;
