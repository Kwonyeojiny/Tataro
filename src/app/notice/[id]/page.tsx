import NoticeDetail from '@/components/notice/noticeDetail';

import ContentBox from '@common/contentBox';

type Props = {
  params: { id: string };
};

const NoticeDetailPage = async ({ params }: Props) => {
  const noticeId = params.id;

  // 임시 데이터 (실제로는 API에서 가져와야 함)
  const data = {
    page: 1,
    size: 10,
    total_pages: 1,
    total_count: 4,
    results: [
      {
        id: 1,
        created_at: '2025-02-20T19:11:46.934281+09:00',
        updated_at: '2025-02-20T19:11:46.934312+09:00',
        title: '첫 공지',
        content: '테스트 중입니다',
        img_url:
          'https://i.namu.wiki/i/Bbq0E9hXYyrXbL4TnIE__vtQ2QwiZ3i40NZSLiX_a6S0ftYCndVZjf4vlruWur4I3Z0o7CZuFrRMl2CKxyk30w.webp',
        order: 2147483647,
        category: '공지',
        user: 9,
      },
      {
        id: 2,
        created_at: '2025-02-21T19:11:46.934281+09:00',
        updated_at: '2025-02-21T19:11:46.934312+09:00',
        title: '이벤트',
        content: '느아으아아아아아아ㅏㅇ',
        order: 2147483647,
        category: '이벤트',
        user: 9,
      },
    ],
  };

  const notice = data.results.find(item => item.id.toString() === noticeId);

  if (!notice) {
    return <div className="p-8">공지사항을 찾을 수 없습니다</div>;
  }

  return (
    <div className="flex justify-center items-center w-full max-w-[700px] h-full max-h-[800px] min-w-[300px]">
      <ContentBox size="max-w-4xl h-full" layout="gap-10 px-6 ">
        <h3 className="font-lilita text-cream stroke text-3xl md:text-4xl">NOTICE</h3>
        <NoticeDetail notice={notice} />
      </ContentBox>
    </div>
  );
};

export default NoticeDetailPage;
