<template>
  <div
    class="store-card"
    :class="[`variant-${variant}`, { 'is-closed': store.isClosed }]"
    @click="handleClick"
  >
    <!-- Compact variant (for StoreListSheet) -->
    <template v-if="variant === 'compact'">
      <div class="store-info">
        <div class="store-name-row">
          <span class="store-category-badge">{{ store.category || '카페' }}</span>
          <h4 class="store-name">{{ store.name }}</h4>
          <span v-if="store.isClosed" class="closed-badge">영업종료</span>
        </div>
        <p class="store-address">{{ store.address || '주소 정보 없음' }}</p>
        <div v-if="store.averageRating" class="store-rating">
          <BaseIcon name="star-fill" :size="14" class="text-accent" />
          <span class="rating-value">{{ formatRating(store.averageRating) }}</span>
          <span class="review-count">({{ store.reviewCount || 0 }})</span>
        </div>
      </div>
      <BaseIcon name="chevron-right" :size="20" class="text-primary-300 flex-shrink-0" />
    </template>

    <!-- Detailed variant (for SavedCafeList, default) -->
    <template v-else>
      <div class="store-thumbnail">
        <img
          v-if="hasValidThumbnail"
          :src="store.thumbnailUrl"
          :alt="store.name"
          class="thumbnail-img"
          @error="handleImageError"
        />
        <BaseIcon v-else name="bookmark-fill" :size="32" class="text-primary-300" />
        <span v-if="store.isClosed" class="closed-overlay">영업종료</span>
      </div>

      <div class="store-content">
        <div class="store-header">
          <h3 class="store-name-detail">{{ store.name }}</h3>
          <BaseChip
            v-if="store.category"
            :label="store.category"
            variant="primary"
            size="small"
          />
        </div>

        <p class="store-address-detail">{{ store.address || '주소 정보 없음' }}</p>

        <div class="store-meta">
          <div class="rating-badge">
            <BaseIcon name="star-fill" :size="14" class="text-accent" />
            <span class="rating-value">{{ formatRating(store.averageRating) }}</span>
          </div>
          <span class="meta-divider"></span>
          <span class="meta-text">리뷰 {{ store.reviewCount || 0 }}개</span>
          <template v-if="showAddedDate && store.addedAt">
            <span class="meta-divider"></span>
            <span class="meta-text">{{ formatDate(store.addedAt) }} 추가</span>
          </template>
        </div>
      </div>

      <!-- Actions slot for delete button etc -->
      <div v-if="showActions" class="store-actions" @click.stop>
        <slot name="actions">
          <button
            v-if="showDeleteButton"
            @click="handleDelete"
            class="action-btn delete-btn"
            :aria-label="`${store.name} 삭제`"
          >
            <BaseIcon name="x" :size="20" />
          </button>
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseChip from '@/components/common/BaseChip.vue'

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

const formatRating = (rating) => {
  if (!rating && rating !== 0) return 'N/A'
  return Number(rating).toFixed(1)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
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
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.store-card.is-closed {
  opacity: 0.6;
}

/* Compact variant styles */
.store-card.variant-compact {
  padding: 0.875rem 1rem;
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

.store-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.store-category-badge {
  flex-shrink: 0;
  padding: 0.125rem 0.5rem;
  background-color: var(--color-accent);
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  border-radius: 0.25rem;
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

.store-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-neutral-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.store-address {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
}

.store-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-neutral-700);
}

.review-count {
  color: var(--color-textSecondary);
  font-weight: 400;
}

/* Detailed variant styles */
.store-card.variant-detailed {
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
}

.store-card.variant-detailed:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.store-thumbnail {
  position: relative;
  width: 5rem;
  height: 5rem;
  border-radius: 0.5rem;
  background-color: var(--color-primary-100);
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

.closed-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.store-content {
  flex: 1;
  min-width: 0;
}

.store-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.store-name-detail {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.store-address-detail {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.5rem;
}

.store-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.rating-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rating-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-textPrimary);
}

.meta-divider {
  width: 1px;
  height: 0.75rem;
  background-color: var(--color-border);
}

.meta-text {
  font-size: 0.75rem;
  color: var(--color-textSecondary);
}

.store-actions {
  flex-shrink: 0;
}

.action-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--color-textSecondary);
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: var(--color-neutral-100);
  color: var(--color-textPrimary);
}

.delete-btn:hover {
  background-color: var(--color-error);
  background-color: rgba(211, 47, 47, 0.1);
  color: var(--color-error);
}
</style>
