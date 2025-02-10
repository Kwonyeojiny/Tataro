'use client';

import { useState } from 'react';
import useScreenWidth from '@/hooks/useScreenWidth';
import { MobileTab, MobileTabs } from '@common/tabs/mobileTaps';
import Button from '@common/button';
import ContentBox from '@common/contentBox';
import SUBMENUS from '@/components/myPage/constants';
import { MyPageSubmenus } from '@/components/myPage/types';

const MyPage = () => {
  const { isInit, isCustomWidth } = useScreenWidth(1056);
  const [submenu, setSubmenu] = useState('Profile');

  const handleClickSubmenu = (selectedSubmenu: MyPageSubmenus) =>
    selectedSubmenu !== submenu && setSubmenu(selectedSubmenu);

  if (!isInit) return null;

  return (
    <div className="relative w-full max-w-5xl h-full">
      <div className="flex justify-start items-center h-full">
        {!isCustomWidth && (
          <>
            <div className="absolute top-1/2 right-12 z-20 -translate-y-[384px]">
              <ContentBox size="w-64 h-[512px]" layout="justify-start gap-6 pt-8">
                <h3 className="font-lilita text-4xl text-cream stroke">My Page</h3>
                <div className="flex flex-col gap-5 relative left-12">
                  {SUBMENUS.map(({ submenu: submenuItem }) => (
                    <Button
                      key={`${submenuItem}-desktopMenu`}
                      variant="submenuButton"
                      isSelected={submenu === submenuItem}
                      onClick={() => handleClickSubmenu(submenuItem)}
                    >
                      {submenuItem}
                    </Button>
                  ))}
                </div>
              </ContentBox>
            </div>
            {SUBMENUS.map(
              ({ submenu: submenuItem, content: Content }) =>
                submenu === submenuItem && (
                  <ContentBox
                    key={`${submenuItem}-content`}
                    size="max-w-3xl max-h-[672px]"
                    layout="p-6"
                  >
                    <Content />
                  </ContentBox>
                ),
            )}
          </>
        )}
        {isCustomWidth && (
          <div className="flex justify-center items-center w-full h-full">
            <div className="w-full max-w-3xl h-full max-h-[672px]">
              <MobileTabs>
                {SUBMENUS.map(({ submenu: submenuItem, content: Content }) => (
                  <MobileTab
                    key={`${submenuItem}-mobileTab`}
                    label={submenuItem}
                    onClick={() => handleClickSubmenu(submenuItem)}
                  >
                    {submenu === submenuItem && <Content />}
                  </MobileTab>
                ))}
              </MobileTabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
