import { z } from 'zod';

import { depositorSchema } from './schema';

export type HeartPriceTagProps = { productId: number; heart: number; price: number };

export type ProductInfoType = {
  id: number;
  name: string;
  description: string;
  price: string;
  discount_price: string;
  img_url: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

export type TransformedProductInfoType = {
  productId: number;
  heart: number;
  price: number;
  discountedPrice: number;
};

export type PaymentDetailsType = {
  payment_amount: number;
  payment_method: 'bank_transfer';
  payment_status: 'pending' | 'completed' | 'expired' | 'canceled' | 'mismatch';
  payments_id: number;
  product_id: number;
  purchase_date: string;
  quantity: number;
};

export type TransformedProductDetailsType = {
  price: number;
  method: 'bank_transfer';
  status: 'pending' | 'completed' | 'expired' | 'canceled' | 'mismatch';
  date: string;
  quantity: 10 | 30 | 50 | 100 | 200 | 300 | 400 | 500 | 700 | 1000;
};

export type DepositorType = z.infer<typeof depositorSchema>;
