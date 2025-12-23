import api from './axios'
import { createLogger } from '@/utils/logger'

const logger = createLogger('API:Preference')

/**
 * 사용자 취향 초기화 (기본값으로 생성)
 */
export const initPreference = async () => {
  logger.info('Initializing user preference')
  const response = await api.post('/preferences/init')
  return response.data
}

/**
 * 사용자 취향 조회
 */
export const getPreference = async () => {
  logger.info('Fetching user preference')
  const response = await api.get('/preferences')
  return response.data
}

/**
 * 사용자 취향 업데이트
 * @param {Object} preferenceData - 취향 데이터
 * @param {number} preferenceData.prefAcidity - 산미 선호도 (1-10)
 * @param {number} preferenceData.prefBody - 바디감 선호도 (1-10)
 * @param {number} preferenceData.prefSweetness - 단맛 선호도 (1-10)
 * @param {number} preferenceData.prefBitterness - 쓴맛 선호도 (1-10)
 * @param {string[]} preferenceData.preferredRoastLevels - 선호 로스팅 레벨
 * @param {string[]} preferenceData.likedTags - 선호 플레이버 태그 코드
 * @param {string[]} preferenceData.dislikedTags - 비선호 플레이버 태그 코드
 */
export const updatePreference = async (preferenceData) => {
  logger.info('Updating user preference', preferenceData)
  const response = await api.put('/preferences', preferenceData)
  return response.data
}

/**
 * 사용자 취향 삭제
 */
export const deletePreference = async () => {
  logger.info('Deleting user preference')
  const response = await api.delete('/preferences')
  return response.data
}

/**
 * 사용자 취향 존재 여부 확인
 * @returns {Promise<boolean>}
 */
export const checkPreferenceExists = async () => {
  try {
    await getPreference()
    return true
  } catch (error) {
    if (error.response?.status === 404) {
      return false
    }
    throw error
  }
}
