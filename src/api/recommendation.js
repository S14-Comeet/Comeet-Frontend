import api from './axios'
import { createLogger } from '@/utils/logger'

const logger = createLogger('RecommendationAPI')

/**
 * 원두 추천 Top 5 조회
 * @returns {Promise<Array>} 추천 원두 목록
 */
export const getBeanRecommendations = async () => {
  try {
    const response = await api.get('/recommendations/beans')
    return response.data?.data || response.data || []
  } catch (error) {
    logger.error('원두 추천 조회 실패', error)
    throw error
  }
}

/**
 * 메뉴 추천 Top 5 조회 (전역)
 * @returns {Promise<Array>} 추천 메뉴 목록
 */
export const getMenuRecommendations = async () => {
  try {
    const response = await api.get('/recommendations/menus')
    return response.data?.data || response.data || []
  } catch (error) {
    logger.error('메뉴 추천 조회 실패', error)
    throw error
  }
}

/**
 * 메뉴 추천 조회 (근거리, 반경 자동 확장)
 * @param {number} latitude - 사용자 위도
 * @param {number} longitude - 사용자 경도
 * @param {number} radiusKm - 검색 반경 (km), 기본값 5
 * @returns {Promise<Object>} { recommendations, requestedRadiusKm, actualRadiusKm, radiusExpanded }
 */
export const getNearbyMenuRecommendations = async (latitude, longitude, radiusKm = 5) => {
  try {
    const response = await api.get('/recommendations/menus/nearby', {
      params: { latitude, longitude, radiusKm }
    })
    const data = response.data?.data || response.data || {}
    return data
  } catch (error) {
    logger.error('근거리 메뉴 추천 조회 실패', error)
    throw error
  }
}

/**
 * 특정 원두를 사용하는 메뉴 조회 (전역)
 * @param {number} beanId - 원두 ID
 * @returns {Promise<Array>} 메뉴 목록
 */
export const getMenusByBean = async (beanId) => {
  try {
    const response = await api.get(`/recommendations/beans/${beanId}/menus`)
    return response.data?.data || response.data || []
  } catch (error) {
    logger.error(`원두(${beanId}) 메뉴 조회 실패`, error)
    throw error
  }
}

/**
 * 특정 원두를 사용하는 메뉴 조회 (근거리)
 * @param {number} beanId - 원두 ID
 * @param {number} latitude - 사용자 위도
 * @param {number} longitude - 사용자 경도
 * @param {number} radiusKm - 검색 반경 (km), 기본값 5
 * @returns {Promise<Array>} 메뉴 목록
 */
export const getNearbyMenusByBean = async (beanId, latitude, longitude, radiusKm = 5) => {
  try {
    const response = await api.get(`/recommendations/beans/${beanId}/menus/nearby`, {
      params: { latitude, longitude, radiusKm }
    })
    return response.data?.data || response.data || []
  } catch (error) {
    logger.error(`원두(${beanId}) 근거리 메뉴 조회 실패`, error)
    throw error
  }
}

/**
 * 로스팅 레벨 한글 변환
 * @param {string} level - LIGHT, MEDIUM, HEAVY
 * @returns {string}
 */
export const formatRoastingLevel = (level) => {
  const labels = {
    LIGHT: '라이트',
    MEDIUM: '미디엄',
    HEAVY: '다크'
  }
  return labels[level] || level
}

/**
 * 거리 포맷팅
 * @param {number|null} distanceKm - 거리 (km)
 * @returns {string}
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined) {
    return ''
  }
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  }
  return `${distanceKm.toFixed(1)}km`
}

/**
 * 가격 포맷팅
 * @param {number} price - 가격 (원)
 * @returns {string}
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return ''
  return new Intl.NumberFormat('ko-KR').format(price) + '원'
}

/**
 * 배경색에 따른 대비 텍스트 색상 결정
 * @param {string} hexColor - Hex 색상 코드 (예: "#FF5733")
 * @returns {string} "#000000" 또는 "#FFFFFF"
 */
export const getContrastColor = (hexColor) => {
  if (!hexColor) return '#000000'
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
