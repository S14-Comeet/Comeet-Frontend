<template>
  <div class="flex flex-col min-h-full bg-background">
    <!-- 탭 바 -->
    <div class="bg-white border-b border-border flex">
      <button
        class="flex-1 py-3 text-sm font-medium transition-colors"
        :class="activeTab === 'menu' ? 'text-primary border-b-2 border-primary' : 'text-textSecondary'"
        @click="activeTab = 'menu'"
      >
        메뉴
      </button>
      <button
        class="flex-1 py-3 text-sm font-medium transition-colors"
        :class="activeTab === 'bean' ? 'text-primary border-b-2 border-primary' : 'text-textSecondary'"
        @click="switchToBeanTab"
      >
        원두
      </button>
    </div>

    <!-- 컨텐츠 영역 -->
    <div class="flex-1 p-4">
      <!-- ========== 메뉴 탭 ========== -->
      <template v-if="activeTab === 'menu'">
        <!-- 로딩 상태 -->
        <div v-if="isLoadingMenus" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="menuError" class="text-center py-12">
          <BaseIcon name="notice" :size="48" class="text-error mx-auto mb-4" />
          <p class="text-textSecondary mb-4">메뉴 목록을 불러오지 못했습니다</p>
          <BaseButton variant="secondary" size="small" @click="fetchMenus">
            다시 시도
          </BaseButton>
        </div>

        <!-- 메뉴 목록 -->
        <template v-else>
          <!-- 메뉴 추가 버튼 -->
          <button
            class="w-full flex items-center justify-center gap-2 p-4 mb-4 bg-white rounded-xl border-2 border-dashed border-primary-300 text-primary hover:bg-primary-50 transition-colors"
            @click="goToAddMenu"
          >
            <BaseIcon name="plus" :size="20" />
            <span class="font-medium">새 메뉴 추가</span>
          </button>

          <!-- 빈 상태 -->
          <div v-if="menus.length === 0" class="text-center py-12">
            <BaseIcon name="list" :size="48" class="text-textSecondary mx-auto mb-4" />
            <p class="text-textPrimary text-lg font-medium mb-2">등록된 메뉴가 없습니다</p>
            <p class="text-textSecondary text-sm">첫 번째 메뉴를 추가해보세요</p>
          </div>

          <!-- 메뉴 카드 목록 -->
          <div v-else class="space-y-3">
            <OwnerMenuCard
              v-for="menu in menus"
              :key="menu.id"
              :menu="menu"
              @edit="handleEditMenu"
              @delete="handleDeleteMenu"
              @manage-beans="handleManageBeans"
            />
          </div>

          <!-- 페이지네이션 -->
          <div v-if="menuTotalPages > 1" class="flex justify-center gap-2 mt-6">
            <button
              v-for="page in menuTotalPages"
              :key="page"
              :class="[
                'w-8 h-8 rounded-full text-sm font-medium transition-colors',
                menuCurrentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-white text-textSecondary hover:bg-primary-50'
              ]"
              @click="goToMenuPage(page)"
            >
              {{ page }}
            </button>
          </div>
        </template>
      </template>

      <!-- ========== 원두 탭 ========== -->
      <template v-else>
        <!-- 로딩 상태 -->
        <div v-if="isLoadingBeans" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="beanError" class="text-center py-12">
          <BaseIcon name="notice" :size="48" class="text-error mx-auto mb-4" />
          <p class="text-textSecondary mb-4">원두 목록을 불러오지 못했습니다</p>
          <BaseButton variant="secondary" size="small" @click="fetchBeans">
            다시 시도
          </BaseButton>
        </div>

        <!-- 원두 목록 -->
        <template v-else>
          <!-- 새 원두 추가 버튼 -->
          <button
            class="w-full flex items-center justify-center gap-2 p-4 mb-4 bg-white rounded-xl border-2 border-dashed border-primary-300 text-primary hover:bg-primary-50 transition-colors"
            @click="goToAddBean"
          >
            <BaseIcon name="plus" :size="20" />
            <span class="font-medium">새 원두 등록</span>
          </button>

          <!-- 빈 상태 -->
          <div v-if="beans.length === 0" class="text-center py-12">
            <BaseIcon name="coffee" :size="48" class="text-textSecondary mx-auto mb-4" />
            <p class="text-textPrimary text-lg font-medium mb-2">등록된 원두가 없습니다</p>
            <p class="text-textSecondary text-sm">첫 번째 원두를 등록해보세요</p>
          </div>

          <!-- 원두 카드 목록 -->
          <div v-else class="space-y-3">
            <OwnerBeanCard
              v-for="bean in beans"
              :key="bean.id"
              :bean="bean"
              :linked-menu-count="getBeanLinkedMenuCount(bean.id)"
              @link-menus="handleLinkMenus"
              @delete="handleDeleteBean"
            />
          </div>

          <!-- 페이지네이션 -->
          <div v-if="beanTotalPages > 1" class="flex justify-center gap-2 mt-6">
            <button
              v-for="page in beanTotalPages"
              :key="page"
              :class="[
                'w-8 h-8 rounded-full text-sm font-medium transition-colors',
                beanCurrentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-white text-textSecondary hover:bg-primary-50'
              ]"
              @click="goToBeanPage(page)"
            >
              {{ page }}
            </button>
          </div>
        </template>
      </template>
    </div>

    <!-- 삭제 확인 모달 (메뉴) -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          @click.self="cancelDelete"
        >
          <div class="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl">
            <h3 class="text-lg font-bold text-neutral-900 mb-2">메뉴 삭제</h3>
            <p class="text-textSecondary mb-6">
              <span class="font-medium text-textPrimary">{{ deletingMenu?.name }}</span>
              을(를) 삭제하시겠습니까?
            </p>
            <div class="flex gap-3">
              <BaseButton
                variant="secondary"
                size="medium"
                class="flex-1"
                @click="cancelDelete"
              >
                취소
              </BaseButton>
              <BaseButton
                variant="primary"
                size="medium"
                class="flex-1 !bg-error hover:!bg-error/90"
                :loading="isDeleting"
                @click="confirmDelete"
              >
                삭제
              </BaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 삭제 확인 모달 (원두) -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showBeanDeleteModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          @click.self="cancelBeanDelete"
        >
          <div class="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl">
            <h3 class="text-lg font-bold text-neutral-900 mb-2">원두 삭제</h3>
            <p class="text-textSecondary mb-6">
              <span class="font-medium text-textPrimary">{{ deletingBean?.country }}{{ deletingBean?.farm ? ` ${deletingBean.farm}` : '' }}</span>
              을(를) 삭제하시겠습니까?
            </p>
            <div class="flex gap-3">
              <BaseButton
                variant="secondary"
                size="medium"
                class="flex-1"
                @click="cancelBeanDelete"
              >
                취소
              </BaseButton>
              <BaseButton
                variant="primary"
                size="medium"
                class="flex-1 !bg-error hover:!bg-error/90"
                :loading="isDeletingBean"
                @click="confirmBeanDelete"
              >
                삭제
              </BaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 원두 연결 모달 (메뉴 탭에서 사용) -->
    <OwnerBeanSelector
      v-if="showBeanModal"
      :menu="selectedMenuForBeans"
      @close="closeBeanModal"
      @updated="handleBeansUpdated"
    />

    <!-- 메뉴 연결 모달 (원두 탭에서 사용) -->
    <OwnerMenuLinkModal
      v-if="showMenuLinkModal"
      :bean="selectedBeanForMenus"
      :store-id="storeId"
      @close="closeMenuLinkModal"
      @updated="handleMenuLinkUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMenusByStoreId } from '@/api/menu'
import { getStoreById } from '@/api/cafe'
import { deleteMenu, getBeansByRoastery } from '@/api/owner'
import { createLogger } from '@/utils/logger'
import { showSuccess, showError } from '@/utils/toast'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import OwnerMenuCard from '@/components/owner/OwnerMenuCard.vue'
import OwnerBeanCard from '@/components/owner/OwnerBeanCard.vue'
import OwnerBeanSelector from '@/components/owner/OwnerBeanSelector.vue'
import OwnerMenuLinkModal from '@/components/owner/OwnerMenuLinkModal.vue'

const logger = createLogger('OwnerMenuManage')
const route = useRoute()
const router = useRouter()

// 탭 상태
const activeTab = ref('menu')

// 공통 상태
const storeId = computed(() => route.params.storeId)
const storeInfo = ref(null)

// 메뉴 탭 상태
const menus = ref([])
const isLoadingMenus = ref(true)
const menuError = ref(null)
const menuCurrentPage = ref(1)
const menuTotalPages = ref(1)
const pageSize = 10

// 원두 탭 상태
const beans = ref([])
const isLoadingBeans = ref(false)
const beanError = ref(null)
const beanCurrentPage = ref(1)
const beanTotalPages = ref(1)
const beansLoaded = ref(false)

// 메뉴 삭제 모달 상태
const showDeleteModal = ref(false)
const deletingMenu = ref(null)
const isDeleting = ref(false)

// 원두 삭제 모달 상태
const showBeanDeleteModal = ref(false)
const deletingBean = ref(null)
const isDeletingBean = ref(false)

// 원두 연결 모달 상태 (메뉴 탭에서)
const showBeanModal = ref(false)
const selectedMenuForBeans = ref(null)

// 메뉴 연결 모달 상태 (원두 탭에서)
const showMenuLinkModal = ref(false)
const selectedBeanForMenus = ref(null)

/**
 * 가맹점 정보 로드
 */
const fetchStoreInfo = async () => {
  try {
    const response = await getStoreById(storeId.value)
    const store = response.data || response
    storeInfo.value = store
  } catch (err) {
    logger.warn('가맹점 정보 로드 실패', err)
  }
}

/**
 * 메뉴 목록 조회
 */
const fetchMenus = async (page = 1) => {
  isLoadingMenus.value = true
  menuError.value = null

  try {
    const response = await getMenusByStoreId(storeId.value, { page, size: pageSize })
    const data = response.data || response

    menus.value = data.content || data || []
    menuTotalPages.value = data.totalPages || 1
    menuCurrentPage.value = page

    logger.info('메뉴 목록 조회 성공', { count: menus.value.length })
  } catch (err) {
    logger.error('메뉴 목록 조회 실패', err)
    menuError.value = err
  } finally {
    isLoadingMenus.value = false
  }
}

/**
 * 원두 목록 조회
 */
const fetchBeans = async (page = 1) => {
  if (!storeInfo.value?.roasteryId) {
    logger.warn('로스터리 ID가 없습니다')
    return
  }

  isLoadingBeans.value = true
  beanError.value = null

  try {
    const response = await getBeansByRoastery(storeInfo.value.roasteryId, { page, size: pageSize })
    const data = response.data || response

    beans.value = data.content || data || []
    beanTotalPages.value = data.totalPages || 1
    beanCurrentPage.value = page
    beansLoaded.value = true

    logger.info('원두 목록 조회 성공', { count: beans.value.length })
  } catch (err) {
    logger.error('원두 목록 조회 실패', err)
    beanError.value = err
  } finally {
    isLoadingBeans.value = false
  }
}

/**
 * 원두 탭으로 전환
 */
const switchToBeanTab = () => {
  activeTab.value = 'bean'
  if (!beansLoaded.value) {
    fetchBeans()
  }
}

/**
 * 원두에 연결된 메뉴 수 계산
 */
const getBeanLinkedMenuCount = (beanId) => {
  return menus.value.filter(menu =>
    menu.beanBadges?.some(b => b.beanId === beanId)
  ).length
}

/**
 * 메뉴 페이지 이동
 */
const goToMenuPage = (page) => {
  fetchMenus(page)
}

/**
 * 원두 페이지 이동
 */
const goToBeanPage = (page) => {
  fetchBeans(page)
}

/**
 * 메뉴 추가 페이지로 이동
 */
const goToAddMenu = () => {
  router.push({ name: 'owner-menu-new', params: { storeId: storeId.value } })
}

/**
 * 원두 등록 페이지로 이동
 */
const goToAddBean = () => {
  router.push({ name: 'owner-bean-new', params: { storeId: storeId.value } })
}

/**
 * 메뉴 수정 페이지로 이동
 */
const handleEditMenu = (menu) => {
  router.push({ name: 'owner-menu-edit', params: { menuId: menu.id } })
}

/**
 * 메뉴 삭제 확인 모달 표시
 */
const handleDeleteMenu = (menu) => {
  deletingMenu.value = menu
  showDeleteModal.value = true
}

/**
 * 메뉴 삭제 취소
 */
const cancelDelete = () => {
  showDeleteModal.value = false
  deletingMenu.value = null
}

/**
 * 메뉴 삭제 확인
 */
const confirmDelete = async () => {
  if (!deletingMenu.value) return

  isDeleting.value = true
  try {
    await deleteMenu(deletingMenu.value.id)
    showSuccess('메뉴가 삭제되었습니다')

    menus.value = menus.value.filter(m => m.id !== deletingMenu.value.id)
    showDeleteModal.value = false
    deletingMenu.value = null
  } catch (err) {
    logger.error('메뉴 삭제 실패', err)
    showError('메뉴 삭제에 실패했습니다')
  } finally {
    isDeleting.value = false
  }
}

/**
 * 원두 연결 관리 (메뉴 탭에서)
 */
const handleManageBeans = (menu) => {
  selectedMenuForBeans.value = menu
  showBeanModal.value = true
}

/**
 * 원두 연결 모달 닫기
 */
const closeBeanModal = () => {
  showBeanModal.value = false
  selectedMenuForBeans.value = null
}

/**
 * 원두 연결 업데이트 후 처리
 */
const handleBeansUpdated = () => {
  fetchMenus(menuCurrentPage.value)
}

/**
 * 메뉴 연결 (원두 탭에서)
 */
const handleLinkMenus = (bean) => {
  selectedBeanForMenus.value = bean
  showMenuLinkModal.value = true
}

/**
 * 메뉴 연결 모달 닫기
 */
const closeMenuLinkModal = () => {
  showMenuLinkModal.value = false
  selectedBeanForMenus.value = null
}

/**
 * 메뉴 연결 업데이트 후 처리
 */
const handleMenuLinkUpdated = () => {
  // 메뉴 목록 새로고침 (원두-메뉴 연결 수 갱신용)
  fetchMenus(menuCurrentPage.value)
}

/**
 * 원두 삭제 확인 모달 표시
 */
const handleDeleteBean = (bean) => {
  deletingBean.value = bean
  showBeanDeleteModal.value = true
}

/**
 * 원두 삭제 취소
 */
const cancelBeanDelete = () => {
  showBeanDeleteModal.value = false
  deletingBean.value = null
}

/**
 * 원두 삭제 확인
 */
const confirmBeanDelete = async () => {
  if (!deletingBean.value) return

  isDeletingBean.value = true
  try {
    // TODO: 원두 삭제 API 호출 (현재 API에 없음)
    // await deleteBean(deletingBean.value.id)
    showError('원두 삭제 API가 구현되지 않았습니다')

    showBeanDeleteModal.value = false
    deletingBean.value = null
  } catch (err) {
    logger.error('원두 삭제 실패', err)
    showError('원두 삭제에 실패했습니다')
  } finally {
    isDeletingBean.value = false
  }
}

onMounted(async () => {
  await fetchStoreInfo()
  fetchMenus()

  // URL 쿼리로 탭 지정 시 해당 탭으로 이동 (원두 등록 후 돌아올 때)
  if (route.query.tab === 'bean') {
    switchToBeanTab()
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
