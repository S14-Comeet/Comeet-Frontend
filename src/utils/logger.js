/**
 * 전역 로깅 유틸리티
 * 환경변수 기반 로깅 레벨 제어
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
}

/**
 * 현재 로깅 레벨 결정
 * - Production: ERROR, WARN만
 * - Development: INFO까지
 * - Debug 모드: DEBUG까지
 */
const getCurrentLogLevel = () => {
  if (import.meta.env.VITE_ENABLE_DEBUG === 'true') {
    return LOG_LEVELS.DEBUG
  }
  if (import.meta.env.MODE === 'production') {
    return LOG_LEVELS.WARN
  }
  return LOG_LEVELS.INFO
}

const currentLevel = getCurrentLogLevel()

/**
 * 로그 포맷팅
 * @param {string} module - 모듈명
 * @param {string} message - 메시지
 */
const formatLog = (module, message) => `[${module}] ${message}`

/**
 * 에러 로그 (항상 출력)
 */
export const logError = (module, message, error = null) => {
  if (currentLevel >= LOG_LEVELS.ERROR) {
    if (error) {
      console.error(formatLog(module, message), error)
    } else {
      console.error(formatLog(module, message))
    }
  }
}

/**
 * 경고 로그 (Production에서도 출력)
 */
export const logWarn = (module, message, data = null) => {
  if (currentLevel >= LOG_LEVELS.WARN) {
    if (data) {
      console.warn(formatLog(module, message), data)
    } else {
      console.warn(formatLog(module, message))
    }
  }
}

/**
 * 정보 로그 (Development에서만)
 */
export const logInfo = (module, message, data = null) => {
  if (currentLevel >= LOG_LEVELS.INFO) {
    if (data) {
      console.log(formatLog(module, message), data)
    } else {
      console.log(formatLog(module, message))
    }
  }
}

/**
 * 디버그 로그 (Debug 모드에서만)
 */
export const logDebug = (module, message, data = null) => {
  if (currentLevel >= LOG_LEVELS.DEBUG) {
    if (data) {
      console.log(formatLog(module, `[DEBUG] ${message}`), data)
    } else {
      console.log(formatLog(module, `[DEBUG] ${message}`))
    }
  }
}

/**
 * 모듈별 로거 생성
 * @param {string} moduleName - 모듈명
 */
export const createLogger = (moduleName) => ({
  error: (message, error = null) => logError(moduleName, message, error),
  warn: (message, data = null) => logWarn(moduleName, message, data),
  info: (message, data = null) => logInfo(moduleName, message, data),
  debug: (message, data = null) => logDebug(moduleName, message, data),
})

export default {
  error: logError,
  warn: logWarn,
  info: logInfo,
  debug: logDebug,
  createLogger,
}

