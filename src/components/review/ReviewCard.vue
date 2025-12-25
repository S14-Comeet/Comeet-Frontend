<template>
  <div class="review-card bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1">
        <p class="text-sm text-textSecondary mb-1">{{ formattedDate }}</p>
        <h3 class="font-bold text-neutral-900">{{ storeName || `가맹점 #${review.storeId}` }}</h3>
        <p class="text-sm text-textSecondary">{{ menuName || `메뉴 #${review.menuId}` }}</p>
      </div>
      <div class="flex items-center gap-2">
        <BaseChip
          v-if="hasCuppingNote"
          label="커핑노트"
          variant="default"
          size="small"
          class="bg-accent/10 text-accent"
        />
        <BaseChip
          v-if="review.isPublic"
          label="공개"
          variant="default"
          size="small"
          class="bg-primary-100 text-primary-700"
        />
        <BaseChip
          v-else
          label="비공개"
          variant="default"
          size="small"
          class="bg-neutral-100 text-textSecondary"
        />
      </div>
    </div>

    <div v-if="displayRating > 0" class="flex items-center gap-2 mb-3">
      <StarRating :model-value="displayRating" :size="20" readonly />
      <span class="text-sm font-medium text-neutral-700">{{ displayRating }}점</span>
    </div>

    <div v-if="review.imageUrl && !imageLoadError" class="mb-3 rounded-lg overflow-hidden">
      <img
        :src="review.imageUrl"
        :alt="`리뷰 이미지 ${review.reviewId}`"
        class="w-full h-48 object-cover"
        @error="handleImageError"
      />
    </div>

    <p class="text-neutral-900 mb-3 whitespace-pre-wrap line-clamp-3">{{ review.content }}</p>

    <div v-if="review.flavorBadges && review.flavorBadges.length > 0" class="flex flex-wrap gap-2">
      <FlavorChip
        v-for="flavor in review.flavorBadges"
        :key="flavor.flavorId"
        :flavor="flavor"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseChip from '@/components/common/BaseChip.vue'
import FlavorChip from '@/components/common/FlavorChip.vue'
import StarRating from '@/components/common/StarRating.vue'

const props = defineProps({
  review: {
    type: Object,
    required: true
  },
  storeName: {
    type: String,
    default: ''
  },
  menuName: {
    type: String,
    default: ''
  },
  hasCuppingNote: {
    type: Boolean,
    default: false
  }
})

const imageLoadError = ref(false)

const handleImageError = () => {
  imageLoadError.value = true
}

const formattedDate = computed(() => {
  const createdAt = props.review.createdAt
  if (!createdAt) return ''

  const date = new Date(createdAt)

  if (isNaN(date.getTime())) {
    if (Array.isArray(createdAt) && createdAt.length >= 3) {
      return `${createdAt[0]}년 ${createdAt[1]}월 ${createdAt[2]}일`
    }
    return ''
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const displayRating = computed(() => {
  return props.review.rating || 0
})
</script>

<style scoped>
.review-card {
  cursor: pointer;
}
</style>
