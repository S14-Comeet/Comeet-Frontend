<template>
  <div class="relative w-full h-screen">
    <!-- 지도 컨테이너 -->
    <div ref="mapContainer" class="w-full h-full"></div>

    <!-- 🗺️ 지도 컨트롤 (우측 상단) -->
    <MapControls
        @request-location="handleRequestLocation"
        class="absolute top-4 right-4 z-10"
    />

    <!-- 로딩 오버레이 -->
    <div
        v-if="isLoading"
        class="absolute inset-0 bg-black/20 flex items-center justify-center z-20"
    >
      <div class="bg-white rounded-lg p-6 shadow-lg">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-text-secondary">지도 로딩 중...</p>
      </div>
    </div>

    <PlaceInfoCard
        v-if="selectedPlace"
        :place="selectedPlace"
        @close="selectedPlace = null"
        @detail="handleShowDetail"
        class="absolute bottom-0 left-0 right-0 z-30"
    />

    <PlaceDetailModal
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
import MapControls from '@/components/map/MapControls.vue'
import PlaceInfoCard from "@/components/map/PlaceInfoCard.vue";
import PlaceDetailModal from "@/components/map/PlaceDetailModal.vue";



const toast = useToast()
const mapContainer = ref(null)
const isLoading = ref(true)
const {location, requestLocation} = useGeolocation()
const {map, initMap, addMarker, clearMarkers} = useNaverMap()
const selectedPlace = ref(null)
const detailPlace = ref(null)


const handleRequestLocation = async () => {
  await requestLocation()
  if (location.value) {
    map.value.setCenter(new naver.maps.LatLng(location.value.lat, location.value.lng))
  }
}

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

    // 🗺️ 현재 위치 요청
    await requestLocation()

    // 현재 위치로 지도 이동
    if (location.value) {
      map.value.setCenter(new naver.maps.LatLng(location.value.lat, location.value.lng))
    }

    // 🗺️ Mock 마커 렌더링
    renderMarkers()

    isLoading.value = false
  } catch (error) {
    console.error('지도 초기화 실패:', error)
    toast.error('지도를 불러오는데 실패했습니다')
    isLoading.value = false
  }
})


</script>
