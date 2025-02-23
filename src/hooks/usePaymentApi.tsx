import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import AccountNumber from '@/components/myPage/payment/accountNumber';

import { layerCard } from '@common/layerCard';
import { layerPopup } from '@common/layerPopup';

import { useFetchWithAuth } from './useFetchWithAuth';

import {
  Account,
  PaymentDetailsType,
  ProductInfoType,
  TransformedProductInfoType,
} from '@/components/myPage/payment/types';
import { API } from '@/api/constants';

const SIZE = 5;

const usePaymentApi = (page?: number) => {
  const queryClient = useQueryClient();
  const fetchWithAuth = useFetchWithAuth();

  const getPaymentHistory = useQuery({
    queryKey: ['payment', page],
    queryFn: async () => {
      try {
        if (!page) throw new Error('Page parameter is required');

        const response = await fetchWithAuth(
          `${API.BASE_URL}${API.ENDPOINTS.PAYMENT.BASE}?page=${page}&size=${SIZE}`,
          { headers: { accept: 'application/json' } },
        );

        if (!response.ok) throw new Error('Failed to fetch payment history');

        const { total_count: totalResult, payment_details } = await response.json();

        const paymentDetails = payment_details.map(
          ({
            payment_amount: price,
            payment_method: method,
            payment_status: status,
            purchase_date: date,
          }: PaymentDetailsType) => ({ price, method, status, date, quantity: price / 100 }),
        );

        return { totalResult, paymentDetails };
      } catch (error) {
        if (error instanceof Error) throw Error(error.message);
      }
    },
  });

  const requestPayment = useMutation({
    mutationKey: ['payment'],
    mutationFn: async (paymentRequest: { product_id: number; name: string }) => {
      const response = await fetchWithAuth(`${API.BASE_URL}${API.ENDPOINTS.PAYMENT.BASE}`, {
        method: 'POST',
        headers: { accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) throw new Error('Failed to send payment request');

      const { admin_account: account } = await response.json();

      if (!account) throw new Error('Account not found');

      return { account };
    },

    onSuccess: ({ account }: Account) => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      layerCard({
        content: <AccountNumber account={account} />,
        size: 'max-w-xl h-[448px] sm:h-96',
        isOutsideClickActive: false,
      });
    },

    onError: error => {
      console.log(error);
      layerPopup({
        type: 'alert',
        content: '계좌번호를 받아오는 데 실패하였습니다.\n잠시 후 다시 시도해 주세요.',
      });
    },
  });

  const getProductList = useQuery({
    queryKey: ['product'],
    queryFn: async () => {
      try {
        const response = await fetchWithAuth(`${API.BASE_URL}${API.ENDPOINTS.PRODUCT.BASE}`, {
          headers: { accept: 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch product list');

        const data = await response.json();

        const productList: TransformedProductInfoType[] = data.map(
          (
            { id: productId, name, price, discount_price }: ProductInfoType, //
          ) => ({
            productId,
            heart: parseInt(name.replace(/\D/g, ''), 10),
            price: parseInt(price),
            discountedPrice: parseInt(discount_price),
          }),
        );

        return productList;
      } catch (error) {
        if (error instanceof Error) throw Error(error.message);
      }
    },
  });

  return { getPaymentHistory, sendPaymentRequest: requestPayment.mutate, getProductList };
};

export default usePaymentApi;
