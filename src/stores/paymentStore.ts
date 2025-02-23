import { create } from 'zustand';

type ProductInfo = { productId: number; heart: number; price: number };

type PaymentState = {
  depositorName: string | null;
  selectedProduct: ProductInfo | null;

  setDepositorName: (depositorName: string) => void;
  setSelectedProduct: (product: ProductInfo) => void;
};

const usePaymentStore = create<PaymentState>(set => ({
  depositorName: null,
  selectedProduct: null,

  setDepositorName: (depositorName: string) => set({ depositorName }),
  setSelectedProduct: (selectedProduct: ProductInfo) => set({ selectedProduct }),
}));

export default usePaymentStore;
