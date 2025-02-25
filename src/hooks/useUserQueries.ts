import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deleteAccount, fetchLoginRedirectUrl, updateUserProfile } from '@/api/userApi';

import { layerPopup } from '@common/layerPopup';

import { OAuthProviderType, UserDataType } from '@root/next-auth';

import { ProfileFormType } from '@/components/myPage/profile/types';
import { ERROR_MESSAGES, INFO_MESSAGES } from './constants';

const useUserQueries = (OAuthProvider?: OAuthProviderType) => {
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

      const url = await fetchLoginRedirectUrl(OAuthProvider);
      return url;
    },
    enabled: !!OAuthProvider,
  });

  const login = useCallback(
    async ({ OAuthProvider, code }: { OAuthProvider: OAuthProviderType; code: string }) => {
      try {
        await signIn('credentials', { OAuthProvider, code });
      } catch (error) {
        handleError(error, ERROR_MESSAGES.LOGIN_FAILED);
      }
    },
    [handleError],
  );

  const { mutate: handleUpdateProfile, isPending: isEditProfilePending } = useMutation<
    UserDataType,
    Error,
    ProfileFormType
  >({
    mutationKey: ['user'],
    mutationFn: async (userProfileData: ProfileFormType) => {
      await updateUserProfile(userProfileData);

      if (!session || !session.user) throw new Error('Failed to get user id');

      return { ...userProfileData, user_id: session.user.user_id };
    },
    onSuccess: async (userProfileData: UserDataType) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });

      if (session) await update({ ...session, user: { ...session?.user, ...userProfileData } });

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
  };
};

export default useUserQueries;
