import axios from 'axios';
import config from '@/config';
import { getAccessToken, setAccessToken, removeAccessToken } from '@/utils/storage';
import { createLogger } from '@/utils/logger';
import { showApiError, showWarning } from '@/utils/toast';

const logger = createLogger('API');

const api = axios.create({
  baseURL: config.api.baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000
});

api.interceptors.request.use(
  (requestConfig) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      requestConfig.headers.Authorization = `Bearer ${accessToken}`;
    }
    logger.debug(`${requestConfig.method?.toUpperCase()} ${requestConfig.url}`);
    return requestConfig;
  },
  (error) => {
    logger.error('요청 인터셉터 에러', error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];
const MAX_QUEUE_SIZE = 10;

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

/** 재발급 중일 때 요청을 큐에 추가하고 대기 */
const waitForTokenRefresh = (originalRequest) => {

  if (failedQueue.length >= MAX_QUEUE_SIZE) {
    logger.warn('토큰 재발급 대기 큐 초과');
    return Promise.reject(new Error('Too many pending requests'));
  }

  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  }).then(token => {
    originalRequest.headers.Authorization = `Bearer ${token}`;
    return api.request(originalRequest);
  });
};

/** 토큰 재발급 처리 */
const handleTokenReissue = async (originalRequest) => {
  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const response = await api.post('/auth/reissue');
    const newAccessToken = response.headers['authorization'];

    if (!newAccessToken) {
      throw new Error('재발급 응답에 토큰이 없습니다.');
    }

    const token = newAccessToken.replace('Bearer ', '');
    setAccessToken(token);
    originalRequest.headers.Authorization = `Bearer ${token}`;
    processQueue(null, token);
    logger.info('토큰 재발급 성공');

    return api.request(originalRequest);
  } catch (reissueError) {
    logger.warn('토큰 재발급 실패', reissueError.message);
    processQueue(reissueError, null);
    removeAccessToken();
    showWarning('로그인이 만료되었습니다. 다시 로그인해주세요.');

    import('@/store/auth').then(({ useAuthStore }) => {
      useAuthStore().clearUser();
    });

    globalThis.location.href = '/login';
    throw reissueError;
  } finally {
    isRefreshing = false;
  }
};

api.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers['authorization'];
    if (newAccessToken) {
      setAccessToken(newAccessToken.replace('Bearer ', ''));
      logger.debug('토큰 갱신됨 (응답 헤더)');
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      const isNetworkError = error.message?.includes('Network Error');

      if (isTimeout) {
        logger.warn('요청 타임아웃:', originalRequest?.url);
        showWarning('서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
      } else if (isNetworkError) {
        logger.warn('네트워크 에러:', originalRequest?.url);
        showWarning('네트워크 연결을 확인해주세요.');
      } else {
        logger.error('알 수 없는 요청 에러:', error.message);
      }
      throw error;
    }

    const isUnauthorized = error.response.status === 401;
    const isRetryable = !originalRequest._retry;

    logger.info(`응답 에러: ${error.response.status} ${originalRequest?.url}`);

    if (!isUnauthorized && error.response.status >= 400) {
      const isSilent = originalRequest?.url?.includes('/reissue') ||
        (originalRequest?.url?.includes('/cupping-note') && error.response.status === 404)

      if (!isSilent) {
        showApiError(error);
      }
    }

    if (!isUnauthorized || !isRetryable) {
      throw error;
    }

    const currentToken = getAccessToken();
    if (!currentToken) {
      logger.debug('토큰 없음 - 재발급 시도 생략');
      throw error;
    }

    const skipReissueUrls = ['/logout', '/reissue'];
    if (skipReissueUrls.some(url => originalRequest?.url?.includes(url))) {
      logger.debug('재발급 스킵 대상 URL - 재발급 시도 생략');
      throw error;
    }

    if (isRefreshing) {
      return waitForTokenRefresh(originalRequest);
    }

    return handleTokenReissue(originalRequest);
  }
);

export default api;
