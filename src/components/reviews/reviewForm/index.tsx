import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { useReviewMutations } from '@/hooks/useReviewMutations';
import useScreenWidth from '@/hooks/useScreenWidth';

import Button from '@common/button';
import { layerPopup } from '@common/layerPopup';

import TextEditor from '../textEditor';
import { ReviewFormData, reviewFormSchema } from './schema';

type ReviewFormProps = {
  mode?: 'create' | 'edit';
  initialData?: {
    title: string;
    content: string;
    img_url?: string;
  } | null;
  reviewId?: number;
};

const ReviewForm = ({ mode = 'create', initialData, reviewId }: ReviewFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const params = useParams();
  const roomId = Number(params.chatlogId);
  const userId = Number(params.userId);
  const { isInit, isCustomWidth } = useScreenWidth(640);
  const { createReviewMutation, updateReviewMutation, deleteReviewMutation } = useReviewMutations();
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      img_url: initialData?.img_url || '',
    },
    mode: 'onSubmit',
  });

  if (!user) {
    layerPopup({
      type: 'alert',
      content: '로그인이 필요한 기능입니다.',
      onConfirmClick: () => {
        router.push('/login');
      },
    });
    return null;
  }
  if (user && user.user_id !== userId) {
    layerPopup({
      type: 'alert',
      content: '리뷰 작성 권한이 없습니다.',
      onConfirmClick: () => {
        router.push('/');
      },
    });
    return null;
  }

  const onSubmit = (data: ReviewFormData) => {
    layerPopup({
      type: 'confirm',
      content: mode === 'create' ? '리뷰를 등록하시겠습니까?' : '리뷰를 수정하시겠습니까?',
      onConfirmClick: () => {
        const formData = new FormData();
        formData.append('title', data.title);

        console.log('컨텐트 내용:', data.content);
        const contentWithoutImage = data.content.replace(/<img.*?>/g, '');
        formData.append('content', contentWithoutImage);

        if (imageFile) {
          formData.append('image', imageFile);
        }
        if (mode === 'edit' && !imageFile && initialData?.img_url) {
          formData.append('img_url', initialData?.img_url);
        }

        if (mode === 'create') {
          formData.append('taro_chat_room', roomId.toString());
          createReviewMutation.mutate(formData);
        } else if (mode === 'edit' && reviewId) {
          formData.append('reviewId', reviewId.toString());
          updateReviewMutation.mutate(formData);
        }
      },
    });
  };

  const onError = () => {
    if (errors.title && errors.title.message) {
      layerPopup({
        type: 'alert',
        content: errors.title.message,
      });
    } else if (errors.content && errors.content.message) {
      layerPopup({
        type: 'alert',
        content: errors.content.message,
      });
    }
  };

  const handleEditorChange = (html: string) => {
    setValue('content', html);
  };

  const handleDeletebuttonClick = () => {
    if (!reviewId) return;

    layerPopup({
      type: 'confirm',
      content: '리뷰를 삭제하시겠습니까?',
      onConfirmClick: () => deleteReviewMutation.mutate(reviewId),
    });
  };

  if (!isInit) return null;

  return (
    <div
      className={`flex flex-col items-center w-full h-full ${isCustomWidth ? 'gap-4 p-5' : 'gap-8 p-10'}`}
    >
      <h1 className={`font-lilita text-cream stroke ${isCustomWidth ? 'text-3xl' : 'text-4xl'}`}>
        Review
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className={`flex flex-1 flex-col items-center w-full min-h-0  ${isCustomWidth ? 'gap-4' : 'gap-8'}`}
      >
        <div className={`flex items-center w-full ${isCustomWidth ? 'flex-col gap-1' : 'gap-6'}`}>
          <p className={`font-gBold ${isCustomWidth ? 'w-full text-base' : 'text-lg'}`}>제목</p>
          <input
            {...register('title')}
            className={`flex px-3 border border-purple bg-cream ${isCustomWidth ? 'w-full h-8 text-sm' : 'flex-1 h-10'}`}
          />
        </div>
        <div className="flex-1 min-h-0 w-full">
          <TextEditor
            value={watch('content')}
            onChange={handleEditorChange}
            onImageUpload={setImageFile}
            initialImageUrl={initialData?.img_url}
          />
        </div>
        {mode === 'create' && <Button type="submit">등록</Button>}
        {mode === 'edit' && (
          <div className="flex gap-4">
            <Button type="submit">수정</Button>
            <Button type="button" onClick={handleDeletebuttonClick}>
              삭제
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReviewForm;
