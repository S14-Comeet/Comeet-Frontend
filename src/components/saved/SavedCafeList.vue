<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- 카페 목록 헤더 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          @click="$emit('back')"
          class="p-2 hover:bg-primary-50 rounded-full transition-colors"
          aria-label="뒤로 가기"
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
      <div
        v-for="cafe in cafes"
        :key="cafe.storeId"
        class="flex gap-4 p-4 bg-white rounded-xl border border-border hover:border-primary hover:shadow-md transition-all relative"
      >
        <!-- 클릭 가능한 영역 -->
        <div
          @click="selectCafe(cafe)"
          class="flex gap-4 flex-1 min-w-0 cursor-pointer"
        >
          <!-- 썸네일 (없을 경우 플레이스홀더) -->
          <div class="w-20 h-20 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              v-if="cafe.thumbnailUrl && !cafe.thumbnailUrl.includes('example.com')"
              :src="cafe.thumbnailUrl"
              :alt="cafe.name"
              class="w-full h-full object-cover"
            />
            <BaseIcon v-else name="bookmark-fill" :size="32" color="var(--color-primary-300)" />
          </div>

          <!-- 카페 정보 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-base font-bold text-textPrimary truncate">
                {{ cafe.name }}
              </h3>
              <BaseChip
                :label="cafe.category"
                variant="primary"
                class="flex-shrink-0"
              />
            </div>

            <p class="text-sm text-textSecondary mt-1 truncate">
              {{ cafe.address }}
            </p>

            <div class="flex items-center gap-2 mt-2">
              <!-- 평점 -->
              <div class="flex items-center gap-1">
                <span class="text-primary-600 font-bold text-sm">★</span>
                <span class="text-textPrimary font-medium text-sm">
                  {{ cafe.averageRating?.toFixed(1) || 'N/A' }}
                </span>
              </div>
              <!-- 리뷰 수 -->
              <span class="text-textSecondary text-xs">
                리뷰 {{ cafe.reviewCount || 0 }}개
              </span>
              <!-- 추가 일자 -->
              <span v-if="cafe.addedAt" class="text-textSecondary text-xs">
                • {{ formatDate(cafe.addedAt) }} 추가
              </span>
            </div>
          </div>
        </div>

        <!-- 삭제 버튼 -->
        <div class="flex-shrink-0">
          <button
            @click.stop="handleDelete(cafe)"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors text-textSecondary hover:text-textPrimary"
            :aria-label="`${cafe.name} 삭제`"
          >
            <BaseIcon
              name="x"
              :size="20"
            />
          </button>
        </div>
      </div>
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
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseChip from '@/components/common/BaseChip.vue'

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

const selectCafe = (cafe) => {
  emit('select', cafe)
}

// 삭제 핸들러
const handleDelete = (cafe) => {
  emit('delete', cafe)
}

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}
</script>

