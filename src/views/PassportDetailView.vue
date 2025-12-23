<template>
  <div class="passport-detail-view">
    <!-- 상단 커버 영역 -->
    <div class="cover-section">
      <img
v-if="passportStore.currentPassport?.coverImageUrl" :src="passportStore.currentPassport.coverImageUrl"
        alt="커버 이미지" class="cover-image" />
      <div v-else class="cover-placeholder">
        <div class="cover-pattern"></div>
      </div>

      <!-- 그라데이션 오버레이 -->
      <div class="cover-overlay"></div>

      <!-- 뒤로가기 버튼 -->
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
      </button>

      <!-- 월 타이틀 -->
      <div class="cover-title">
        <h1 class="month-title">{{ monthLabel }}</h1>
        <p class="year-subtitle">{{ passportStore.currentPassport?.year }}년 커피 여정</p>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="passportStore.isLoading" class="loading-container">
      <div class="skeleton-stats skeleton"></div>
      <div class="skeleton-timeline">
        <div v-for="n in 3" :key="n" class="skeleton-item skeleton"></div>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="passportStore.error" class="error-container">
      <p class="error-message">{{ passportStore.error }}</p>
      <button class="retry-button" @click="loadPassportDetail">다시 시도</button>
    </div>

    <!-- 콘텐츠 -->
    <template v-else-if="passportStore.currentPassport">
      <!-- 요약 통계 -->
      <PassportStats :info="passportStore.currentPassport.info" />

      <!-- 타임라인 -->
      <section class="timeline-section">
        <div class="section-header">
          <h2 class="section-title">☕ 방문 기록</h2>
          <span class="record-count">{{ passportStore.sortedRecords.length }}건</span>
        </div>

        <div v-if="passportStore.sortedRecords.length === 0" class="empty-state">
          <div class="empty-icon">✈️</div>
          <p class="empty-message">이번 달은 아직 커피 여정이 없어요</p>
          <button class="cta-button" @click="goToMap">
            <span>🗺️</span> 카페 찾으러 가기
          </button>
        </div>

        <PassportTimeline
v-else :grouped-records="passportStore.groupedRecords"
          @item-click="handleTimelineItemClick" />
      </section>
    </template>

    <!-- 타임라인 지도 모드 -->
    <TimelineMapMode
v-if="isMapMode" :records="passportStore.sortedRecords" :initial-index="mapModeIndex"
      :month="passportStore.currentPassport?.month" @close="closeMapMode" @index-change="handleMapIndexChange" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePassportStore } from '@/store/passport'
import PassportStats from '@/components/passport/PassportStats.vue'
import PassportTimeline from '@/components/passport/PassportTimeline.vue'
import TimelineMapMode from '@/components/passport/TimelineMapMode.vue'

const route = useRoute()
const router = useRouter()
const passportStore = usePassportStore()

const passportId = computed(() => route.params.passportId)

const monthLabel = computed(() => {
  const month = passportStore.currentPassport?.month
  return month ? `${month}월` : ''
})

// 지도 모드 상태
const isMapMode = ref(false)
const mapModeIndex = ref(0)

const loadPassportDetail = async () => {
  try {
    await passportStore.fetchPassportDetail(passportId.value)
  } catch (error) {
    console.error('Failed to load passport detail:', error)
  }
}

const goBack = () => {
  router.back()
}

const goToMap = () => {
  router.push('/map')
}

// 타임라인 아이템 클릭 → 지도 모드 진입
const handleTimelineItemClick = (record) => {
  // sortedRecords에서 해당 record의 인덱스 찾기
  const index = passportStore.sortedRecords.findIndex(r => r.visitId === record.visitId)
  mapModeIndex.value = index >= 0 ? index : 0
  isMapMode.value = true
}

// 지도 모드 닫기
const closeMapMode = () => {
  isMapMode.value = false
}

// 지도 모드 인덱스 변경
const handleMapIndexChange = (index) => {
  mapModeIndex.value = index
}

onMounted(() => {
  loadPassportDetail()
})
</script>

<style scoped>
.passport-detail-view {
  background-color: var(--color-background);
}

/* 커버 섹션 */
.cover-section {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%);
  position: relative;
}

.cover-pattern {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

.back-button {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.back-button:hover {
  background-color: white;
  transform: scale(1.05);
}

.back-icon {
  font-size: 1.25rem;
  color: var(--color-primary-700);
}

.cover-title {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 5;
}

.month-title {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  margin: 0;
}

.year-subtitle {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4px;
}

/* 타임라인 섹션 */
.timeline-section {
  padding: 1.25rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary-700);
  margin: 0;
}

.record-count {
  font-size: 0.875rem;
  color: var(--color-textSecondary);
  background-color: var(--color-primary-50);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(99, 73, 54, 0.06);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-message {
  color: var(--color-textSecondary);
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.cta-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(132, 97, 72, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(132, 97, 72, 0.4);
}

/* 로딩 스켈레톤 */
.loading-container {
  padding: 1.25rem;
}

.skeleton-stats {
  height: 120px;
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.skeleton-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-item {
  height: 90px;
  border-radius: 12px;
}

/* 에러 상태 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.25rem;
  text-align: center;
}

.error-message {
  color: var(--color-error);
  margin-bottom: 1rem;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
</style>
