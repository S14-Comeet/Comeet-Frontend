/**
 * Toast 알림 유틸리티
 * vue-toastification 래퍼 함수들
 */
import { useToast } from 'vue-toastification'

/** Toast 인스턴스 */
let toast = null

/**
 * Toast 인스턴스 가져오기 (지연 초기화)
 */
const getToast = () => {
  if (!toast) {
    toast = useToast()
  }
  return toast
}

/**
 * 성공 메시지
 * @param {string} message - 표시할 메시지
 */
export const showSuccess = (message) => {
  getToast().success(message)
}

/**
 * 에러 메시지
 * @param {string} message - 표시할 메시지
 */
export const showError = (message) => {
  getToast().error(message)
}

/**
 * 경고 메시지
 * @param {string} message - 표시할 메시지
 */
export const showWarning = (message) => {
  getToast().warning(message)
}

/**
 * 정보 메시지
 * @param {string} message - 표시할 메시지
 */
export const showInfo = (message) => {
  getToast().info(message)
}

/**
 * API 에러 메시지 처리
 * @param {Error} error - Axios 에러 객체
 * @param {string} defaultMessage - 기본 에러 메시지
 */
export const showApiError = (error, defaultMessage = '오류가 발생했습니다.') => {
  const status = error.response?.status
  const serverMessage = error.response?.data?.message || error.response?.data?.error?.message

  if (serverMessage) {
    getToast().error(serverMessage)
    return
  }

  // 상태 코드별 기본 메시지
  const statusMessages = {
    400: '잘못된 요청입니다.',
    401: '로그인이 필요합니다.',
    403: '접근 권한이 없습니다.',
    404: '요청한 정보를 찾을 수 없습니다.',
    409: '이미 존재하는 정보입니다.',
    500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  }

  const message = statusMessages[status] || defaultMessage
  getToast().error(message)
}

export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  apiError: showApiError,
}

