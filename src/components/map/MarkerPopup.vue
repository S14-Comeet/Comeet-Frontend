<template>
  <transition name="popup">
    <div
      v-if="store"
      class="marker-popup"
      :style="popupStyle"
      @click="handleClick"
    >
      <!-- 말풍선 꼬리 -->
      <div class="popup-tail"></div>

      <!-- 컨텐츠 -->
      <div class="popup-content">
        <div class="popup-header">
          <!-- 카테고리 태그들 -->
          <div class="category-tags">
            <span
              v-for="(category, idx) in categories"
              :key="idx"
              class="category-tag"
            >
              {{ category }}
            </span>
            <span v-if="!categories.length" class="category-tag">카페</span>
          </div>
          <button @click.stop="$emit('close')" class="close-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <h4 class="store-name">{{ store.name }}</h4>

        <p v-if="store.address" class="store-address">
          {{ truncateAddress(store.address) }}
        </p>

        <!-- 별점, 방문수, 리뷰수 -->
        <div class="store-stats">
          <!-- 별점 -->
          <div class="stat-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="star-icon">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span class="stat-value">{{ store.avgRating?.toFixed(1) || '-' }}</span>
          </div>
          <!-- 방문수 -->
          <div class="stat-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="stat-value">{{ store.visitCount ?? 0 }}</span>
          </div>
          <!-- 리뷰수 -->
          <div class="stat-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span class="stat-value">{{ store.reviewCount ?? 0 }}</span>
          </div>
          <!-- 거리 -->
          <div v-if="store.distanceText" class="stat-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span class="stat-value">{{ store.distanceText }}</span>
          </div>
        </div>

        <div class="tap-hint">
          탭하여 상세보기
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  store: {
    type: Object,
    default: null
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
})

const emit = defineEmits(['close', 'detail'])

// 팝업 위치 스타일 계산 (커스텀 마커 높이 40px 고려하여 위에 배치)
const MARKER_HEIGHT_OFFSET = 44

const popupStyle = computed(() => {
  if (!props.position) return {}

  return {
    left: `${props.position.x}px`,
    top: `${props.position.y - MARKER_HEIGHT_OFFSET}px`,
    transform: 'translate(-50%, -100%)'
  }
})

// 카테고리 파싱 (쉼표로 구분된 문자열을 배열로)
const categories = computed(() => {
  if (!props.store?.category) return []
  return props.store.category.split(',').map(c => c.trim()).filter(c => c).slice(0, 3)
})

// 주소 줄임 처리
const truncateAddress = (address) => {
  if (!address) return ''
  if (address.length > 25) {
    return address.substring(0, 25) + '...'
  }
  return address
}

// 팝업 클릭 시 상세 페이지로 이동
const handleClick = () => {
  emit('detail', props.store)
}
</script>

<style scoped>
.marker-popup {
  position: absolute;
  z-index: 200;
  pointer-events: auto;
  cursor: pointer;
}

.popup-tail {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1));
}

.popup-content {
  background: white;
  border-radius: 0.75rem;
  padding: 0.75rem;
  min-width: 200px;
  max-width: 240px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.popup-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  flex: 1;
}

.category-tag {
  font-size: 0.625rem;
  font-weight: 500;
  padding: 0.125rem 0.375rem;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  border-radius: 0.25rem;
  white-space: nowrap;
}

.close-btn {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-400);
  border-radius: 50%;
  transition: all 0.15s;
}

.close-btn:hover {
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
}

.store-name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin: 0;
  line-height: 1.3;
}

.store-address {
  font-size: 0.75rem;
  color: var(--color-neutral-500);
  margin: 0.25rem 0 0;
  line-height: 1.4;
}

.store-stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  color: var(--color-neutral-600);
}

.stat-item svg {
  flex-shrink: 0;
  color: var(--color-neutral-400);
}

.star-icon {
  color: var(--color-accent) !important;
}

.stat-value {
  font-weight: 500;
}

.tap-hint {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.6875rem;
  color: var(--color-primary-500);
  text-align: center;
  font-weight: 500;
}

/* 애니메이션 */
.popup-enter-active {
  animation: popupIn 0.2s ease-out;
}

.popup-leave-active {
  animation: popupOut 0.15s ease-in;
}

@keyframes popupIn {
  from {
    opacity: 0;
    transform: translate(-50%, -90%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
}

@keyframes popupOut {
  from {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -90%) scale(0.9);
  }
}
</style>
