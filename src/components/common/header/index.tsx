'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { BellDot, LogIn, Menu, UserRound } from 'lucide-react';

import AlarmBox from '@/components/notice/alarmBox';
import useScreenWidth from '@/hooks/useScreenWidth';
import { getAccessToken } from '@/utils/auth';

import { layerCard } from '@common/layerCard';
import Sidebar from '@common/sidebar';

const Header = () => {
  const { data: session } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await getAccessToken();
      setAccessToken(token ? token : null);
    };

    fetchAccessToken();
  }, [session]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const { isInit, isMobile } = useScreenWidth();

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

              <BellDot
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
                <circle cx="18" cy="8" r="4" className="fill-deepPink stroke-none" />
              </BellDot>
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
