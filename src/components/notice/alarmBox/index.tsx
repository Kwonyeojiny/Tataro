'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { postNotificationRead } from '@/api/noticeApi';
import useLayerCardStore from '@/stores/layerCardStore';
import useNotificationStore from '@/stores/notificationStore';

const AlarmBox = () => {
  const { hideLayerCard } = useLayerCardStore();
  const { notifications } = useNotificationStore();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-center w-full border-b-2 border-purple">
        <h1 className="font-lilita text-lightBlue text-3xl stroke">alarm</h1>
        <button onClick={hideLayerCard} className="absolute top-1 right-1">
          <X strokeWidth={1.5} className="text-purple" />
        </button>
      </div>

      <div className=" flex flex-col items-center w-full space-y-2 h-full max-h-[350px] overflow-y-auto scrollbar-hide ">
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center w-full h-[350px] font-gMedium text-sm text-gray-500">
            알림이 없습니다.
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => {
                router.push(notification.url);
                postNotificationRead(notification.id);
              }}
              className="w-full p-3 border-b-2 last:border-none border-purple cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-gMedium text-xs text-purple">[{notification.category}]</span>
                <span className="text-xs text-gray-400">
                  {notification.created_at.toLocaleDateString()}
                </span>
              </div>
              <div className="font-gMedium text-sm text-darkBlue">{notification.title}</div>
              {notification.url && <div className="text-xs text-blue-400 mt-1">바로가기</div>}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AlarmBox;
