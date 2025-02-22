import { OAuthProviderType } from '@root/next-auth';

type SocialLoginButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  OAuthProvider: OAuthProviderType;
  className?: string;
};

export default SocialLoginButtonProps;
