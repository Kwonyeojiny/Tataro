import Image from 'next/image';
import Link from 'next/link';

import Button from '@common/button';

import { Notice } from '../noticeList/types';

type Props = {
  notice: Notice;
};

const NoticeDetail = ({ notice }: Props) => {
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
          <Image src={notice.img_url} alt={notice.title} width={200} height={200} />
        )}
        <p className="flex w-full text-purple font-gMedium">{notice.content}</p>
      </div>
      <Link href={'/notice'}>
        <Button variant="primary" className="md:translate-y-4">
          목록
        </Button>
      </Link>
    </div>
  );
};

export default NoticeDetail;
