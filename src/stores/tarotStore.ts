import { create } from 'zustand';

import { TarotCard, TarotConsultResponse } from '@/types/tarot';

type TarotState = {
  roomId: string | null;
  setRoomId: (id: string) => void;
  resetRoomId: () => void;
  tarotResults: TarotConsultResponse['chat_log'];
  addTarotResult: (result: TarotCard) => void;
  isDetailViewVisible: boolean[];
  setIsDetailViewVisible: (index: number, isVisible: boolean) => void;
};

export const useTarotStore = create<TarotState>(set => ({
  roomId: null,
  setRoomId: id => set({ roomId: id }),
  resetRoomId: () => set({ roomId: null }),
  tarotResults: [],
  addTarotResult: result => set(state => ({ tarotResults: [...state.tarotResults, result] })),
  isDetailViewVisible: [],
  setIsDetailViewVisible: (index, isVisible) =>
    set(state => {
      const newIsDetailViewVisible = [...state.isDetailViewVisible];
      newIsDetailViewVisible[index] = isVisible;
      return { isDetailViewVisible: newIsDetailViewVisible };
    }),
}));
