<template>
    <div class="timeline-map-mode">
        <!-- 헤더 -->
        <header class="map-header">
            <button class="back-button" @click="handleClose">
                <BaseIcon name="chevron-left" :size="20" />
            </button>
            <h1 class="header-title">{{ monthLabel }} 커피여정</h1>
            <div class="header-spacer"></div>
        </header>

        <!-- 지도 영역 -->
        <div ref="mapContainer" class="map-container">
            <!-- 마커 클릭 팝업 (MarkerPopup 재사용) -->
            <MarkerPopup
:store="popupStore" :position="popupPosition" @close="showMarkerPopup = false"
                @detail="goToStoreDetail" />
        </div>

        <!-- 페이지네이션 (지도 위에 플로팅) -->
        <div class="floating-pagination">
            <button class="nav-button" :disabled="currentIndex === 0" @click="goToPrev">
                <BaseIcon name="chevron-left" :size="20" />
            </button>
            <span class="page-info">{{ currentIndex + 1 }} / {{ records.length }}</span>
            <button class="nav-button" :disabled="currentIndex === records.length - 1" @click="goToNext">
                <BaseIcon name="chevron-right" :size="20" />
            </button>
        </div>

        <!-- 하단 기록 카드 -->
        <div class="bottom-info">
            <TimelineRecordCard :record="currentRecord" @detail="goToStoreDetail" @close="handleClose" />
        </div>

        <!-- 상세 정보 모달 -->
        <MapPlaceDetail v-if="showDetailSheet" :place="detailPlace" @close="showDetailSheet = false" />
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { waitForNaverMaps } from '@/composables/useNaverMap'
import BaseIcon from '@/components/common/BaseIcon.vue'
import TimelineRecordCard from '@/components/passport/TimelineRecordCard.vue'
import MapPlaceDetail from '@/components/map/MapPlaceDetail.vue'
import MarkerPopup from '@/components/map/MarkerPopup.vue'
import { useMapPopup } from '@/composables/useMapPopup'

const props = defineProps({
    records: {
        type: Array,
        required: true
    },
    initialIndex: {
        type: Number,
        default: 0
    },
    month: {
        type: Number,
        default: null
    }
})

const emit = defineEmits(['close', 'index-change'])
const router = useRouter()

// 상태
const mapContainer = ref(null)
const map = ref(null)
const marker = ref(null)
const polylines = ref([])
const currentIndex = ref(props.initialIndex)
const showDetailSheet = ref(false)

// useMapPopup composable 사용
const {
    popupStore,
    popupPosition,
    updatePopupPosition,
    throttledUpdatePopupPosition,
    showPopupOnly,
    closePopup,
    cleanup: cleanupPopup
} = useMapPopup(map)

// 현재 기록
const currentRecord = computed(() => props.records[currentIndex.value])

// MapPlaceDetail용 장소 데이터
const detailPlace = computed(() => {
    if (!currentRecord.value) return null
    return {
        storeId: currentRecord.value.storeId,
        name: currentRecord.value.storeName,
        address: currentRecord.value.storeAddress,
        description: `${currentRecord.value.beanOrigin} 원두로 만든 ${currentRecord.value.menuName}`
    }
})

// 월 라벨
const monthLabel = computed(() => props.month ? `${props.month}월` : '')

// ============================================================
// 베지어 곡선 경로 생성
// ============================================================
const createBezierCurve = (from, to, numPoints = 30) => {
    const points = []

    const midLat = (from.latitude + to.latitude) / 2
    const midLng = (from.longitude + to.longitude) / 2

    const distance = Math.sqrt(
        Math.pow(to.latitude - from.latitude, 2) +
        Math.pow(to.longitude - from.longitude, 2)
    )
    const curveHeight = distance * 0.15

    const controlLat = midLat + curveHeight
    const controlLng = midLng

    for (let t = 0; t <= 1; t += 1 / numPoints) {
        const lat = Math.pow(1 - t, 2) * from.latitude +
            2 * (1 - t) * t * controlLat +
            Math.pow(t, 2) * to.latitude
        const lng = Math.pow(1 - t, 2) * from.longitude +
            2 * (1 - t) * t * controlLng +
            Math.pow(t, 2) * to.longitude
        points.push(new window.naver.maps.LatLng(lat, lng))
    }

    return points
}

// 모든 경로 그리기
const drawAllPaths = () => {
    if (!map.value || props.records.length < 2) return

    polylines.value.forEach(line => line.setMap(null))
    polylines.value = []

    for (let i = 0; i < props.records.length - 1; i++) {
        const from = props.records[i]
        const to = props.records[i + 1]

        const curvePoints = createBezierCurve(from, to)

        const polyline = new window.naver.maps.Polyline({
            map: map.value,
            path: curvePoints,
            strokeColor: '#846148',
            strokeWeight: 2,
            strokeOpacity: 0.6,
            strokeStyle: 'shortdash'
        })

        polylines.value.push(polyline)
    }
}

// ============================================================
// 지도 초기화 및 마커
// ============================================================
const initMap = async () => {
    try {
        await waitForNaverMaps()
        if (!mapContainer.value) return

        const initialRecord = currentRecord.value
        const center = initialRecord
            ? new window.naver.maps.LatLng(initialRecord.latitude, initialRecord.longitude)
            : new window.naver.maps.LatLng(37.5665, 126.9780)

        const zoom = props.records.length > 1 ? 13 : 16

        map.value = new window.naver.maps.Map(mapContainer.value, {
            center,
            zoom,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false
        })

        // 지도 이동/확대 시 팝업 위치 업데이트
        window.naver.maps.Event.addListener(map.value, 'idle', updatePopupPosition)
        window.naver.maps.Event.addListener(map.value, 'zoom_changed', throttledUpdatePopupPosition)
        window.naver.maps.Event.addListener(map.value, 'drag', throttledUpdatePopupPosition)
        window.naver.maps.Event.addListener(map.value, 'center_changed', throttledUpdatePopupPosition)

        // 모든 경로 그리기
        drawAllPaths()

        // 현재 위치 마커 생성
        createMarker()

        // 경계에 맞게 지도 조정
        fitBounds()
    } catch (error) {
        console.error('Failed to initialize map:', error)
    }
}

// 지도 경계 조정
const fitBounds = () => {
    if (!map.value || props.records.length === 0) return

    const bounds = new window.naver.maps.LatLngBounds()
    props.records.forEach(record => {
        bounds.extend(new window.naver.maps.LatLng(record.latitude, record.longitude))
    })

    map.value.fitBounds(bounds, {
        top: 80,
        right: 40,
        bottom: 320,
        left: 40
    })
}

// 마커 생성 (기존 커피 아이콘 + 깜빡임)
const createMarker = () => {
    if (!currentRecord.value || !map.value) return

    const position = new window.naver.maps.LatLng(
        currentRecord.value.latitude,
        currentRecord.value.longitude
    )

    if (marker.value) {
        marker.value.setPosition(position)
    } else {
        marker.value = new window.naver.maps.Marker({
            position,
            map: map.value,
            icon: {
                content: `<div class="timeline-marker">
                    <div class="marker-pin">☕</div>
                    <div class="marker-pulse"></div>
                </div>`,
                anchor: new window.naver.maps.Point(20, 20)
            },
            zIndex: 100
        })

        // 마커 클릭 이벤트
        window.naver.maps.Event.addListener(marker.value, 'click', () => {
            // 팝업이 열려있으면 닫기, 아니면 열기
            if (popupStore.value) {
                closePopup()
            } else {
                // 현재 기록을 store 형식으로 변환하여 팝업 표시
                const storeData = {
                    storeId: currentRecord.value.storeId,
                    name: currentRecord.value.storeName,
                    address: currentRecord.value.storeAddress,
                    category: '카페',
                    latitude: currentRecord.value.latitude,
                    longitude: currentRecord.value.longitude
                }
                showPopupOnly(storeData)
            }
        })
    }
}

// 현재 기록으로 이동
const moveToCurrentRecord = () => {
    if (!currentRecord.value || !map.value) return

    const position = new window.naver.maps.LatLng(
        currentRecord.value.latitude,
        currentRecord.value.longitude
    )

    map.value.panTo(position)
    createMarker()
}

// ============================================================
// 네비게이션
// ============================================================
const goToPrev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--
        emit('index-change', currentIndex.value)
    }
}

const goToNext = () => {
    if (currentIndex.value < props.records.length - 1) {
        currentIndex.value++
        emit('index-change', currentIndex.value)
    }
}

// 상세 페이지 이동
const goToStoreDetail = () => {
    if (currentRecord.value?.storeId) {
        router.push(`/store/${currentRecord.value.storeId}`)
    }
}

// 닫기
const handleClose = () => {
    emit('close')
}

// 인덱스 변경 감시
watch(currentIndex, moveToCurrentRecord)

onMounted(initMap)

onUnmounted(() => {
    if (marker.value) marker.value.setMap(null)
    polylines.value.forEach(line => line.setMap(null))
})
</script>

<style scoped>
.timeline-map-mode {
    position: fixed;
    inset: 0;
    background-color: var(--color-background);
    z-index: 100;
    display: flex;
    flex-direction: column;
}

/* 헤더 */
.map-header {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    background: white;
    border-bottom: 1px solid var(--color-border);
    gap: 0.5rem;
    z-index: 10;
}

.back-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    color: var(--color-primary-700);
}

.back-button:hover {
    background-color: var(--color-primary-50);
}

.header-title {
    flex: 1;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary-800);
    margin: 0;
    text-align: center;
}

.header-spacer {
    width: 40px;
}

/* 지도 */
.map-container {
    flex: 1;
    position: relative;
}

/* 플로팅 페이지네이션 */
.floating-pagination {
    position: absolute;
    bottom: 300px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
    background: white;
    border-radius: 24px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    z-index: 20;
}

.nav-button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-primary-50);
    border: 1px solid var(--color-primary-200);
    border-radius: 50%;
    cursor: pointer;
    color: var(--color-primary-700);
    transition: all 0.2s;
}

.nav-button:hover:not(:disabled) {
    background: var(--color-primary-100);
}

.nav-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-info {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-primary-700);
    min-width: 50px;
    text-align: center;
}

/* 하단 정보 */
.bottom-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 15;
}
</style>

<style>
/* 타임라인 마커 (커피 아이콘 + 깜빡임) */
.timeline-marker {
    position: relative;
    width: 40px;
    height: 40px;
}

.marker-pin {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%);
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(132, 97, 72, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.marker-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: rgba(132, 97, 72, 0.3);
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }

    100% {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}
</style>
