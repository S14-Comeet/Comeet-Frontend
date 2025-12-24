<template>
  <div
    class="store-card"
    :class="[`variant-${variant}`, { 'is-closed': store.isClosed }]"
    @click="handleClick"
  >
    <!-- Compact variant (for StoreListSheet - 지도) -->
    <template v-if="variant === 'compact'">
      <div class="store-info">
        <!-- 1줄: 가게명 + 별점 -->
        <div class="store-header-row">
          <h4 class="store-name">{{ store.name }}</h4>
          <div v-if="store.averageRating" class="rating-inline">
            <BaseIcon name="star-fill" :size="14" class="text-accent" />
            <span class="rating-value">{{ formatRating(store.averageRating) }}</span>
          </div>
          <span v-if="store.isClosed" class="closed-badge">영업종료</span>
        </div>

        <!-- 2줄: 리뷰 수 · 카테고리 -->
        <div class="store-meta-row">
          <span class="review-info">
            리뷰 <span class="review-count">{{ store.reviewCount || 0 }}</span>
          </span>
          <span class="meta-dot">·</span>
          <BaseChip
            :label="displayCategory"
            variant="accent"
            size="xs"
          />
        </div>

        <!-- 3줄: 주소 -->
        <p class="store-address">{{ store.address || '주소 정보 없음' }}</p>

        <!-- 4줄: 거리 (있으면) -->
        <div v-if="store.distanceText" class="store-distance">
          <BaseIcon name="map-marker" :size="12" />
          <span>{{ store.distanceText }}</span>
        </div>
      </div>
      <BaseIcon name="chevron-right" :size="20" class="chevron-icon" />
    </template>

    <!-- Detailed variant (for SavedCafeList - 저장목록) -->
    <template v-else>
      <!-- 썸네일 -->
      <div class="store-thumbnail">
        <img
          v-if="hasValidThumbnail"
          :src="store.thumbnailUrl"
          :alt="store.name"
          class="thumbnail-img"
          @error="handleImageError"
        />
        <BaseIcon v-else name="coffee" :size="28" class="thumbnail-placeholder" />
        <span v-if="store.isClosed" class="closed-overlay">영업종료</span>
      </div>

      <div class="store-content">
        <!-- 1줄: 가게명 + 별점 -->
        <div class="store-header-row">
          <h3 class="store-name">{{ store.name }}</h3>
          <div class="rating-inline">
            <BaseIcon name="star-fill" :size="14" class="text-accent" />
            <span class="rating-value">{{ formatRating(store.averageRating) }}</span>
          </div>
        </div>

        <!-- 2줄: 리뷰 수 · 카테고리 -->
        <div class="store-meta-row">
          <span class="review-info">
            리뷰 <span class="review-count">{{ store.reviewCount || 0 }}</span>
          </span>
          <span class="meta-dot">·</span>
          <BaseChip
            :label="displayCategory"
            variant="primary"
            size="xs"
          />
        </div>

        <!-- 3줄: 주소 -->
        <p class="store-address">{{ store.address || '주소 정보 없음' }}</p>

        <!-- 4줄: 추가일 또는 거리 -->
        <div v-if="showAddedDate && store.addedAt" class="store-meta-extra">
          <span class="meta-date">{{ formatDate(store.addedAt) }} 저장</span>
        </div>
        <div v-else-if="store.distanceText" class="store-distance">
          <BaseIcon name="map-marker" :size="12" />
          <span>{{ store.distanceText }}</span>
        </div>
      </div>

      <!-- 삭제 버튼 -->
      <div v-if="showActions" class="store-actions" @click.stop>
        <slot name="actions">
          <button
            v-if="showDeleteButton"
            class="action-btn delete-btn"
            :aria-label="`${store.name} 삭제`"
            @click="handleDelete"
          >
            <BaseIcon name="x" :size="18" />
          </button>
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MENU_CATEGORIES } from '@/constants'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseChip from '@/components/common/BaseChip.vue'
import { formatDate } from '@/utils/date'

// enum 값을 한글 라벨로 변환하는 맵
const categoryLabelMap = Object.fromEntries(
  MENU_CATEGORIES.map(cat => [cat.value, cat.label])
)

const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  variant: {
    type: String,
    default: 'detailed', // 'compact' | 'detailed'
    validator: (value) => ['compact', 'detailed'].includes(value)
  },
  showAddedDate: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: false
  },
  showDeleteButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'delete'])

const imageError = ref(false)

const hasValidThumbnail = computed(() => {
  return props.store.thumbnailUrl &&
         !props.store.thumbnailUrl.includes('example.com') &&
         !imageError.value
})

// 카테고리를 한글로 변환 (첫 번째 카테고리만 표시)
const displayCategory = computed(() => {
  if (!props.store.category) return '카페'

  const firstCategory = props.store.category.split(',')[0].trim()
  return categoryLabelMap[firstCategory] || firstCategory
})

const formatRating = (rating) => {
  if (!rating && rating !== 0) return '0.0'
  return Number(rating).toFixed(1)
}

const handleClick = () => {
  emit('click', props.store)
}

const handleDelete = () => {
  emit('delete', props.store)
}

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.store-card {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.2s ease;
}

.store-card.is-closed {
  opacity: 0.6;
}

/* ==========================================
   Compact variant styles (지도 리스트용)
   ========================================== */
.store-card.variant-compact {
  padding: 1rem;
  gap: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.store-card.variant-compact:last-child {
  border-bottom: none;
}

.store-card.variant-compact:hover {
  background-color: var(--color-primary-50);
}

.store-card.variant-compact:active {
  background-color: var(--color-primary-100);
}

.store-card.variant-compact .store-info {
  flex: 1;
  min-width: 0;
}

/* ==========================================
   Detailed variant styles (저장목록용)
   ========================================== */
.store-card.variant-detailed {
  gap: 0.875rem;
  padding: 1rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
}

.store-card.variant-detailed:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(132, 97, 72, 0.08);
}

/* ==========================================
   공통 스타일
   ========================================== */

/* 헤더 (가게명 + 별점) */
.store-header-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.store-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.rating-inline {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.rating-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-textPrimary);
}

.closed-badge {
  flex-shrink: 0;
  padding: 0.125rem 0.375rem;
  background-color: var(--color-neutral-400);
  color: white;
  font-size: 0.625rem;
  font-weight: 500;
  border-radius: 0.25rem;
}

/* 메타 라인 (리뷰 수 · 카테고리) */
.store-meta-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.375rem;
}

.review-info {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
}

.review-count {
  font-weight: 600;
  color: var(--color-textPrimary);
}

.meta-dot {
  color: var(--color-textTertiary);
  font-size: 0.75rem;
}

/* 주소 */
.store-address {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

/* 거리 */
.store-distance {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary-600);
  margin-top: 0.375rem;
}

/* 추가일 등 메타 정보 */
.store-meta-extra {
  margin-top: 0.375rem;
}

.meta-date {
  font-size: 0.75rem;
  color: var(--color-textTertiary);
}

/* 화살표 아이콘 (compact) */
.chevron-icon {
  color: var(--color-primary-300);
  flex-shrink: 0;
  align-self: center;
}

/* 썸네일 (detailed) */
.store-thumbnail {
  position: relative;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 0.75rem;
  background-color: var(--color-primary-50);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  color: var(--color-primary-200);
}

.closed-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.6875rem;
  font-weight: 600;
}

/* 컨텐츠 영역 (detailed) */
.store-content {
  flex: 1;
  min-width: 0;
}

/* 액션 버튼 */
.store-actions {
  flex-shrink: 0;
  align-self: flex-start;
}

.action-btn {
  padding: 0.375rem;
  border-radius: 0.5rem;
  color: var(--color-textTertiary);
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--color-neutral-100);
  color: var(--color-textSecondary);
}

.delete-btn:hover {
  background-color: rgba(211, 47, 47, 0.1);
  color: var(--color-error);
}
</style>
