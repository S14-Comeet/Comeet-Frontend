import api from './axios';

/**
 * 가맹점 메뉴 목록 조회
 * @param {number} storeId - 가맹점 ID
 * @param {Object} params - 페이지네이션 파라미터
 * @param {number} params.page - 페이지 번호 (기본값: 1)
 * @param {number} params.size - 페이지 크기 (기본값: 10)
 * @returns {Promise<Object>} 메뉴 목록 및 페이지 정보
 */
export const getMenusByStoreId = async (storeId, { page = 1, size = 10 } = {}) => {
  const response = await api.get(`/stores/${storeId}/menus`, {
    params: { page, size }
  });
  return response.data;
};

/**
 * 메뉴 상세 조회 (원두 정보 포함)
 * @param {number} menuId - 메뉴 ID
 * @returns {Promise<Object>} 메뉴 상세 정보
 */
export const getMenuById = async (menuId) => {
  const response = await api.get(`/menus/${menuId}`);
  return response.data;
};
