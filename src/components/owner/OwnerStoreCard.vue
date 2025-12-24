<template>
  <div class="owner-store-card">
    <!-- 가게 정보 영역 -->
    <div class="store-info-area">
      <!-- 썸네일 -->
      <div class="store-thumbnail">
        <img
          v-if="store.thumbnailUrl"
          :src="store.thumbnailUrl"
          :alt="store.name"
          class="thumbnail-img"
        />
        <BaseIcon v-else name="coffee" :size="28" class="thumbnail-placeholder" />
        <span v-if="store.isClosed" class="closed-overlay">영업종료</span>
      </div>

      <!-- 정보 -->
      <div class="store-content">
        <!-- 1줄: 가게명 + 별점 -->
        <div class="store-header-row">
          <h3 class="store-name">{{ store.name }}</h3>
          <div class="rating-inline">
            <BaseIcon name="star-fill" :size="14" class="text-accent" />
            <span class="rating-value">{{ formatRating(store.averageRating) }}</span>
          </div>
        </div>

        <!-- 2줄: 리뷰 · 방문 · 카테고리 -->
        <div class="store-meta-row">
          <span class="meta-info">
            리뷰 <span class="meta-count">{{ store.reviewCount || 0 }}</span>
          </span>
          <span class="meta-dot">·</span>
          <span class="meta-info">
            방문 <span class="meta-count">{{ store.visitCount || 0 }}</span>
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

        <!-- 4줄: 영업시간 (있으면) -->
        <div v-if="store.openingHours || (store.openTime && store.closeTime)" class="store-hours">
          <BaseIcon name="time" :size="12" />
          <span>{{ store.openingHours || formatHours(store.openTime, store.closeTime) }}</span>
        </div>
      </div>
    </div>

    <!-- 액션 버튼들 -->
    <div class="action-area">
      <BaseButton
        variant="secondary"
        size="small"
        class="flex-1"
        @click="$emit('manage-menus', store)"
      >
        <BaseIcon name="list" :size="16" class="mr-1" />
        메뉴 관리
      </BaseButton>
      <BaseButton
        variant="secondary"
        size="small"
        class="flex-1"
        @click="$emit('edit', store)"
      >
        <BaseIcon name="edit" :size="16" class="mr-1" />
        수정
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="small"
        class="delete-btn"
        @click="$emit('delete', store)"
      >
        <BaseIcon name="close" :size="16" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseChip from '@/components/common/BaseChip.vue'
import { MENU_CATEGORIES } from '@/constants'

// enum 값을 한글 라벨로 변환하는 맵
const categoryLabelMap = Object.fromEntries(
  MENU_CATEGORIES.map(cat => [cat.value, cat.label])
)

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete', 'manage-menus'])

/**
 * 별점 포맷팅
 */
const formatRating = (rating) => {
  if (!rating && rating !== 0) return '0.0'
  return Number(rating).toFixed(1)
}

/**
 * 카테고리 포맷팅 (첫 번째 카테고리만)
 */
const displayCategory = computed(() => {
  if (!props.store.category) return '카페'
  const firstCategory = props.store.category.split(',')[0].trim()
  return categoryLabelMap[firstCategory] || firstCategory
})

/**
 * 영업시간 포맷팅
 */
const formatHours = (openTime, closeTime) => {
  if (!openTime || !closeTime) return '정보 없음'
  return `${openTime} - ${closeTime}`
}
</script>

<style scoped>
.owner-store-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.store-info-area {
  display: flex;
  gap: 0.875rem;
  padding: 1rem;
}

/* 썸네일 */
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

/* 컨텐츠 */
.store-content {
  flex: 1;
  min-width: 0;
}

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

/* 메타 라인 */
.store-meta-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.375rem;
  flex-wrap: wrap;
}

.meta-info {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
}

.meta-count {
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

/* 영업시간 */
.store-hours {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-textTertiary);
  margin-top: 0.375rem;
}

/* 액션 버튼 영역 */
.action-area {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-neutral-50);
}

.delete-btn {
  color: var(--color-error) !important;
}

.delete-btn:hover {
  background-color: rgba(211, 47, 47, 0.1) !important;
}
</style>
