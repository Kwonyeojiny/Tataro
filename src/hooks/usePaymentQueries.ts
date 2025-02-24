import { useMutation, useQuery } from '@tanstack/react-query';

import { useFetchWithAuth } from './useFetchWithAuth';

import {
  PaymentDetailsType,
  ProductInfoType,
  TransformedProductInfoType,
} from '@/components/myPage/payment/types';
import { API } from '@/api/constants';

const SIZE = 5;

const usePaymentQueries = (page?: number) => {
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

  const { mutate: sendPaymentRequest, isPending: isRequestPaymentPending } = useMutation({
    mutationKey: ['payment'],
    mutationFn: async (paymentRequest: { product_id: number; name: string }) => {
      const response = await fetchWithAuth(`${API.BASE_URL}${API.ENDPOINTS.PAYMENT.BASE}`, {
        method: 'POST',
        headers: { accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        return Promise.reject(new Error('Failed to send payment request'));
      }

      const { admin_account: account } = await response.json();

      if (!account) {
        return Promise.reject(new Error('Account not found'));
      }

      return { account };
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

  return {
    getPaymentHistory,
    sendPaymentRequest,
    isRequestPaymentPending,
    getProductList,
  };
};

export default usePaymentQueries;
