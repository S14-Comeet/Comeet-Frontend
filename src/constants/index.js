/**
 * 애플리케이션 전역 상수
 * 변하지 않는 정적인 값들을 관리합니다.
 */

// 애플리케이션 상수
export const APP_CONSTANTS = {
  NAME: 'Comeet',
  DESCRIPTION: 'Comeet 프로젝트',
  DEFAULT_LOCALE: 'ko',
  SUPPORTED_LOCALES: ['ko', 'en']
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_INFO: 'comeet_user_info',
  THEME: 'comeet_theme',
  LANGUAGE: 'comeet_language'
};

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  NICKNAME: '/nickname',
  OAUTH_CALLBACK: '/oauth/callback',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings'
};

// API 엔드포인트
export const API_ENDPOINTS = {
  // OAuth2 인증
  OAUTH2: {
    NAVER: '/oauth2/authorization/naver',
    KAKAO: '/oauth2/authorization/kakao',
    GOOGLE: '/oauth2/authorization/google'
  },
  // 인증 관련
  AUTH: {
    LOGOUT: '/auth/logout',
    REISSUE: '/auth/reissue',
  },
  // 사용자 정보
  USER: {
    INFO: '/user',
    NICKNAME_CHECK: '/user/nickname/check',
    REGISTER: '/user/register'
  },
  // 알림
  NOTIFICATION: {
    LIST: '/api/notifications',
    READ: '/api/notifications/:id/read',
    READ_ALL: '/api/notifications/read-all',
    DELETE: '/api/notifications/:id',
    DELETE_ALL: '/api/notifications/delete-all'
  }
};

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// 메시지 타입
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// 유효성 검사 규칙
export const VALIDATION = {
  NICKNAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 12,
    // 한글(가-힣), 영문(a-z, A-Z)만 허용, 공백 불가
    PATTERN: /^[가-힣a-zA-Z]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 20,
    PATTERN: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

// 기본 설정값
export const DEFAULTS = {
  PAGE_SIZE: 20,
  TIMEOUT: 10000, // 10초
  DEBOUNCE_DELAY: 300, // 300ms
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif']
};
