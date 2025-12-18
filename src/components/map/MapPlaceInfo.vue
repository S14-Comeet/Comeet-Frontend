<template>
  <transition name="slide-up">
    <div
        v-if="place"
        class="bg-white rounded-t-2xl shadow-2xl p-4 pb-safe"
        @click.stop
    >
      <!-- 드래그 핸들 -->
      <div class="w-12 h-1 bg-primary-200 rounded-full mx-auto mb-4"></div>

      <!-- 카페 정보 -->
      <div class="flex items-start gap-3">
          <span class="px-2 py-1 rounded-md text-xs font-medium bg-accent/10 text-accent">
            카페
          </span>

        <div class="flex-1">
          <h3 class="text-lg font-bold text-textPrimary">
            {{ place.name }}
          </h3>
          <p class="text-sm text-textSecondary mt-1">
            {{ place.address || '주소 정보 없음' }}
          </p>
        </div>
      </div>

      <!-- 액션 버튼 -->
      <div class="flex gap-2 mt-4">
        <button
            class="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-500 transition-colors"
            @click="$emit('detail')"
        >
          상세보기
        </button>
        <button
            class="px-4 py-2 border border-border rounded-lg text-textSecondary hover:bg-primary-50 transition-colors"
            @click="$emit('close')"
        >
          닫기
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  place: Object,
})

defineEmits(['close', 'detail'])
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
