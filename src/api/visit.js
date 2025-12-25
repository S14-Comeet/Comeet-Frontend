
import api from './axios';

/**
 * 방문 인증 요청
 * @param {Object} data
 * @param {number} data.menuId
 * @param {Object} data.storeLocationDto { latitude, longitude }
 * @param {Object} data.userLocationDto { latitude, longitude }
 * @returns {Promise<Object>} { visitId, isVerified }
 */
export const verifyVisit = async (data) => {
  const response = await api.post('/visit/verify', data);
  return response.data;
};

/**
 * 방문 인증 내역 조회
 * @param {Object} params - { page, size }
 */
export const getVisitHistory = async (params) => {
  const response = await api.get('/visit/history', { params });
  return response.data;
};

/**
 * 방문 인증 상세 조회
 * @param {number} visitId
 */
export const getVisitById = async (visitId) => {
  const response = await api.get(`/visit/${visitId}`);
  return response.data;
};
