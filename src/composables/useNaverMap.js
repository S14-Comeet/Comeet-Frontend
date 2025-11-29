import {ref} from 'vue'

export function useNaverMap() {
    const map = ref(null)
    const markers = ref([])

    /**
     * 네이버 지도 초기화
     */
    const initMap = (container, options = {}) => {
        return new Promise((resolve, reject) => {
            if (!globalThis.naver?.maps) {
                reject(new Error('Naver Maps API가 로드되지 않았습니다'))
                return
            }

            try {
                const {center = {lat: 37.5665, lng: 126.978}, zoom = 15} = options

                map.value = new naver.maps.Map(container, {
                    center: new naver.maps.LatLng(center.lat, center.lng),
                    zoom: zoom,
                    minZoom: 10,
                    maxZoom: 19,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: naver.maps.Position.TOP_RIGHT,
                    },
                })

                resolve(map.value)
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 마커 추가
     */
    const addMarker = (options) => {
        const {position, title, icon, onClick} = options

        const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(position.lat, position.lng),
            map: map.value,
            title: title,
            icon: icon,
        })

        if (onClick) {
            naver.maps.Event.addListener(marker, 'click', onClick)
        }

        markers.value.push(marker)
        return marker
    }

    /**
     * 모든 마커 제거
     */
    const clearMarkers = () => {
        markers.value.forEach((marker) => marker.setMap(null))
        markers.value = []
    }

    return {
        map,
        markers,
        initMap,
        addMarker,
        clearMarkers,
    }
}

