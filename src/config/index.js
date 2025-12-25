/**
 * 애플리케이션 설정
 * 환경 변수를 통합하여 관리합니다.
 */

const env = import.meta.env;

export const apiConfig = {
  baseURL: env.VITE_API_BASE_URL,
  wsURL: env.VITE_WS_BASE_URL,
  timeout: 10000,
  withCredentials: true
};

export const appConfig = {
  title: env.VITE_APP_TITLE || 'Comeet',
  version: env.VITE_APP_VERSION || '1.0.0',
  isDebug: env.VITE_ENABLE_DEBUG === 'true',
  isDevelopment: env.MODE === 'development',
  isProduction: env.MODE === 'production'
};

export default {
  api: apiConfig,
  app: appConfig
};
