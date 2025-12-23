<template>
  <div class="flex flex-col min-h-full bg-background">
    <!-- 페이지 헤더 -->
    <div class="bg-white px-4 py-5 border-b border-border">
      <h1 class="text-xl font-bold text-textPrimary">내 가게 관리</h1>
      <p class="text-sm text-textSecondary mt-1">등록한 가맹점을 관리하세요</p>
    </div>

    <!-- 컨텐츠 영역 -->
    <div class="flex-1 p-4">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="text-center py-12">
        <BaseIcon name="notice" :size="48" class="text-error mx-auto mb-4" />
        <p class="text-textSecondary mb-4">가맹점 목록을 불러오지 못했습니다</p>
        <BaseButton variant="secondary" size="small" @click="fetchStores">
          다시 시도
        </BaseButton>
      </div>

      <!-- 빈 상태 -->
      <div v-else-if="stores.length === 0" class="text-center py-12">
        <BaseIcon name="coffee" :size="48" class="text-textSecondary mx-auto mb-4" />
        <p class="text-textPrimary text-lg font-medium mb-2">등록된 가맹점이 없습니다</p>
        <p class="text-textSecondary text-sm mb-6">첫 번째 가맹점을 등록해보세요</p>
        <BaseButton variant="primary" size="medium" @click="goToAddStore">
          가맹점 등록하기
        </BaseButton>
      </div>

      <!-- 가맹점 목록 -->
      <template v-else>
        <!-- 가맹점 추가 버튼 -->
        <button
          class="w-full flex items-center justify-center gap-2 p-4 mb-4 bg-white rounded-xl border-2 border-dashed border-primary-300 text-primary hover:bg-primary-50 transition-colors"
          @click="goToAddStore"
        >
          <BaseIcon name="plus" :size="20" />
          <span class="font-medium">새 가맹점 등록</span>
        </button>

        <!-- 가맹점 카드 목록 -->
        <div class="space-y-3">
          <OwnerStoreCard
            v-for="store in stores"
            :key="store.id"
            :store="store"
            @edit="handleEditStore"
            @delete="handleDeleteStore"
            @manage-menus="handleManageMenus"
          />
        </div>
      </template>
    </div>

    <!-- 삭제 확인 모달 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          @click.self="cancelDelete"
        >
          <div class="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl">
            <h3 class="text-lg font-bold text-neutral-900 mb-2">가맹점 삭제</h3>
            <p class="text-textSecondary mb-2">
              <span class="font-medium text-textPrimary">{{ deletingStore?.name }}</span>
              을(를) 삭제하시겠습니까?
            </p>
            <p class="text-sm text-error mb-6">삭제된 가맹점은 복구할 수 없습니다.</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyStores, deleteStore } from '@/api/owner'
import { createLogger } from '@/utils/logger'
import { showSuccess, showError } from '@/utils/toast'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import OwnerStoreCard from '@/components/owner/OwnerStoreCard.vue'

const logger = createLogger('OwnerStoreList')
const router = useRouter()

// 상태
const stores = ref([])
const isLoading = ref(true)
const error = ref(null)

// 삭제 모달 상태
const showDeleteModal = ref(false)
const deletingStore = ref(null)
const isDeleting = ref(false)

/**
 * 가맹점 목록 조회
 */
const fetchStores = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await getMyStores()
    stores.value = response.data || response || []
    logger.info('가맹점 목록 조회 성공', { count: stores.value.length })
  } catch (err) {
    logger.error('가맹점 목록 조회 실패', err)
    error.value = err
  } finally {
    isLoading.value = false
  }
}

/**
 * 가맹점 등록 페이지로 이동
 */
const goToAddStore = () => {
  router.push({ name: 'owner-store-new' })
}

/**
 * 가맹점 수정 페이지로 이동
 */
const handleEditStore = (store) => {
  router.push({ name: 'owner-store-edit', params: { storeId: store.id } })
}

/**
 * 가맹점 삭제 확인 모달 표시
 */
const handleDeleteStore = (store) => {
  deletingStore.value = store
  showDeleteModal.value = true
}

/**
 * 삭제 취소
 */
const cancelDelete = () => {
  showDeleteModal.value = false
  deletingStore.value = null
}

/**
 * 삭제 확인
 */
const confirmDelete = async () => {
  if (!deletingStore.value) return

  isDeleting.value = true
  try {
    await deleteStore(deletingStore.value.id)
    showSuccess('가맹점이 삭제되었습니다')

    // 목록에서 제거
    stores.value = stores.value.filter(s => s.id !== deletingStore.value.id)
    showDeleteModal.value = false
    deletingStore.value = null
  } catch (err) {
    logger.error('가맹점 삭제 실패', err)
    showError('가맹점 삭제에 실패했습니다')
  } finally {
    isDeleting.value = false
  }
}

/**
 * 메뉴 관리 페이지로 이동
 */
const handleManageMenus = (store) => {
  router.push({ name: 'owner-menus', params: { storeId: store.id } })
}

onMounted(() => {
  fetchStores()
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
