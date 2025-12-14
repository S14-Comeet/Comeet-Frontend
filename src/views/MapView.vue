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
      <!-- 읽지 않은 알림 배지 -->
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
      <!-- 확대 버튼 -->
      <button @click="handleZoomIn" class="control-button" aria-label="확대">
        <BaseIcon name="plus" :size="20" />
      </button>
      <!-- 축소 버튼 -->
      <button @click="handleZoomOut" class="control-button" aria-label="축소">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12H19" stroke-linecap="round" />
        </svg>
      </button>
      <!-- 내 위치 버튼 -->
      <button @click="handleMyLocation" class="control-button" aria-label="내 위치" :disabled="isLocating">
        <BaseIcon v-if="isLocating" name="spinner" :size="20" class="animate-spin" />
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <!-- 가게 리스트 바텀시트 -->
    <StoreListSheet
        :stores="stores"
        @select-store="handleStoreSelect"
        @state-change="handleSheetStateChange"
    />

    <!-- 마커 클릭 시 간단 정보 (바텀시트 위에 표시) -->
    <MapPlaceInfo
        v-if="selectedPlace"
        :place="selectedPlace"
        @close="selectedPlace = null"
        @detail="handleShowDetail"
        class="absolute bottom-0 left-0 right-0 z-50"
    />

    <MapPlaceDetail
        v-if="detailPlace"
        :place="detailPlace"
        @close="detailPlace = null"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useNaverMap} from '@/composables/useNaverMap'
import {useGeolocation} from '@/composables/useGeolocation'
import {useToast} from 'vue-toastification'
import {useNotificationStore} from '@/store/notification'
import {useAuthStore} from '@/store/auth'
import {useSavedStore} from '@/store/saved'
import {getStoresByLocation} from '@/api/cafe'
import MapPlaceInfo from "@/components/map/MapPlaceInfo.vue"
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
const {map, initMap, addMarker, clearMarkers} = useNaverMap()
const selectedPlace = ref(null)
const detailPlace = ref(null)

// 마지막 검색 위치 (중복 검색 방지)
const lastSearchCenter = ref(null)

// 내 위치 마커 (가게 마커와 별도 관리)
const myLocationMarker = ref(null)

// 바텀시트 상태
const sheetState = ref('collapsed')

// 인증 상태
const isAuthenticated = computed(() => authStore.isAuthenticated)

// 읽지 않은 알림이 있는지
const hasUnreadNotifications = computed(() => notificationStore.hasUnread)

// 시트 상태에 따른 컨트롤 버튼 위치
const controlsBottomStyle = computed(() => {
  const bottomValues = {
    collapsed: '100px',
    half: 'calc(50vh + 16px)',
    full: 'calc(85vh + 16px)'
  }
  return { bottom: bottomValues[sheetState.value] || '100px' }
})

// 알림 아이콘 클릭 핸들러
const handleNotificationClick = () => {
  router.push('/notifications')
}

// 내 위치 마커 생성/업데이트
const updateMyLocationMarker = (lat, lng) => {
  if (!map.value) return

  // 기존 마커가 있으면 위치만 업데이트
  if (myLocationMarker.value) {
    myLocationMarker.value.setPosition(new naver.maps.LatLng(lat, lng))
    return
  }

  // 내 위치 마커 스타일 (파란 점 + 펄스 효과)
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
    zIndex: 1000 // 가게 마커보다 위에 표시
  })
}

// Haversine 공식으로 두 좌표 간 거리 계산 (미터 단위)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
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

// 지도 bounds에서 radius 계산
const getRadiusFromBounds = () => {
  if (!map.value) return 1000

  const bounds = map.value.getBounds()
  const center = map.value.getCenter()
  const ne = bounds.getNE() // 북동쪽 꼭지점

  const radius = calculateDistance(
    center.lat(), center.lng(),
    ne.lat(), ne.lng()
  )

  // 최소 100m, 최대 50km
  return Math.max(100, Math.min(Math.round(radius), 50000))
}

// 가게 목록
const stores = ref([])

// 위치 기반 가게 목록 불러오기
const fetchStores = async (latitude, longitude, radius = 1000) => {
  try {
    const response = await getStoresByLocation({ latitude, longitude, radius })
    if (response.data && response.data.stores) {
      stores.value = response.data.stores
      return response.data.stores
    }
    return []
  } catch (error) {
    console.error('[MapView] 가게 목록 조회 실패:', error)
    toast.error('가게 목록을 불러오는데 실패했습니다.')
    return []
  }
}

const renderMarkers = (cafes = [], moveToFirst = false) => {
  clearMarkers()

  cafes.forEach((cafe) => {
    addMarker({
      position: {
        lat: cafe.lat || cafe.latitude,
        lng: cafe.lng || cafe.longitude
      },
      title: cafe.name,
      onClick: () => handleMarkerClick(cafe),
    })
  })

  // moveToFirst가 true일 때만 첫 번째 카페로 이동
  if (moveToFirst && cafes.length > 0 && map.value) {
    const firstCafe = cafes[0]
    const center = new naver.maps.LatLng(
        firstCafe.lat || firstCafe.latitude,
        firstCafe.lng || firstCafe.longitude
    )
    map.value.setCenter(center)
    map.value.setZoom(13)
  }
}

const handleMarkerClick = (cafe) => {
  selectedPlace.value = cafe
}

const handleShowDetail = () => {
  if (selectedPlace.value) {
    const storeId = selectedPlace.value.storeId || selectedPlace.value.id
    router.push({
      name: 'store-detail',
      params: { storeId }
    })
  }
  selectedPlace.value = null
}

// 바텀시트에서 가게 선택 - 상세 페이지로 이동
const handleStoreSelect = (store) => {
  if (store) {
    const storeId = store.storeId || store.id
    router.push({
      name: 'store-detail',
      params: { storeId },
      query: {
        name: store.name,
        lat: store.lat || store.latitude,
        lng: store.lng || store.longitude,
        address: store.address,
        category: store.category
      }
    })
  }
}

// 바텀시트 상태 변경
const handleSheetStateChange = (state) => {
  sheetState.value = state
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

    // 마지막 검색 위치 저장
    lastSearchCenter.value = { lat: center.lat(), lng: center.lng() }

    if (storeList.length === 0) {
      toast.info('이 지역에 등록된 카페가 없습니다.')
    } else {
      toast.success(`${storeList.length}개의 카페를 찾았습니다.`)
    }
  } finally {
    isSearching.value = false
  }
}

// 확대
const handleZoomIn = () => {
  if (!map.value) return
  const currentZoom = map.value.getZoom()
  map.value.setZoom(currentZoom + 1)
}

// 축소
const handleZoomOut = () => {
  if (!map.value) return
  const currentZoom = map.value.getZoom()
  map.value.setZoom(currentZoom - 1)
}

// 내 위치로 이동
const handleMyLocation = async () => {
  if (isLocating.value) return

  isLocating.value = true

  try {
    await requestLocation()

    if (location.value && map.value) {
      map.value.setCenter(new naver.maps.LatLng(location.value.lat, location.value.lng))
      // 배율은 변경하지 않음
      updateMyLocationMarker(location.value.lat, location.value.lng)
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

  // 100m 이상 이동했으면 버튼 표시
  showSearchButton.value = distance > 100
}

// 🗺️ 지도 초기화
onMounted(async () => {
  try {
    const defaultCenter = {lat: 37.5665, lng: 126.978}

    await initMap(mapContainer.value, {
      center: defaultCenter,
      zoom: 15,
    })

    // SavedView에서 선택된 폴더 정보 확인 (Pinia store에서)
    const hasSelectedFolder = savedStore.selectedFolder && savedStore.selectedFolderCafes.length > 0

    if (hasSelectedFolder) {
      // 저장된 폴더의 카페를 지도에 표시
      renderMarkers(savedStore.selectedFolderCafes, true)

      // 사용 후 store 초기화 (다음 방문 시 기본 지도 표시)
      savedStore.clearSelectedFolder()
    } else {
      let centerLat = defaultCenter.lat
      let centerLng = defaultCenter.lng

      // 🗺️ 현재 위치 요청 (실패해도 지도는 표시)
      try {
        await requestLocation()
        // 현재 위치로 지도 이동
        if (location.value && map.value) {
          centerLat = location.value.lat
          centerLng = location.value.lng
          map.value.setCenter(new naver.maps.LatLng(centerLat, centerLng))
          // 내 위치 마커 표시
          updateMyLocationMarker(centerLat, centerLng)
        }
      } catch {
        // 위치 권한 거부 또는 타임아웃 - 기본 위치 사용
        console.warn('[지도] 현재 위치를 가져올 수 없어 기본 위치를 사용합니다.')
      }

      // 초기 검색
      const radius = getRadiusFromBounds()
      const storeList = await fetchStores(centerLat, centerLng, radius)
      renderMarkers(storeList, false)

      // 마지막 검색 위치 저장
      lastSearchCenter.value = { lat: centerLat, lng: centerLng }
    }

    // 지도 이동 완료 시 "이 지역 검색" 버튼 표시 여부 확인
    if (map.value) {
      naver.maps.Event.addListener(map.value, 'idle', () => {
        checkShowSearchButton()
      })
    }
  } catch (error) {
    console.error('[MapView] 초기화 실패:', error)
    toast.error('지도를 불러오는데 실패했습니다.')
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Floating 알림 버튼 - BaseHeader와 동일한 위치 및 크기 */
.floating-notification-button {
  position: absolute;
  top: 0.5rem;
  right: 1.25rem;
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
  border-radius: 0.5rem;
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
    top: max(0.5rem, env(safe-area-inset-top));
    right: max(1.25rem, env(safe-area-inset-right));
  }

  .search-area-button {
    top: max(0.75rem, env(safe-area-inset-top));
  }

  .map-controls {
    right: max(1rem, env(safe-area-inset-right));
  }
}
</style>
