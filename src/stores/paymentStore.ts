import { create } from 'zustand';

type ProductInfo = { productId: number; heart: number; price: number };

type PaymentState = {
  depositorName: string;
  selectedProduct: ProductInfo | null;
  account: string;

  setDepositorName: (depositorName: string) => void;
  setSelectedProduct: (product: ProductInfo) => void;
  setAccount: (account: string) => void;
};

const usePaymentStore = create<PaymentState>(set => ({
  depositorName: '',
  selectedProduct: null,
  account: '',

  setDepositorName: (depositorName: string) => set({ depositorName }),
  setSelectedProduct: (selectedProduct: ProductInfo) => set({ selectedProduct }),
  setAccount: (account: string) => set({ account }),
}));

export default usePaymentStore;
