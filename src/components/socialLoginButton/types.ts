import { OAuthProviderType } from '@/types/user';

type SocialLoginButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  OAuthProvider: OAuthProviderType;
  className?: string;
};

export default SocialLoginButtonProps;
