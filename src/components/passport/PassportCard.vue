<template>
  <div class="passport-card" :class="{ 'unavailable': !passport.isAvailable }" @click="handleClick">
    <!-- 커버 이미지 영역 -->
    <div class="card-cover">
      <img
v-if="passport.coverImageUrl" :src="passport.coverImageUrl" :alt="`${passport.month}월 커피 여정`"
        class="cover-image" />
      <div v-else class="cover-placeholder">
        <div class="placeholder-map">
          <span class="map-icon">🗺️</span>
          <span class="placeholder-text">{{ passport.month }}월의 커피 여정</span>
        </div>
      </div>

      <!-- 그라데이션 오버레이 -->
      <div class="cover-overlay"></div>

      <!-- 월 라벨 -->
      <div class="month-badge">{{ passport.month }}월</div>
    </div>

    <!-- 카드 컨텐츠 -->
    <div class="card-content">
      <template v-if="passport.isAvailable">
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-icon">☕</span>
            <span class="stat-value">{{ passport.totalCoffeeCount }}</span>
            <span class="stat-label">잔</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-icon">🏪</span>
            <span class="stat-value">{{ passport.totalStoreCount }}</span>
            <span class="stat-label">곳</span>
          </div>
          <div v-if="passport.topOrigin" class="stat-divider"></div>
          <div v-if="passport.topOrigin" class="stat-item origin">
            <span class="stat-icon">🌍</span>
            <span class="origin-name">{{ passport.topOrigin }}</span>
          </div>
        </div>

        <!-- 미니 경로 표시 (원산지 순서) -->
        <div v-if="passport.originSequence?.length" class="route-preview">
          <span v-for="(origin, idx) in passport.originSequence.slice(0, 4)" :key="idx" class="route-dot">
            {{ origin }}
            <span v-if="idx < Math.min(passport.originSequence.length, 4) - 1" class="route-arrow">→</span>
          </span>
        </div>
      </template>

      <template v-else>
        <div class="empty-state">
          <span class="empty-icon">✈️</span>
          <span class="empty-text">아직 시작되지 않은 여정</span>
        </div>
      </template>
    </div>

    <!-- 화살표 아이콘 -->
    <div v-if="passport.isAvailable" class="card-arrow">
      <span>→</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  passport: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.passport)
}
</script>

<style scoped>
.passport-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(99, 73, 54, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.passport-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 73, 54, 0.15);
}

.passport-card.unavailable {
  cursor: not-allowed;
  opacity: 0.7;
}

.passport-card.unavailable:hover {
  transform: none;
  box-shadow: 0 4px 16px rgba(99, 73, 54, 0.1);
}

/* 커버 이미지 영역 */
.card-cover {
  position: relative;
  height: 140px;
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
  background: linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-primary-200) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.map-icon {
  font-size: 2.5rem;
  opacity: 0.6;
}

.placeholder-text {
  font-size: 0.875rem;
  color: var(--color-primary-600);
  opacity: 0.8;
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
}

.month-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 0.375rem 0.75rem;
  background-color: rgba(255, 255, 255, 0.95);
  color: var(--color-primary-700);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 카드 컨텐츠 */
.card-content {
  padding: 1rem 1.25rem;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 1rem;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary-700);
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
}

.stat-divider {
  width: 1px;
  height: 20px;
  background-color: var(--color-border);
}

.stat-item.origin {
  flex: 1;
  justify-content: flex-end;
}

.origin-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary-600);
}

/* 경로 미리보기 */
.route-preview {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.route-dot {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-textSecondary);
}

.route-arrow {
  color: var(--color-primary-400);
}

/* 빈 상태 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.empty-icon {
  font-size: 1.25rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 0.875rem;
  color: var(--color-textSecondary);
}

/* 화살표 */
.card-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-50);
  border-radius: 50%;
  color: var(--color-primary-600);
  font-size: 1rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.passport-card:hover .card-arrow {
  opacity: 1;
}
</style>
