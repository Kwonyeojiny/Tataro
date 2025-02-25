import { useMutation } from '@tanstack/react-query';

import { consultTarot, initTarot, reInitTarot } from '@/api/tarotApi';
import { useTarotStore } from '@/stores/tarotStore';
import { TarotConsultResponse, TarotInitResponse } from '@/types/tarot';

export const useTarotQueries = () => {
  const { setRoomId } = useTarotStore();

  const initTarotMutation = useMutation<TarotInitResponse, Error, string>({
    mutationFn: initTarot,
    onSuccess: data => {
      setRoomId(data.room_id);
    },
    onError: error => {
      console.error('Error initializing tarot: ', error);
    },
  });

  const reInitTarotMutation = useMutation<
    TarotInitResponse,
    Error,
    { roomId: string; content: string }
  >({
    mutationFn: ({ roomId, content }) => reInitTarot(roomId, content),
    onSuccess: data => {
      setRoomId(data.room_id);
    },
  });

  const consultTarotMutation = useMutation<TarotConsultResponse, Error, string>({
    mutationFn: (roomId: string) => consultTarot(roomId),
  });

  return {
    initTarotMutation,
    reInitTarotMutation,
    consultTarotMutation,
  };
};
