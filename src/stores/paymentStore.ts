import { create } from 'zustand';

type ProductInfo = { productId: number; heart: number; price: number };

type AccountInfo = { account: string; accountHolder: string; bank: string; deadline: string };

type PaymentState = {
  depositorName: string;
  selectedProduct: ProductInfo | null;
  accountInfo: AccountInfo | null;

  setDepositorName: (depositorName: string) => void;
  setSelectedProduct: (product: ProductInfo) => void;
  setAccountInfo: (accountInfo: AccountInfo) => void;
};

const usePaymentStore = create<PaymentState>(set => ({
  depositorName: '',
  selectedProduct: null,
  accountInfo: null,

  setDepositorName: (depositorName: string) => set({ depositorName }),
  setSelectedProduct: (selectedProduct: ProductInfo) => set({ selectedProduct }),
  setAccountInfo: (accountInfo: AccountInfo) => set({ accountInfo }),
}));

export default usePaymentStore;
