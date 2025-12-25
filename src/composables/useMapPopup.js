import { ref } from 'vue'
import { isValidCoordinate } from '@/utils/geo'
import { createLogger } from '@/utils/logger'

const logger = createLogger('MapPopup')

/**
 * 지도 팝업 관리 composable
 * @param {Object} map - Naver Maps 인스턴스 ref
 */
export function useMapPopup(map) {
  const popupStore = ref(null)
  const popupPosition = ref({ x: 0, y: 0 })

  let rafId = null

  /**
   * 위경도를 지도 컨테이너 기준 화면 좌표로 변환
   */
  const getScreenPosition = (lat, lng) => {
    if (!map.value) return { x: 0, y: 0 }

    const projection = map.value.getProjection()
    const mapSize = map.value.getSize()
    const center = map.value.getCenter()

    const targetLatLng = new naver.maps.LatLng(lat, lng)
    const centerLatLng = new naver.maps.LatLng(center.lat(), center.lng())

    const targetOffset = projection.fromCoordToOffset(targetLatLng)
    const centerOffset = projection.fromCoordToOffset(centerLatLng)

    const deltaX = targetOffset.x - centerOffset.x
    const deltaY = targetOffset.y - centerOffset.y

    const screenX = mapSize.width / 2 + deltaX
    const screenY = mapSize.height / 2 + deltaY

    return { x: screenX, y: screenY }
  }

  /**
   * 팝업 위치 업데이트
   */
  const updatePopupPosition = () => {
    if (!popupStore.value || !map.value) return

    const lat = popupStore.value.lat || popupStore.value.latitude
    const lng = popupStore.value.lng || popupStore.value.longitude

    if (!isValidCoordinate(lat, lng)) {
      logger.warn('유효하지 않은 좌표', { lat, lng })
      return
    }

    popupPosition.value = getScreenPosition(lat, lng)
  }

  /**
   * 쓰로틀된 팝업 위치 업데이트 (지도 이동/줌 이벤트용)
   */
  const throttledUpdatePopupPosition = () => {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      updatePopupPosition()
      rafId = null
    })
  }

  /**
   * 팝업만 표시 (지도 이동 없음) - 마커 클릭 시 사용
   */
  const showPopupOnly = (store) => {
    if (!map.value) return
    popupStore.value = store
    updatePopupPosition()
  }

  /**
   * 팝업 닫기
   */
  const closePopup = () => {
    popupStore.value = null
  }

  /**
   * RAF 정리
   */
  const cleanup = () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  return {
    popupStore,
    popupPosition,
    getScreenPosition,
    updatePopupPosition,
    throttledUpdatePopupPosition,
    showPopupOnly,
    closePopup,
    cleanup
  }
}
