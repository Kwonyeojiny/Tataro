import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

import { layerPopup } from '@common/layerPopup';

import { OAuthProviderType } from '@root/next-auth';

import { useFetchWithAuth } from './useFetchWithAuth';

import { ProfileFormType } from '@/components/myPage/profile/types';
import { ERROR_MESSAGES, INFO_MESSAGES } from './constants';
import { API } from '@/api/constants';

const useUserActions = () => {
  const { data: session, update } = useSession();
  const fetchWithAuth = useFetchWithAuth();

  const router = useRouter();

  const handleError = useCallback(
    (error: unknown, errorMessage: string, redirectToLogin = true) => {
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

  const redirectToSocialLogin = async (OAuthProvider: OAuthProviderType) => {
    try {
      const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.USER.REDIRECT(OAuthProvider)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch the redirect URL');

      const data = await response.json();

      router.push(data.auth_url);
    } catch (error) {
      handleError(error, ERROR_MESSAGES.GENERAL_ERROR);
    }
  };

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

  const logout = () => signOut();

  const editProfile = async (userProfileData: ProfileFormType) => {
    try {
      const response = await fetchWithAuth(`${API.BASE_URL}${API.ENDPOINTS.USER.BASE}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfileData),
      });

      if (!response.ok) throw new Error('Failed to edit profile');

      if (session) {
        await update({
          ...session,
          user: { ...session?.user, ...userProfileData },
        });
      }

      layerPopup({ content: INFO_MESSAGES.EDIT_PROFILE_SUCCEEDED });
    } catch (error) {
      handleError(error, ERROR_MESSAGES.EDIT_PROFILE_FAILED, false);
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetchWithAuth(`${API.BASE_URL}${API.ENDPOINTS.USER.BASE}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: session?.refresh_token }),
      });

      if (!response.ok) throw new Error('Failed to delete the user');

      const { status } = await response.json();

      if (status === 'success') {
        signOut({ redirect: false });

        layerPopup({
          content: INFO_MESSAGES.DELETE_USER_SUCCEEDED,
          onConfirmClick: () => router.push('/'),
        });
      }
    } catch (error) {
      handleError(error, ERROR_MESSAGES.DELETE_USER_FAILED, false);
    }
  };

  return { redirectToSocialLogin, login, logout, editProfile, deleteAccount };
};

export default useUserActions;
