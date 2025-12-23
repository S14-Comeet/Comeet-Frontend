/**
 * Toast 알림 유틸리티
 *
 * 환경별 토스트 표시:
 * - 개발 환경: 모든 토스트 표시
 * - 프로덕션 환경: VITE_ENABLE_TOAST=true일 때만 표시 (기본값: 비활성화)
 */
import { useToast } from 'vue-toastification'

let toast = null

// 토스트 활성화 여부 (개발 환경에서는 항상 활성화)
const isToastEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_TOAST === 'true'

const getToast = () => {
  if (!toast) {
    toast = useToast()
  }
  return toast
}

/** 성공 메시지 */
export const showSuccess = (message) => {
  if (!isToastEnabled) return
  getToast().success(message)
}

/** 에러 메시지 */
export const showError = (message) => {
  if (!isToastEnabled) return
  getToast().error(message)
}

/** 경고 메시지 */
export const showWarning = (message) => {
  if (!isToastEnabled) return
  getToast().warning(message)
}

/** 정보 메시지 */
export const showInfo = (message) => {
  if (!isToastEnabled) return
  getToast().info(message)
}

/** API 에러 메시지 자동 처리 */
export const showApiError = (error, defaultMessage = '오류가 발생했습니다.') => {
  if (!isToastEnabled) return

  const status = error.response?.status
  const serverMessage = error.response?.data?.message || error.response?.data?.error?.message

  if (serverMessage) {
    getToast().error(serverMessage)
    return
  }

  const statusMessages = {
    400: '잘못된 요청입니다.',
    401: '로그인이 필요합니다.',
    403: '접근 권한이 없습니다.',
    404: '요청한 정보를 찾을 수 없습니다.',
    409: '이미 존재하는 정보입니다.',
    500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  }

  getToast().error(statusMessages[status] || defaultMessage)
}
