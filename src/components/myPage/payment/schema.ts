import { z } from 'zod';

export const depositorSchema = z.object({
  depositorName: z
    .string()
    .min(1, '입금자명을 입력해 주세요.')
    .max(6, '입금자명은 최대 6자까지 가능합니다.')
    .regex(/^[가-힣]+$/, '입금자명은 한글만 입력 가능합니다.'),
});
