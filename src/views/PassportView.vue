<template>
  <div class="passport-view">
    <!-- 헤더 영역 -->
    <header class="passport-header">
      <h1 class="title">커피여권</h1>
      <YearSelector :selected-year="passportStore.selectedYear" @change="handleYearChange" />
    </header>

    <div v-if="passportStore.isLoading" class="loading-container">
      <div class="loading-list">
        <div v-for="n in 6" :key="n" class="skeleton-card"></div>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="passportStore.error" class="error-container">
      <p class="error-message">{{ passportStore.error }}</p>
      <button class="retry-button" @click="loadPassports">다시 시도</button>
    </div>

    <!-- 여권 카드 그리드 -->
    <div v-else class="passport-grid">
      <PassportCard v-for="passport in passportStore.passports" :key="passport.passportId" :passport="passport"
        @click="handleCardClick(passport)" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePassportStore } from '@/store/passport'
import PassportCard from '@/components/passport/PassportCard.vue'
import YearSelector from '@/components/passport/YearSelector.vue'

const router = useRouter()
const passportStore = usePassportStore()

/**
 * 여권 목록 로드
 */
const loadPassports = async () => {
  try {
    await passportStore.fetchPassportList()
  } catch (error) {
    console.error('Failed to load passports:', error)
  }
}

/**
 * 연도 변경 핸들러
 */
const handleYearChange = async (year) => {
  await passportStore.setYear(year)
}

/**
 * 카드 클릭 핸들러
 */
const handleCardClick = (passport) => {
  if (passport.isAvailable) {
    router.push(`/passport/${passport.passportId}`)
  }
}

onMounted(() => {
  loadPassports()
})
</script>

<style scoped>
.passport-view {
  background-color: var(--color-background);
  padding: var(--page-padding);
}

.passport-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-700);
}

/* 여권 카드 리스트 (1열) */
.passport-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-card {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 16px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

/* 에러 상태 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.error-message {
  color: var(--color-error);
  margin-bottom: 1rem;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.retry-button:hover {
  opacity: 0.9;
}
</style>
