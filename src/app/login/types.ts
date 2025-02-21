export type UserDataType = {
  id?: string;
  email?: string;
  nickname: string;
  birthday: string | null;
  gender: 'male' | 'female' | null;
  social_type?: 'KAKAO' | 'NAVER';
};

export type LoginResponseType = {
  access_token: string;
  kakao_refresh_token: string;
  naver_refresh_token: string;
  created: boolean;
  message: string;
  user_id: number;
  user_data: UserDataType;
};

export type OAuthProviderType = 'kakao' | 'naver';
