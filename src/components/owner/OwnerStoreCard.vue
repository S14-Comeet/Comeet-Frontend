<template>
  <div class="bg-white rounded-xl p-4 shadow-sm border border-border">
    <!-- 가맹점 정보 -->
    <div class="flex gap-4">
      <!-- 썸네일 -->
      <div class="w-20 h-20 rounded-lg bg-primary-100 flex-shrink-0 overflow-hidden">
        <img
          v-if="store.thumbnailUrl"
          :src="store.thumbnailUrl"
          :alt="store.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <BaseIcon name="coffee" :size="32" class="text-primary-400" />
        </div>
      </div>

      <!-- 정보 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-bold text-textPrimary truncate">{{ store.name }}</h3>
          <span
            v-if="store.isClosed"
            class="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-error/10 text-error rounded"
          >
            영업종료
          </span>
        </div>

        <p class="text-sm text-textSecondary mt-1 line-clamp-1">{{ store.address }}</p>

        <div class="flex items-center gap-3 mt-2 text-xs text-textSecondary">
          <span v-if="store.openingHours" class="flex items-center gap-1">
            <BaseIcon name="time" :size="12" />
            {{ store.openingHours }}
          </span>
          <span v-if="store.category">
            {{ formatCategory(store.category) }}
          </span>
        </div>

        <!-- 통계 -->
        <div class="flex items-center gap-4 mt-2 text-xs">
          <span class="flex items-center gap-1 text-accent">
            <BaseIcon name="star-fill" :size="12" />
            {{ store.averageRating?.toFixed(1) || '-' }}
          </span>
          <span class="text-textSecondary">
            리뷰 {{ store.reviewCount || 0 }}개
          </span>
          <span class="text-textSecondary">
            방문 {{ store.visitCount || 0 }}회
          </span>
        </div>
      </div>
    </div>

    <!-- 액션 버튼들 -->
    <div class="flex gap-2 mt-4 pt-4 border-t border-border">
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
        class="!text-error"
        @click="$emit('delete', store)"
      >
        <BaseIcon name="close" :size="16" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { MENU_CATEGORIES } from '@/constants'

// enum 값을 한글 라벨로 변환하는 맵
const categoryLabelMap = Object.fromEntries(
  MENU_CATEGORIES.map(cat => [cat.value, cat.label])
)

defineProps({
  store: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete', 'manage-menus'])

/**
 * 카테고리 포맷팅 (comma-separated enum을 한글로 변환)
 */
const formatCategory = (category) => {
  if (!category) return ''
  return category
    .split(',')
    .map(c => c.trim())
    .filter(c => c)
    .map(c => categoryLabelMap[c] || c)
    .join(', ')
}
</script>
