<template>
  <div class="menu-view">
    <BaseHeader show-back-button :title="storeName || '메뉴'" />

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <BaseIcon name="spinner" :size="32" class="text-primary animate-spin" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <BaseIcon name="x" :size="48" class="text-error mb-4" />
      <p class="text-textPrimary font-medium mb-2">메뉴를 불러올 수 없습니다</p>
      <p class="text-textSecondary text-sm mb-4">{{ error }}</p>
      <BaseButton label="다시 시도" variant="primary" @click="fetchMenus" />
    </div>

    <!-- Empty State -->
    <div v-else-if="menuData.length === 0" class="empty-state">
      <BaseIcon name="coffee" :size="48" class="text-primary-300 mb-4" />
      <p class="text-textSecondary">등록된 메뉴가 없습니다</p>
    </div>

    <!-- Menu List -->
    <template v-else>
      <MenuList :menus="menuData" @select-menu="handleMenuSelect" />

      <!-- Review Button Section -->
      <div class="review-button-section">
        <ReviewButton @click="goToReview" />
      </div>
    </template>

    <!-- Menu Detail Modal -->
    <MenuDetailModal
      v-if="selectedMenu"
      :menu="selectedMenu"
      :is-loading="isLoadingDetail"
      @close="selectedMenu = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createLogger } from '@/utils/logger'
import MenuList from '@/components/MenuList.vue'
import MenuDetailModal from '@/components/MenuDetailModal.vue'
import ReviewButton from '@/components/review/ReviewButton.vue'
import BaseHeader from '@/components/common/BaseHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import { getMenusByStoreId, getMenuById } from '@/api/menu'

const logger = createLogger('MenuView')
const route = useRoute()
const router = useRouter()

const storeId = computed(() => route.params.storeId)
const storeName = computed(() => route.query.name || '')

const menuData = ref([])
const isLoading = ref(true)
const error = ref(null)
const selectedMenu = ref(null)
const isLoadingDetail = ref(false)

const fetchMenus = async () => {
  if (!storeId.value) {
    error.value = '가게 ID가 없습니다'
    isLoading.value = false
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const response = await getMenusByStoreId(storeId.value, { page: 1, size: 50 })
    const data = response?.data ?? response
    // 페이지네이션 응답 처리: content 필드 또는 배열 직접 반환
    const menus = data?.content ?? (Array.isArray(data) ? data : [])
    menuData.value = menus
    logger.info(`Loaded ${menuData.value.length} menus for store ${storeId.value}`)
  } catch (e) {
    logger.error('Failed to fetch menus', e)
    error.value = e.response?.data?.message || '메뉴를 불러오는데 실패했습니다'
  } finally {
    isLoading.value = false
  }
}

const handleMenuSelect = async (menu) => {
  isLoadingDetail.value = true
  selectedMenu.value = menu

  try {
    const response = await getMenuById(menu.id)
    const detailData = response?.data ?? response
    selectedMenu.value = { ...menu, ...detailData }
  } catch (e) {
    logger.error('Failed to fetch menu detail', e)
  } finally {
    isLoadingDetail.value = false
  }
}

const goToReview = () => {
  router.push({
    name: 'review-select',
    query: {
      storeId: storeId.value,
      name: storeName.value
    }
  })
}

onMounted(() => {
  fetchMenus()
})
</script>

<style scoped>
.menu-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: var(--color-background);
}

.loading-state,
.error-state,
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.review-button-section {
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  padding: 0 1.5rem;
  max-width: 448px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .review-button-section {
    bottom: calc(64px + env(safe-area-inset-bottom) + 16px);
    padding: 0 1rem;
  }
}
</style>
