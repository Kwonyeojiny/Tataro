import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import useSubmenuStore from '@/stores/submenuStore';

import ProviderProps from './types';

const SubmenuProvider = ({ children }: ProviderProps) => {
  const pathname = usePathname();

  const { resetSubmenu, setMyPageSubmenu, setReviewsSubmenu } = useSubmenuStore(
    useShallow(state => ({
      resetSubmenu: state.resetSubmenu,
      setMyPageSubmenu: state.setMyPageSubmenu,
      setReviewsSubmenu: state.setReviewsSubmenu,
    })),
  );

  useEffect(() => {
    switch (pathname) {
      case '/mypage':
        setReviewsSubmenu(0);
        break;
      case '/reviews':
        setMyPageSubmenu(0);
        break;
      default:
        resetSubmenu();
    }
  }, [pathname, resetSubmenu, setMyPageSubmenu, setReviewsSubmenu]);

  return <>{children}</>;
};

export default SubmenuProvider;
