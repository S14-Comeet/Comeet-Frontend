import api from './axios'
import { createLogger } from '@/utils/logger'

const logger = createLogger('CafeAPI')

/**
 * 위치 기반 가맹점 목록 조회 (실제 API)
 * @param {Object} params
 * @param {number} params.latitude - 중심 위도 (required)
 * @param {number} params.longitude - 중심 경도 (required)
 * @param {number} params.radius - 검색 반경 (기본 1000m)
 * @param {string} params.categories - 카테고리 필터 (콤마 구분)
 * @param {string} params.keyword - 검색 키워드
 * @returns {Promise<Object>} { totalCount, stores }
 */
export const getStoresByLocation = async (params) => {
  const response = await api.get('/stores', { params })
  return response.data
}

/**
 * 가맹점 상세 조회 (실제 API)
 * @param {string|number} storeId - 가맹점 ID
 * @returns {Promise<Object>} Store details
 */
export const getStoreById = async (storeId) => {
  const response = await api.get(`/stores/${storeId}`)
  return response.data
}

/**
 * 가맹점 리뷰 목록 조회 (실제 API)
 * @param {string|number} storeId - 가맹점 ID
 * @param {Object} params - 페이지네이션 등 추가 파라미터
 * @returns {Promise<Object>} { reviews, totalCount, ... }
 */
export const getStoreReviews = async (storeId, params = {}) => {
  try {
    const response = await api.get(`/stores/${storeId}/reviews`, { params })
    return response.data
  } catch {
    // API가 아직 구현되지 않은 경우 빈 배열 반환
    logger.warn('Store reviews API not available, returning empty')
    return []
  }
}
