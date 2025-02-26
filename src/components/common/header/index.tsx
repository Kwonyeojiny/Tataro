'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { Bell, LogIn, Menu, UserRound } from 'lucide-react';

import AlarmBox from '@/components/notice/alarmBox';
import useScreenWidth from '@/hooks/useScreenWidth';
import useNotificationStore from '@/stores/notificationStore';

import { layerCard } from '@common/layerCard';
import Sidebar from '@common/sidebar';

const Header = () => {
  const { data: session } = useSession();
  const accessToken = session?.access_token ?? '';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const { isInit, isMobile } = useScreenWidth();

  const { notifications, connectWebSocket, disconnectWebSocket } = useNotificationStore();

  useEffect(() => {
    connectWebSocket(accessToken);
    return () => {
      disconnectWebSocket(); // 컴포넌트 언마운트 시 연결 해제
    };
  }, [accessToken, connectWebSocket, disconnectWebSocket]);
  if (!isInit) return null;
  return (
    <>
      <nav className="flex justify-between items-start fixed z-30 top-0 left-0 w-full p-4">
        {pathname !== '/' && (
          <Link href="/">
            <div
              className={clsx(
                'bg-logo bg-center bg-contain bg-no-repeat',
                isMobile ? 'w-24 h-12' : 'w-32 h-16',
              )}
              aria-label="로고"
            />
          </Link>
        )}
        <div className={clsx('flex gap-8', pathname === '/' && 'ml-auto')}>
          {accessToken ? (
            <>
              <Link href="/mypage">
                <UserRound
                  className={clsx(' text-blueGray', isMobile ? 'w-5 h-5' : 'w-6 h-6')}
                  strokeWidth={1.5}
                  absoluteStrokeWidth
                />
              </Link>

              <Bell
                className={clsx('text-blueGray cursor-pointer', isMobile ? 'w-5 h-5' : 'w-6 h-6')}
                strokeWidth={1.5}
                absoluteStrokeWidth
                onClick={() => {
                  layerCard({
                    content: <AlarmBox />,
                    position: 'top-12 right-10',
                    size: 'max-w-[300px] h-[400px]',
                    overlay: false,
                  });
                }}
              >
                {/* 알림 왔을 때 동그라미 색 표시 */}
                {notifications.length > 0 && (
                  <circle
                    cx="18"
                    cy="8"
                    r="4"
                    className="fill-deepPink stroke-none absolute top-0 right-0"
                  />
                )}
              </Bell>
            </>
          ) : (
            <Link href="/login">
              <LogIn
                className={clsx('text-blueGray', isMobile ? 'w-5 h-5' : 'w-6 h-6')}
                strokeWidth={1.5}
                absoluteStrokeWidth
              />
            </Link>
          )}

          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu
              className={clsx('text-blueGray', isMobile ? 'w-5 h-5' : 'w-6 h-6')}
              strokeWidth={1.5}
              absoluteStrokeWidth
            />
          </button>
        </div>
        <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)} />
      </nav>
    </>
  );
};
export default Header;
