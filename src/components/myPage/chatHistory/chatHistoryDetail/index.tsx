import { useEffect, useState } from 'react';
import Image from 'next/image';

import { getTarotChatHistory } from '@/api/tarotApi';
import { TarotConsultResponse } from '@/types/tarot';

import CardBack from '@images/CardBack.svg';

const ChatHistoryDetail = ({ roomId }: { roomId: number }) => {
  const [chatHistory, setChatHistory] = useState<TarotConsultResponse | null>(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      console.log('roomId: ', roomId);
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

  if (!chatHistory) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">상담 내역</h2>
      {chatHistory.chat_log.map((log, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <div className="relative w-24 h-40 rounded-lg flex-shrink-0 select-none">
            <Image
              src={log.card_url || CardBack}
              alt="tarotCard"
              layout="fill"
              objectFit="cover"
              draggable="false"
              style={{
                transform: log?.card_direction === '역방향' ? 'rotate(180deg)' : 'none',
              }}
            />
          </div>
          <h3 className="font-bold">
            {log.card_name} ({log.card_direction})
          </h3>
          <p className="mb-2">
            <strong>질문:</strong> {log.question}
          </p>
          <p className="mb-2">
            <strong>답변:</strong> {log.content}
          </p>
          <p>
            <strong>카드 설명:</strong> {log.card_content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatHistoryDetail;
