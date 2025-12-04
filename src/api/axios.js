import axios from 'axios';
import config from '@/config';
import { getAccessToken, setAccessToken, removeAccessToken } from '@/utils/storage';
import { createLogger } from '@/utils/logger';
import { showApiError, showWarning } from '@/utils/toast';

const logger = createLogger('API');

const api = axios.create({
  baseURL: config.api.baseURL,
  withCredentials: true, // 쿠키 전송 필수 (JWT 토큰용)
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터 - 액세스 토큰 자동 주입
api.interceptors.request.use(
  (requestConfig) => {
    // 안전한 스토리지 접근으로 액세스 토큰 가져오기
    const accessToken = getAccessToken();

    // 토큰이 있으면 Authorization 헤더에 추가
    if (accessToken) {
      requestConfig.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 요청 로깅 (DEBUG 레벨)
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

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * 재발급 중일 때 요청을 큐에 추가하고 대기
 */
const waitForTokenRefresh = (originalRequest) => {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  }).then(token => {
    originalRequest.headers.Authorization = `Bearer ${token}`;
    return api.request(originalRequest);
  });
};

/**
 * 토큰 재발급 처리
 */
const handleTokenReissue = async (originalRequest) => {
  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const response = await api.post('/api/auth/reissue');
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

    // Toast 알림: 세션 만료
    showWarning('로그인이 만료되었습니다. 다시 로그인해주세요.');

    import('@/store/auth').then(({ useAuthStore }) => {
      const authStore = useAuthStore();
      authStore.clearUser();
    });

    globalThis.location.href = '/login';
    throw reissueError;
  } finally {
    isRefreshing = false;
  }
};

// 응답 인터셉터 - 401 에러 처리 및 토큰 재발급
api.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers['authorization'];
    if (newAccessToken) {
      const token = newAccessToken.replace('Bearer ', '');
      setAccessToken(token);
      logger.debug('토큰 갱신됨 (응답 헤더)');
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRetryable = !originalRequest._retry;

    // API 에러 로깅 (INFO 레벨)
    if (error.response) {
      logger.info(`응답 에러: ${error.response.status} ${originalRequest?.url}`);
    }

    // 401이 아닌 에러는 Toast로 표시 (400, 500 등)
    if (!isUnauthorized && error.response?.status >= 400) {
      // reissue 요청이 아닌 경우에만 Toast 표시
      if (!originalRequest?.url?.includes('/reissue')) {
        showApiError(error);
      }
    }

    if (!isUnauthorized || !isRetryable) {
      throw error;
    }

    if (isRefreshing) {
      return waitForTokenRefresh(originalRequest);
    }

    return handleTokenReissue(originalRequest);
  }
);

export default api;
