const LOG_LEVELS = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 }

const getCurrentLogLevel = () => {
  if (import.meta.env.VITE_ENABLE_DEBUG === 'true') return LOG_LEVELS.DEBUG
  if (import.meta.env.MODE === 'production') return LOG_LEVELS.WARN
  return LOG_LEVELS.INFO
}

const currentLevel = getCurrentLogLevel()
const formatLog = (module, message) => `[${module}] ${message}`

/** 에러 로그 (항상 출력) */
export const logError = (module, message, error = null) => {
  if (currentLevel >= LOG_LEVELS.ERROR) {
    error ? console.error(formatLog(module, message), error) : console.error(formatLog(module, message))
  }
}

/** 경고 로그 (Production에서도 출력) */
export const logWarn = (module, message, data = null) => {
  if (currentLevel >= LOG_LEVELS.WARN) {
    data ? console.warn(formatLog(module, message), data) : console.warn(formatLog(module, message))
  }
}

/** 정보 로그 (Development에서만) */
export const logInfo = (module, message, data = null) => {
  if (currentLevel >= LOG_LEVELS.INFO) {
    data ? console.log(formatLog(module, message), data) : console.log(formatLog(module, message))
  }
}

/** 디버그 로그 (Debug 모드에서만) */
export const logDebug = (module, message, data = null) => {
  if (currentLevel >= LOG_LEVELS.DEBUG) {
    data ? console.log(formatLog(module, `[DEBUG] ${message}`), data) : console.log(formatLog(module, `[DEBUG] ${message}`))
  }
}

/** 모듈별 로거 생성 */
export const createLogger = (moduleName) => ({
  error: (message, error = null) => logError(moduleName, message, error),
  warn: (message, data = null) => logWarn(moduleName, message, data),
  info: (message, data = null) => logInfo(moduleName, message, data),
  debug: (message, data = null) => logDebug(moduleName, message, data),
})
