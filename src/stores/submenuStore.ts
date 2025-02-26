import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SubmenuState = {
  myPageSubmenuIndex: number;
  reviewSubmenuIndex: number;
};

type SubmenuActions = {
  setMyPageSubmenu: (myPageSubmenu: number) => void;
  setReviewsSubmenu: (reviewsSubmenu: number) => void;
  resetSubmenu: () => void;
};

const DEFAULT_STATE: SubmenuState = {
  myPageSubmenuIndex: 0,
  reviewSubmenuIndex: 0,
};

const useSubmenuStore = create<SubmenuState & SubmenuActions>()(
  persist(
    set => ({
      myPageSubmenuIndex: DEFAULT_STATE.myPageSubmenuIndex,
      reviewSubmenuIndex: DEFAULT_STATE.reviewSubmenuIndex,

      setMyPageSubmenu: (myPageSubmenuIndex: number) => set({ myPageSubmenuIndex }),
      setReviewsSubmenu: (reviewSubmenuIndex: number) => set({ reviewSubmenuIndex }),
      resetSubmenu: () => set({ ...DEFAULT_STATE }),
    }),
    {
      name: 'submenu',
    },
  ),
);

export default useSubmenuStore;
