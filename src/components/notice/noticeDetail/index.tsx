'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getNoticeDetail } from '@/api/noticeApi';

import Button from '@common/button';

import { Notice } from '../noticeList/types';

type Props = {
  noticeId: string;
};

const NoticeDetail = ({ noticeId }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getNoticeDetail(noticeId);
        setNotice(data);
      } catch (error) {
        console.error('공지사항 조회 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [noticeId]);

  if (isLoading) {
    return <div className="py-8 text-center">로딩 중...</div>;
  }

  if (!notice) {
    return <div className="py-8 text-center">공지사항을 찾을 수 없습니다</div>;
  }
  return (
    <div className="flex flex-col items-center h-full w-full max-h-[567px] gap-3 ">
      <div className="flex justify-start items-center gap-3 w-full h-10 px-4 py-2 border border-purple bg-cream ">
        <h3 className="text-xl text-purple font-gBold">{`[${notice.category}]`}</h3>
        <h3 className="text-xl text-purple font-gBold">{notice.title}</h3>
      </div>
      <div className="flex justify-end w-full text-sm text-gray-600 font-gMedium">
        {new Date(notice.created_at).toLocaleDateString()}
      </div>
      <div className="flex flex-col items-center gap-10 w-full h-full p-4 border border-purple bg-cream overflow-y-auto">
        {notice.img_url && (
          <div className="relative w-full max-w-[400px] h-[200px]">
            <Image
              src={notice.img_url}
              alt={notice.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
        <p className="flex w-full text-purple font-gMedium">{notice.content}</p>
      </div>
      <Link href={'/notice'} scroll={false}>
        <Button variant="primary" className="md:translate-y-4">
          목록
        </Button>
      </Link>
    </div>
  );
};

export default NoticeDetail;
