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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNaverMap } from '@/composables/useNaverMap'
import { useGeolocation } from '@/composables/useGeolocation'
import { useMapMarkers } from '@/composables/useMapMarkers'
import { useMapPopup } from '@/composables/useMapPopup'
import { useMapControls } from '@/composables/useMapControls'
import { useToast } from 'vue-toastification'
import { useNotificationStore } from '@/store/notification'
import { useAuthStore } from '@/store/auth'
import { useSavedStore } from '@/store/saved'
import { getStoresByLocation } from '@/api/cafe'
import { calculateDistance, formatDistance } from '@/utils/geo'
import { createLogger } from '@/utils/logger'
import MarkerPopup from "@/components/map/MarkerPopup.vue"
import MapPlaceDetail from "@/components/map/MapPlaceDetail.vue"
import StoreListSheet from "@/components/map/StoreListSheet.vue"
import BaseIcon from '@/components/common/BaseIcon.vue'

const logger = createLogger('MapView')
const router = useRouter()
const toast = useToast()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()
const savedStore = useSavedStore()

// 기본 상태
const mapContainer = ref(null)
const isLoading = ref(true)
const isSearching = ref(false)
const isLocating = ref(false)
const showSearchButton = ref(false)
const detailPlace = ref(null)
const stores = ref([])
const userLocation = ref(null)
const lastSearchCenter = ref(null)
const forceSheetState = ref(null)

// 검색 관련 상태
const isGlobalSearch = ref(false)
const searchKeyword = ref('')
const searchCategories = ref([])
const searchLocation = ref(null) // 검색용 위치 (키워드/"이 지역" 검색 시에만 업데이트)

// Composables
const { location, requestLocation } = useGeolocation()
const { map, markers, initMap, addMarker, clearMarkers } = useNaverMap()

// Map composables (map이 초기화된 후 사용)
const {
  updateMyLocationMarker,
  updateMarkerSizes,
  renderMarkers: renderMarkersBase,
  cleanup: cleanupMarkers
} = useMapMarkers(map, markers, clearMarkers, addMarker)

const {
  popupStore,
  popupPosition,
  updatePopupPosition,
  throttledUpdatePopupPosition,
  showPopupOnly,
  closePopup,
  cleanup: cleanupPopup
} = useMapPopup(map)

const {
  focusedLocation,
  sheetState,
  controlsBottomStyle,
  getRadiusFromBounds,
  panToWithOffset,
  handleZoomIn,
  handleZoomOut,
  setFocusedLocation,
  clearFocusedLocation,
  setSheetState
} = useMapControls(map)

// 인증 상태
const isAuthenticated = computed(() => authStore.isAuthenticated)
const hasUnreadNotifications = computed(() => notificationStore.hasUnread)

// 알림 아이콘 클릭 핸들러
const handleNotificationClick = () => {
  router.push('/notifications')
}

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
    logger.error('가게 목록 조회 실패', error)
    return []
  }
}

// 마커 렌더링 (클릭 핸들러 포함)
const renderMarkers = (cafes = [], moveToFirst = false) => {
  renderMarkersBase(cafes, handleMarkerClick)

  if (moveToFirst && cafes.length > 0 && map.value) {
    const firstCafe = cafes[0]
    const lat = firstCafe.lat || firstCafe.latitude
    const lng = firstCafe.lng || firstCafe.longitude
    map.value.setZoom(13)
    setTimeout(() => {
      panToWithOffset(lat, lng, { offsetRatio: 0.3 })
    }, 50)
  }
}

// 지도 이동 후 팝업 표시
const showStorePopup = (store) => {
  if (!map.value) return

  const lat = store.lat || store.latitude
  const lng = store.lng || store.longitude

  panToWithOffset(lat, lng, { offsetRatio: 0.25 })

  setTimeout(() => {
    popupStore.value = store
    updatePopupPosition()
  }, 150)
}

// 마커 클릭 핸들러
const handleMarkerClick = (cafe) => {
  const lat = cafe.lat || cafe.latitude
  const lng = cafe.lng || cafe.longitude
  setFocusedLocation(lat, lng)
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

// 바텀시트에서 가게 선택
const handleStoreSelect = (store) => {
  if (store) {
    const lat = store.lat || store.latitude
    const lng = store.lng || store.longitude
    setFocusedLocation(lat, lng)

    forceSheetState.value = 'half'
    setTimeout(() => {
      forceSheetState.value = null
    }, 100)

    showStorePopup(store)
  }
}

// 검색 실행
const handleSearch = async (searchParams) => {
  if (!map.value) return

  isSearching.value = true
  showSearchButton.value = false

  try {
    let lat, lng, radius
    const isKeywordSearch = searchParams.searchType !== 'category'

    // 카테고리 검색일 때는 저장된 searchLocation 사용
    if (searchParams.searchType === 'category' && searchLocation.value) {
      lat = searchLocation.value.lat
      lng = searchLocation.value.lng
      radius = searchLocation.value.radius
    } else if (searchParams.isGlobalSearch) {
      // 전국 검색
      if (userLocation.value) {
        lat = userLocation.value.lat
        lng = userLocation.value.lng
      } else {
        const center = map.value.getCenter()
        lat = center.lat()
        lng = center.lng()
      }
      radius = 50000

      // 키워드 검색 시 위치 저장
      if (isKeywordSearch) {
        searchLocation.value = { lat, lng, radius }
      }
    } else {
      // 지도 영역 검색
      const center = map.value.getCenter()
      lat = center.lat()
      lng = center.lng()
      radius = getRadiusFromBounds()

      // 키워드 검색 시 위치 저장
      if (isKeywordSearch) {
        searchLocation.value = { lat, lng, radius }
      }
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
  setSheetState(state)

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
    const lat = center.lat()
    const lng = center.lng()

    // 검색 위치 저장
    searchLocation.value = { lat, lng, radius }

    // 검색어/카테고리 초기화 (이 지역 검색은 새 검색)
    searchKeyword.value = ''
    searchCategories.value = []

    const storeList = await fetchStores(lat, lng, radius)
    renderMarkers(storeList, false)

    lastSearchCenter.value = { lat, lng }

    if (storeList.length === 0) {
      toast.info('이 지역에 등록된 카페가 없습니다.')
    }
  } finally {
    isSearching.value = false
  }
}

// 내 위치로 이동
const handleMyLocation = async () => {
  if (isLocating.value) return

  isLocating.value = true

  try {
    await requestLocation()

    if (location.value && map.value) {
      panToWithOffset(location.value.lat, location.value.lng, { offsetRatio: 0.3 })
      updateMyLocationMarker(location.value.lat, location.value.lng)
      userLocation.value = { lat: location.value.lat, lng: location.value.lng }
      setFocusedLocation(location.value.lat, location.value.lng)
      showSearchButton.value = true
    }
  } catch {
    toast.error('현재 위치를 가져올 수 없습니다.')
  } finally {
    isLocating.value = false
  }
}

// 지도 이동 시 검색 버튼 표시 여부
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
    const defaultCenter = { lat: 37.5665, lng: 126.978 }

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
          panToWithOffset(centerLat, centerLng, { offsetRatio: 0.3 })
          updateMyLocationMarker(centerLat, centerLng)
          userLocation.value = { lat: centerLat, lng: centerLng }
          setFocusedLocation(centerLat, centerLng)
        }
      } catch {
        logger.warn('현재 위치를 가져올 수 없어 기본 위치를 사용합니다.')
      }

      const radius = getRadiusFromBounds()
      const storeList = await fetchStores(centerLat, centerLng, radius)
      renderMarkers(storeList, false)

      lastSearchCenter.value = { lat: centerLat, lng: centerLng }
      // 초기 검색 위치 저장
      searchLocation.value = { lat: centerLat, lng: centerLng, radius }
    }

    if (map.value) {
      naver.maps.Event.addListener(map.value, 'idle', () => {
        checkShowSearchButton()
        updatePopupPosition()
      })

      naver.maps.Event.addListener(map.value, 'zoom_changed', () => {
        throttledUpdatePopupPosition()
        updateMarkerSizes()
      })
      naver.maps.Event.addListener(map.value, 'center_changed', throttledUpdatePopupPosition)
      naver.maps.Event.addListener(map.value, 'drag', () => {
        throttledUpdatePopupPosition()
        clearFocusedLocation()
      })
      naver.maps.Event.addListener(map.value, 'zooming', throttledUpdatePopupPosition)

      naver.maps.Event.addListener(map.value, 'click', closePopup)
    }
  } catch (error) {
    logger.error('초기화 실패', error)
    toast.error('지도를 불러오는데 실패했습니다.')
  } finally {
    isLoading.value = false
  }
})

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  cleanupPopup()
  cleanupMarkers()
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
