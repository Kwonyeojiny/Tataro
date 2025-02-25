import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import useUserQueries from '@/hooks/useUserQueries';

import kakao from '@images/kakao.svg';
import naver from '@images/naver.svg';

import SocialLoginButtonProps from './types';
import { OAUTH_PROVIDERS_KOR } from '@/app/login/constants';

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ OAuthProvider, ...props }) => {
  const { loginRedirectUrl } = useUserQueries(OAuthProvider);
  const router = useRouter();

  const handleSocialLogin = () => loginRedirectUrl && router.push(loginRedirectUrl);

  return (
    <button
      type="button"
      className={twMerge(
        'flex justify-center items-center gap-2 z-10 w-full max-w-80 h-12 px-4 rounded-xl text-lg font-medium',
        OAuthProvider === 'kakao' ? 'bg-kakao text-kakaoText' : 'bg-naver text-white',
      )}
      onClick={handleSocialLogin}
      {...props}
    >
      <Image
        src={OAuthProvider === 'kakao' ? kakao : naver}
        alt={`${OAuthProvider} 로고`}
        width={20}
      />
      <span className="grow">{OAUTH_PROVIDERS_KOR[OAuthProvider]} 로그인</span>
    </button>
  );
};

export default SocialLoginButton;
