'use client';

import { useState } from 'react';

import Pagination from '@common/pagination';

import NoticeItem from '../noticeItem';

import { NoticesResponse } from './types';

const NoticeList = ({ data }: { data: NoticesResponse }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!data.results.length) {
    return <div className="py-8 text-center">공지사항이 없습니다.</div>;
  }
  return (
    <div className="flex flex-col gap-3 w-full max-h-[567px]">
      {data.results.map(notice => (
        <NoticeItem key={notice.id} notice={notice} />
      ))}
      <div className="md:translate-y-4">
        <Pagination
          totalResults={data.results.length}
          currentPage={currentPage}
          setPage={setCurrentPage}
          perPage={4}
        />
      </div>
    </div>
  );
};

export default NoticeList;
