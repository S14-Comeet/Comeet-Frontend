import api from './axios';

/**
 * 가맹점 메뉴 목록 조회
 * @param {number} storeId - 가맹점 ID
 * @returns {Promise<Array>} 메뉴 목록
 */
export const getMenusByStoreId = async (storeId) => {
  const response = await api.get(`/stores/${storeId}/menus`);
  return response.data; // Assuming response.data is the array or wrapped in data
};
