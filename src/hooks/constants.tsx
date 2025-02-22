export const ERROR_MESSAGES = {
  NO_REFRESH_TOKEN: '로그인이 만료되었습니다.\n다시 로그인해 주세요.',
  GENERAL_ERROR: '오류가 발생하였습니다.\n잠시 후 다시 시도해 주세요.',
  LOGIN_FAILED: '로그인에 실패하였습니다.\n잠시 후 다시 시도해 주세요.',
  FETCH_USER_FAILED: '회원 정보를 가져오는 데 실패하였습니다.\n잠시 후 다시 시도해 주세요.',
  EDIT_PROFILE_FAILED: '회원 정보를 수정하는 데 실패하였습니다.\n잠시 후 다시 시도해 주세요.',
  DELETE_USER_FAILED: '회원 탈퇴를 실패하였습니다.\n잠시 후 다시 시도해 주세요.',
};

export const INFO_MESSAGES = {
  EDIT_PROFILE_SUCCEEDED: '회원 정보가 성공적으로 수정되었습니다!',
  DELETE_USER_SUCCEEDED: '회원 탈퇴가 완료되었습니다!',
};

export const REVIEW_MESSAGES = {
  CREATE: {
    SUCCESS: '리뷰가 성공적으로 등록되었습니다\n 잠시후 다시 시도해 주세요.',
    ERROR: '리뷰 등록에 실패했습니다\n 잠시후 다시 시도해 주세요.',
  },
  UPDATE: {
    SUCCESS: '리뷰가 성공적으로 수정되었습니다.',
    ERROR: '리뷰 수정에 실패했습니다\n 잠시후 다시 시도해 주세요.',
  },
  DELETE: {
    SUCCESS: '리뷰가 삭제되었습니다.',
    ERROR: '리뷰 삭제에 실패했습니다.\n 잠시후 다시 시도해 주세요.',
  },
};
