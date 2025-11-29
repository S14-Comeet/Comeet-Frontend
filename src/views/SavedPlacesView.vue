<template>
  <div class="saved-places-view">
    <div class="header">
      <h1 class="title">저장한 카페</h1>
      <p class="subtitle">내가 찜한 카페 목록입니다</p>
    </div>

    <div class="empty-state">
      <div class="empty-icon">📋</div>
      <p class="empty-text">아직 저장한 카페가 없어요</p>
      <p class="empty-subtext">마음에 드는 카페를 찜해보세요!</p>
      <router-link to="/map" class="btn-primary">
        지도에서 카페 찾기
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Phase 2에서 저장한 카페 목록 기능 구현 예정
</script>

<style scoped>
@import "tailwindcss" reference;

.saved-places-view {
  @apply min-h-screen p-4;
}

.header {
  @apply mb-6;
}

.title {
  @apply text-2xl font-bold text-textPrimary mb-2;
}

.subtitle {
  @apply text-sm text-textSecondary;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-20 text-center;
}

.empty-icon {
  @apply text-6xl mb-4;
}

.empty-text {
  @apply text-lg font-medium text-textPrimary mb-2;
}

.empty-subtext {
  @apply text-sm text-textSecondary mb-6;
}

.btn-primary {
  @apply px-6 py-3 bg-primary text-white rounded-lg font-medium
         hover:bg-primary-600 transition-colors;
}
</style>
