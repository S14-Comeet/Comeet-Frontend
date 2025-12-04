/**
 * 로컬 스토리지 안전 접근 유틸리티
 *
 * 브라우저 제한(iframe, 시크릿 모드 등)으로 인해
 * storage 접근이 차단될 수 있는 상황을 안전하게 처리합니다.
 */

import { STORAGE_KEYS } from '@/constants'

// 메모리 폴백 스토리지 (localStorage 접근 불가 시 사용)
const memoryStorage = new Map()

/**
 * Storage 접근 가능 여부 확인
 * @returns {boolean}
 */
const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    console.warn('[Storage] localStorage 접근 불가:', e.message)
    return false
  }
}

// 스토리지 접근 가능 여부 캐시
let storageAvailable = null
const checkStorageAvailable = () => {
  if (storageAvailable === null) {
    storageAvailable = isStorageAvailable()
  }
  return storageAvailable
}

/**
 * 로컬 스토리지에서 값 가져오기 (안전)
 * @param {string} key - 스토리지 키
 * @returns {string|null}
 */
export const getItem = (key) => {
  try {
    if (!checkStorageAvailable()) {
      console.log('[Storage] 메모리 폴백 사용 (getItem):', key)
      return memoryStorage.get(key) || null
    }
    return localStorage.getItem(key)
  } catch (e) {
    console.warn('[Storage] localStorage 접근이 차단되었습니다:', e.message)
    return memoryStorage.get(key) || null
  }
}

/**
 * 로컬 스토리지에 값 저장 (안전)
 * @param {string} key - 스토리지 키
 * @param {string} value - 저장할 값
 * @returns {boolean} 저장 성공 여부
 */
export const setItem = (key, value) => {
  try {
    if (!checkStorageAvailable()) {
      console.log('[Storage] 메모리 폴백 사용 (setItem):', key)
      memoryStorage.set(key, value)
      return true
    }
    localStorage.setItem(key, value)
    console.log('[Storage] 저장 성공:', key)
    return true
  } catch (e) {
    console.warn('[Storage] localStorage 저장 실패, 메모리 폴백 사용:', e.message)
    memoryStorage.set(key, value)
    return true // 메모리에 저장했으므로 true 반환
  }
}

/**
 * 로컬 스토리지에서 값 삭제 (안전)
 * @param {string} key - 스토리지 키
 * @returns {boolean} 삭제 성공 여부
 */
export const removeItem = (key) => {
  try {
    if (!checkStorageAvailable()) {
      memoryStorage.delete(key)
      return true
    }
    localStorage.removeItem(key)
    memoryStorage.delete(key) // 메모리에서도 삭제
    return true
  } catch (e) {
    console.warn('[Storage] localStorage 삭제가 차단되었습니다:', e.message)
    memoryStorage.delete(key)
    return true
  }
}

/**
 * 액세스 토큰 가져오기
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * 액세스 토큰 저장
 * @param {string} token
 * @returns {boolean}
 */
export const setAccessToken = (token) => {
  return setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
}

/**
 * 액세스 토큰 삭제
 * @returns {boolean}
 */
export const removeAccessToken = () => {
  return removeItem(STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * Pinia persist용 안전한 스토리지 어댑터
 * pinia-plugin-persistedstate에서 사용
 */
export const safeStorage = {
  getItem: (key) => {
    try {
      if (!checkStorageAvailable()) {
        return memoryStorage.get(key) || null
      }
      return localStorage.getItem(key)
    } catch (e) {
      console.warn('[Storage] persist 읽기 실패:', e.message)
      return memoryStorage.get(key) || null
    }
  },
  setItem: (key, value) => {
    try {
      if (!checkStorageAvailable()) {
        memoryStorage.set(key, value)
        return
      }
      localStorage.setItem(key, value)
    } catch (e) {
      console.warn('[Storage] persist 저장 실패, 메모리 폴백 사용:', e.message)
      memoryStorage.set(key, value)
    }
  },
  removeItem: (key) => {
    try {
      if (!checkStorageAvailable()) {
        memoryStorage.delete(key)
        return
      }
      localStorage.removeItem(key)
      memoryStorage.delete(key)
    } catch (e) {
      console.warn('[Storage] persist 삭제 실패:', e.message)
      memoryStorage.delete(key)
    }
  }
}

export default {
  isStorageAvailable,
  getItem,
  setItem,
  removeItem,
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  safeStorage
}

