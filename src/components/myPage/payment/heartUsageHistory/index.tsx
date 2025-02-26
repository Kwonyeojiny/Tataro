import { useState } from 'react';

import useScreenWidth from '@/hooks/useScreenWidth';
import useUserQueries from '@/hooks/useUserQueries';
import { UsedHeartsDetailsType } from '@/types/user';

import Button from '@common/button';
import { layerCard } from '@common/layerCard';
import { layerPopup } from '@common/layerPopup';
import LoadingSpinner from '@common/loadingSpinner';
import Pagination from '@common/pagination';

import ChatHistoryDetail from '../../chatHistory/chatHistoryDetail';

import { PER_PAGE } from '../constants';

const HeartUsageHistory = () => {
  const [page, setPage] = useState(1);

  const { isInit } = useScreenWidth();
  const { heartUsageHistory, isHeartUsageHistoryLoading, isHeartUsageHistoryError } =
    useUserQueries({
      page,
    });

  if (isHeartUsageHistoryError) {
    layerPopup({
      type: 'alert',
      content: '사용내역을 불러오는 데 실패하였습니다.\n잠시 후 다시 시도해 주세요.',
    });
    return;
  }

  const handleChatRoomClick = (chatRoomId: number) => {
    layerCard({
      content: <ChatHistoryDetail roomId={chatRoomId} />,
      size: 'max-w-5xl max-h-[768px]',
    });
  };

  if (!isInit) return null;

  if (isHeartUsageHistoryLoading) return <LoadingSpinner />;

  if (!heartUsageHistory || heartUsageHistory?.heart_used_logs.length === 0)
    return (
      <p className="w-full h-full font-gMedium text-center content-center">사용 내역이 없습니다.</p>
    );

  const { heart_used_logs: heartUsageDetails, total_count: totalResults } = heartUsageHistory;

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <table className="w-full">
        <colgroup>
          <col className="w-1/3" />
          <col className="w-1/3" />
          <col className="w-1/3" />
        </colgroup>
        <thead>
          <tr className="h-10 border-b-2 border-purple">
            <td>
              <strong>사용일자</strong>
            </td>
            <td>
              <strong>사용개수</strong>
            </td>
            <td>
              <strong>상담기록</strong>
            </td>
          </tr>
        </thead>
        <tbody>
          {heartUsageDetails.map(
            ({
              heart_count: usedHearts,
              chat_room_id: chatRoomId,
              created_at: date,
            }: UsedHeartsDetailsType) => (
              <tr
                key={`${date}-${chatRoomId}`}
                className="h-10 sm:h-12 lg:h-14 border-b border-purple text-sm sm:text-base"
              >
                <td>{date.split('T')[0].replaceAll('-', '.')}</td>
                <td>{usedHearts}개</td>
                <td>
                  <Button
                    onClick={() => handleChatRoomClick(chatRoomId)}
                    variant="simple"
                    className="h-7 md:h-8 px-2 bg-cream font-gMedium text-purple md:text-purple hover:text-purple stroke-none"
                  >
                    조회
                  </Button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>

      <Pagination
        totalResults={totalResults}
        currentPage={page}
        setPage={setPage}
        perPage={PER_PAGE}
      />
    </div>
  );
};

export default HeartUsageHistory;
