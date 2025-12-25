<template>
  <div class="passport-stats">
    
    <div class="main-stats-card">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon-wrapper">
            <BaseIcon name="coffee" :size="22" color="var(--color-primary-600)" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ info.totalCoffeeCount }}</span>
            <span class="stat-label">잔</span>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon-wrapper">
            <BaseIcon name="map-marker" :size="22" color="var(--color-primary-600)" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ info.totalStoreCount }}</span>
            <span class="stat-label">곳</span>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon-wrapper">
            <BaseIcon name="globe" :size="22" color="var(--color-primary-600)" />
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ info.totalBeanCount }}</span>
            <span class="stat-label">원두</span>
          </div>
        </div>
      </div>
    </div>

    
    <div class="highlight-cards">
      
      <div class="highlight-card">
        <div class="highlight-header">
          <BaseIcon name="star-fill" :size="14" color="var(--color-primary-500)" />
          <span class="highlight-label">최다 원산지</span>
        </div>
        <div class="highlight-value">{{ info.topOrigin || '없음' }}</div>
      </div>

      
      <div class="highlight-card">
        <div class="highlight-header">
          <BaseIcon name="bookmark-fill" :size="14" color="var(--color-primary-500)" />
          <span class="highlight-label">단골 카페</span>
        </div>
        <div class="highlight-value small">{{ info.topRoastery || '없음' }}</div>
      </div>
    </div>

    
    <div v-if="info.originSequence?.length" class="journey-card">
      <div class="journey-header">
        <BaseIcon name="mapPin" :size="16" color="var(--color-primary-600)" />
        <span class="journey-title">커피 여정</span>
        <span v-if="info.totalOriginDistance" class="journey-distance">
          {{ formatDistance(info.totalOriginDistance) }}km
        </span>
      </div>
      <div class="journey-route">
        <template v-for="(origin, idx) in info.originSequence" :key="idx">
          <span class="stop-badge">{{ origin }}</span>
          <BaseIcon
v-if="idx < info.originSequence.length - 1" name="chevron-right" :size="12"
            color="var(--color-primary-400)" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseIcon from '@/components/common/BaseIcon.vue'

defineProps({
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
  padding: var(--space-lg) var(--page-padding);
}

/* 메인 통계 카드 */
.main-stats-card {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(132, 97, 72, 0.1);
  margin-bottom: 0.75rem;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}

.stat-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-100);
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-primary-700);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.6875rem;
  color: var(--color-primary-500);
}

/* 하이라이트 카드 */
.highlight-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
  margin-bottom: 0.75rem;
}

.highlight-card {
  background: white;
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 0 2px 8px rgba(132, 97, 72, 0.06);
  border: 1px solid var(--color-primary-100);
}

.highlight-header {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
}

.highlight-label {
  font-size: 0.625rem;
  color: var(--color-primary-500);
  font-weight: 500;
}

.highlight-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary-700);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.highlight-value.small {
  font-size: 0.875rem;
}

/* 여정 카드 */
.journey-card {
  background: var(--color-primary-50);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-primary-200);
}

.journey-header {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}

.journey-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-primary-700);
  flex: 1;
}

.journey-distance {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-primary-500);
  background: white;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.journey-route {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

.stop-badge {
  background: white;
  padding: 0.1875rem 0.5rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-primary-700);
  border: 1px solid var(--color-primary-200);
}

.stop-more {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-primary-500);
  padding: 0.1875rem 0.375rem;
}

/* 반응형: 작은 화면 (360px 이하) */
@media (max-width: 360px) {
  .passport-stats {
    padding: 0.875rem 1rem;
  }

  .main-stats-card {
    padding: 0.875rem;
  }

  .stat-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  /* 하이라이트 카드 1열로 변경 */
  .highlight-cards {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .highlight-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.625rem 0.75rem;
  }

  .highlight-header {
    margin-bottom: 0;
  }

  .highlight-value {
    font-size: 0.9375rem;
    margin-left: auto;
  }

  .highlight-value.small {
    font-size: 0.875rem;
  }

  .stop-badge {
    padding: 0.125rem 0.375rem;
    font-size: 0.625rem;
  }
}

/* 반응형: 중간 화면 (361px - 400px) */
@media (min-width: 361px) and (max-width: 400px) {
  .stat-value {
    font-size: 1.25rem;
  }

  .highlight-value {
    font-size: 0.9375rem;
  }

  .highlight-value.small {
    font-size: 0.8125rem;
  }
}
</style>
