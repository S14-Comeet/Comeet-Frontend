<template>
  <div class="flex flex-col min-h-full h-full bg-background">
    <!-- Content -->
    <div class="flex-1 overflow-y-auto safe-bottom">
      <!-- Welcome Message -->
      <div class="px-4 pt-4 pb-2">
        <p class="text-lg font-bold text-textPrimary">
          {{ welcomeMessage }}
        </p>
        <p class="text-sm text-textSecondary mt-1">
          취향에 맞는 메뉴와 원두를 추천해드려요
        </p>
      </div>

      <!-- Nearby Menu Recommendations Section -->
      <section class="px-4 py-3">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon">📍</span>
            내 주변 추천 메뉴
          </h2>
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
          <BaseButton variant="tertiary" size="small" @click="loadNearbyMenus(false)">
            추천 받기
          </BaseButton>
        </div>

        <!-- Radius Expanded Notice -->
        <div v-else-if="recommendationStore.radiusExpanded && recommendationStore.hasFetchedNearbyMenus" class="radius-notice">
          반경 {{ recommendationStore.actualRadiusKm }}km까지 확장하여 검색했습니다
        </div>

        <!-- Loading -->
        <div v-if="recommendationStore.isLoadingNearbyMenus" class="space-y-3">
          <RecommendationSkeleton v-for="i in 3" :key="i" type="menu" />
        </div>

        <!-- Location Error -->
        <div v-else-if="locationError" class="empty-state">
          <p>{{ locationError }}</p>
          <BaseButton variant="tertiary" size="small" class="mt-3" @click="retryNearbyMenus">
            다시 시도
          </BaseButton>
        </div>

        <!-- API Error -->
        <div v-else-if="recommendationStore.nearbyMenuError" class="empty-state">
          <p>{{ recommendationStore.nearbyMenuError }}</p>
          <BaseButton variant="tertiary" size="small" class="mt-3" @click="retryNearbyMenus">
            다시 시도
          </BaseButton>
        </div>

        <!-- Empty -->
        <div v-else-if="recommendationStore.hasFetchedNearbyMenus && !recommendationStore.nearbyMenuRecommendations.length" class="empty-state">
          <p>주변에 추천할 메뉴가 없습니다</p>
          <p class="text-sm mt-1">검색 반경을 넓혀보세요</p>
        </div>

        <!-- Nearby Menu List -->
        <div v-else-if="recommendationStore.nearbyMenuRecommendations.length" class="space-y-3">
          <MenuRecommendationCard
            v-for="menu in recommendationStore.nearbyMenuRecommendations"
            :key="menu.menuId"
            :menu="menu"
            @click="goToMenuDetail"
          />
        </div>
      </section>

      <!-- Global Menu Recommendations Section -->
      <section class="px-4 py-3">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon">🌍</span>
            전체 추천 메뉴
          </h2>
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
          <BaseButton variant="tertiary" size="small" @click="loadGlobalMenus">
            추천 받기
          </BaseButton>
        </div>

        <!-- Loading -->
        <div v-else-if="recommendationStore.isLoadingMenus" class="space-y-3">
          <RecommendationSkeleton v-for="i in 3" :key="i" type="menu" />
        </div>

        <!-- Error -->
        <div v-else-if="recommendationStore.menuError" class="empty-state">
          <p>{{ recommendationStore.menuError }}</p>
          <BaseButton variant="tertiary" size="small" class="mt-3" @click="loadGlobalMenus">
            다시 시도
          </BaseButton>
        </div>

        <!-- Empty -->
        <div v-else-if="recommendationStore.hasFetchedMenus && !recommendationStore.menuRecommendations.length" class="empty-state">
          <p>추천할 메뉴가 없습니다</p>
        </div>

        <!-- Global Menu List -->
        <div v-else-if="recommendationStore.menuRecommendations.length" class="space-y-3">
          <MenuRecommendationCard
            v-for="menu in recommendationStore.menuRecommendations"
            :key="menu.menuId"
            :menu="menu"
            @click="goToMenuDetail"
          />
        </div>
      </section>

      <!-- Bean Recommendations Section -->
      <section class="px-4 py-3">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon">☕</span>
            추천 원두
          </h2>
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
          <BaseButton variant="tertiary" size="small" @click="loadBeans">
            추천 받기
          </BaseButton>
        </div>

        <!-- Loading -->
        <div v-else-if="recommendationStore.isLoadingBeans" class="space-y-3">
          <RecommendationSkeleton v-for="i in 3" :key="i" type="bean" />
        </div>

        <!-- Error -->
        <div v-else-if="recommendationStore.beanError" class="empty-state">
          <p>{{ recommendationStore.beanError }}</p>
          <BaseButton variant="tertiary" size="small" class="mt-3" @click="loadBeans">
            다시 시도
          </BaseButton>
        </div>

        <!-- Empty -->
        <div v-else-if="recommendationStore.hasFetchedBeans && !recommendationStore.beanRecommendations.length" class="empty-state">
          <p>추천할 원두가 없습니다</p>
          <p class="text-sm mt-1">취향 설정을 완료해주세요</p>
        </div>

        <!-- Bean List -->
        <div v-else-if="recommendationStore.beanRecommendations.length" class="space-y-3">
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

/* Section Initial State */
.section-initial {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
}

/* Section Refresh Button */
.section-refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  color: var(--color-textSecondary);
  border-radius: 0.375rem;
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--color-textSecondary);
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
