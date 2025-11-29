<template>
  <transition name="fade">
    <div
        v-if="place"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click="$emit('close')"
    >
      <div
          class="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
          @click.stop
      >
        <!-- 닫기 버튼 -->
        <button
            @click="$emit('close')"
            class="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- 카페 정보 -->
        <h2 class="text-2xl font-bold text-text-primary mb-4">
          {{ place.name }}
        </h2>

        <div class="space-y-3">
          <div>
            <p class="text-sm text-text-secondary">주소</p>
            <p class="text-base text-text-primary">
              {{ place.address || '주소 정보 없음' }}
            </p>
          </div>

          <div>
            <p class="text-sm text-text-secondary">카테고리</p>
            <span class="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                카페
              </span>
          </div>

          <div v-if="place.description">
            <p class="text-sm text-text-secondary">설명</p>
            <p class="text-base text-text-primary">
              {{ place.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  place: Object,
})

defineEmits(['close'])
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
