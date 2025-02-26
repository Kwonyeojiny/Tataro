import { z } from 'zod';

export const depositorSchema = z.object({
  depositorName: z
    .string()
    .min(1, '입금자명을 입력해 주세요.')
    .max(6, '입금자명은 최대 6자까지 가능합니다.')
    .regex(/^[가-힣]+$/, '입금자명은 한글만 입력 가능합니다.'),
});

const paymentSchema = z.object({
  id: z.number(),
  payment_id: z.number(),
  product_id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  discount_price: z.string(),
  img_url: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  is_active: z.boolean(),
  purchase_date: z.string(),
  quantity: z.number(),
  payment_amount: z.number(),
  payment_method: z.enum(['bank_transfer']),
  payment_status: z.enum(['pending', 'completed', 'expired', 'canceled', 'mismatch']),
  admin_account: z.string(),
  admin_name: z.string(),
  admin_bank: z.string(),
  deadline: z.string(),
  depositor_name: z.string(),
  deposit_amount: z.number(),
  heart_count: z.number(),
});

const paginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  total_count: z.number(),
  total_pages: z.number(),
});

export const paymentDetailsSchema = paymentSchema.pick({
  product_id: true,
  payment_id: true,
  purchase_date: true,
  quantity: true,
  payment_amount: true,
  payment_method: true,
  payment_status: true,
});

export const paymentHistoryResponseSchema = paginationSchema.extend({
  payment_details: z.array(paymentDetailsSchema),
});

export const bankTransferRequestSchema = paymentSchema.pick({
  product_id: true,
  name: true,
});

export const depositInfoSchema = paymentSchema.pick({
  admin_account: true,
  admin_bank: true,
  admin_name: true,
  deadline: true,
  payment_id: true,
  depositor_name: true,
  deposit_amount: true,
  heart_count: true,
});

export const productListSchema = z.array(
  paymentSchema.pick({
    id: true,
    name: true,
    description: true,
    price: true,
    discount_price: true,
    img_url: true,
    created_at: true,
    updated_at: true,
    is_active: true,
  }),
);

export const transformedProductListSchema = z.array(
  paymentSchema
    .pick({
      product_id: true,
      heart_count: true,
    })
    .extend({ price: z.number() }),
);
