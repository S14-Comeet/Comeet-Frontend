
import axios from 'axios';
import config from '@/config';
import { getAccessToken, setAccessToken, removeAccessToken } from '@/utils/storage';

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

    // 디버그 모드일 때 요청 로깅
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log('[API 요청]', requestConfig.method?.toUpperCase(), requestConfig.url);
      if (accessToken) {
        console.log('[인증] 액세스 토큰 포함:', accessToken.substring(0, 20) + '...');
      }
    }
    return requestConfig;
  },
  (error) => {
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

    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log('[인증] 토큰 재발급 성공');
    }

    return api.request(originalRequest);
  } catch (reissueError) {
    console.warn('[인증] 토큰 재발급 실패:', reissueError.message);
    processQueue(reissueError, null);
    removeAccessToken();

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

      if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
        console.log('[인증] 액세스 토큰이 응답 헤더에서 갱신되었습니다.');
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isRetryable = !originalRequest._retry;

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
