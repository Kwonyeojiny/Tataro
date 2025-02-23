import Image from 'next/image';
import { X } from 'lucide-react';

import useLayerCardStore from '@/stores/layerCardStore';
import { useTarotStore } from '@/stores/tarotStore';

export const addLineBreaks = (text: string) => {
  return text
    .replace(/\n/g, ' ')
    .split('.')
    .map(sentence => sentence.trim())
    .filter(Boolean)
    .join('.\n')
    .replace(/(🔮 카드:.*방향🔮)\s*/g, '$1\n\n')
    .replace(/([^.\n])\s*(🌟)/g, '$1\n\n$2')
    .replace(/\n(🪄|💖)/g, '\n\n$1');
};

const TarotChatDetail = ({ index }: { index: number }) => {
  const { tarotResults } = useTarotStore.getState();
  const setIsDetailViewVisible = useTarotStore(state => state.setIsDetailViewVisible);
  const { hideLayerCard } = useLayerCardStore();

  const { isDetailViewVisible } = useTarotStore.getState();
  console.log('디테일 페이지 index', index);
  console.log('디테일 페이지 index', isDetailViewVisible[index]);

  const handleClose = () => {
    hideLayerCard();
    setIsDetailViewVisible(index, true);
  };

  const tarotResult = tarotResults[index];

  return (
    <main className="w-full h-full p-4 pt-6 md:p-8 md:pt-10">
      <button
        onClick={handleClose}
        aria-label="닫기"
        className="absolute top-2 right-2 text-purple cursor-pointer"
      >
        <X strokeWidth={1.5} size={28} className="text-purple" />
      </button>
      <div className="flex flex-col justify-center items-center gap-4 h-full max-h-[100vh]">
        {tarotResult && (
          <div className="w-[160px] md:w-[200px] rounded-lg flex-shrink-0 select-none">
            <Image
              src={tarotResult.card_url}
              alt="tarotCard"
              width={200}
              height={400}
              draggable="false"
              className="w-full h-auto"
              style={{
                transform: tarotResult?.card_direction === '역방향' ? 'rotate(180deg)' : 'none',
              }}
            />
          </div>
        )}
        <div className="font-lilita text-white text-3xl md:text-4xl stroke stroke-purple">
          {tarotResult?.card_name}
        </div>
        <div className="p-4 border border-purple bg-lightYellow font-gLight text-sm md:text-base overflow-auto">
          {tarotResult && (
            <p className="whitespace-pre-wrap">{addLineBreaks(tarotResult.card_content)}</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default TarotChatDetail;
