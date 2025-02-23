import { OAuthProviderType } from '@root/next-auth';

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  ENDPOINTS: {
    USER: {
      BASE: '/user/',
      REDIRECT: (OAuthProvider: OAuthProviderType) => `/user/auth/${OAuthProvider}/`,
      LOGIN: (OAuthProvider: OAuthProviderType, code: string) =>
        `/user/auth/${OAuthProvider}/callback/?code=${code}`,
      REISSUE: (OAuthProvider: OAuthProviderType) => `/user/auth/${OAuthProvider}/reissue/`,
    },
    TAROT: {
      INIT: '/tarot/init/',
      REINIT: (roomId: string) => `/tarot/init/${roomId}/`,
      CONSULT: (roomId: string) => `/tarot/${roomId}/`,
      RECENT_TAROT: `/tarot/logs/first/`,
      TAROT_LOGS: (roomId: string) => `/tarot/logs/${roomId}/`,
      PREVIOUS_TAROT: (roomId: string) => `/tarot/logs/${roomId}/before`,
      ALL_TAROT: `/tarot/logs/`,
    },
    REVIEW: {
      ALL_REVIEW: `/review/`,
      CREATE_REVIEW: `/review/`,
      REVIEW_DETAIL: (reviewId: number) => `/review/${reviewId}/`,
      UPDATE_REVIEW: (reviewId: number) => `/review/${reviewId}/`,
      DELETE_REVIEW: (reviewId: number) => `/review/${reviewId}/`,
    },
    NOTICE: {
      ALL_NOTICE: '/notice/',
      NOTICE_DETAIL: (noticeId: string) => `/notice/${noticeId}`,
    },
    FAQ: {},
  },
};
