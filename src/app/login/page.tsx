'use client';

import SocialLoginButton from '@/components/socialLoginButton';
import useUserQueries from '@/hooks/useUserQueries';

import ContentBox from '@common/contentBox';
import LoadingSpinner from '@common/loadingSpinner';

import { OAUTH_PROVIDERS } from './constants';
import { ERROR_MESSAGES } from '@/hooks/constants';

const Login = () => {
  const { handleError, isLoginRedirectLoading, loginRedirectError } = useUserQueries({});

  if (isLoginRedirectLoading) return <LoadingSpinner />;

  if (loginRedirectError) {
    handleError(loginRedirectError, ERROR_MESSAGES.GENERAL_ERROR);
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
      <ContentBox size="max-w-[420px] h-[576px]" layout="gap-10 px-6 pt-10 pb-20">
        <div className="w-full h-48 bg-logo bg-center bg-contain bg-no-repeat" aria-label="로고" />
        <p className="grow content-center font-lilita text-cream text-3xl stroke">Login</p>
        <div className="flex flex-col items-center gap-5 w-full">
          {OAUTH_PROVIDERS.map(OAuthProvider => (
            <SocialLoginButton key={OAuthProvider} OAuthProvider={OAuthProvider} />
          ))}
        </div>
      </ContentBox>
    </div>
  );
};

export default Login;
