/**
 * 로컬 스토리지 안전 접근 유틸리티
 * 브라우저 제한(iframe, 시크릿 모드 등)에서도 안전하게 동작
 */

import { STORAGE_KEYS } from '@/constants'

/** 메모리 폴백 스토리지 */
const memoryStorage = new Map()

/** 스토리지 접근 가능 여부 캐시 */
let storageAvailable = null

/**
 * Storage 접근 가능 여부 확인
 */
const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * 스토리지 가용성 확인 (캐시 사용)
 */
const checkStorageAvailable = () => {
  if (storageAvailable === null) {
    storageAvailable = isStorageAvailable()
  }
  return storageAvailable
}

/**
 * 로컬 스토리지에서 값 가져오기
 * @param {string} key - 스토리지 키
 * @returns {string|null}
 */
export const getItem = (key) => {
  try {
    if (!checkStorageAvailable()) {
      return memoryStorage.get(key) || null
    }
    return localStorage.getItem(key)
  } catch {
    return memoryStorage.get(key) || null
  }
}

/**
 * 로컬 스토리지에 값 저장
 * @param {string} key - 스토리지 키
 * @param {string} value - 저장할 값
 * @returns {boolean} 저장 성공 여부
 */
export const setItem = (key, value) => {
  try {
    if (!checkStorageAvailable()) {
      memoryStorage.set(key, value)
      return true
    }
    localStorage.setItem(key, value)
    return true
  } catch {
    memoryStorage.set(key, value)
    return true
  }
}

/**
 * 로컬 스토리지에서 값 삭제
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
    memoryStorage.delete(key)
    return true
  } catch {
    memoryStorage.delete(key)
    return true
  }
}

/**
 * 액세스 토큰 가져오기
 */
export const getAccessToken = () => getItem(STORAGE_KEYS.ACCESS_TOKEN)

/**
 * 액세스 토큰 저장
 */
export const setAccessToken = (token) => setItem(STORAGE_KEYS.ACCESS_TOKEN, token)

/**
 * 액세스 토큰 삭제
 */
export const removeAccessToken = () => removeItem(STORAGE_KEYS.ACCESS_TOKEN)

/**
 * Pinia persist용 안전한 스토리지 어댑터
 */
export const safeStorage = {
  getItem: (key) => {
    try {
      if (!checkStorageAvailable()) {
        return memoryStorage.get(key) || null
      }
      return localStorage.getItem(key)
    } catch {
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
    } catch {
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
    } catch {
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
