import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Eye } from 'lucide-react';

import { getTarotChatHistory } from '@/api/tarotApi';
import useScreenWidth from '@/hooks/useScreenWidth';
import useLayerCardStore from '@/stores/layerCardStore';
import { TarotCard } from '@/types/tarot';

import { layerCard } from '@common/layerCard';

import ReviewDetail from '../reviewDetail';

import { ReviewCardProps } from '../types';

type CardImage = {
  url: string;
  name: string;
  direction: string;
};
const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  room_id,
  title,
  content,
  user_nickname,
  created_at,
  updated_at,
  view_count,
}) => {
  const { hideLayerCard } = useLayerCardStore();
  const { isCustomWidth } = useScreenWidth(640);
  const [cardImages, setCardImages] = useState<CardImage[]>([]);

  useEffect(() => {
    const fetchChatImages = async () => {
      if (!room_id) {
        return;
      }
      try {
        const data = await getTarotChatHistory(room_id.toString());
        const cardImagesData = data.chat_log.map((log: TarotCard) => ({
          url: log.card_url,
          name: log.card_name,
          direction: log.card_direction,
        }));
        setCardImages(cardImagesData);
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      }
    };
    fetchChatImages();
  }, [room_id]);

  const showLayerCard = () => {
    layerCard({
      content: (
        <ReviewDetail review_id={id} cardImages={cardImages} close={() => hideLayerCard()} />
      ),
      size: 'max-w-5xl max-h-[768px]',
    });
  };

  return (
    <li className="w-full">
      <button
        onClick={showLayerCard}
        className={`flex items-center w-full max-h-32 border border-purple bg-lightPink hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 hover:cursor-pointer ${isCustomWidth ? 'gap-4 px-4 py-3' : 'gap-5 px-6 py-4 '}`}
        aria-label={`${title} 리뷰 상세보기`}
      >
        <div
          className={`relative flex items-center w-[82px] h-[94px] ${isCustomWidth ? 'hidden' : 'block'}`}
        >
          {cardImages.slice(0, 3).map((image, index) => (
            <Image
              key={index}
              src={image.url}
              alt={image.name}
              width={50}
              height={87}
              className={`absolute
                        ${index === 0 ? 'left-0' : index === 1 ? 'left-4' : 'left-8'}`}
              style={{
                zIndex: index,
                width: 'auto',
                height: '90%',
                transform: image.direction === '역방향' ? 'rotate(180deg)' : 'none',
              }}
            />
          ))}
        </div>
        <div className="flex flex-col flex-1 justify-center h-full text-purple">
          <div
            className={`flex items-center w-full ${isCustomWidth ? 'justify-between' : 'gap-5'}`}
          >
            <h2 className={`font-gBold truncate ${isCustomWidth ? 'text-sm' : 'text-base'}`}>
              {title}
            </h2>
            <p className="text-xs line-clamp-1">{user_nickname}</p>
          </div>
          <p
            className={`w-full min-h-10 text-left line-clamp-2 break-all ${isCustomWidth ? 'text-xs' : 'text-sm'}`}
          >
            {content}
          </p>
          <div className="flex justify-between items-center w-full text-xs">
            <time
              dateTime={
                updated_at || created_at
                  ? new Date(updated_at || created_at).toISOString()
                  : undefined
              }
            >
              {updated_at
                ? new Date(updated_at).toLocaleDateString()
                : new Date(created_at).toLocaleDateString()}
            </time>
            <p className="flex items-center gap-1">
              <Eye className="w-4" />
              {view_count}
            </p>
          </div>
        </div>
      </button>
    </li>
  );
};

export default ReviewCard;
