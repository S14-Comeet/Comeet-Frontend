<template>
  <div class="survey-view">
    <div class="survey-container">
      <div class="survey-header">
        <h1 class="title">커피 취향 설문</h1>
        <p class="subtitle">당신의 취향에 맞는 카페를 추천해드릴게요!</p>
      </div>

      <div class="survey-content">
        <div class="survey-icon">☕</div>
        <p class="survey-text">취향 설문 기능은 곧 만나보실 수 있어요</p>
        <p class="survey-subtext">Phase 1에서 구현 예정입니다</p>
      </div>

      <div class="survey-actions">
        <button @click="skipSurvey" class="btn-secondary">
          나중에 하기
        </button>
        <button @click="goToMap" class="btn-primary">
          지도 보러가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const skipSurvey = () => {
  router.push('/map')
}

const goToMap = () => {
  router.push('/map')
}
</script>

<style scoped>
@import "tailwindcss" reference;

.survey-view {
  @apply min-h-screen flex items-center justify-center p-4 bg-background;
}

.survey-container {
  @apply max-w-md w-full;
}

.survey-header {
  @apply text-center mb-8;
}

.title {
  @apply text-2xl font-bold text-textPrimary mb-2;
}

.subtitle {
  @apply text-sm text-textSecondary;
}

.survey-content {
  @apply bg-white rounded-xl p-8 text-center mb-6 shadow-sm;
}

.survey-icon {
  @apply text-6xl mb-4;
}

.survey-text {
  @apply text-lg font-medium text-textPrimary mb-2;
}

.survey-subtext {
  @apply text-sm text-textSecondary;
}

.survey-actions {
  @apply flex gap-3;
}

.btn-primary {
  @apply flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium
         hover:bg-primary-600 transition-colors;
}

.btn-secondary {
  @apply flex-1 px-6 py-3 bg-white text-textPrimary border border-gray-300
         rounded-lg font-medium hover:bg-gray-50 transition-colors;
}
</style>
