'use client';

import { useState } from 'react';

import Pagination from '@common/pagination';

import NoticeItem from '../noticeItem';

import { NoticesResponse } from './types';

const NoticeList = ({ data }: { data: NoticesResponse }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!data.results.length) {
    return <div className="text-center py-8">공지사항이 없습니다.</div>;
  }
  return (
    <div className="flex flex-col w-full h-[567px] gap-3 ">
      {data.results.map(notice => (
        <NoticeItem key={notice.id} notice={notice} />
      ))}
      <div className="flex h-full items-center justify-center">
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
