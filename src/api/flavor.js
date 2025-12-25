import api from './axios';

/**
 * 모든 Flavor(커피 향미) 목록 조회
 * 계층 구조(Level 1 -> 2 -> 3)를 포함한 전체 데이터 반환
 *
 * @returns {Promise<Array>} FlavorInfoDto 목록 (계층 구조 포함)
 */
export const getAllFlavors = async () => {
  const response = await api.get('/flavors');
  return response.data;
};
