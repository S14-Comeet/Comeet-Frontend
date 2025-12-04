/**
 * 애플리케이션 전역 설정
 * 환경 변수를 중앙에서 관리합니다.
 */

/**
 * API 설정
 */
export const api = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000, // 10초
}

/**
 * OAuth 설정
 */
export const oauth = {
  naver: {
    authUrl: `${api.baseURL}/oauth2/authorization/naver`,
    callbackUrl: '/oauth/callback',
  },
  kakao: {
    authUrl: `${api.baseURL}/oauth2/authorization/kakao`,
    callbackUrl: '/oauth/callback',
  },
  google: {
    authUrl: `${api.baseURL}/oauth2/authorization/google`,
    callbackUrl: '/oauth/callback',
  },
}

/**
 * 네이버 지도 설정
 */
export const map = {
  clientId: import.meta.env.VITE_NAVER_MAP_CLIENT_ID,
  defaultCenter: {
    lat: 37.5665,
    lng: 126.978,
  },
  defaultZoom: 15,
}

/**
 * 앱 설정
 */
export const app = {
  title: import.meta.env.VITE_APP_TITLE || 'Comeet',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  debug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
}

export default {
  api,
  oauth,
  map,
  app,
}
