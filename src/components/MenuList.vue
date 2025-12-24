<template>
  <div class="menu-list">
    <!-- 로딩 상태 -->
    <div v-if="isLoadingBeans" class="loading-indicator">
      <BaseIcon name="spinner" :size="20" class="animate-spin text-primary" />
      <span>메뉴 정보 불러오는 중...</span>
    </div>

    <div
      v-for="menu in menus"
      :key="menu.id"
      class="menu-card"
      :class="{
        selected: selectedMenuId === menu.id,
        disabled: disabled
      }"
      @click="handleCardClick(menu)"
    >
      <!-- 메뉴 기본 정보 -->
      <div class="menu-item">
        <div class="menu-image-wrapper">
          <img
            v-if="menu.image_url || menu.imageUrl"
            :src="menu.image_url || menu.imageUrl"
            :alt="menu.name"
            class="menu-image"
          />
          <div v-else class="menu-image-placeholder">
            <BaseIcon name="coffee" :size="24" class="text-primary-300" />
          </div>
        </div>
        <div class="menu-info">
          <h3 class="menu-name">{{ menu.name }}</h3>
          <p v-if="menu.description" class="menu-description">{{ menu.description }}</p>
          <p class="menu-price">{{ formatPrice(menu.price) }}원</p>

          <!-- 원두 칩 (항상 표시) -->
          <div v-if="getMenuBeans(menu.id).length > 0" class="bean-chips">
            <button
              v-for="bean in getMenuBeans(menu.id)"
              :key="bean.id"
              class="bean-chip"
              @click.stop="goToBeanDetail(bean)"
            >
              <span>{{ bean.name }}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          <div v-else-if="!isLoadingBeans && menuBeans[menu.id] !== undefined" class="bean-empty-inline">
            <span>원두 정보 없음</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseIcon from '@/components/common/BaseIcon.vue'
import { getMenuById } from '@/api/menu'
import { createLogger } from '@/utils/logger'

const logger = createLogger('MenuList')
const router = useRouter()

const props = defineProps({
  menus: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedMenuId: {
    type: [Number, String],
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select-menu'])

// 원두 정보 상태
const menuBeans = ref({}) // { menuId: [{ id, name }, ...] }
const isLoadingBeans = ref(false)

const formatPrice = (price) => {
  return price?.toLocaleString('ko-KR') || '0'
}

const getMenuBeans = (menuId) => {
  return menuBeans.value[menuId] || []
}

// 모든 메뉴의 원두 정보 미리 로드
const preloadAllBeans = async () => {
  if (!props.menus?.length) return

  isLoadingBeans.value = true

  try {
    // 병렬로 모든 메뉴 상세 정보 fetch
    const promises = props.menus.map(async (menu) => {
      // 이미 로드된 정보는 스킵
      if (menuBeans.value[menu.id]) return

      try {
        const response = await getMenuById(menu.id)
        const data = response?.data ?? response
        menuBeans.value[menu.id] = data.beanBadges || []
      } catch (e) {
        logger.error(`Failed to fetch beans for menu ${menu.id}`, e)
        menuBeans.value[menu.id] = []
      }
    })

    await Promise.all(promises)
    logger.info(`Preloaded beans for ${props.menus.length} menus`)
  } finally {
    isLoadingBeans.value = false
  }
}

// 카드 클릭 핸들러 (원두 칩 영역 제외)
const handleCardClick = (menu) => {
  if (props.disabled) return
  emit('select-menu', menu)
}

// 원두 상세 페이지로 이동
const goToBeanDetail = (bean) => {
  router.push({
    name: 'bean-detail',
    params: { beanId: bean.id }
  })
}

// menus가 변경되면 원두 정보 로드
watch(() => props.menus, (newMenus) => {
  if (newMenus?.length) {
    preloadAllBeans()
  }
}, { immediate: true })

onMounted(() => {
  if (props.menus?.length) {
    preloadAllBeans()
  }
})
</script>

<style scoped>
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  color: var(--color-textSecondary);
  font-size: 0.8125rem;
}

.menu-card {
  background: transparent;
  overflow: hidden;
  transition: all 0.2s;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}

.menu-card:last-child {
  border-bottom: none;
}

.menu-card:hover {
  background-color: var(--color-neutral-50);
}

.menu-card:active {
  background-color: var(--color-neutral-100);
}

.menu-card.selected {
  background-color: var(--color-primary-50);
}

.menu-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.menu-card.disabled.selected {
  opacity: 1;
}

.menu-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
}

.menu-image-wrapper {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
}

.menu-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.menu-image-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-50);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-image-placeholder :deep(svg) {
  width: 24px;
  height: 24px;
}

.menu-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.menu-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-textPrimary);
  margin: 0;
  line-height: 1.3;
}

.menu-description {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menu-price {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
  margin-top: 0.125rem;
}

/* 원두 칩 (항상 표시) */
.bean-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.bean-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
  border: 1px solid var(--color-primary-200);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.bean-chip:hover {
  background-color: var(--color-primary-100);
  border-color: var(--color-primary-300);
  color: var(--color-primary-800);
}

.bean-chip svg {
  color: var(--color-primary-500);
  width: 10px;
  height: 10px;
}

.bean-chip:hover svg {
  color: var(--color-primary-700);
}

.bean-empty-inline {
  margin-top: 0.125rem;
  font-size: 0.6875rem;
  color: var(--color-textSecondary);
}

@media (max-width: 640px) {
  .menu-item {
    gap: 0.875rem;
    padding: 0.875rem 0;
  }

  .menu-image-wrapper {
    width: 72px;
    height: 72px;
  }

  .menu-name {
    font-size: 0.9375rem;
  }

  .menu-price {
    font-size: 0.875rem;
  }
}
</style>
