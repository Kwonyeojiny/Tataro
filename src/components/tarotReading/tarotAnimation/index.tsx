import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

import CardBack from '@images/CardBack.svg';

import { TarotAnimationProps } from '../types';
import { CARD_ANGLE, CARD_COUNT, CARD_HEIGHT, CARD_WIDTH, RADIUS } from '../constants';

const TarotAnimation = ({ onCardSelect, cardImageUrl, cardDirection }: TarotAnimationProps) => {
  const [cards, setCards] = useState(Array.from({ length: CARD_COUNT }, (_, i) => i + 1));
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffling, setIsShuffling] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isSelectable, setIsSelectable] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [cardImage, setCardImage] = useState(cardImageUrl || CardBack);
  const [isReversed, setIsReversed] = useState(cardDirection === '역방향');

  useEffect(() => {
    if (cardImageUrl) {
      setCardImage(cardImageUrl);
    }
  }, [cardImageUrl]);

  useEffect(() => {
    setIsReversed(cardDirection === '역방향');
  }, [cardDirection]);

  const calculateCardPosition = (index: number) => {
    const angle = index * CARD_ANGLE;
    const x = Math.cos(angle) * RADIUS;
    const y = Math.sin(angle) * RADIUS;
    return { x, y, angle: angle * (180 / Math.PI) + 90 };
  };

  const cardPositions = cards.map((_, index) => calculateCardPosition(index));

  useEffect(() => {
    setIsVisible(true);

    const initialDelay = setTimeout(() => {
      setIsRotating(true);
      setIsShuffling(true);

      let timer: NodeJS.Timeout;
      let shuffleCount = 0;
      const maxShuffles = 10;

      const shuffleAnimation = () => {
        if (shuffleCount < maxShuffles) {
          setCards(prevCards => {
            const newCards = [...prevCards];
            for (let i = newCards.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
            }
            return newCards;
          });
          shuffleCount++;
          timer = setTimeout(shuffleAnimation, 300);
        } else {
          setIsShuffling(false);
          setTimeout(() => {
            setIsSelectable(true);
          }, 5000);
        }
      };

      shuffleAnimation();

      return () => {
        clearTimeout(timer);
      };
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, []);

  const selectCard = (card: number) => {
    if (isSelectable && !isShuffling && selectedCard === null) {
      setSelectedCard(card);
      setTimeout(() => {
        setIsFlipped(true);
        setTimeout(() => {
          setIsClosing(true);
          onCardSelect?.();
        }, 5000);
      }, 2000);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isClosing &&
            cards.map((card, index) => {
              const { x, y, angle } = cardPositions[index];
              return (
                <motion.div
                  key={card}
                  initial={{ scale: 0, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    scale: selectedCard === card ? 2 : 1,
                    opacity: isVisible ? 1 : 0,
                    x: selectedCard === card ? 0 : x,
                    y: selectedCard === card ? 0 : y,
                    rotate: selectedCard === card ? (isReversed ? 180 : 0) : angle,
                    rotateY: selectedCard === card && isFlipped ? 180 : 0,
                    zIndex: selectedCard === card ? 50 : 1,
                  }}
                  exit={{
                    scale: 0,
                    x: 0,
                    y: 0,
                    rotate: 0,
                    transition: {
                      duration: 0.3,
                      type: 'spring',
                      stiffness: 150,
                      damping: 80,
                    },
                  }}
                  transition={{
                    duration: 0.8,
                    rotateY: {
                      delay: 2,
                      duration: 2,
                    },
                    rotate: {
                      duration: isRotating ? 0.5 : 0,
                    },
                    default: {
                      type: 'spring',
                      stiffness: 150,
                      damping: 80,
                      mass: 1.2,
                    },
                  }}
                  style={{
                    width: `${CARD_WIDTH}px`,
                    height: `${CARD_HEIGHT}px`,
                    position: 'absolute',
                    transformStyle: 'preserve-3d',
                    cursor:
                      isSelectable && !isShuffling && selectedCard === null ? 'pointer' : 'default',
                  }}
                  onClick={() => selectCard(card)}
                  {...(isSelectable && selectedCard === null && !isShuffling
                    ? {
                        whileHover: {
                          scale: 1.25,
                          transition: { duration: 0.2 },
                        },
                        whileTap: {
                          scale: 0.95,
                          transition: { duration: 0.1 },
                        },
                      }
                    : {})}
                >
                  <motion.div className="flex justify-center items-center absolute w-full h-full backface-hidden rounded-md">
                    <Image
                      src={CardBack}
                      alt="Tarot Card Back"
                      fill
                      draggable="false"
                      className="select-none"
                    />
                  </motion.div>
                  <motion.div
                    className="flex justify-center items-center absolute w-full h-full backface-hidden rounded-md"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <Image
                      src={cardImage || CardBack}
                      alt="Tarot Card Front"
                      fill
                      draggable="false"
                      className="select-none"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TarotAnimation;
