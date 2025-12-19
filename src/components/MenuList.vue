<template>
  <div class="menu-list">
    <div
      v-for="menu in menus"
      :key="menu.id"
      class="menu-card"
      :class="{ expanded: expandedMenuId === menu.id }"
    >
      <!-- 메뉴 기본 정보 -->
      <div
        class="menu-item shadow-sm cursor-pointer hover:shadow"
        @click="toggleExpand(menu)"
      >
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
          <div class="menu-footer">
            <p class="menu-price">{{ formatPrice(menu.price) }}원</p>
            <button class="bean-toggle-btn" @click.stop="toggleExpand(menu)">
              <BaseIcon name="coffee" :size="14" />
              <span>원두</span>
              <svg
                class="toggle-icon"
                :class="{ rotated: expandedMenuId === menu.id }"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 원두 정보 확장 영역 -->
      <transition name="expand">
        <div v-if="expandedMenuId === menu.id" class="bean-section">
          <!-- 로딩 -->
          <div v-if="loadingMenuId === menu.id" class="bean-loading">
            <BaseIcon name="spinner" :size="20" class="animate-spin text-primary" />
            <span>원두 정보 불러오는 중...</span>
          </div>

          <!-- 원두 정보 표시 -->
          <template v-else-if="getMenuBeans(menu.id).length > 0">
            <div class="bean-header">
              <span class="bean-title">사용 원두</span>
              <span class="bean-count">{{ getMenuBeans(menu.id).length }}종</span>
            </div>
            <div class="bean-chips">
              <button
                v-for="bean in getMenuBeans(menu.id)"
                :key="bean.id"
                class="bean-chip"
                @click.stop="openBeanDetail(bean)"
              >
                <span>{{ bean.name }}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </template>

          <!-- 원두 정보 없음 -->
          <div v-else class="bean-empty">
            <BaseIcon name="coffee" :size="20" class="text-neutral-300" />
            <span>등록된 원두 정보가 없습니다</span>
          </div>
        </div>
      </transition>
    </div>

    <!-- 원두 상세 바텀시트 -->
    <transition name="sheet">
      <div v-if="selectedBean" class="bean-sheet-overlay" @click="closeBeanDetail">
        <div class="bean-sheet" @click.stop>
          <!-- 핸들 -->
          <div class="sheet-handle"></div>

          <!-- 로딩 -->
          <div v-if="loadingBeanDetail" class="sheet-loading">
            <BaseIcon name="spinner" :size="24" class="animate-spin text-primary" />
          </div>

          <!-- 원두 상세 정보 -->
          <template v-else-if="beanDetail">
            <div class="sheet-header">
              <h3 class="sheet-title">{{ beanDetail.name }}</h3>
              <button class="sheet-close" @click="closeBeanDetail">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div class="sheet-content">
              <!-- 로스터리 -->
              <div v-if="beanDetail.roasteryName" class="sheet-row">
                <span class="row-label">로스터리</span>
                <span class="row-value">{{ beanDetail.roasteryName }}</span>
              </div>

              <!-- 원산지 -->
              <div v-if="beanDetail.origin" class="sheet-row">
                <span class="row-label">원산지</span>
                <span class="row-value">{{ beanDetail.origin }}</span>
              </div>

              <!-- 프로세스 -->
              <div v-if="beanDetail.process" class="sheet-row">
                <span class="row-label">프로세스</span>
                <span class="row-value">{{ beanDetail.process }}</span>
              </div>

              <!-- 로스팅 레벨 -->
              <div v-if="beanDetail.roastLevel" class="sheet-row">
                <span class="row-label">로스팅</span>
                <span class="row-value">{{ beanDetail.roastLevel }}</span>
              </div>

              <!-- 향미 노트 -->
              <div v-if="beanDetail.flavorNotes?.length > 0" class="sheet-section">
                <span class="section-label">향미 노트</span>
                <div class="flavor-tags">
                  <span v-for="flavor in beanDetail.flavorNotes" :key="flavor" class="flavor-tag">
                    {{ flavor }}
                  </span>
                </div>
              </div>

              <!-- 설명 -->
              <div v-if="beanDetail.description" class="sheet-section">
                <span class="section-label">설명</span>
                <p class="section-text">{{ beanDetail.description }}</p>
              </div>
            </div>
          </template>

          <!-- 에러 -->
          <div v-else class="sheet-error">
            <p>원두 정보를 불러올 수 없습니다</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import { getMenuById } from '@/api/menu'
import { getBeanById } from '@/api/bean'
import { createLogger } from '@/utils/logger'

const logger = createLogger('MenuList')

defineProps({
  menus: {
    type: Array,
    required: true,
    default: () => []
  }
})

const expandedMenuId = ref(null)
const loadingMenuId = ref(null)
const menuBeans = ref({}) // { menuId: [{ id, name }, ...] }

const selectedBean = ref(null)
const beanDetail = ref(null)
const loadingBeanDetail = ref(false)

const formatPrice = (price) => {
  return price?.toLocaleString('ko-KR') || '0'
}

const getMenuBeans = (menuId) => {
  return menuBeans.value[menuId] || []
}

const toggleExpand = async (menu) => {
  // 이미 열려있으면 닫기
  if (expandedMenuId.value === menu.id) {
    expandedMenuId.value = null
    return
  }

  expandedMenuId.value = menu.id

  // 이미 로드된 정보가 있으면 API 호출 스킵
  if (menuBeans.value[menu.id]) {
    return
  }

  // API로 메뉴 상세 정보 로드
  loadingMenuId.value = menu.id
  try {
    const response = await getMenuById(menu.id)
    const data = response?.data ?? response
    menuBeans.value[menu.id] = data.beanBadges || []
    logger.info(`Loaded ${menuBeans.value[menu.id].length} beans for menu ${menu.id}`)
  } catch (e) {
    logger.error('Failed to fetch menu detail', e)
    menuBeans.value[menu.id] = []
  } finally {
    loadingMenuId.value = null
  }
}

const openBeanDetail = async (bean) => {
  selectedBean.value = bean
  beanDetail.value = null
  loadingBeanDetail.value = true

  try {
    const response = await getBeanById(bean.id)
    beanDetail.value = response?.data ?? response
    logger.info('Loaded bean detail:', beanDetail.value)
  } catch (e) {
    logger.error('Failed to fetch bean detail', e)
    beanDetail.value = null
  } finally {
    loadingBeanDetail.value = false
  }
}

const closeBeanDetail = () => {
  selectedBean.value = null
  beanDetail.value = null
}
</script>

<style scoped>
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  padding-bottom: 6rem;
}

.menu-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.menu-card.expanded {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.menu-item {
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;
  padding: 1rem;
  transition: all 0.2s;
}

.menu-image-wrapper {
  flex-shrink: 0;
  width: 88px;
  height: 88px;
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

.menu-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.menu-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin: 0;
  line-height: 1.3;
}

.menu-description {
  font-size: 0.8rem;
  color: var(--color-textSecondary);
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menu-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.35rem;
  gap: 0.5rem;
}

.menu-price {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.bean-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.6rem;
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
  border: none;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.bean-toggle-btn:hover {
  background-color: var(--color-primary-100);
}

.toggle-icon {
  transition: transform 0.2s;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

/* 확장 영역 */
.bean-section {
  padding: 0.875rem 1rem 1rem;
  background-color: var(--color-neutral-50);
  border-top: 1px solid var(--color-border);
}

.bean-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  color: var(--color-textSecondary);
  font-size: 0.8rem;
}

.bean-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
}

.bean-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-textSecondary);
}

.bean-count {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-primary);
  background-color: var(--color-primary-100);
  padding: 0.125rem 0.4rem;
  border-radius: 9999px;
}

.bean-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.bean-chip {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background-color: white;
  color: var(--color-textPrimary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.bean-chip:hover {
  border-color: var(--color-primary-300);
  background-color: var(--color-primary-50);
}

.bean-chip svg {
  color: var(--color-textSecondary);
}

.bean-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  color: var(--color-textSecondary);
  font-size: 0.8rem;
}

/* 확장 애니메이션 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 200px;
}

/* 바텀시트 */
.bean-sheet-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bean-sheet {
  width: 100%;
  max-width: 448px;
  max-height: 70vh;
  background: white;
  border-radius: 20px 20px 0 0;
  overflow-y: auto;
  padding: 0.5rem 1.25rem 2rem;
}

.sheet-handle {
  width: 36px;
  height: 4px;
  background-color: var(--color-neutral-300);
  border-radius: 2px;
  margin: 0.5rem auto 1rem;
}

.sheet-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.sheet-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin: 0;
}

.sheet-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-textSecondary);
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.15s;
}

.sheet-close:hover {
  background-color: var(--color-neutral-100);
}

.sheet-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sheet-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--color-border);
}

.row-label {
  font-size: 0.875rem;
  color: var(--color-textSecondary);
}

.row-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-textPrimary);
}

.sheet-section {
  padding-top: 0.5rem;
}

.section-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-textSecondary);
  margin-bottom: 0.5rem;
}

.section-text {
  font-size: 0.875rem;
  color: var(--color-textPrimary);
  line-height: 1.5;
  margin: 0;
}

.flavor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.flavor-tag {
  padding: 0.35rem 0.625rem;
  background-color: var(--color-accent-50, #fff8e1);
  color: var(--color-accent-700, #f57c00);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.sheet-error {
  padding: 2rem;
  text-align: center;
  color: var(--color-textSecondary);
}

/* 바텀시트 애니메이션 */
.sheet-enter-active,
.sheet-leave-active {
  transition: all 0.25s ease-out;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .bean-sheet,
.sheet-leave-to .bean-sheet {
  transform: translateY(100%);
}

@media (max-width: 640px) {
  .menu-item {
    gap: 0.75rem;
    padding: 0.875rem;
  }

  .menu-image-wrapper {
    width: 76px;
    height: 76px;
  }

  .menu-name {
    font-size: 0.95rem;
  }

  .menu-price {
    font-size: 0.95rem;
  }
}
</style>
