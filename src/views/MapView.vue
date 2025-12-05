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
      <BaseIcon name="notice" :size="24" color="var(--color-neutral-900)" />
      <!-- 읽지 않은 알림 배지 -->
      <span
        v-if="hasUnreadNotifications"
        class="notification-badge"
      ></span>
    </button>

    <MapPlaceInfo
        v-if="selectedPlace"
        :place="selectedPlace"
        @close="selectedPlace = null"
        @detail="handleShowDetail"
        class="absolute bottom-0 left-0 right-0 z-30"
    />

    <MapPlaceDetail
        v-if="detailPlace"
        :place="detailPlace"
        @close="detailPlace = null"
    />


  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNaverMap } from '@/composables/useNaverMap'
import { useGeolocation } from '@/composables/useGeolocation'
import { useToast } from 'vue-toastification'
import { useNotificationStore } from '@/store/notification'
import { useAuthStore } from '@/store/auth'
import { useSavedStore } from '@/store/saved'
import MapPlaceInfo from "@/components/map/MapPlaceInfo.vue"
import MapPlaceDetail from "@/components/map/MapPlaceDetail.vue"
import BaseIcon from '@/components/common/BaseIcon.vue'

const router = useRouter()
const toast = useToast()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()
const savedStore = useSavedStore()
const mapContainer = ref(null)
const isLoading = ref(true)
const {location, requestLocation} = useGeolocation()
const {map, initMap, addMarker, clearMarkers} = useNaverMap()
const selectedPlace = ref(null)
const detailPlace = ref(null)

// 인증 상태
const isAuthenticated = computed(() => authStore.isAuthenticated)

// 읽지 않은 알림이 있는지
const hasUnreadNotifications = computed(() => notificationStore.hasUnread)

// 알림 아이콘 클릭 핸들러
const handleNotificationClick = () => {
  router.push('/notifications')
}

// Mock 카페 데이터 (개발용)
const mockCafes = [
  {
    id: 1,
    name: '스타벅스 강남역점',
    lat: 37.4979,
    lng: 127.0276,
    category: 'cafe',
  },
  {
    id: 2,
    name: '블루보틀 삼청점',
    lat: 37.5814,
    lng: 126.9835,
    category: 'cafe',
  },
  {
    id: 3,
    name: '폴바셋 홍대점',
    lat: 37.5563,
    lng: 126.9245,
    category: 'cafe',
  },
]

const renderMarkers = (cafes = mockCafes) => {
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

  // 카페 목록이 있을 때 지도 중심 이동
  if (cafes.length > 0 && map.value) {
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
  detailPlace.value = selectedPlace.value
  selectedPlace.value = null
}

// 🗺️ 지도 초기화
onMounted(async () => {
  try {
    await initMap(mapContainer.value, {
      center: {lat: 37.5665, lng: 126.978},
      zoom: 15,
    })

    // SavedView에서 선택된 폴더 정보 확인 (Pinia store에서)
    const hasSelectedFolder = savedStore.selectedFolder && savedStore.selectedFolderCafes.length > 0

    if (hasSelectedFolder) {
      // 저장된 폴더의 카페를 지도에 표시
      renderMarkers(savedStore.selectedFolderCafes)

      // 사용 후 store 초기화 (다음 방문 시 기본 지도 표시)
      savedStore.clearSelectedFolder()
    } else {
      // 🗺️ 현재 위치 요청 (실패해도 지도는 표시)
      try {
        await requestLocation()
        // 현재 위치로 지도 이동
        if (location.value && map.value) {
          map.value.setCenter(new naver.maps.LatLng(location.value.lat, location.value.lng))
        }
      } catch {
        // 위치 권한 거부 또는 타임아웃 - 기본 위치 사용
        console.warn('[지도] 현재 위치를 가져올 수 없어 기본 위치를 사용합니다.')
      }

    // 마커 렌더링
    renderMarkers()
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
  top: 0.5rem; /* 헤더 높이(56px) 기준 중앙 정렬 */
  right: 1.25rem; /* 헤더 px-5와 동일 */
  z-index: 100;
  width: 2.5rem; /* 40px - BaseHeader 아이콘과 동일 */
  height: 2.5rem; /* 40px */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 50%;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.floating-notification-button:hover {
  background-color: rgba(255, 255, 255, 0.95);
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

/* 모바일에서 Safe Area 대응 */
@media (max-width: 640px) {
  .floating-notification-button {
    top: max(0.5rem, env(safe-area-inset-top));
    right: max(1.25rem, env(safe-area-inset-right));
  }
}
</style>

