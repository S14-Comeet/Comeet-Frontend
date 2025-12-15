<template>
  <div class="relative w-full h-full">
    <!-- 지도 컨테이너 -->
    <div ref="mapContainer" class="w-full h-full"></div>

    <!-- 로딩 오버레이 -->
    <div
        v-if="isLoading"
        class="absolute inset-0 bg-black/20 flex items-center justify-center z-20"
    >
      <div class="bg-white rounded-lg p-6 shadow-lg">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-textSecondary">지도 로딩 중...</p>
      </div>
    </div>

    <!-- Floating 알림 아이콘 (우측 상단) - 로그인 상태일 때만 표시 -->
    <button
        v-if="isAuthenticated"
        @click="handleNotificationClick"
        class="floating-notification-button"
        aria-label="알림"
    >
      <BaseIcon name="notice" :size="24" color="var(--color-neutral-900)"/>
      <span
          v-if="hasUnreadNotifications"
          class="notification-badge"
      ></span>
    </button>

    <!-- 이 지역 검색 버튼 (상단 중앙) -->
    <button
        v-if="showSearchButton"
        @click="handleSearchThisArea"
        class="search-area-button"
        :disabled="isSearching"
    >
      <BaseIcon v-if="isSearching" name="spinner" :size="16" class="animate-spin" />
      <BaseIcon v-else name="search" :size="16" />
      <span>{{ isSearching ? '검색 중...' : '이 지역 검색' }}</span>
    </button>

    <!-- 지도 컨트롤 버튼들 (우측) -->
    <div class="map-controls" :style="controlsBottomStyle">
      <button @click="handleZoomIn" class="control-button" aria-label="확대">
        <BaseIcon name="plus" :size="20" />
      </button>
      <button @click="handleZoomOut" class="control-button" aria-label="축소">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12H19" stroke-linecap="round" />
        </svg>
      </button>
      <button @click="handleMyLocation" class="control-button" aria-label="내 위치" :disabled="isLocating">
        <BaseIcon v-if="isLocating" name="spinner" :size="20" class="animate-spin" />
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <!-- 통합 검색 + 가게 리스트 바텀시트 -->
    <StoreListSheet
        :stores="stores"
        :is-searching="isSearching"
        :initial-keyword="searchKeyword"
        :initial-categories="searchCategories"
        :initial-global-search="isGlobalSearch"
        :force-state="forceSheetState"
        @select-store="handleStoreSelect"
        @state-change="handleSheetStateChange"
        @search="handleSearch"
    />

    <!-- 마커 클릭 시 팝업 (마커 위치에 표시) -->
    <MarkerPopup
        :store="popupStore"
        :position="popupPosition"
        @close="closePopup"
        @detail="handlePopupDetail"
    />

    <MapPlaceDetail
        v-if="detailPlace"
        :place="detailPlace"
        @close="detailPlace = null"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useNaverMap} from '@/composables/useNaverMap'
import {useGeolocation} from '@/composables/useGeolocation'
import {useToast} from 'vue-toastification'
import {useNotificationStore} from '@/store/notification'
import {useAuthStore} from '@/store/auth'
import {useSavedStore} from '@/store/saved'
import {getStoresByLocation} from '@/api/cafe'
import MarkerPopup from "@/components/map/MarkerPopup.vue"
import MapPlaceDetail from "@/components/map/MapPlaceDetail.vue"
import StoreListSheet from "@/components/map/StoreListSheet.vue"
import BaseIcon from '@/components/common/BaseIcon.vue'

const router = useRouter()
const toast = useToast()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()
const savedStore = useSavedStore()
const mapContainer = ref(null)
const isLoading = ref(true)
const isSearching = ref(false)
const isLocating = ref(false)
const showSearchButton = ref(false)
const {location, requestLocation} = useGeolocation()
const {map, markers, initMap, addMarker, clearMarkers} = useNaverMap()
const popupStore = ref(null)
const popupPosition = ref({ x: 0, y: 0 })
const detailPlace = ref(null)

// 쓰로틀 유틸리티 (RAF 기반 - 더 부드러운 애니메이션)
let rafId = null
const throttledUpdatePopup = (fn) => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    fn()
    rafId = null
  })
}

// 좌표 유효성 검증
const isValidCoordinate = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  )
}

// 마지막 검색 위치 (중복 검색 방지)
const lastSearchCenter = ref(null)

// 내 위치 마커 (가게 마커와 별도 관리)
const myLocationMarker = ref(null)

// 바텀시트 상태
const sheetState = ref('collapsed')
const forceSheetState = ref(null)

// 검색 관련 상태
const isGlobalSearch = ref(false)
const searchKeyword = ref('')
const searchCategories = ref([])

// 줌 중심으로 사용할 포커스된 위치 (내 위치, 선택한 마커 등)
const focusedLocation = ref(null)

// 마커 업데이트 디바운스 타이머
let markerUpdateTimer = null

// 인증 상태
const isAuthenticated = computed(() => authStore.isAuthenticated)

// 읽지 않은 알림이 있는지
const hasUnreadNotifications = computed(() => notificationStore.hasUnread)

// 시트 상태에 따른 컨트롤 버튼 위치
const controlsBottomStyle = computed(() => {
  const bottomValues = {
    collapsed: '120px',
    half: 'calc(33vh + 16px)',
    full: 'calc(85vh + 16px)'
  }
  return { bottom: bottomValues[sheetState.value] || '120px' }
})

// 알림 아이콘 클릭 핸들러
const handleNotificationClick = () => {
  router.push('/notifications')
}

// 내 위치 마커 생성/업데이트
const updateMyLocationMarker = (lat, lng) => {
  if (!map.value) return

  if (myLocationMarker.value) {
    myLocationMarker.value.setPosition(new naver.maps.LatLng(lat, lng))
    return
  }

  const markerIcon = {
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

  myLocationMarker.value = new naver.maps.Marker({
    position: new naver.maps.LatLng(lat, lng),
    map: map.value,
    icon: markerIcon,
    zIndex: 1000
  })
}

// Haversine 공식으로 두 좌표 간 거리 계산 (미터 단위)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 지도 bounds에서 radius 계산
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

// 가게 목록
const stores = ref([])

// 현재 사용자 위치 (거리 계산용)
const userLocation = ref(null)

// 위치 기반 가게 목록 불러오기
const fetchStores = async (latitude, longitude, radius = 1000, options = {}) => {
  try {
    const params = { latitude, longitude, radius }

    if (options.keyword) {
      params.keyword = options.keyword
    }
    if (options.categories) {
      params.categories = options.categories
    }

    const response = await getStoresByLocation(params)
    if (response.data && response.data.stores) {
      let storeList = response.data.stores

      const refLat = userLocation.value?.lat || latitude
      const refLng = userLocation.value?.lng || longitude

      storeList = storeList.map(store => {
        const storeLat = store.lat || store.latitude
        const storeLng = store.lng || store.longitude
        const distance = calculateDistance(refLat, refLng, storeLat, storeLng)
        return {
          ...store,
          distance,
          distanceText: formatDistance(distance)
        }
      })

      storeList.sort((a, b) => a.distance - b.distance)

      stores.value = storeList
      return storeList
    }
    return []
  } catch (error) {
    console.error('[MapView] 가게 목록 조회 실패:', error)
    return []
  }
}

// 거리 포맷팅
const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

// 줌 레벨에 따른 마커 스케일 계산 (확대할수록 작아짐)
const getMarkerScale = (zoom) => {
  // 줌 12~19 범위에서 촘촘하게 변화
  const maxSizeZoom = 12  // 이 줌 이하에서 최대 크기
  const minSizeZoom = 19  // 이 줌 이상에서 최소 크기
  const maxScale = 1.25   // 최대 크기 스케일 (줌 12 이하) → 40x50px
  const minScale = 0.8    // 최소 크기 스케일 (줌 19 이상) → 26x32px

  if (zoom <= maxSizeZoom) return maxScale
  if (zoom >= minSizeZoom) return minScale

  // 줌 12~19 사이에서 선형 보간
  const ratio = (zoom - maxSizeZoom) / (minSizeZoom - maxSizeZoom)
  return maxScale - ratio * (maxScale - minScale)
}

// 카페 마커 아이콘 생성 (줌 레벨에 따른 크기 조정)
const createCafeMarkerIcon = (zoom = 15) => {
  const scale = getMarkerScale(zoom)
  const baseWidth = 32  // 기본 크기
  const baseHeight = 40 // 기본 크기
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

// 현재 표시 중인 카페 목록 (줌 변경 시 마커 업데이트용)
const currentCafes = ref([])

// 마커 크기 업데이트 (줌 변경 시 호출, 디바운스 적용)
const updateMarkerSizes = () => {
  // 이전 타이머 취소
  if (markerUpdateTimer) {
    clearTimeout(markerUpdateTimer)
  }

  // 100ms 디바운스 - 연속 줌 시 마지막에만 업데이트
  markerUpdateTimer = setTimeout(() => {
    if (!map.value || markers.value.length === 0) return

    const zoom = map.value.getZoom()
    const newIcon = createCafeMarkerIcon(zoom)

    markers.value.forEach((marker) => {
      marker.setIcon(newIcon)
    })
  }, 100)
}

const renderMarkers = (cafes = [], moveToFirst = false) => {
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
      onClick: () => handleMarkerClick(cafe),
    })
  })

  if (moveToFirst && cafes.length > 0 && map.value) {
    const firstCafe = cafes[0]
    const lat = firstCafe.lat || firstCafe.latitude
    const lng = firstCafe.lng || firstCafe.longitude
    map.value.setZoom(13)
    // 줌 변경 후 오프셋 적용을 위해 약간 지연
    setTimeout(() => {
      panToWithOffset(lat, lng, { offsetRatio: 0.3 })
    }, 50)
  }
}

// 위경도를 지도 컨테이너 기준 화면 좌표로 변환
const getScreenPosition = (lat, lng) => {
  if (!map.value) return { x: 0, y: 0 }

  const projection = map.value.getProjection()
  const mapSize = map.value.getSize()
  const center = map.value.getCenter()

  // 타겟 좌표와 중심 좌표를 오프셋으로 변환
  const targetLatLng = new naver.maps.LatLng(lat, lng)
  const centerLatLng = new naver.maps.LatLng(center.lat(), center.lng())

  const targetOffset = projection.fromCoordToOffset(targetLatLng)
  const centerOffset = projection.fromCoordToOffset(centerLatLng)

  // 중심으로부터의 픽셀 차이 계산
  const deltaX = targetOffset.x - centerOffset.x
  const deltaY = targetOffset.y - centerOffset.y

  // 화면 중심 기준으로 픽셀 좌표 계산
  const screenX = mapSize.width / 2 + deltaX
  const screenY = mapSize.height / 2 + deltaY

  return { x: screenX, y: screenY }
}

// 하단 시트를 고려한 지도 이동 (마커가 화면 상단 1/3 위치에 오도록)
const panToWithOffset = (lat, lng, options = {}) => {
  if (!map.value) return

  const mapSize = map.value.getSize()
  const projection = map.value.getProjection()

  // 시트가 화면의 33%를 차지하므로, 마커를 상단 1/3 지점에 표시
  // 화면 상단에서 약 25% 지점에 마커가 오도록 오프셋 계산
  const offsetRatio = options.offsetRatio || 0.2 // 상단에서 20% 지점
  const targetY = mapSize.height * offsetRatio

  // 현재 화면 중앙의 Y 좌표
  const centerY = mapSize.height / 2

  // 필요한 픽셀 오프셋 (마커를 위로 올려야 하므로 양수)
  const pixelOffset = centerY - targetY

  // 타겟 좌표를 화면 좌표로 변환
  const targetLatLng = new naver.maps.LatLng(lat, lng)
  const targetPoint = projection.fromCoordToOffset(targetLatLng)

  // 오프셋을 적용한 새 중심점 계산
  const newCenterPoint = new naver.maps.Point(targetPoint.x, targetPoint.y + pixelOffset)
  const newCenter = projection.fromOffsetToCoord(newCenterPoint)

  map.value.setCenter(newCenter)
}

// 팝업 위치 업데이트 (좌표 검증 포함)
const updatePopupPosition = () => {
  if (!popupStore.value || !map.value) return

  const lat = popupStore.value.lat || popupStore.value.latitude
  const lng = popupStore.value.lng || popupStore.value.longitude

  if (!isValidCoordinate(lat, lng)) {
    console.warn('[MapView] 유효하지 않은 좌표:', { lat, lng })
    return
  }

  popupPosition.value = getScreenPosition(lat, lng)
}

// 쓰로틀된 팝업 위치 업데이트 (지도 이동/줌 이벤트용)
const throttledUpdatePopupPosition = () => {
  throttledUpdatePopup(updatePopupPosition)
}

// 팝업만 표시 (지도 이동 없음) - 마커 클릭 시 사용
const showPopupOnly = (store) => {
  if (!map.value) return

  popupStore.value = store
  updatePopupPosition()
}

// 지도 이동 후 팝업 표시 - 검색바에서 가게 선택 시 사용
const showStorePopup = (store) => {
  if (!map.value) return

  const lat = store.lat || store.latitude
  const lng = store.lng || store.longitude

  // 하단 시트를 고려하여 지도 이동 (마커가 화면 상단에 보이도록)
  panToWithOffset(lat, lng, { offsetRatio: 0.25 })

  // 팝업 표시 (지도 이동 후 위치 계산을 위해 약간 지연)
  setTimeout(() => {
    popupStore.value = store
    updatePopupPosition()
  }, 150)
}

// 마커 클릭 시 - 지도 이동 없이 팝업만 표시
const handleMarkerClick = (cafe) => {
  const lat = cafe.lat || cafe.latitude
  const lng = cafe.lng || cafe.longitude
  // 클릭한 마커를 줌 중심으로 설정
  focusedLocation.value = { lat, lng }
  showPopupOnly(cafe)
}

// 팝업에서 상세보기 클릭
const handlePopupDetail = (store) => {
  if (store) {
    const storeId = store.storeId || store.id
    router.push({
      name: 'store-detail',
      params: { storeId }
    })
  }
  popupStore.value = null
}

// 팝업 닫기
const closePopup = () => {
  popupStore.value = null
}

// 바텀시트에서 가게 선택 - 마커로 이동 + 팝업 표시 + 시트 축소
const handleStoreSelect = (store) => {
  if (store) {
    const lat = store.lat || store.latitude
    const lng = store.lng || store.longitude
    // 선택한 가게를 줌 중심으로 설정
    focusedLocation.value = { lat, lng }

    // 시트를 1/3 크기로 축소
    forceSheetState.value = 'half'
    // 다음 변경을 감지할 수 있도록 리셋
    setTimeout(() => {
      forceSheetState.value = null
    }, 100)

    showStorePopup(store)
  }
}

// 검색 실행 (바텀시트에서 호출)
const handleSearch = async (searchParams) => {
  if (!map.value) return

  isSearching.value = true
  showSearchButton.value = false

  try {
    let lat, lng, radius

    if (searchParams.isGlobalSearch) {
      if (userLocation.value) {
        lat = userLocation.value.lat
        lng = userLocation.value.lng
      } else {
        const center = map.value.getCenter()
        lat = center.lat()
        lng = center.lng()
      }
      radius = 50000
    } else {
      const center = map.value.getCenter()
      lat = center.lat()
      lng = center.lng()
      radius = getRadiusFromBounds()
    }

    const storeList = await fetchStores(lat, lng, radius, {
      keyword: searchParams.keyword,
      categories: searchParams.categories
    })

    renderMarkers(storeList, false)

    searchKeyword.value = searchParams.keyword || ''
    searchCategories.value = searchParams.categories ? searchParams.categories.split(',') : []
    isGlobalSearch.value = searchParams.isGlobalSearch

    lastSearchCenter.value = { lat, lng }

    // 검색 후 바텀시트를 최대 상태로 확장
    forceSheetState.value = 'full'
    setTimeout(() => {
      forceSheetState.value = null
    }, 100)

    if (storeList.length === 0) {
      toast.info('검색 결과가 없습니다.')
    }
  } finally {
    isSearching.value = false
  }
}

// 바텀시트 상태 변경
const handleSheetStateChange = (state) => {
  sheetState.value = state

  // 바텀시트가 full로 확장되면 팝업 닫기
  if (state === 'full') {
    closePopup()
  }
}

// 이 지역 검색
const handleSearchThisArea = async () => {
  if (!map.value || isSearching.value) return

  isSearching.value = true
  showSearchButton.value = false

  try {
    const center = map.value.getCenter()
    const radius = getRadiusFromBounds()

    const storeList = await fetchStores(center.lat(), center.lng(), radius)
    renderMarkers(storeList, false)

    lastSearchCenter.value = { lat: center.lat(), lng: center.lng() }

    if (storeList.length === 0) {
      toast.info('이 지역에 등록된 카페가 없습니다.')
    }
  } finally {
    isSearching.value = false
  }
}

// 줌 중심점 계산 (포커스된 위치 우선, 없으면 시각적 중심)
const getZoomCenter = () => {
  if (!map.value) return null

  // 포커스된 위치가 있으면 그 위치를 줌 중심으로 사용
  if (focusedLocation.value) {
    return new naver.maps.LatLng(focusedLocation.value.lat, focusedLocation.value.lng)
  }

  // 포커스된 위치가 없으면 바텀시트를 고려한 시각적 중심 계산
  const mapSize = map.value.getSize()
  const projection = map.value.getProjection()

  // 바텀시트가 차지하는 높이 비율 계산
  let bottomSheetRatio = 0
  if (sheetState.value === 'collapsed') {
    bottomSheetRatio = 100 / mapSize.height  // 약 100px
  } else if (sheetState.value === 'half') {
    bottomSheetRatio = 0.33  // 33vh
  } else if (sheetState.value === 'full') {
    bottomSheetRatio = 0.85  // 85vh
  }

  // 보이는 영역의 중심 Y 좌표 (상단 0 ~ 바텀시트 시작점의 중간)
  const visibleHeight = mapSize.height * (1 - bottomSheetRatio)
  const visualCenterY = visibleHeight / 2

  // 실제 지도 중심과의 Y 차이
  const actualCenterY = mapSize.height / 2
  const deltaY = visualCenterY - actualCenterY

  // 화면 좌표 차이를 지도 좌표로 변환
  const centerOffset = projection.fromCoordToOffset(map.value.getCenter())
  const visualCenterOffset = new naver.maps.Point(centerOffset.x, centerOffset.y + deltaY)

  return projection.fromOffsetToCoord(visualCenterOffset)
}

// 특정 좌표를 피벗으로 줌 (해당 좌표가 현재 화면 위치 유지)
const zoomAtPivot = (pivotLat, pivotLng, newZoom) => {
  if (!map.value) return

  const currentZoom = map.value.getZoom()
  if (newZoom === currentZoom) return

  const projection = map.value.getProjection()
  const pivot = new naver.maps.LatLng(pivotLat, pivotLng)
  const center = map.value.getCenter()

  // 현재 줌에서 피벗의 오프셋과 중심의 오프셋
  const pivotOffset = projection.fromCoordToOffset(pivot)
  const centerOffset = projection.fromCoordToOffset(center)

  // 중심에서 피벗까지의 픽셀 거리
  const deltaX = pivotOffset.x - centerOffset.x
  const deltaY = pivotOffset.y - centerOffset.y

  // 줌 비율 (줌 1 증가 = 스케일 2배)
  const zoomRatio = Math.pow(2, newZoom - currentZoom)

  // 줌 후 피벗이 같은 화면 위치에 있으려면, 새 중심 오프셋 계산
  const newCenterOffsetX = pivotOffset.x - deltaX / zoomRatio
  const newCenterOffsetY = pivotOffset.y - deltaY / zoomRatio

  const newCenterOffset = new naver.maps.Point(newCenterOffsetX, newCenterOffsetY)
  const newCenter = projection.fromOffsetToCoord(newCenterOffset)

  // 애니메이션 없이 즉시 적용 (끊김 방지)
  map.value.setZoom(newZoom, false)
  map.value.setCenter(newCenter)
}

// 확대 (포커스된 위치 또는 시각적 중심을 피벗으로)
const handleZoomIn = () => {
  if (!map.value) return
  const currentZoom = map.value.getZoom()

  // 최대 줌 레벨 체크 (19)
  if (currentZoom >= 19) return

  if (focusedLocation.value) {
    // 포커스된 위치를 피벗으로 줌
    zoomAtPivot(focusedLocation.value.lat, focusedLocation.value.lng, currentZoom + 1)
  } else {
    // 시각적 중심을 피벗으로 줌
    const zoomCenter = getZoomCenter()
    if (zoomCenter) {
      zoomAtPivot(zoomCenter.lat(), zoomCenter.lng(), currentZoom + 1)
    } else {
      map.value.setZoom(currentZoom + 1)
    }
  }
}

// 축소 (포커스된 위치 또는 시각적 중심을 피벗으로)
const handleZoomOut = () => {
  if (!map.value) return
  const currentZoom = map.value.getZoom()

  // 최소 줌 레벨 체크 (10)
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

// 내 위치로 이동
const handleMyLocation = async () => {
  if (isLocating.value) return

  isLocating.value = true

  try {
    await requestLocation()

    if (location.value && map.value) {
      // 하단 시트를 고려하여 이동 (내 위치가 화면 상단에 보이도록)
      panToWithOffset(location.value.lat, location.value.lng, { offsetRatio: 0.3 })
      updateMyLocationMarker(location.value.lat, location.value.lng)
      userLocation.value = { lat: location.value.lat, lng: location.value.lng }
      // 내 위치를 줌 중심으로 설정
      focusedLocation.value = { lat: location.value.lat, lng: location.value.lng }
      showSearchButton.value = true
    }
  } catch {
    toast.error('현재 위치를 가져올 수 없습니다.')
  } finally {
    isLocating.value = false
  }
}

// 지도 이동 시 "이 지역 검색" 버튼 표시 여부 확인
const checkShowSearchButton = () => {
  if (!map.value || !lastSearchCenter.value) {
    showSearchButton.value = true
    return
  }

  const center = map.value.getCenter()
  const distance = calculateDistance(
    lastSearchCenter.value.lat, lastSearchCenter.value.lng,
    center.lat(), center.lng()
  )

  showSearchButton.value = distance > 100
}

// 지도 초기화
onMounted(async () => {
  try {
    const defaultCenter = {lat: 37.5665, lng: 126.978}

    await initMap(mapContainer.value, {
      center: defaultCenter,
      zoom: 15,
    })

    const hasSelectedFolder = savedStore.selectedFolder && savedStore.selectedFolderCafes.length > 0

    if (hasSelectedFolder) {
      renderMarkers(savedStore.selectedFolderCafes, true)
      savedStore.clearSelectedFolder()
    } else {
      let centerLat = defaultCenter.lat
      let centerLng = defaultCenter.lng

      try {
        await requestLocation()
        if (location.value && map.value) {
          centerLat = location.value.lat
          centerLng = location.value.lng
          // 하단 시트를 고려하여 초기 위치 설정
          panToWithOffset(centerLat, centerLng, { offsetRatio: 0.3 })
          updateMyLocationMarker(centerLat, centerLng)
          userLocation.value = { lat: centerLat, lng: centerLng }
          // 내 위치를 줌 중심으로 설정
          focusedLocation.value = { lat: centerLat, lng: centerLng }
        }
      } catch {
        console.warn('[지도] 현재 위치를 가져올 수 없어 기본 위치를 사용합니다.')
      }

      const radius = getRadiusFromBounds()
      const storeList = await fetchStores(centerLat, centerLng, radius)
      renderMarkers(storeList, false)

      lastSearchCenter.value = { lat: centerLat, lng: centerLng }
    }

    if (map.value) {
      // 지도 이동 완료 시
      naver.maps.Event.addListener(map.value, 'idle', () => {
        checkShowSearchButton()
        updatePopupPosition()
      })

      // 지도 이동/줌 중 팝업 위치 실시간 업데이트 (쓰로틀 적용)
      naver.maps.Event.addListener(map.value, 'zoom_changed', () => {
        throttledUpdatePopupPosition()
        updateMarkerSizes()  // 줌 변경 시 마커 크기 업데이트
      })
      naver.maps.Event.addListener(map.value, 'center_changed', throttledUpdatePopupPosition)
      naver.maps.Event.addListener(map.value, 'drag', () => {
        throttledUpdatePopupPosition()
        // 지도 드래그 시 포커스 해제 (시각적 중심으로 줌하도록)
        focusedLocation.value = null
      })
      naver.maps.Event.addListener(map.value, 'zooming', throttledUpdatePopupPosition)

      // 지도 클릭 시 팝업 닫기
      naver.maps.Event.addListener(map.value, 'click', closePopup)
    }
  } catch (error) {
    console.error('[MapView] 초기화 실패:', error)
    toast.error('지도를 불러오는데 실패했습니다.')
  } finally {
    isLoading.value = false
  }
})

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  // RAF 정리
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  // 마커 업데이트 타이머 정리
  if (markerUpdateTimer) {
    clearTimeout(markerUpdateTimer)
    markerUpdateTimer = null
  }
})
</script>

<style scoped>
/* Floating 알림 버튼 */
.floating-notification-button {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  z-index: 100;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 50%;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.floating-notification-button:hover {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.floating-notification-button:active {
  transform: scale(0.95);
  background-color: var(--color-primary-50);
}

/* 알림 배지 */
.notification-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--color-error);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9);
}

/* 이 지역 검색 버튼 */
.search-area-button {
  position: absolute;
  top: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background-color: var(--color-primary-600);
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(132, 97, 72, 0.3);
  transition: all 200ms ease;
}

.search-area-button:hover:not(:disabled) {
  background-color: var(--color-primary-700);
  box-shadow: 0 6px 16px rgba(132, 97, 72, 0.4);
}

.search-area-button:active:not(:disabled) {
  transform: translateX(-50%) scale(0.97);
}

.search-area-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 지도 컨트롤 버튼들 */
.map-controls {
  position: absolute;
  right: 1rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.control-button {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: none;
  border-radius: 0.625rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 200ms ease;
  color: var(--color-neutral-700);
}

.control-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: var(--color-primary-600);
}

.control-button:active:not(:disabled) {
  transform: scale(0.95);
}

.control-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 모바일에서 Safe Area 대응 */
@media (max-width: 640px) {
  .floating-notification-button {
    top: max(0.75rem, env(safe-area-inset-top));
    right: max(1rem, env(safe-area-inset-right));
  }

  .search-area-button {
    top: max(0.75rem, env(safe-area-inset-top));
  }

  .map-controls {
    right: max(1rem, env(safe-area-inset-right));
  }
}
</style>
