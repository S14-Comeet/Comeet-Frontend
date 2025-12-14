<template>
  <div class="review-card bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
    <!-- Review Header -->
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1">
        <p class="text-sm text-textSecondary mb-1">{{ formattedDate }}</p>
        <h3 class="font-bold text-neutral-900">{{ storeName || `가맹점 #${review.storeId}` }}</h3>
        <p class="text-sm text-textSecondary">{{ menuName || `메뉴 #${review.menuId}` }}</p>
      </div>
      <div class="flex items-center gap-2">
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

    <!-- Review Image -->
    <div v-if="review.imageUrl" class="mb-3 rounded-lg overflow-hidden">
      <img
        :src="review.imageUrl"
        :alt="`리뷰 이미지 ${review.reviewId}`"
        class="w-full h-48 object-cover"
      />
    </div>

    <!-- Review Content -->
    <p class="text-neutral-900 mb-3 whitespace-pre-wrap">{{ review.content }}</p>

    <!-- Flavor Badges -->
    <div v-if="review.flavorBadges && review.flavorBadges.length > 0" class="flex flex-wrap gap-2">
      <BaseChip
        v-for="flavor in review.flavorBadges"
        :key="flavor.flavorId"
        :label="flavor.name"
        variant="default"
        size="small"
        class="border"
        :style="{ borderColor: flavor.colorHex || flavor.color }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseChip from '@/components/common/BaseChip.vue'

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
  }
})

const formattedDate = computed(() => {
  if (!props.review.createdAt) return ''
  const date = new Date(props.review.createdAt)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<style scoped>
.review-card {
  cursor: pointer;
}
</style>
