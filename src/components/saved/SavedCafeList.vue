<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- 카페 목록 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          class="p-2 hover:bg-primary-50 rounded-full transition-colors"
          aria-label="뒤로 가기"
          @click="$emit('back')"
        >
          <BaseIcon name="chevron-left" :size="24" color="var(--color-primary)" />
        </button>
        <div>
          <h2 class="text-xl font-bold text-textPrimary">{{ folderName }}</h2>
          <p class="text-sm text-textSecondary">카페 {{ cafes.length }}개</p>
        </div>
      </div>
      <BaseButton
        size="small"
        variant="primary"
        @click="$emit('show-on-map')"
      >
        지도에서 보기
      </BaseButton>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <BaseIcon name="spinner" :size="32" class="text-primary animate-spin" />
    </div>

    <!-- 카페 목록 -->
    <div v-else-if="cafes.length > 0" class="flex flex-col gap-3">
      <StoreCard
        v-for="cafe in cafes"
        :key="cafe.storeId"
        :store="cafe"
        variant="detailed"
        show-added-date
        show-actions
        show-delete-button
        @click="handleSelectCafe"
        @delete="handleDelete"
      />
    </div>

    <!-- 빈 상태 -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <BaseIcon name="bookmark-line" :size="48" class="text-textSecondary mb-4" />
      <p class="text-textPrimary text-lg font-medium mb-2">이 폴더에 저장된 카페가 없습니다</p>
      <p class="text-textSecondary text-sm">카페를 추가해보세요</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import StoreCard from '@/components/common/StoreCard.vue'

defineProps({
  folderName: {
    type: String,
    default: ''
  },
  cafes: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back', 'select', 'show-on-map', 'delete'])
const router = useRouter()

const handleSelectCafe = (cafe) => {
  // 상세 페이지로 이동
  router.push({
    name: 'store-detail',
    params: { storeId: cafe.storeId || cafe.id }
  })
  emit('select', cafe)
}

// 삭제 핸들러
const handleDelete = (cafe) => {
  emit('delete', cafe)
}
</script>
