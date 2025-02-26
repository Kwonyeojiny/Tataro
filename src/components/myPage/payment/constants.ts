export const PAYMENT_STATUS = {
  pending: '입금대기중',
  completed: '입금완료',
  canceled: '결제취소',
  expired: '만료',
  mismatch: '오류',
} as const;

export const PAYMENT_METHOD = {
  bank_transfer: '무통장 입금',
} as const;

export const PER_PAGE = 5;
