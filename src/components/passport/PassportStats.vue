<template>
  <div class="passport-stats">
    <!-- 메인 통계 카드 -->
    <div class="main-stats-card">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon-wrapper coffee">
            <BaseIcon name="coffee" :size="24" color="var(--color-primary-600)" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ info.totalCoffeeCount }}</span>
            <span class="stat-label">잔의 커피</span>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon-wrapper store">
            <BaseIcon name="map-marker" :size="24" color="#43a047" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ info.totalStoreCount }}</span>
            <span class="stat-label">곳 방문</span>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon-wrapper bean">
            <BaseIcon name="globe" :size="24" color="#1976d2" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ info.totalBeanCount }}</span>
            <span class="stat-label">가지 원두</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 하이라이트 카드 -->
    <div class="highlight-cards">
      <!-- 주요 원산지 -->
      <div class="highlight-card origin">
        <div class="highlight-header">
          <BaseIcon name="star-fill" :size="16" color="#f9a825" />
          <span class="highlight-label">이번 달 최다</span>
        </div>
        <div class="highlight-value">{{ info.topOrigin || '없음' }}</div>
        <div class="highlight-sublabel">주요 원산지</div>
      </div>

      <!-- 주요 로스터리 -->
      <div class="highlight-card roastery">
        <div class="highlight-header">
          <BaseIcon name="bookmark-fill" :size="16" color="var(--color-primary-500)" />
          <span class="highlight-label">단골 카페</span>
        </div>
        <div class="highlight-value small">{{ info.topRoastery || '없음' }}</div>
        <div class="highlight-sublabel">가장 많이 방문</div>
      </div>
    </div>

    <!-- 원산지 여정 (있을 경우) -->
    <div v-if="info.originSequence?.length" class="journey-card">
      <div class="journey-header">
        <BaseIcon name="mapPin" :size="18" color="var(--color-primary-600)" />
        <span class="journey-title">이번 달 커피 여정</span>
      </div>
      <div class="journey-route">
        <span v-for="(origin, idx) in info.originSequence" :key="idx" class="route-stop">
          <span class="stop-name">{{ origin }}</span>
          <span v-if="idx < info.originSequence.length - 1" class="route-line">
            <span class="route-dot"></span>
            <span class="route-dash"></span>
          </span>
        </span>
      </div>
      <div v-if="info.totalOriginDistance" class="journey-distance">
        총 {{ formatDistance(info.totalOriginDistance) }} km 여정
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseIcon from '@/components/common/BaseIcon.vue'

const props = defineProps({
  info: {
    type: Object,
    required: true
  }
})

const formatDistance = (distance) => {
  return Math.round(distance).toLocaleString()
}
</script>

<style scoped>
.passport-stats {
  padding: 1.25rem;
  margin-top: -40px;
  position: relative;
  z-index: 10;
}

/* 메인 통계 카드 */
.main-stats-card {
  background: white;
  border-radius: 20px;
  padding: 1.25rem;
  box-shadow: 0 8px 24px rgba(99, 73, 54, 0.1);
  margin-bottom: 1rem;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrapper.coffee {
  background: linear-gradient(135deg, #f8e9d9 0%, #f0dcc7 100%);
}

.stat-icon-wrapper.store {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

.stat-icon-wrapper.bean {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary-700);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-textSecondary);
}

/* 하이라이트 카드 */
.highlight-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.highlight-card {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(99, 73, 54, 0.06);
  position: relative;
  overflow: hidden;
}

.highlight-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.highlight-card.origin::before {
  background: linear-gradient(90deg, #FFD700, #FFA500);
}

.highlight-card.roastery::before {
  background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600));
}

.highlight-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}

.highlight-label {
  font-size: 0.6875rem;
  color: var(--color-textSecondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.highlight-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary-700);
  margin-bottom: 0.125rem;
}

.highlight-value.small {
  font-size: 1rem;
}

.highlight-sublabel {
  font-size: 0.6875rem;
  color: var(--color-textSecondary);
}

/* 여정 카드 */
.journey-card {
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%);
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid var(--color-primary-200);
}

.journey-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.journey-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-primary-700);
}

.journey-route {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

.route-stop {
  display: flex;
  align-items: center;
}

.stop-name {
  background: white;
  padding: 0.25rem 0.625rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-primary-700);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.route-line {
  display: flex;
  align-items: center;
  margin: 0 0.25rem;
}

.route-dot {
  width: 4px;
  height: 4px;
  background-color: var(--color-primary-400);
  border-radius: 50%;
}

.route-dash {
  width: 12px;
  height: 2px;
  background-color: var(--color-primary-300);
  margin-left: 2px;
}

.journey-distance {
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: var(--color-primary-600);
  text-align: right;
}
</style>
