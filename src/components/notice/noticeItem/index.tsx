import Image from 'next/image';
import { useRouter } from 'next/navigation';

import logo from '@images/logo.svg';

import { Notice } from '../noticeList/types';

const NoticeItem = ({ notice }: { notice: Notice }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`notice/${notice.id}`);
  };
  return (
    <div
      onClick={handleClick}
      className="w-full h-full p-3 bg-cream border-purple border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 hover:cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {notice.img_url ? (
          <Image
            src={notice.img_url}
            alt={notice.title}
            width={90}
            height={90}
            className="rounded-md "
          />
        ) : (
          <div className="flex justify-center items-center  h-[90px] w-[90px] bg-lightBlue rounded-md   ">
            <Image src={logo} alt="noneImage" width={80} height={80} className="rounded-md " />
          </div>
        )}

        <div className="flex-grow">
          <div className="flex items-baseline justify-between gap-2 ">
            {notice.category == '공지' ? (
              <span className="px-1 mb-1 bg-blue-100 text-blue-800 text-sm font-gMedium rounded">
                {notice.category}
              </span>
            ) : (
              <span className="px-2 mb-1 bg-lightPink text-purple text-sm font-gMedium rounded">
                {notice.category}
              </span>
            )}
            <span className="text-sm text-gray-500 font-gMedium">
              {new Date(notice.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className="text-xl text-purple font-gBold ">{notice.title}</h3>
          <p className="text-purple font-gMedium">{notice.content}</p>
        </div>
      </div>
    </div>
  );
};

export default NoticeItem;
