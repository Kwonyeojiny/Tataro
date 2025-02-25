import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteAccount,
  fetchLoginRedirectUrl,
  getHeartCount,
  getHeartUsageHistory,
  updateUserProfile,
} from '@/api/userApi';
import {
  GetHeartResponseType,
  HeartUsageHistoryType,
  OAuthProviderAndCodeType,
  OAuthProviderType,
  UserType,
} from '@/types/user';

import { layerPopup } from '@common/layerPopup';

import { UserSessionType } from '@root/next-auth';

import { ProfileFormType } from '@/components/myPage/profile/types';
import { ERROR_MESSAGES, INFO_MESSAGES } from './constants';

const useUserQueries = ({
  OAuthProvider,
  page,
}: {
  OAuthProvider?: OAuthProviderType;
  page?: number;
}) => {
  const queryClient = useQueryClient();
  const { data: session, update } = useSession();
  const router = useRouter();

  const handleError = useCallback(
    (error: unknown, errorMessage: string, redirectToLogin = true) => {
      console.error(error);

      layerPopup({
        type: 'alert',
        content: errorMessage,
        onConfirmClick: () => {
          if (redirectToLogin) router.push('/login');
        },
      });
    },
    [router],
  );

  const {
    data: loginRedirectUrl,
    isLoading: isLoginRedirectLoading,
    error: loginRedirectError,
  } = useQuery<string | undefined>({
    queryKey: ['login', OAuthProvider],
    queryFn: async () => {
      if (!OAuthProvider) return;

      const { auth_url } = await fetchLoginRedirectUrl(OAuthProvider);
      return auth_url;
    },
    enabled: !!OAuthProvider,
  });

  const login = useCallback(
    async ({ OAuthProvider, code }: OAuthProviderAndCodeType) => {
      try {
        await signIn('credentials', { OAuthProvider, code });
      } catch (error) {
        handleError(error, ERROR_MESSAGES.LOGIN_FAILED);
      }
    },
    [handleError],
  );

  const { mutate: handleUpdateProfile, isPending: isEditProfilePending } = useMutation<
    UserSessionType,
    Error,
    ProfileFormType
  >({
    mutationKey: ['user'],
    mutationFn: async (userProfileData: ProfileFormType) => {
      if (!session || !session.user) throw new Error('Failed to get user id');

      const { nickname, birthday, gender }: UserType = await updateUserProfile(userProfileData);

      const updatedUserWithUserId: UserSessionType = {
        nickname,
        birthday,
        gender,
        user_id: session.user.user_id,
      };

      return updatedUserWithUserId;
    },
    onSuccess: async (updatedUser: UserSessionType) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });

      if (session) await update({ ...session, user: { ...session?.user, ...updatedUser } });

      layerPopup({ content: INFO_MESSAGES.EDIT_PROFILE_SUCCEEDED });
    },
    onError: error => {
      handleError(error, ERROR_MESSAGES.EDIT_PROFILE_FAILED, false);
    },
  });

  const { mutate: handleDeleteAccount, isPending: isDeleteAccountPending } = useMutation<
    string,
    Error
  >({
    mutationKey: ['user'],
    mutationFn: async () => {
      if (!session?.refresh_token) throw new Error('Failed to fetch refresh token');

      const status = await deleteAccount(session?.refresh_token);

      return status;
    },
    onSuccess: status => {
      if (status === 'success') {
        signOut({ redirect: false });

        queryClient.invalidateQueries({ queryKey: ['user'] });

        layerPopup({
          content: INFO_MESSAGES.DELETE_USER_SUCCEEDED,
          onConfirmClick: () => router.push('/'),
        });
      }
    },
    onError: error => {
      handleError(error, ERROR_MESSAGES.DELETE_USER_FAILED, false);
    },
  });

  const {
    data: heartCount,
    isLoading: isHeartCountLoading,
    isError: isHeartCountError,
  } = useQuery<number>({
    queryKey: ['heart'],
    queryFn: async () => {
      const { heart_count } = await getHeartCount();
      return heart_count;
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: heartUsageHistory,
    isLoading: isHeartUsageHistoryLoading,
    isError: isHeartUsageHistoryError,
  } = useQuery<HeartUsageHistoryType>({
    queryKey: ['heart', page],
    queryFn: async () => {
      if (!page) throw new Error('Page parameter required');

      const heartUsageHistory = await getHeartUsageHistory(page);
      return heartUsageHistory;
    },
    refetchOnWindowFocus: false,
    enabled: !!page,
  });

  const { mutate: spendHeart, isPending: isSpendHeartPending } = useMutation<
    GetHeartResponseType,
    Error
  >({
    mutationKey: ['heart'],
    mutationFn: async () => {
      const heartCount = await getHeartCount();
      return heartCount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'heart' });
    },
    onError: error => {
      handleError(error, ERROR_MESSAGES.DELETE_USER_FAILED, false);
    },
  });

  return {
    handleError,
    loginRedirectUrl,
    isLoginRedirectLoading,
    loginRedirectError,
    login,
    handleUpdateProfile,
    isEditProfilePending,
    handleDeleteAccount,
    isDeleteAccountPending,
    heartCount,
    isHeartCountLoading,
    isHeartCountError,
    heartUsageHistory,
    isHeartUsageHistoryLoading,
    isHeartUsageHistoryError,
    spendHeart,
    isSpendHeartPending,
  };
};

export default useUserQueries;
