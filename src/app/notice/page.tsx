import NoticeList from '@/components/notice/noticeList';

import ContentBox from '@common/contentBox';

const Notice = async () => {
  return (
    <div className="flex justify-center items-center w-full max-w-[700px] min-w-[300px] h-full max-h-[800px]  ">
      <ContentBox size="max-w-4xl " layout="gap-10 px-6 ">
        <h3 className="font-lilita text-cream stroke text-3xl md:text-4xl">NOTICE</h3>
        <NoticeList />
      </ContentBox>
    </div>
  );
};

export default Notice;
