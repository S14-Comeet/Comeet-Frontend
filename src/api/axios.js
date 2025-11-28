/**
 * Axios 인스턴스 설정
 * Spring 백엔드와 통신하기 위한 설정
 */
import axios from 'axios';
import config from '@/config';

const api = axios.create({
  baseURL: config.api.baseURL,
  withCredentials: true, // 쿠키 전송 필수 (JWT 토큰용)
  headers: {
    'Content-Type': 'application/json'
  }
});

// 요청 인터셉터 (필요시 토큰 추가 등)
api.interceptors.request.use(
  (config) => {
    // 디버그 모드일 때 요청 로깅
    if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리 등)
api.interceptors.response.use(
  (response) => {
    // 성공 응답
    return response;
  },
  async (error) => {
    // 401 Unauthorized - 토큰 만료 시 재발급 시도
    if (error.response?.status === 401) {
      try {
        // 토큰 재발급 시도
        await api.post('/api/auth/reissue');
        // 원래 요청 재시도
        return api.request(error.config);
      } catch (reissueError) {
        // 재발급 실패 시 로그인 페이지로 이동
        window.location.href = '/login';
        return Promise.reject(reissueError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
