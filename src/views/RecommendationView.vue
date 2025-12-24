<template>
  <div class="flex flex-col min-h-full h-full bg-background">
    <!-- Content -->
    <div class="flex-1 overflow-y-auto safe-bottom">
      <!-- Welcome Header -->
      <div class="welcome-header">
        <h1 class="welcome-title">{{ welcomeMessage }}</h1>
        <p class="welcome-subtitle">취향에 맞는 메뉴와 원두를 추천해드려요</p>
      </div>

      <!-- Nearby Menu Recommendations Section -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">내 주변 추천 메뉴</h2>
          <button
            v-if="recommendationStore.hasFetchedNearbyMenus"
            class="section-refresh-btn"
            :disabled="recommendationStore.isLoadingNearbyMenus"
            @click="loadNearbyMenus(true)"
          >
            <BaseIcon name="refresh" :size="16" :class="{ 'animate-spin': recommendationStore.isLoadingNearbyMenus }" />
          </button>
        </div>

        <!-- Initial State -->
        <div v-if="!recommendationStore.hasFetchedNearbyMenus && !recommendationStore.isLoadingNearbyMenus && !locationError && !recommendationStore.nearbyMenuError" class="section-initial">
          <BaseButton variant="primary" size="small" @click="loadNearbyMenus(false)">
            추천 받기
          </BaseButton>
        </div>

        <!-- Radius Expanded Notice -->
        <div v-if="recommendationStore.radiusExpanded && recommendationStore.hasFetchedNearbyMenus" class="radius-notice">
          <BaseIcon name="info" :size="14" />
          반경 {{ recommendationStore.actualRadiusKm }}km까지 확장하여 검색했습니다
        </div>

        <!-- Loading -->
        <div v-if="recommendationStore.isLoadingNearbyMenus" class="card-list">
          <RecommendationSkeleton v-for="i in 3" :key="i" type="menu" />
        </div>

        <!-- Location Error -->
        <div v-else-if="locationError" class="empty-state">
          <BaseIcon name="map-marker" :size="32" class="empty-icon" />
          <p class="empty-text">{{ locationError }}</p>
          <BaseButton variant="tertiary" size="small" @click="retryNearbyMenus">
            다시 시도
          </BaseButton>
        </div>

        <!-- API Error -->
        <div v-else-if="recommendationStore.nearbyMenuError" class="empty-state">
          <BaseIcon name="alert-circle" :size="32" class="empty-icon" />
          <p class="empty-text">{{ recommendationStore.nearbyMenuError }}</p>
          <BaseButton variant="tertiary" size="small" @click="retryNearbyMenus">
            다시 시도
          </BaseButton>
        </div>

        <!-- Empty -->
        <div v-else-if="recommendationStore.hasFetchedNearbyMenus && !recommendationStore.nearbyMenuRecommendations.length" class="empty-state">
          <BaseIcon name="coffee" :size="32" class="empty-icon" />
          <p class="empty-text">주변에 추천할 메뉴가 없습니다</p>
          <p class="empty-hint">검색 반경을 넓혀보세요</p>
        </div>

        <!-- Nearby Menu List -->
        <div v-else-if="recommendationStore.nearbyMenuRecommendations.length" class="card-list">
          <MenuRecommendationCard
            v-for="menu in recommendationStore.nearbyMenuRecommendations"
            :key="menu.menuId"
            :menu="menu"
            @click="goToMenuDetail"
          />
        </div>
      </section>

      <!-- Global Menu Recommendations Section -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">전체 추천 메뉴</h2>
          <button
            v-if="recommendationStore.hasFetchedMenus"
            class="section-refresh-btn"
            :disabled="recommendationStore.isLoadingMenus"
            @click="loadGlobalMenus"
          >
            <BaseIcon name="refresh" :size="16" :class="{ 'animate-spin': recommendationStore.isLoadingMenus }" />
          </button>
        </div>

        <!-- Initial State -->
        <div v-if="!recommendationStore.hasFetchedMenus && !recommendationStore.isLoadingMenus && !recommendationStore.menuError" class="section-initial">
          <BaseButton variant="primary" size="small" @click="loadGlobalMenus">
            추천 받기
          </BaseButton>
        </div>

        <!-- Loading -->
        <div v-if="recommendationStore.isLoadingMenus" class="card-list">
          <RecommendationSkeleton v-for="i in 3" :key="i" type="menu" />
        </div>

        <!-- Error -->
        <div v-else-if="recommendationStore.menuError" class="empty-state">
          <BaseIcon name="alert-circle" :size="32" class="empty-icon" />
          <p class="empty-text">{{ recommendationStore.menuError }}</p>
          <BaseButton variant="tertiary" size="small" @click="loadGlobalMenus">
            다시 시도
          </BaseButton>
        </div>

        <!-- Empty -->
        <div v-else-if="recommendationStore.hasFetchedMenus && !recommendationStore.menuRecommendations.length" class="empty-state">
          <BaseIcon name="coffee" :size="32" class="empty-icon" />
          <p class="empty-text">추천할 메뉴가 없습니다</p>
        </div>

        <!-- Global Menu List -->
        <div v-else-if="recommendationStore.menuRecommendations.length" class="card-list">
          <MenuRecommendationCard
            v-for="menu in recommendationStore.menuRecommendations"
            :key="menu.menuId"
            :menu="menu"
            @click="goToMenuDetail"
          />
        </div>
      </section>

      <!-- Bean Recommendations Section -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">추천 원두</h2>
          <button
            v-if="recommendationStore.hasFetchedBeans"
            class="section-refresh-btn"
            :disabled="recommendationStore.isLoadingBeans"
            @click="loadBeans"
          >
            <BaseIcon name="refresh" :size="16" :class="{ 'animate-spin': recommendationStore.isLoadingBeans }" />
          </button>
        </div>

        <!-- Initial State -->
        <div v-if="!recommendationStore.hasFetchedBeans && !recommendationStore.isLoadingBeans && !recommendationStore.beanError" class="section-initial">
          <BaseButton variant="primary" size="small" @click="loadBeans">
            추천 받기
          </BaseButton>
        </div>

        <!-- Loading -->
        <div v-if="recommendationStore.isLoadingBeans" class="card-list">
          <RecommendationSkeleton v-for="i in 3" :key="i" type="bean" />
        </div>

        <!-- Error -->
        <div v-else-if="recommendationStore.beanError" class="empty-state">
          <BaseIcon name="alert-circle" :size="32" class="empty-icon" />
          <p class="empty-text">{{ recommendationStore.beanError }}</p>
          <BaseButton variant="tertiary" size="small" @click="loadBeans">
            다시 시도
          </BaseButton>
        </div>

        <!-- Empty -->
        <div v-else-if="recommendationStore.hasFetchedBeans && !recommendationStore.beanRecommendations.length" class="empty-state">
          <BaseIcon name="coffee" :size="32" class="empty-icon" />
          <p class="empty-text">추천할 원두가 없습니다</p>
          <p class="empty-hint">취향 설정을 완료해주세요</p>
        </div>

        <!-- Bean List -->
        <div v-else-if="recommendationStore.beanRecommendations.length" class="card-list">
          <BeanCard
            v-for="(bean, index) in recommendationStore.beanRecommendations"
            :key="bean.beanId"
            :bean="bean"
            :rank="index + 1"
            :reason="bean.reason"
            @click="goToBeanDetail"
          />
        </div>
      </section>
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

import BaseNavigationBar from '@/components/common/BaseNavigationBar.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BeanCard from '@/components/common/BeanCard.vue'
import MenuRecommendationCard from '@/components/recommendation/MenuRecommendationCard.vue'
import RecommendationSkeleton from '@/components/recommendation/RecommendationSkeleton.vue'

const router = useRouter()
const authStore = useAuthStore()
const recommendationStore = useRecommendationStore()
const { location, requestLocation } = useGeolocation()

// State
const locationError = ref(null)

// Computed
const welcomeMessage = computed(() => {
  const nickname = authStore.userNickname || '사용자'
  return `${nickname}님을 위한 추천`
})

// Methods
const loadBeans = async () => {
  await recommendationStore.fetchBeanRecommendations(true)
}

const loadGlobalMenus = async () => {
  await recommendationStore.fetchMenuRecommendations(true)
}

const loadNearbyMenus = async (forceRefresh = false) => {
  locationError.value = null

  let loc = location.value
  if (!loc) {
    try {
      loc = await requestLocation({ showToast: false })
    } catch {
      locationError.value = '위치 정보를 가져올 수 없습니다'
      return
    }
  }

  await recommendationStore.fetchNearbyMenuRecommendations(loc.lat, loc.lng, 5, forceRefresh)
}

const retryNearbyMenus = async () => {
  await loadNearbyMenus(true)
}

const goToBeanDetail = (bean) => {
  router.push(`/bean/${bean.beanId}`)
}

const goToMenuDetail = (menu) => {
  // Build query params with recommendation context
  const query = {}

  // Pass recommendation reason
  if (menu.reason) {
    query.reason = menu.reason
  }

  // Pass recommended bean ID (first bean that has the recommended flavors)
  // The API returns beans array sorted by relevance, so first bean is the recommended one
  if (menu.beans?.length) {
    query.recommendedBeanId = menu.beans[0].beanId || menu.beans[0].id
  }

  // Pass recommended flavors (the flavors that matched user's preference)
  if (menu.flavors?.length) {
    query.recommendedFlavors = JSON.stringify(menu.flavors.map(f => f.flavorId || f.code || f.id))
  }

  // Pass store info (already known from recommendation)
  if (menu.storeId) {
    query.storeId = menu.storeId
  }
  if (menu.storeName) {
    query.storeName = menu.storeName
  }
  if (menu.storeAddress) {
    query.storeAddress = menu.storeAddress
  }

  router.push({
    path: `/menus/${menu.menuId}`,
    query
  })
}
</script>

<style scoped>
/* Welcome Header */
.welcome-header {
  padding: 1.25rem 1rem 0.75rem;
}

.welcome-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin: 0 0 0.25rem 0;
}

.welcome-subtitle {
  font-size: 0.875rem;
  color: var(--color-textSecondary);
  margin: 0;
}

/* Section */
.section {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.section:last-of-type {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin: 0;
}

/* Section Refresh Button */
.section-refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: var(--color-textSecondary);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.section-refresh-btn:hover:not(:disabled) {
  background-color: var(--color-primary-50);
  color: var(--color-primary-600);
}

.section-refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Section Initial State */
.section-initial {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  background-color: var(--color-neutral-50);
  border-radius: 0.75rem;
  border: 1px dashed var(--color-border);
}

/* Card List */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2.5rem 1rem;
  background-color: var(--color-neutral-50);
  border-radius: 0.75rem;
  gap: 0.75rem;
}

.empty-icon {
  color: var(--color-textTertiary);
}

.empty-text {
  font-size: 0.9375rem;
  color: var(--color-textSecondary);
  margin: 0;
}

.empty-hint {
  font-size: 0.8125rem;
  color: var(--color-textTertiary);
  margin: 0;
}

/* Radius Notice */
.radius-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  margin-bottom: 0.75rem;
}

/* Animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
