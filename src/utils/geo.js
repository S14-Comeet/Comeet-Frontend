/**
 * 지리/좌표 관련 유틸리티 함수
 */

/**
 * 좌표 유효성 검증
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @returns {boolean}
 */
export const isValidCoordinate = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  )
}

/**
 * Haversine 공식으로 두 좌표 간 거리 계산
 * @param {number} lat1 - 시작점 위도
 * @param {number} lng1 - 시작점 경도
 * @param {number} lat2 - 끝점 위도
 * @param {number} lng2 - 끝점 경도
 * @returns {number} 거리 (미터 단위)
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000 // 지구 반지름 (미터)
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * 거리 포맷팅 (미터 -> 표시용 문자열)
 * @param {number} meters - 거리 (미터)
 * @returns {string} 포맷팅된 거리 문자열
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}
