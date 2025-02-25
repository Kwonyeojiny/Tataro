import {
  BankTransferRequestType,
  DepositInfoResponseType,
  PaymentDetailsType,
  PaymentHistoryResponseType,
  ProductListResponseType,
  TransformedProductListType,
} from '@/components/myPage/payment/types';
import { API } from './constants';
import { PER_PAGE } from '@/components/myPage/payment/constants';

export const getPaymentHistory = async (page: number): Promise<PaymentHistoryResponseType> => {
  const url = `${API.BASE_URL}${API.ENDPOINTS.PAYMENT.BASE}?page=${page}&size=${PER_PAGE}`;

  const response = await fetch('/api/auth/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      options: { headers: { accept: 'application/json' } },
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch payment history');

  const data: PaymentHistoryResponseType = await response.json();

  return {
    ...data,
    payment_details: data.payment_details.map((payment: PaymentDetailsType) => ({
      ...payment,
      quantity: payment.payment_amount / 100,
    })),
  };
};

export const postPaymentRequest = async (
  paymentRequest: BankTransferRequestType,
): Promise<DepositInfoResponseType> => {
  const url = `${API.BASE_URL}${API.ENDPOINTS.PAYMENT.BASE}`;

  const response = await fetch('/api/auth/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      options: {
        method: 'POST',
        headers: { accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequest),
      },
    }),
  });

  if (!response.ok) {
    return Promise.reject(new Error('Failed to send payment request'));
  }
  const data: DepositInfoResponseType = await response.json();

  return data;
};

export const getProductList = async (): Promise<TransformedProductListType> => {
  const url = `${API.BASE_URL}${API.ENDPOINTS.PRODUCT.BASE}`;

  const response = await fetch('/api/auth/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      options: {
        headers: { accept: 'application/json' },
      },
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch product list');

  const data: ProductListResponseType = await response.json();

  const transformedData: TransformedProductListType = data.map(item => ({
    product_id: item.id,
    heart_count: parseInt(item.name.replace(/\D/g, ''), 10),
    price: parseInt(item.price),
  }));

  return transformedData;
};

export const getPaymentDetails = async (paymentId: number): Promise<DepositInfoResponseType> => {
  const url = `${API.BASE_URL}${API.ENDPOINTS.PAYMENT.PAYMENT_DETAILS(paymentId)}`;

  const response = await fetch('/api/auth/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      options: {
        headers: { accept: 'application/json' },
      },
    }),
  });

  if (!response.ok) {
    return Promise.reject(new Error('Failed to send payment request'));
  }

  const data: DepositInfoResponseType = await response.json();

  return data;
};
