<template>
  <transition name="fade">
    <dialog
        v-if="place"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        role="alertdialog"
        aria-modal="true"
        @click="$emit('close')"
    >
      <div
          class="relative bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
          @click.stop
      >
        <!-- 닫기 버튼 -->
        <button
            @click="$emit('close')"
            class="absolute top-4 right-4 text-textSecondary hover:text-primary hover:bg-primary-50 rounded-full p-1 transition-all"
            aria-label="장소 상세 닫기"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- 카페 정보 -->
        <h2 class="text-2xl font-bold text-textPrimary mb-4">
          {{ place.name }}
        </h2>

        <div class="space-y-3">
          <div>
            <p class="text-sm text-textSecondary">주소</p>
            <p class="text-base text-textPrimary">
              {{ place.address || '주소 정보 없음' }}
            </p>
          </div>

          <div>
            <p class="text-sm text-textSecondary">카테고리</p>
            <span class="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                카페
              </span>
          </div>

          <div v-if="place.description">
            <p class="text-sm text-textSecondary">설명</p>
            <p class="text-base text-textPrimary">
              {{ place.description }}
            </p>
          </div>
        </div>

        <!-- 리뷰 작성 버튼 (New) -->
        <div class="mt-8 pt-4 border-t border-border flex justify-end">
          <BaseButton
            label="리뷰 작성하기"
            variant="primary"
            size="medium"
            @click="goToReview"
          />
        </div>
      </div>
    </dialog>
  </transition>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  place: Object,
})

const emit = defineEmits(['close'])
const router = useRouter()

const goToReview = () => {
  if (!props.place) return
  // Use storeId or fallback to id
  const id = props.place.storeId || props.place.id
  
  if (!id) {
    console.warn('Store ID not found in place object:', props.place)
    return
  }

  router.push({
    name: 'review-write',
    query: {
      storeId: id,
      name: props.place.name
    }
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
