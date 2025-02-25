import { ChatBubbleProps } from '@common/chatBubble/types';

export const initialChatbotMessages: ChatBubbleProps[] = [
  {
    message: '어서와~ 타타로를 만나러 와줘서 고마워',
    isChatbot: true,
  },
  {
    message: '어떤 고민이 있어서 왔니?',
    isChatbot: true,
  },
];

export const CARD_COUNT = 78;
export const CARD_ANGLE = (2 * Math.PI) / CARD_COUNT;
export const RADIUS = 300;
export const CARD_WIDTH = 80;
export const CARD_HEIGHT = 140;
