<template>
  <div class="bg-white rounded-xl p-4 shadow-sm border border-border">
    <!-- 메뉴 정보 -->
    <div class="flex gap-4">
      <!-- 이미지 -->
      <div class="w-16 h-16 rounded-lg bg-primary-100 flex-shrink-0 overflow-hidden">
        <img
          v-if="menu.imageUrl"
          :src="menu.imageUrl"
          :alt="menu.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <BaseIcon name="coffee" :size="24" class="text-primary-400" />
        </div>
      </div>

      <!-- 정보 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-bold text-textPrimary truncate">{{ menu.name }}</h3>
          <span class="flex-shrink-0 text-primary font-bold">
            {{ formatPrice(menu.price) }}원
          </span>
        </div>

        <p v-if="menu.description" class="text-sm text-textSecondary mt-1 line-clamp-2">
          {{ menu.description }}
        </p>

        <div class="flex items-center gap-2 mt-2">
          <span
            class="px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary rounded"
          >
            {{ formatCategory(menu.category) }}
          </span>

          <!-- 연결된 원두 표시 -->
          <span
            v-if="menu.beanBadges && menu.beanBadges.length > 0"
            class="px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded"
          >
            원두 {{ menu.beanBadges.length }}종
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
        @click="$emit('manage-beans', menu)"
      >
        <BaseIcon name="coffee" :size="16" class="mr-1" />
        원두 연결
      </BaseButton>
      <BaseButton
        variant="secondary"
        size="small"
        class="flex-1"
        @click="$emit('edit', menu)"
      >
        <BaseIcon name="edit" :size="16" class="mr-1" />
        수정
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="small"
        class="!text-error"
        @click="$emit('delete', menu)"
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
  menu: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete', 'manage-beans'])

/**
 * 가격 포맷팅
 */
const formatPrice = (price) => {
  return price?.toLocaleString() || '0'
}

/**
 * 카테고리 포맷팅
 */
const formatCategory = (category) => {
  return categoryLabelMap[category] || category
}
</script>
