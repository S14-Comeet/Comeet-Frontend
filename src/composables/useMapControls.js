import { ref, computed } from 'vue'
import { calculateDistance } from '@/utils/geo'

/**
 * 지도 컨트롤 (줌, 이동) 관리 composable
 * @param {Object} map - Naver Maps 인스턴스 ref
 */
export function useMapControls(map) {
  // 줌 중심으로 사용할 포커스된 위치
  const focusedLocation = ref(null)

  // 바텀시트 상태
  const sheetState = ref('collapsed')

  // 시트 상태에 따른 컨트롤 버튼 위치
  const controlsBottomStyle = computed(() => {
    const bottomValues = {
      collapsed: '120px',
      half: 'calc(33vh + 16px)',
      full: 'calc(85vh + 16px)'
    }
    return { bottom: bottomValues[sheetState.value] || '120px' }
  })

  /**
   * 지도 bounds에서 radius 계산
   */
  const getRadiusFromBounds = () => {
    if (!map.value) return 1000

    const bounds = map.value.getBounds()
    const center = map.value.getCenter()
    const ne = bounds.getNE()

    const radius = calculateDistance(
      center.lat(), center.lng(),
      ne.lat(), ne.lng()
    )

    return Math.max(100, Math.min(Math.round(radius), 50000))
  }

  /**
   * 하단 시트를 고려한 지도 이동
   */
  const panToWithOffset = (lat, lng, options = {}) => {
    if (!map.value) return

    const mapSize = map.value.getSize()
    const projection = map.value.getProjection()

    const offsetRatio = options.offsetRatio || 0.2
    const targetY = mapSize.height * offsetRatio
    const centerY = mapSize.height / 2
    const pixelOffset = centerY - targetY

    const targetLatLng = new naver.maps.LatLng(lat, lng)
    const targetPoint = projection.fromCoordToOffset(targetLatLng)

    const newCenterPoint = new naver.maps.Point(targetPoint.x, targetPoint.y + pixelOffset)
    const newCenter = projection.fromOffsetToCoord(newCenterPoint)

    map.value.setCenter(newCenter)
  }

  /**
   * 줌 중심점 계산
   */
  const getZoomCenter = () => {
    if (!map.value) return null

    if (focusedLocation.value) {
      return new naver.maps.LatLng(focusedLocation.value.lat, focusedLocation.value.lng)
    }

    const mapSize = map.value.getSize()
    const projection = map.value.getProjection()

    let bottomSheetRatio = 0
    if (sheetState.value === 'collapsed') {
      bottomSheetRatio = 100 / mapSize.height
    } else if (sheetState.value === 'half') {
      bottomSheetRatio = 0.33
    } else if (sheetState.value === 'full') {
      bottomSheetRatio = 0.85
    }

    const visibleHeight = mapSize.height * (1 - bottomSheetRatio)
    const visualCenterY = visibleHeight / 2
    const actualCenterY = mapSize.height / 2
    const deltaY = visualCenterY - actualCenterY

    const centerOffset = projection.fromCoordToOffset(map.value.getCenter())
    const visualCenterOffset = new naver.maps.Point(centerOffset.x, centerOffset.y + deltaY)

    return projection.fromOffsetToCoord(visualCenterOffset)
  }

  /**
   * 특정 좌표를 피벗으로 줌
   */
  const zoomAtPivot = (pivotLat, pivotLng, newZoom) => {
    if (!map.value) return

    const currentZoom = map.value.getZoom()
    if (newZoom === currentZoom) return

    const projection = map.value.getProjection()
    const pivot = new naver.maps.LatLng(pivotLat, pivotLng)
    const center = map.value.getCenter()

    const pivotOffset = projection.fromCoordToOffset(pivot)
    const centerOffset = projection.fromCoordToOffset(center)

    const deltaX = pivotOffset.x - centerOffset.x
    const deltaY = pivotOffset.y - centerOffset.y

    const zoomRatio = Math.pow(2, newZoom - currentZoom)

    const newCenterOffsetX = pivotOffset.x - deltaX / zoomRatio
    const newCenterOffsetY = pivotOffset.y - deltaY / zoomRatio

    const newCenterOffset = new naver.maps.Point(newCenterOffsetX, newCenterOffsetY)
    const newCenter = projection.fromOffsetToCoord(newCenterOffset)

    map.value.setZoom(newZoom, false)
    map.value.setCenter(newCenter)
  }

  /**
   * 확대
   */
  const handleZoomIn = () => {
    if (!map.value) return
    const currentZoom = map.value.getZoom()

    if (currentZoom >= 19) return

    if (focusedLocation.value) {
      zoomAtPivot(focusedLocation.value.lat, focusedLocation.value.lng, currentZoom + 1)
    } else {
      const zoomCenter = getZoomCenter()
      if (zoomCenter) {
        zoomAtPivot(zoomCenter.lat(), zoomCenter.lng(), currentZoom + 1)
      } else {
        map.value.setZoom(currentZoom + 1)
      }
    }
  }

  /**
   * 축소
   */
  const handleZoomOut = () => {
    if (!map.value) return
    const currentZoom = map.value.getZoom()

    if (currentZoom <= 10) return

    if (focusedLocation.value) {
      zoomAtPivot(focusedLocation.value.lat, focusedLocation.value.lng, currentZoom - 1)
    } else {
      const zoomCenter = getZoomCenter()
      if (zoomCenter) {
        zoomAtPivot(zoomCenter.lat(), zoomCenter.lng(), currentZoom - 1)
      } else {
        map.value.setZoom(currentZoom - 1)
      }
    }
  }

  /**
   * 포커스 위치 설정
   */
  const setFocusedLocation = (lat, lng) => {
    focusedLocation.value = { lat, lng }
  }

  /**
   * 포커스 해제
   */
  const clearFocusedLocation = () => {
    focusedLocation.value = null
  }

  /**
   * 시트 상태 설정
   */
  const setSheetState = (state) => {
    sheetState.value = state
  }

  return {
    focusedLocation,
    sheetState,
    controlsBottomStyle,
    getRadiusFromBounds,
    panToWithOffset,
    getZoomCenter,
    zoomAtPivot,
    handleZoomIn,
    handleZoomOut,
    setFocusedLocation,
    clearFocusedLocation,
    setSheetState
  }
}
