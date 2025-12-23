<template>
  <div class="flex flex-col min-h-full h-full bg-background">
    <!-- Header -->
    <BaseHeader :title="pageTitle" show-back />

    <!-- Content -->
    <div class="flex-1 overflow-y-auto safe-bottom">
      <!-- Loading Bean -->
      <div v-if="isLoadingBean" class="p-4">
        <RecommendationSkeleton type="bean" />
      </div>

      <!-- Error -->
      <div v-else-if="beanError" class="p-4">
        <div class="empty-state">
          <p>{{ beanError }}</p>
          <button class="retry-btn" @click="loadBeanDetail">다시 시도</button>
        </div>
      </div>

      <!-- Bean Detail -->
      <template v-else-if="bean">
        <!-- Bean Info Card -->
        <div class="bean-detail-card mx-4 mt-4">
          <h1 class="bean-name">{{ bean.beanName }}</h1>

          <div class="bean-meta">
            <span v-if="bean.origin" class="meta-item">
              <BaseIcon name="globe" :size="14" />
              {{ bean.origin }}
            </span>
            <span v-if="bean.roastLevel" class="meta-item">
              <BaseIcon name="fire" :size="14" />
              {{ formatRoastingLevel(bean.roastLevel) }}
            </span>
          </div>

          <!-- Flavor badges -->
          <div v-if="bean.flavors?.length" class="flavor-list">
            <FlavorBadge
              v-for="flavor in bean.flavors"
              :key="flavor.flavorId"
              :flavor="flavor"
            />
          </div>

          <!-- Description -->
          <p v-if="bean.description" class="bean-description">
            {{ bean.description }}
          </p>

          <!-- AI Reason (if from recommendation) -->
          <RecommendationReason v-if="bean.reason" :reason="bean.reason" />
        </div>

        <!-- Menus using this bean -->
        <section class="px-4 py-4">
          <div class="section-header">
            <h2 class="section-title">
              <span class="section-icon">🍵</span>
              이 원두를 사용하는 메뉴
            </h2>
            <LocationModeToggle v-model="menuLocationMode" @update:model-value="onLocationModeChange" />
          </div>

          <!-- Loading Menus -->
          <div v-if="isLoadingMenus" class="space-y-3">
            <RecommendationSkeleton v-for="i in 3" :key="i" type="menu" />
          </div>

          <!-- Error -->
          <div v-else-if="menuError" class="empty-state">
            <p>{{ menuError }}</p>
            <button class="retry-btn" @click="loadMenus">다시 시도</button>
          </div>

          <!-- Empty -->
          <div v-else-if="!menus.length" class="empty-state">
            <p>이 원두를 사용하는 메뉴가 없습니다</p>
            <p v-if="menuLocationMode === 'nearby'" class="text-sm mt-1">
              검색 반경 내에 메뉴가 없습니다. 전체 보기를 이용해주세요.
            </p>
          </div>

          <!-- Menu List -->
          <div v-else class="space-y-3">
            <MenuRecommendationCard
              v-for="menu in menus"
              :key="menu.menuId"
              :menu="menu"
              :show-rank="false"
              :show-reason="false"
              @click="goToStore"
            />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGeolocation } from '@/composables/useGeolocation'
import { createLogger } from '@/utils/logger'
import { showWarning } from '@/utils/toast'
import {
  getMenusByBean,
  getNearbyMenusByBean,
  formatRoastingLevel
} from '@/api/recommendation'

import BaseHeader from '@/components/common/BaseHeader.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import FlavorBadge from '@/components/recommendation/FlavorBadge.vue'
import RecommendationReason from '@/components/recommendation/RecommendationReason.vue'
import LocationModeToggle from '@/components/recommendation/LocationModeToggle.vue'
import MenuRecommendationCard from '@/components/recommendation/MenuRecommendationCard.vue'
import RecommendationSkeleton from '@/components/recommendation/RecommendationSkeleton.vue'

const logger = createLogger('BeanDetailView')
const route = useRoute()
const router = useRouter()
const { location, requestLocation } = useGeolocation()

// State
const bean = ref(null)
const menus = ref([])
const isLoadingBean = ref(false)
const isLoadingMenus = ref(false)
const beanError = ref(null)
const menuError = ref(null)
const menuLocationMode = ref('global')

// Computed
const beanId = computed(() => Number(route.params.beanId))
const pageTitle = computed(() => bean.value?.beanName || '원두 상세')

// Methods
const loadBeanDetail = async () => {
  isLoadingBean.value = true
  beanError.value = null

  try {
    // 추천 페이지에서 넘어온 경우 route.query로 bean 데이터가 있을 수 있음
    // 없으면 메뉴 조회 시 첫 번째 메뉴의 beans에서 정보 추출
    if (route.query.bean) {
      try {
        bean.value = JSON.parse(route.query.bean)
      } catch {
        // JSON 파싱 실패 시 무시
      }
    }

    // bean 데이터가 없으면 메뉴 조회 후 추출
    if (!bean.value) {
      await loadMenus()
      // 첫 번째 메뉴에서 원두 정보 추출은 어려우므로, 기본 정보만 표시
      // 실제로는 별도 API가 필요할 수 있음
      bean.value = {
        beanId: beanId.value,
        beanName: `원두 #${beanId.value}`,
        description: '',
        origin: '',
        roastLevel: '',
        flavors: []
      }
    }
  } catch (error) {
    logger.error('Failed to load bean detail', error)
    beanError.value = '원두 정보를 불러올 수 없습니다'
  } finally {
    isLoadingBean.value = false
  }
}

const loadMenus = async () => {
  isLoadingMenus.value = true
  menuError.value = null

  try {
    if (menuLocationMode.value === 'nearby') {
      let loc = location.value
      if (!loc) {
        try {
          loc = await requestLocation({ showToast: true })
        } catch {
          menuLocationMode.value = 'global'
          showWarning('위치 정보를 가져올 수 없어 전체 메뉴를 표시합니다')
          const data = await getMenusByBean(beanId.value)
          menus.value = data || []
          return
        }
      }

      const data = await getNearbyMenusByBean(beanId.value, loc.lat, loc.lng, 10)
      menus.value = data || []
    } else {
      const data = await getMenusByBean(beanId.value)
      menus.value = data || []
    }

    logger.info('Menus loaded', {
      beanId: beanId.value,
      mode: menuLocationMode.value,
      count: menus.value.length
    })
  } catch (error) {
    logger.error('Failed to load menus', error)
    menuError.value = '메뉴를 불러올 수 없습니다'
  } finally {
    isLoadingMenus.value = false
  }
}

const onLocationModeChange = () => {
  loadMenus()
}

const goToStore = (menu) => {
  router.push(`/store/${menu.storeId}`)
}

// Watch for route changes
watch(() => route.params.beanId, () => {
  if (route.params.beanId) {
    bean.value = null
    menus.value = []
    loadBeanDetail()
  }
})

// Lifecycle
onMounted(() => {
  loadBeanDetail()
})
</script>

<style scoped>
.bean-detail-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
}

.bean-name {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin: 0 0 0.75rem 0;
}

.bean-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-textSecondary);
}

.meta-item :deep(svg) {
  color: var(--color-primary-500);
}

.flavor-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.bean-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-textSecondary);
  margin: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-textPrimary);
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

.space-y-3 > * + * {
  margin-top: 0.75rem;
}
</style>
