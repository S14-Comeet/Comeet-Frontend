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
import {ref, onMounted} from 'vue'
import {useNaverMap} from '@/composables/useNaverMap'
import {useGeolocation} from '@/composables/useGeolocation'
import {useToast} from 'vue-toastification'
import MapPlaceInfo from "@/components/map/MapPlaceInfo.vue";
import MapPlaceDetail from "@/components/map/MapPlaceDetail.vue";



const toast = useToast()
const mapContainer = ref(null)
const isLoading = ref(true)
const {location, requestLocation} = useGeolocation()
const {map, initMap, addMarker, clearMarkers} = useNaverMap()
const selectedPlace = ref(null)
const detailPlace = ref(null)

// 🗺️ Mock 카페 데이터
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

const renderMarkers = () => {
  clearMarkers()

  mockCafes.forEach((cafe) => {
    addMarker({
      position: {lat: cafe.lat, lng: cafe.lng},
      title: cafe.name,
      onClick: () => handleMarkerClick(cafe),
    })
  })
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

    // 🗺️ Mock 마커 렌더링
    renderMarkers()
  } catch (error) {
    console.error('[지도] 초기화 실패:', error)
    toast.error('지도를 불러오는데 실패했습니다.')
  } finally {
    // 항상 로딩 상태 해제
    isLoading.value = false
  }
})


</script>
