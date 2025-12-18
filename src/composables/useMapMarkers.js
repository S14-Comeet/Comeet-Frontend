import { ref } from 'vue'

/**
 * 줌 레벨에 따른 마커 스케일 계산 (확대할수록 작아짐)
 * @param {number} zoom - 줌 레벨
 * @returns {number} 스케일 값
 */
const getMarkerScale = (zoom) => {
  const maxSizeZoom = 12  // 이 줌 이하에서 최대 크기
  const minSizeZoom = 19  // 이 줌 이상에서 최소 크기
  const maxScale = 1.05   // 최대 크기 스케일 (줌 12 이하)
  const minScale = 0.85   // 최소 크기 스케일 (줌 19 이상)

  if (zoom <= maxSizeZoom) return maxScale
  if (zoom >= minSizeZoom) return minScale

  // 줌 12~19 사이에서 선형 보간
  const ratio = (zoom - maxSizeZoom) / (minSizeZoom - maxSizeZoom)
  return maxScale - ratio * (maxScale - minScale)
}

/**
 * 카페 마커 아이콘 생성 (줌 레벨에 따른 크기 조정)
 * @param {number} zoom - 현재 줌 레벨
 * @returns {Object} Naver Maps 마커 아이콘 객체
 */
const createCafeMarkerIcon = (zoom = 15) => {
  const scale = getMarkerScale(zoom)
  const baseWidth = 32
  const baseHeight = 40
  const width = Math.round(baseWidth * scale)
  const height = Math.round(baseHeight * scale)

  return {
    content: `
      <div style="
        position: relative;
        width: ${width}px;
        height: ${height}px;
        cursor: pointer;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
      ">
        <svg width="${width}" height="${height}" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16 0 0 7.16 0 16C0 24 10 36 14.4 39.2C15.3 39.8 16.7 39.8 17.6 39.2C22 36 32 24 32 16C32 7.16 24.84 0 16 0Z" fill="#846148"/>
          <circle cx="16" cy="16" r="9" fill="#FFF8F0"/>
          <!-- 커피잔 -->
          <rect x="10" y="14" width="10" height="8" rx="1" fill="#846148"/>
          <!-- 손잡이 -->
          <path d="M20 15.5C21.5 15.5 22.5 16.5 22.5 18C22.5 19.5 21.5 20.5 20 20.5" stroke="#846148" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <!-- 김 (애니메이션) -->
          <path d="M12.5 13C12.5 12 13 11 12.5 10" stroke="#846148" stroke-width="1" stroke-linecap="round" opacity="0.7">
            <animate attributeName="d" values="M12.5 13C12.5 12 13 11 12.5 10;M12.5 13C12.5 11.5 12 10.5 12.5 9.5;M12.5 13C12.5 12 13 11 12.5 10" dur="1.5s" repeatCount="indefinite"/>
          </path>
          <path d="M15 12.5C15 11.5 15.5 10.5 15 9.5" stroke="#846148" stroke-width="1" stroke-linecap="round" opacity="0.7">
            <animate attributeName="d" values="M15 12.5C15 11.5 15.5 10.5 15 9.5;M15 12.5C15 11 14.5 10 15 9;M15 12.5C15 11.5 15.5 10.5 15 9.5" dur="1.8s" repeatCount="indefinite"/>
          </path>
          <path d="M17.5 13C17.5 12 18 11 17.5 10" stroke="#846148" stroke-width="1" stroke-linecap="round" opacity="0.7">
            <animate attributeName="d" values="M17.5 13C17.5 12 18 11 17.5 10;M17.5 13C17.5 11.5 17 10.5 17.5 9.5;M17.5 13C17.5 12 18 11 17.5 10" dur="1.3s" repeatCount="indefinite"/>
          </path>
        </svg>
      </div>
    `,
    size: new naver.maps.Size(width, height),
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
 * @param {Function} addMarker - 마커 추가 함수
 */
export function useMapMarkers(map, markers, clearMarkers, addMarker) {
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

    const zoom = map.value ? map.value.getZoom() : 15
    const markerIcon = createCafeMarkerIcon(zoom)

    cafes.forEach((cafe) => {
      addMarker({
        position: {
          lat: cafe.lat || cafe.latitude,
          lng: cafe.lng || cafe.longitude
        },
        title: cafe.name,
        icon: markerIcon,
        onClick: () => onMarkerClick(cafe),
      })
    })
  }

  /**
   * 타이머 정리
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
