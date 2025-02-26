'use client';

import { useShallow } from 'zustand/react/shallow';

import useScreenWidth from '@/hooks/useScreenWidth';
import useSubmenuStore from '@/stores/submenuStore';

import Button from '@common/button';
import ContentBox from '@common/contentBox';
import { MobileTab, MobileTabs } from '@common/tabs/mobileTaps';

import SUBMENUS from '@/components/myPage/constants';

const MyPage = () => {
  const { isInit, isCustomWidth } = useScreenWidth(1056);
  const { myPageSubmenuIndex, setMyPageSubmenu } = useSubmenuStore(
    useShallow(state => ({
      myPageSubmenuIndex: state.myPageSubmenuIndex,
      setMyPageSubmenu: state.setMyPageSubmenu,
    })),
  );

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
                  {SUBMENUS.map(({ submenu }, index) => (
                    <Button
                      key={`${submenu}-desktopMenu`}
                      variant="submenuButton"
                      isSelected={myPageSubmenuIndex === index}
                      onClick={() => setMyPageSubmenu(index)}
                    >
                      {submenu}
                    </Button>
                  ))}
                </div>
              </ContentBox>
            </div>
            {SUBMENUS.map(
              ({ submenu, content: Content }, index) =>
                myPageSubmenuIndex === index && (
                  <ContentBox key={`${submenu}-content`} size="max-w-3xl h-[672px]" layout="p-6">
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
                {SUBMENUS.map(({ submenu, content: Content }, index) => (
                  <MobileTab
                    key={`${submenu}-mobileTab`}
                    label={submenu}
                    onClick={() => setMyPageSubmenu(index)}
                  >
                    {myPageSubmenuIndex === index && <Content />}
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
