import { ReactNode } from 'react';

type LayerCardType = {
  content: ReactNode;
  variant?: 'layerCard' | 'price';
  position?: string;
  size: string;
  overlay?: boolean;
  isOutsideClickActive?: boolean;
};

export default LayerCardType;
