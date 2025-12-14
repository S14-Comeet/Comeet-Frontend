import {ref} from 'vue'
import {useToast} from 'vue-toastification'

// 에러 코드별 메시지 정의
const ERROR_MESSAGES = {
    PERMISSION_DENIED: '위치 권한을 허용하면 주변 카페를 추천받을 수 있어요',
    POSITION_UNAVAILABLE: '현재 위치 정보를 가져올 수 없습니다. 잠시 후 다시 시도해주세요',
    TIMEOUT: '위치 정보 요청 시간이 초과되었습니다. 다시 시도해주세요',
    NOT_SUPPORTED: '위치 서비스를 지원하지 않는 브라우저입니다',
    UNKNOWN: '위치 정보를 가져올 수 없습니다'
}

export function useGeolocation() {
    const location = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const toast = useToast()

    /**
     * 에러 코드에 따른 메시지 반환
     */
    const getErrorMessage = (err) => {
        if (!err || !err.code) return ERROR_MESSAGES.UNKNOWN

        switch (err.code) {
            case 1: // PERMISSION_DENIED
                return ERROR_MESSAGES.PERMISSION_DENIED
            case 2: // POSITION_UNAVAILABLE
                return ERROR_MESSAGES.POSITION_UNAVAILABLE
            case 3: // TIMEOUT
                return ERROR_MESSAGES.TIMEOUT
            default:
                return ERROR_MESSAGES.UNKNOWN
        }
    }

    /**
     * 위치 정보 요청
     * @param {Object} options - 추가 옵션
     * @param {boolean} options.showToast - 에러 토스트 표시 여부 (기본: true)
     * @param {number} options.timeout - 타임아웃 시간 (기본: 10000ms)
     * @param {number} options.maximumAge - 캐시된 위치 최대 나이 (기본: 60000ms)
     */
    const requestLocation = (options = {}) => {
        const { showToast = true, timeout = 10000, maximumAge = 60000 } = options

        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const errorMsg = ERROR_MESSAGES.NOT_SUPPORTED
                error.value = errorMsg
                if (showToast) toast.error(errorMsg)
                reject(new Error(errorMsg))
                return
            }

            isLoading.value = true
            error.value = null // 이전 에러 초기화

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    location.value = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy, // 정확도 추가
                        timestamp: position.timestamp
                    }
                    isLoading.value = false
                    error.value = null // 성공 시 에러 상태 초기화
                    resolve(location.value)
                },
                (err) => {
                    isLoading.value = false
                    const errorMsg = getErrorMessage(err)
                    error.value = errorMsg

                    // PERMISSION_DENIED는 warning, 나머지는 error
                    if (showToast) {
                        if (err.code === 1) {
                            toast.warning(errorMsg)
                        } else {
                            toast.error(errorMsg)
                        }
                    }
                    reject(err)
                },
                {
                    enableHighAccuracy: true,
                    timeout,
                    maximumAge // 캐시된 위치 사용 허용
                }
            )
        })
    }

    /**
     * 위치 정보 초기화
     */
    const clearLocation = () => {
        location.value = null
        error.value = null
    }

    return {
        location,
        isLoading,
        error,
        requestLocation,
        clearLocation
    }
}
