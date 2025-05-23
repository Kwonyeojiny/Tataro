'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useShallow } from 'zustand/react/shallow';

import useSubmenuStore from '@/stores/submenuStore';

import { TabProps } from '../types';

const MobileTabs: React.FC<{ children: React.ReactElement<TabProps>[] }> = ({ children }) => {
  const pathname = usePathname();

  const { myPageSubmenuIndex, setMyPageSubmenu, reviewSubmenuIndex, setReviewsSubmenu } =
    useSubmenuStore(
      useShallow(state => ({
        myPageSubmenuIndex: state.myPageSubmenuIndex,
        setMyPageSubmenu: state.setMyPageSubmenu,
        reviewSubmenuIndex: state.reviewSubmenuIndex,
        setReviewsSubmenu: state.setReviewsSubmenu,
      })),
    );

  const submenuIndex = pathname === '/mypage' ? myPageSubmenuIndex : reviewSubmenuIndex;
  const setSubmenuIndex = pathname === '/mypage' ? setMyPageSubmenu : setReviewsSubmenu;

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="relative top-1 left-1 z-10 w-full h-full border bg-deepPink border-purple text-sm">
        <div className="flex flex-col justify-center items-center absolute bottom-2 right-2 -z-10 w-full h-full border bg-softPink border-purple">
          {children[submenuIndex]}
        </div>
      </div>
      <div className="flex z-20 relative left-1 w-full">
        {children.map((child, index) => (
          <button
            key={index}
            onClick={() => {
              setSubmenuIndex(index);
              (child.props.onClick as () => void)?.();
            }}
            className={clsx(
              'flex justify-center flex-grow py-3 border border-t-0 border-purple font-lilita text-lg sm:text-2xl text-cream stroke',
              submenuIndex === index
                ? 'relative -left-[7px] bottom-2 z-30 bg-softPink'
                : 'bg-deepPink',
              submenuIndex === children.length - 1 && '-left-[9px] first:border-r-0',
              submenuIndex === 0 && children.length > 2 && 'last:border-l-0',
            )}
          >
            {child.props.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const MobileTab: React.FC<TabProps> = ({ children }) => {
  return <div className="w-full h-full p-4 sm:p-6">{children}</div>;
};

export { MobileTab, MobileTabs };
