import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { getLocationByIP } from '@/api/geolocation'
import { createLogger } from '@/utils/logger'

const logger = createLogger('useGeolocation')

// 에러 메시지 정의
const ERROR_MESSAGES = {
    API_KEY_MISSING: 'Naver API 키가 설정되지 않았습니다',
    IP_FETCH_FAILED: '공인 IP 주소를 가져올 수 없습니다',
    LOCATION_FAILED: 'IP 기반 위치 조회에 실패했습니다',
    UNKNOWN: '위치 정보를 가져올 수 없습니다'
}

export function useGeolocation() {
    const location = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const toast = useToast()

    /**
     * 위치 정보 요청 (Naver Geolocation API - IP 기반)
     * @param {Object} options - 추가 옵션
     * @param {boolean} options.showToast - 에러 토스트 표시 여부 (기본: true)
     */
    const requestLocation = async (options = {}) => {
        const { showToast = true } = options

        isLoading.value = true
        error.value = null

        try {
            logger.info('Requesting IP-based location from Naver Geolocation')

            const result = await getLocationByIP()

            location.value = result
            isLoading.value = false
            error.value = null

            logger.info('Location retrieved successfully', {
                lat: result.lat,
                lng: result.lng,
                region: `${result.r1} ${result.r2} ${result.r3}`
            })

            return result
        } catch (err) {
            isLoading.value = false
            const errorMsg = err.message || ERROR_MESSAGES.UNKNOWN
            error.value = errorMsg

            logger.error('Failed to get location', err)

            if (showToast) {
                toast.error(errorMsg)
            }

            throw err
        }
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
