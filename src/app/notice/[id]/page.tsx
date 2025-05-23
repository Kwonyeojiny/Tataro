import NoticeDetail from '@/components/notice/noticeDetail';

import ContentBox from '@common/contentBox';

type Props = {
  params: { id: string };
};

const NoticeDetailPage = ({ params }: Props) => {
  const noticeId = params.id;

  return (
    <div className="flex justify-center items-center w-full max-w-[700px] min-w-[300px] h-full max-h-[800px]">
      <ContentBox size="max-w-4xl h-full" layout="gap-10 px-6">
        <h3 className="font-lilita text-cream stroke text-3xl md:text-4xl">NOTICE</h3>
        <NoticeDetail noticeId={noticeId} />
      </ContentBox>
    </div>
  );
};
export default NoticeDetailPage;
