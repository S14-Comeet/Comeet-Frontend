import {ref} from 'vue'
import {useToast} from 'vue-toastification'

export function useGeolocation() {
    const location = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const toast = useToast()

    const requestLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const errorMsg = '위치 서비스를 지원하지 않는 브라우저입니다'
                error.value = errorMsg
                toast.error(errorMsg)
                reject(new Error(errorMsg))
                return
            }

            isLoading.value = true

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    location.value = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }
                    isLoading.value = false
                    resolve(location.value)
                },
                (err) => {
                    isLoading.value = false
                    let errorMsg = '위치 정보를 가져올 수 없습니다'

                    if (err.code === err.PERMISSION_DENIED) {
                        errorMsg = '위치 권한을 허용하면 주변 카페를 추천받을 수 있어요'
                    }

                    error.value = errorMsg
                    toast.warning(errorMsg)
                    reject(err)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                }
            )
        })
    }

    return {
        location,
        isLoading,
        error,
        requestLocation,
    }
}
