import { z } from 'zod';

import {
  bankTransferRequestSchema,
  depositInfoSchema,
  depositorSchema,
  paymentDetailsSchema,
  paymentHistoryResponseSchema,
  productListSchema,
  transformedProductListSchema,
} from './schema';

export type PaymentDetailsType = z.infer<typeof paymentDetailsSchema>;

export type PaymentHistoryResponseType = z.infer<typeof paymentHistoryResponseSchema>;

export type BankTransferRequestType = z.infer<typeof bankTransferRequestSchema>;

export type DepositInfoResponseType = z.infer<typeof depositInfoSchema>;

export type ProductListResponseType = z.infer<typeof productListSchema>;

export type TransformedProductListType = z.infer<typeof transformedProductListSchema>;

export type DepositorType = z.infer<typeof depositorSchema>;

export type HeartPriceTagProps = { productId: number; heart: number; price: number };

export type AccountNumberProps = { paymentId?: number };

export type EnterPayerNamePopupProps = { productId: number; heart: number };
