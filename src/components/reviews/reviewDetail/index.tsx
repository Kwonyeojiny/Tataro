import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FocusTrap } from 'focus-trap-react';
import { X } from 'lucide-react';

import { getReviewDetail } from '@/api/reviewApi';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useReviewMutations } from '@/hooks/useReviewMutations';
import useScreenWidth from '@/hooks/useScreenWidth';
import { useReviewStore } from '@/stores/reviewStore';

import Button from '@common/button';
import { layerPopup } from '@common/layerPopup';

import { Review, ReviewDetailProps } from '../types';

const ReviewDetail = ({ review_id, cardImages, close }: ReviewDetailProps) => {
  const [review, setReview] = useState<Review | null>(null);
  const { isCustomWidth } = useScreenWidth(640);
  const { deleteReviewMutation } = useReviewMutations();
  const router = useRouter();
  const ref = useOutsideClick(close);
  const { data: session } = useSession();
  const user = session?.user;

  const handleEditButtonClick = () => {
    useReviewStore.setState({ currentReview: review });
    router.push(`/reviews/edit/${review_id}/${review?.user_id}`);
  };

  const handleDeleteButtonClick = () => {
    layerPopup({
      type: 'confirm',
      content: '리뷰를 삭제하시겠습니까?',
      onConfirmClick: () => {
        deleteReviewMutation.mutate(review_id);
        close();
      },
    });
  };

  useEffect(() => {
    const handleClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', handleClose);
    return () => document.removeEventListener('keydown', handleClose);
  }, [close]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReviewDetail(review_id);
        setReview(data);
      } catch (error) {
        console.error('Failed to fetch review detail', error);
      }
    };
    fetchData();
  }, [review_id]);

  if (!review) return null;

  return (
    <FocusTrap active={true} focusTrapOptions={{ initialFocus: false }}>
      <article
        ref={ref}
        className={`flex flex-col relative w-full h-full p-8 font-gMedium ${isCustomWidth ? 'gap-4 text-sm' : 'gap-6 text-base'}`}
      >
        <button
          onClick={() => close()}
          aria-label="닫기"
          className="absolute top-2 right-2 text-purple cursor-pointer hover:bg-purple/10 transition-colors"
        >
          <X strokeWidth={1.5} size={28} />
        </button>
        <header
          className={`flex ${isCustomWidth ? 'flex-col gap-2 p-3' : 'flex-row p-8'} 
            items-center justify-between border-b border-purple`}
        >
          <h3 className={`${isCustomWidth ? 'text-xl' : 'text-3xl'}`}>{review.title}</h3>
          <p className="font-gMedium">조회수: {review.view_count}회</p>
        </header>

        <div className={`flex items-center justify-between ${isCustomWidth ? 'px-4' : 'px-8'}`}>
          <p>{review.user_nickname}</p>
          <time
            dateTime={
              review.updated_at || review.created_at
                ? new Date(review.updated_at || review.created_at).toISOString()
                : undefined
            }
          >
            {review.updated_at
              ? new Date(review.updated_at).toLocaleDateString()
              : new Date(review.created_at).toLocaleDateString()}
          </time>
        </div>

        <section className="flex flex-1 flex-col gap-4 max-h-[459px] overflow-y-auto scrollbar-hide">
          <div
            className={`flex justify-center gap-4 w-full overflow-x-auto scrollbar-hide ${isCustomWidth ? 'h-[160px]' : ' h-[180px]'}`}
          >
            {cardImages.slice(0, 3).map((card, index) => (
              <Image
                key={index}
                src={card.url}
                alt={card.name}
                width={120}
                height={180}
                style={{
                  width: 'auto',
                  height: '100%',
                  transform: card.direction === '역방향' ? 'rotate(180deg)' : 'none',
                }}
              />
            ))}
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: `
              <div>
                ${review.content}
                ${review.img_url ? `<Image src="${review.img_url}" alt="리뷰 이미지" />` : ''}
              </div>
            `,
            }}
            className={`flex-1 ${isCustomWidth ? 'max-h-60' : 'max-h-64'} py-8`}
          />
        </section>
        {user && user.user_id === review.user_id ? (
          <footer className="flex justify-end items-center gap-4">
            <Button variant="editAndDeleteButton" aria-label="수정" onClick={handleEditButtonClick}>
              수정
            </Button>
            <Button
              variant="editAndDeleteButton"
              aria-label="삭제"
              onClick={handleDeleteButtonClick}
            >
              삭제
            </Button>
          </footer>
        ) : (
          ''
        )}
      </article>
    </FocusTrap>
  );
};

export default ReviewDetail;
