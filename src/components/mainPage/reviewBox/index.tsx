'use client';

import Image from 'next/image';
import { Eye } from 'lucide-react';

import { ReviewCardProps } from '@/components/reviews/types';

const ReviewBox: React.FC<ReviewCardProps> = ({
  img_url,
  title,
  content,
  user_nickname,
  created_at,
  updated_at,
  view_count,
}) => {
  return (
    <div>
      <div
        className="flex flex-col items-center gap-12 max-w-[500px] h-[650px] px-6 py-4 border border-purple bg-lightPink hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 "
        aria-label={`${title} 리뷰 상세보기`}
      >
        <Image src={img_url} alt="타로카드" width={160} height={300} className="mt-7" />
        <div className="flex flex-1 flex-col justify-center gap-10 h-full text-purple">
          <div className="flex justify-between">
            <h2 className="text-base font-gBold">{title}</h2>
            <p className="text-xs">{user_nickname}</p>
          </div>

          <p className="text-sm text-left line-clamp-2">{content}</p>
          <div className="flex justify-between items-center text-xs">
            <p>{updated_at ? updated_at : created_at}</p>
            <p className="flex items-center gap-1">
              <Eye className="w-4" />
              {view_count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBox;
