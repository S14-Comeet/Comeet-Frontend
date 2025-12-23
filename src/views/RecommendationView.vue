<template>
  <div class="flex flex-col min-h-full h-full bg-background">
    <!-- Header -->
    <BaseHeader title="AI 추천">
      <template #right>
        <button
          v-if="hasAnyRecommendations"
          class="refresh-btn"
          :disabled="isLoading"
          @click="refreshRecommendations"
        >
          <BaseIcon name="refresh" :size="18" :class="{ 'animate-spin': isLoading }" />
        </button>
      </template>
    </BaseHeader>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto safe-bottom">
      <!-- Initial State: No recommendations yet -->
      <div v-if="!hasAnyRecommendations && !isLoading" class="initial-state">
        <div class="initial-content">
          <div class="initial-icon">
            <BaseIcon name="sparkle" :size="48" />
          </div>
          <h2 class="initial-title">{{ welcomeMessage }}</h2>
          <p class="initial-desc">
            AI가 당신의 취향에 맞는<br>
            원두와 메뉴를 추천해드려요
          </p>
          <button class="recommend-btn" :disabled="isLoading" @click="getRecommendations">
            <BaseIcon name="sparkle" :size="20" />
            <span>추천 받기</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading && !hasAnyRecommendations" class="loading-state-full">
        <BaseIcon name="spinner" :size="40" class="animate-spin text-primary-400" />
        <p class="loading-text">AI가 추천을 분석하고 있어요...</p>
        <p class="loading-subtext">잠시만 기다려주세요</p>
      </div>

      <!-- Recommendations -->
      <template v-else>
        <!-- Welcome Message -->
        <div class="px-4 pt-4 pb-2">
          <p class="text-lg font-bold text-textPrimary">
            {{ welcomeMessage }}
          </p>
          <p class="text-sm text-textSecondary mt-1">
            취향에 맞는 원두와 메뉴를 추천해드려요
          </p>
        </div>

        <!-- Bean Recommendations Section -->
        <section class="px-4 py-3">
          <h2 class="section-title">
            <span class="section-icon">☕</span>
            추천 원두
          </h2>

          <!-- Loading -->
          <div v-if="recommendationStore.isLoadingBeans" class="space-y-3">
            <RecommendationSkeleton v-for="i in 3" :key="i" type="bean" />
          </div>

          <!-- Error -->
          <div v-else-if="recommendationStore.beanError" class="empty-state">
            <p>{{ recommendationStore.beanError }}</p>
            <button class="retry-btn" @click="loadBeans">다시 시도</button>
          </div>

          <!-- Empty -->
          <div v-else-if="!recommendationStore.beanRecommendations.length" class="empty-state">
            <p>추천할 원두가 없습니다</p>
            <p class="text-sm mt-1">취향 설정을 완료해주세요</p>
          </div>

          <!-- Bean List -->
          <div v-else class="space-y-3">
            <BeanRecommendationCard
              v-for="bean in recommendationStore.beanRecommendations"
              :key="bean.beanId"
              :bean="bean"
              @click="goToBeanDetail"
            />
          </div>
        </section>

        <!-- Menu Recommendations Section -->
        <section class="px-4 py-3">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon">🍵</span>
              추천 메뉴
            </h2>
            <LocationModeToggle v-model="menuLocationMode" @update:model-value="onLocationModeChange" />
          </div>

          <!-- Radius Expanded Notice -->
          <div v-if="recommendationStore.radiusExpanded && menuLocationMode === 'nearby'" class="radius-notice">
            반경 {{ recommendationStore.actualRadiusKm }}km까지 확장하여 검색했습니다
          </div>

          <!-- Loading -->
          <div v-if="recommendationStore.isLoadingMenus" class="space-y-3">
            <RecommendationSkeleton v-for="i in 3" :key="i" type="menu" />
          </div>

          <!-- Error -->
          <div v-else-if="recommendationStore.menuError" class="empty-state">
            <p>{{ recommendationStore.menuError }}</p>
            <button class="retry-btn" @click="loadMenus">다시 시도</button>
          </div>

          <!-- Empty -->
          <div v-else-if="!currentMenuRecommendations.length" class="empty-state">
            <p>추천할 메뉴가 없습니다</p>
            <p v-if="menuLocationMode === 'nearby'" class="text-sm mt-1">
              검색 반경을 넓혀보세요
            </p>
          </div>

          <!-- Menu List -->
          <div v-else class="space-y-3">
            <MenuRecommendationCard
              v-for="menu in currentMenuRecommendations"
              :key="menu.menuId"
              :menu="menu"
              @click="goToStore"
            />
          </div>
        </section>
      </template>
    </div>

    <!-- Navigation -->
    <BaseNavigationBar />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useRecommendationStore } from '@/store/recommendation'
import { useGeolocation } from '@/composables/useGeolocation'
import { showWarning } from '@/utils/toast'

import BaseHeader from '@/components/common/BaseHeader.vue'
import BaseNavigationBar from '@/components/common/BaseNavigationBar.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BeanRecommendationCard from '@/components/recommendation/BeanRecommendationCard.vue'
import MenuRecommendationCard from '@/components/recommendation/MenuRecommendationCard.vue'
import LocationModeToggle from '@/components/recommendation/LocationModeToggle.vue'
import RecommendationSkeleton from '@/components/recommendation/RecommendationSkeleton.vue'

const router = useRouter()
const authStore = useAuthStore()
const recommendationStore = useRecommendationStore()
const { location, requestLocation } = useGeolocation()

// State
const menuLocationMode = ref('global') // 'global' | 'nearby'

// Computed
const welcomeMessage = computed(() => {
  const nickname = authStore.userNickname || '사용자'
  return `${nickname}님을 위한 추천`
})

const hasAnyRecommendations = computed(() => {
  return recommendationStore.hasFetchedBeans || recommendationStore.hasFetchedMenus
})

const isLoading = computed(() => {
  return recommendationStore.isLoadingBeans || recommendationStore.isLoadingMenus
})

const currentMenuRecommendations = computed(() => {
  if (menuLocationMode.value === 'nearby') {
    return recommendationStore.nearbyMenuRecommendations
  }
  return recommendationStore.menuRecommendations
})

// Methods
const getRecommendations = async () => {
  await recommendationStore.fetchAllRecommendations(false)
}

const refreshRecommendations = async () => {
  await recommendationStore.fetchAllRecommendations(true)
  if (menuLocationMode.value === 'nearby') {
    await loadNearbyMenus(true)
  }
}

const loadBeans = async () => {
  await recommendationStore.fetchBeanRecommendations(true)
}

const loadMenus = async () => {
  if (menuLocationMode.value === 'nearby') {
    await loadNearbyMenus(true)
  } else {
    await recommendationStore.fetchMenuRecommendations(true)
  }
}

const loadNearbyMenus = async (forceRefresh = false) => {
  let loc = location.value
  if (!loc) {
    try {
      loc = await requestLocation({ showToast: true })
    } catch {
      menuLocationMode.value = 'global'
      showWarning('위치 정보를 가져올 수 없어 전체 메뉴를 표시합니다')
      return
    }
  }

  await recommendationStore.fetchNearbyMenuRecommendations(loc.lat, loc.lng, 5, forceRefresh)
}

const onLocationModeChange = async (mode) => {
  if (mode === 'nearby') {
    await loadNearbyMenus(false)
  }
}

const goToBeanDetail = (bean) => {
  router.push(`/bean/${bean.beanId}`)
}

const goToStore = (menu) => {
  router.push(`/store/${menu.storeId}`)
}
</script>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin-bottom: 0.75rem;
}

.section-icon {
  font-size: 1.25rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.section-header .section-title {
  margin-bottom: 0;
}

/* Initial State */
.initial-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
}

.initial-content {
  text-align: center;
  max-width: 280px;
}

.initial-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200));
  border-radius: 50%;
  margin-bottom: 1.5rem;
  color: var(--color-primary-600);
}

.initial-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin-bottom: 0.75rem;
}

.initial-desc {
  font-size: 0.9375rem;
  color: var(--color-textSecondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.recommend-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(132, 97, 72, 0.3);
  transition: all 0.2s ease;
}

.recommend-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(132, 97, 72, 0.4);
}

.recommend-btn:active:not(:disabled) {
  transform: translateY(0);
}

.recommend-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Loading State */
.loading-state-full {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
}

.loading-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-textPrimary);
  margin-top: 1.5rem;
}

.loading-subtext {
  font-size: 0.875rem;
  color: var(--color-textSecondary);
  margin-top: 0.5rem;
}

/* Refresh Button */
.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--color-textSecondary);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background-color: var(--color-primary-50);
  color: var(--color-primary-600);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--color-textSecondary);
}

.retry-btn {
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary-600);
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: var(--color-primary-700);
}

.radius-notice {
  background-color: var(--color-primary-100);
  color: var(--color-primary-700);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  margin-bottom: 0.75rem;
  text-align: center;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}
</style>
