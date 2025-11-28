/**
 * 인증 관련 API 호출 함수
 */
import api from './axios';
import { API_ENDPOINTS } from '@/constants';

/**
 * 사용자 정보 조회 (인증 필요)
 * @returns {Promise<Object>} 사용자 정보
 */
export const getUserInfo = async () => {
  const response = await api.get(API_ENDPOINTS.USER.INFO);
  return response.data.data; // BaseResponse<UserResDto>
};

/**
 * 닉네임 중복 확인
 * @param {string} nickname - 확인할 닉네임
 * @returns {Promise<boolean>} 중복 여부
 */
export const checkNickname = async (nickname) => {
  const response = await api.get(API_ENDPOINTS.AUTH.NICKNAME_CHECK, {
    params: { nickname }
  });
  return response.data.data;
};

/**
 * 로그아웃
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await api.post(API_ENDPOINTS.AUTH.LOGOUT);
};

/**
 * 토큰 재발급
 * @returns {Promise<void>}
 */
export const reissueToken = async () => {
  await api.post(API_ENDPOINTS.AUTH.REISSUE);
};

/**
 * Role 업데이트
 * @param {Object} roleData - 업데이트할 Role 정보
 * @returns {Promise<Object>}
 */
export const updateRole = async (roleData) => {
  const response = await api.patch(API_ENDPOINTS.AUTH.UPDATE_ROLE, roleData);
  return response.data.data;
};
