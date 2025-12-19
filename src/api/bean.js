import api from './axios'

/**
 * 원두 상세 조회
 * @param {number} beanId - 원두 ID
 * @returns {Promise<Object>} 원두 상세 정보 (향미, 원산지 등)
 */
export const getBeanById = async (beanId) => {
  const response = await api.get(`/beans/${beanId}`)
  return response.data
}
