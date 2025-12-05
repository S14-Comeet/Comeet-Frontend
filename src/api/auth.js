/**
 * 인증 관련 API 호출 함수
 */
import api from '@/api/axios';
import { API_ENDPOINTS } from '@/constants';

/**
 * 사용자 정보 조회 (인증 필요)
 * GET /user
 * @returns {Promise<Object>} 사용자 정보
 */
export const getUserInfo = async () => {
  const response = await api.get(API_ENDPOINTS.USER.INFO);
  return response.data.data;
};

/**
 * 닉네임 중복 확인
 * GET /user/nickname/check?nickname={nickname}
 * @param {string} nickname - 확인할 닉네임
 * @returns {Promise<boolean>} 사용 가능 여부 (true: 사용 가능, false: 중복)
 */
export const checkNickname = async (nickname) => {
  const response = await api.get(API_ENDPOINTS.USER.NICKNAME_CHECK, {
    params: { nickname }
  });
  return !response.data.data.exists;
};

/**
 * 사용자 서비스 등록 (닉네임 + 역할 설정)
 * POST /user/register
 * @param {Object} userData - 사용자 정보
 * @param {string} userData.nickname - 닉네임 (1~12자, 한글/영문만 허용)
 * @param {string} userData.role - 역할 ('USER' | 'OWNER')
 * @returns {Promise<Object>} 등록된 사용자 정보
 */
export const registerUser = async (userData) => {
  const response = await api.post(API_ENDPOINTS.USER.REGISTER, userData);
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

