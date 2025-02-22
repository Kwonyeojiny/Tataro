import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

import { getTarotChatHistory } from '@/api/tarotApi';
import { addLineBreaks } from '@/components/tarotReading/tarotChatDetail';
import { TarotConsultResponse } from '@/types/tarot';

import CardBack from '@images/CardBack.svg';
import useLayerCardStore from '@/stores/layerCardStore';

const ChatHistoryDetail = ({ roomId, created_at }: { roomId: number; created_at: string }) => {
  const [chatHistory, setChatHistory] = useState<TarotConsultResponse | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

  const { hideLayerCard } = useLayerCardStore();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await getTarotChatHistory(roomId.toString());
        setChatHistory(response);
        console.log('상담: ', response);
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      }
    };
    fetchChatHistory();
  }, [roomId]);

  const handleClose = () => {
    hideLayerCard();
  };

  if (!chatHistory) {
    return <div>Loading...</div>;
  }

  const handleCardSelect = (index: number) => {
    setSelectedCardIndex(index);
  };

  return (
    <div className="flex flex-col justify-between gap-4 md:gap-8 p-4 md:p-8 h-full font-gLight">
      <button
        onClick={handleClose}
        aria-label="닫기"
        className="absolute top-2 right-2 text-purple cursor-pointer"
      >
        <X strokeWidth={1.5} size={28} className="text-purple" />
      </button>
      <div className="flex justify-center items-center gap-2 h-64 py-4 overflow-x-auto overflow-y-visible">
        {chatHistory.chat_log.map((log, index) => (
          <div
            key={index}
            className={`relative w-24 h-40 rounded-lg flex-shrink-0 select-none cursor-pointer transition-all duration-300 ease-in-out ${
              index === selectedCardIndex ? 'transform scale-125 z-10' : ''
            }`}
            onClick={() => handleCardSelect(index)}
          >
            <Image
              src={log.card_url || CardBack}
              alt={log.card_name}
              layout="fill"
              objectFit="cover"
              draggable="false"
              style={{
                transform: log.card_direction === '역방향' ? 'rotate(180deg)' : 'none',
              }}
            />
          </div>
        ))}
      </div>
      {chatHistory.chat_log[selectedCardIndex] && (
        <div className="flex flex-col gap-4 p-4 h-[calc(100%-14rem)] overflow-y-auto border border-purple bg-lightYellow font-gLight text-sm md:text-base overflow-auto">
          <h3 className="font-gMedium text-center">
            {chatHistory.chat_log[selectedCardIndex].card_name} (
            {chatHistory.chat_log[selectedCardIndex].card_direction})
          </h3>

          <p className="">
            <time dateTime={created_at}>상담날짜: {new Date(created_at).toLocaleDateString()}</time>
          </p>
          <p className="">질문: {chatHistory.chat_log[selectedCardIndex].question}</p>
          <p className="">답변: {chatHistory.chat_log[selectedCardIndex].content}</p>
          <p className="whitespace-pre-wrap">
            {addLineBreaks(chatHistory.chat_log[selectedCardIndex].card_content)}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatHistoryDetail;
