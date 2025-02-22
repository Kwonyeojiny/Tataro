import { useEffect, useMemo } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';

import useUserActions from '@/hooks/useUserActions';

import Button from '@common/button';
import { layerPopup } from '@common/layerPopup';

import ProfileFormPresentation from './ProfileFormPresentation';
import { profileFormSchema, signUpFormSchema } from './schemas';

import { FormType } from './types';
import { DEFAULT_VALUES_SIGNUP_FORM } from './constants';

const ProfileFormContainer = () => {
  const pathname = usePathname();
  const isEditMode = pathname === '/mypage';

  const { data: session } = useSession();
  const user = session?.user;

  const { editProfile, deleteAccount } = useUserActions();

  const formSchema = isEditMode ? profileFormSchema : signUpFormSchema;
  const defaultValues = useMemo(() => {
    if (user) {
      const { nickname, birthday, gender } = user;
      return { nickname, birthday: birthday?.split('T')[0], gender };
    }

    return DEFAULT_VALUES_SIGNUP_FORM;
  }, [user]);

  const methods = useForm<FormType<typeof isEditMode>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<FormType<typeof isEditMode>> = data => {
    editProfile({ ...data, birthday: new Date(data.birthday || '').toISOString() });
  };

  const handleDeleteUser = () => {
    layerPopup({
      type: 'confirm',
      content: '회원 탈퇴 시 회원 정보가 모두 삭제됩니다.\n정말로 탈퇴하시겠습니까?',
      onConfirmClick: () => deleteAccount(),
    });
  };

  useEffect(() => {
    reset(defaultValues);
  }, [user, reset, defaultValues]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center gap-4 grow w-full pb-2 overflow-y-auto"
      >
        <div className="flex flex-col justify-center items-center grow w-full">
          <ProfileFormPresentation isEditMode={isEditMode} />
        </div>

        <div className="flex justify-center items-center relative w-full">
          <Button type="submit" className="text-lg">
            {isEditMode ? '저장' : '가입하기'}
          </Button>

          {isEditMode && (
            <Button
              type="button"
              variant="simple"
              onClick={handleDeleteUser}
              className="absolute right-0 px-2 bg-softPink font-gMedium !text-purple !hover:text-purple stroke-none hover:brightness-105"
            >
              회원 탈퇴
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default ProfileFormContainer;
