'use client';

import { useEffect, useState } from 'react';

import { getNoticeList } from '@/api/noticeApi';

import Pagination from '@common/pagination';

import NoticeItem from '../noticeItem';

import { Notice } from './types';

const NoticeList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchNotices = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getNoticeList('', page, 4);
      setNotices(response.results);
      setTotalItems(response.total_count);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage]);

  if (isLoading) {
    return <div className="py-8 text-center">로딩 중...</div>;
  }

  if (!notices.length) {
    return <div className="py-8 text-center">공지사항이 없습니다.</div>;
  }
  return (
    <div className="flex flex-col gap-3 h-full w-full max-h-[567px]">
      <div className="flex flex-col gap-3 h-full">
        {notices.map(notice => (
          <NoticeItem key={notice.id} notice={notice} />
        ))}
      </div>
      <div className="md:translate-y-4">
        <Pagination
          totalResults={totalItems}
          currentPage={currentPage}
          setPage={setCurrentPage}
          perPage={4}
        />
      </div>
    </div>
  );
};

export default NoticeList;
