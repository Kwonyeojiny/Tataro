'use client';

import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import useOutsideClick from '@/hooks/useOutsideClick';
import useLayerCardStore from '@/stores/layerCardStore';

import ContentBox from '@common/contentBox';

import LayerCardType from './types';

export const layerCard = ({
  content,
  variant = 'layerCard',
  position = 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  size,
  overlay = true,
  isOutsideClickActive = true,
}: LayerCardType) => {
  const store = useLayerCardStore.getState();
  store.showLayerCard({ content, variant, position, size, overlay, isOutsideClickActive });
};

const LayerCard = () => {
  const {
    layerCardData: { content, variant, position, size, overlay, isOutsideClickActive },
    hideLayerCard,
  } = useLayerCardStore();

  const ref = useOutsideClick(() => hideLayerCard());

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 z-40 w-screen h-screen bg-purple',
        overlay ? 'bg-opacity-10' : 'bg-opacity-0',
      )}
    >
      <div className={twMerge(clsx('fixed w-full h-full px-2', position, size))}>
        <ContentBox variant={variant} ref={isOutsideClickActive ? ref : null}>
          {content}
        </ContentBox>
      </div>
    </div>
  );
};

export default LayerCard;
