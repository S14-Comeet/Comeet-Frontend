import { ref } from 'vue'

/**
 * 줌 레벨에 따른 마커 스케일 계산 (확대할수록 작아짐)
 * @param {number} zoom - 줌 레벨
 * @returns {number} 스케일 값
 */
const getMarkerScale = (zoom) => {
  const maxSizeZoom = 12
  const minSizeZoom = 19
  const maxScale = 1.0
  const minScale = 0.7

  if (zoom <= maxSizeZoom) return maxScale
  if (zoom >= minSizeZoom) return minScale

  const ratio = (zoom - maxSizeZoom) / (minSizeZoom - maxSizeZoom)
  return maxScale - ratio * (maxScale - minScale)
}

/**
 * 카페 마커 아이콘 생성 (정적 이미지, 줌 레벨에 따른 크기 조정)
 * @param {number} zoom - 현재 줌 레벨
 * @returns {Object} Naver Maps 마커 아이콘 객체
 */
const createCafeMarkerIcon = (zoom = 15) => {
  const scale = getMarkerScale(zoom)
  const baseWidth = 28
  const baseHeight = 35
  const width = Math.round(baseWidth * scale)
  const height = Math.round(baseHeight * scale)

  return {
    url: '/markers/cafe-marker.svg',
    size: new naver.maps.Size(baseWidth, baseHeight),
    scaledSize: new naver.maps.Size(width, height),
    anchor: new naver.maps.Point(width / 2, height)
  }
}

/**
 * 내 위치 마커 아이콘 생성
 * @returns {Object} Naver Maps 마커 아이콘 객체
 */
const createMyLocationMarkerIcon = () => {
  return {
    content: `
      <div style="position: relative;">
        <div style="
          width: 16px;
          height: 16px;
          background-color: #4285F4;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background-color: rgba(66, 133, 244, 0.2);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      </style>
    `,
    anchor: new naver.maps.Point(8, 8)
  }
}

/**
 * 지도 마커 관리 composable
 * @param {Object} map - Naver Maps 인스턴스 ref
 * @param {Array} markers - 마커 배열 ref
 * @param {Function} clearMarkers - 마커 제거 함수
 */
export function useMapMarkers(map, markers, clearMarkers) {
  const myLocationMarker = ref(null)
  const currentCafes = ref([])
  let markerUpdateTimer = null

  /**
   * 내 위치 마커 생성/업데이트
   */
  const updateMyLocationMarker = (lat, lng) => {
    if (!map.value) return

    if (myLocationMarker.value) {
      myLocationMarker.value.setPosition(new naver.maps.LatLng(lat, lng))
      return
    }

    myLocationMarker.value = new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lng),
      map: map.value,
      icon: createMyLocationMarkerIcon(),
      zIndex: 1000
    })
  }

  /**
   * 마커 크기 업데이트 (줌 변경 시 호출, 디바운스 적용)
   */
  const updateMarkerSizes = () => {
    if (markerUpdateTimer) {
      clearTimeout(markerUpdateTimer)
    }

    markerUpdateTimer = setTimeout(() => {
      if (!map.value || markers.value.length === 0) return

      const zoom = map.value.getZoom()
      const newIcon = createCafeMarkerIcon(zoom)

      markers.value.forEach((marker) => {
        marker.setIcon(newIcon)
      })
    }, 100)
  }

  /**
   * 카페 마커들 렌더링
   */
  const renderMarkers = (cafes = [], onMarkerClick) => {
    clearMarkers()
    currentCafes.value = cafes

    if (cafes.length === 0) return

    const zoom = map.value ? map.value.getZoom() : 15
    const markerIcon = createCafeMarkerIcon(zoom)

    cafes.forEach((cafe) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(
          cafe.lat || cafe.latitude,
          cafe.lng || cafe.longitude
        ),
        map: map.value,
        title: cafe.name,
        icon: markerIcon
      })

      if (onMarkerClick) {
        naver.maps.Event.addListener(marker, 'click', () => onMarkerClick(cafe))
      }

      markers.value.push(marker)
    })
  }

  /**
   * 리소스 정리
   */
  const cleanup = () => {
    if (markerUpdateTimer) {
      clearTimeout(markerUpdateTimer)
      markerUpdateTimer = null
    }
  }

  return {
    myLocationMarker,
    currentCafes,
    updateMyLocationMarker,
    updateMarkerSizes,
    renderMarkers,
    cleanup,
    createCafeMarkerIcon
  }
}
