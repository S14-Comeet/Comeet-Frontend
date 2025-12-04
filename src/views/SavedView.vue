<template>
  <div class="flex flex-col min-h-full h-full bg-background">
    <div class="flex-1 flex flex-col items-center justify-center p-4 text-center">
      <BaseIcon name="bookmark-line" :size="48" class="text-textSecondary mb-4" />
      <p class="text-textPrimary text-lg font-medium mb-2">저장한 장소가 없습니다</p>
      <p class="text-textSecondary text-sm">마음에 드는 장소를 저장해보세요</p>
    </div>
  </div>
</template>

<script setup>
import BaseIcon from '@/components/common/BaseIcon.vue'
</script>

