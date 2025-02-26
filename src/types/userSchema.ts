import { z } from 'zod';

import { profileFormSchema } from '@/components/myPage/profile/schemas';

const userSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  email: z.string().email().nullable(),
  social_type: z.enum(['KAKAO', 'NAVER']).nullable(),
  heart_count: z.number(),
  access_token: z.string(),
  refresh_token: z.string(),
  created: z.boolean(),
  message: z.string(),
});

export const userDataSchema = profileFormSchema.merge(
  userSchema.pick({
    id: true,
    email: true,
    social_type: true,
    heart_count: true,
  }),
);

export const loginResponseSchema = userSchema
  .pick({
    id: true,
    access_token: true,
    refresh_token: true,
    created: true,
    message: true,
    user_id: true,
  })
  .extend({
    user_data: z.object({ ...userDataSchema.shape }),
  });

export const userSessionSchema = profileFormSchema.merge(
  userSchema.pick({
    user_id: true,
  }),
);

export const getHeartResponseSchema = userSchema.pick({
  heart_count: true,
});

const paginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  total_count: z.number(),
  total_pages: z.number(),
});

export const usedHeartDetailsSchema = z.object({
  heart_count: z.number(),
  chat_room_id: z.number(),
  created_at: z.string(),
});

export const heartUsageHistorySchema = paginationSchema.extend({
  heart_used_logs: z.array(z.object({ ...usedHeartDetailsSchema.shape })),
});
