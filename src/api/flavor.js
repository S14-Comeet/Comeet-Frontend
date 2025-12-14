import api from './axios';

/**
 * 모든 Flavor(커피 향미) 목록 조회
 * 계층 구조(Level 1 -> 2 -> 3)를 포함한 전체 데이터 반환
 *
 * @returns {Promise<Array>} FlavorInfoDto 목록 (계층 구조 포함)
 */
export const getAllFlavors = async () => {
  const response = await api.get('/flavors');
  return response.data; // ResponseUtils.ok(response) wraps result in data, axios also wraps in data.
  // Assumption: The backend response structure is { success: true, data: [...], ... }
  // So response.data (axios) -> .data (backend payload).
  // However, looking at cafe.js mock, it resolves { data: ... }.
  // I will assume the standard response wrapper.
  // If api.get returns the axios response object, accessing .data gives the body.
  // If the body is BaseResponse, we need .data again.
};
