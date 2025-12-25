<template>
  <div class="flex flex-col min-h-full h-full bg-background">
    
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center py-20 px-4 text-center">
      <BaseIcon name="user-line" :size="64" class="text-textSecondary mb-6" />
      <p class="text-textSecondary text-base mb-6">저장 목록을 확인하려면 로그인해주세요</p>
      <button
        class="px-6 py-3 bg-primary text-white rounded-lg text-base font-medium hover:bg-primary-700 transition-colors"
        @click="goToLogin"
      >
        로그인하기
      </button>
    </div>

    
    <template v-else>
      
      <SavedFolderList
        v-if="!selectedFolder"
        :folders="folders"
        :is-loading="isLoadingFolders"
        :selected-folder-id="selectedFolder?.id"
        @select="handleSelectFolder"
        @add-folder="showAddFolderModal = true"
        @edit="handleEditFolder"
        @delete="handleDeleteFolder"
      />

      
      <SavedCafeList
        v-else
        :folder-name="selectedFolder.name"
        :cafes="cafes"
        :is-loading="isLoadingCafes"
        @back="handleBack"
        @select="handleSelectCafe"
        @show-on-map="handleShowOnMap"
        @delete="handleDeleteCafe"
      />
    </template>

    <!-- 폴더 추가 모달 -->
    <AddFolderModal
      :is-open="showAddFolderModal"
      @close="showAddFolderModal = false"
      @submit="handleAddFolder"
    />

    <!-- 폴더 수정 모달 -->
    <EditFolderModal
      :is-open="showEditFolderModal"
      :folder="editingFolder"
      @close="showEditFolderModal = false"
      @submit="handleUpdateFolder"
    />

    <!-- 삭제 확인 다이얼로그 -->
    <ConfirmDialog
      :is-open="showDeleteConfirm"
      title="목록 삭제"
      :message="`'${deletingFolder?.name}' 목록을 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`"
      icon="x"
      confirm-text="삭제"
      cancel-text="취소"
      @confirm="confirmDelete"
      @close="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showInfo, showError, showSuccess } from '@/utils/toast'
import { useSavedStore } from '@/store/saved'
import { useAuthStore } from '@/store/auth'
import { createLogger } from '@/utils/logger'
import SavedFolderList from '@/components/saved/SavedFolderList.vue'
import SavedCafeList from '@/components/saved/SavedCafeList.vue'
import AddFolderModal from '@/components/saved/AddFolderModal.vue'
import EditFolderModal from '@/components/saved/EditFolderModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import {
  getFolders,
  getStoresByFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  removeStoreFromFolder
} from '@/api/bookmark'

const logger = createLogger('SavedView')

const router = useRouter()
const savedStore = useSavedStore()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const folders = ref([])
const selectedFolder = ref(null)
const cafes = ref([])
const isLoadingFolders = ref(false)
const isLoadingCafes = ref(false)
const showAddFolderModal = ref(false)
const showEditFolderModal = ref(false)
const showDeleteConfirm = ref(false)
const editingFolder = ref(null)
const deletingFolder = ref(null)

const goToLogin = () => {
  router.push('/login')
}

const loadFolders = async () => {
  if (!isAuthenticated.value) {
    return
  }

  isLoadingFolders.value = true
  try {
    folders.value = await getFolders()
  } catch (error) {
    logger.error('폴더 목록 불러오기 실패', error)
    showError('폴더 목록을 불러오는데 실패했습니다.')
  } finally {
    isLoadingFolders.value = false
  }
}

const handleSelectFolder = async (folder) => {
  selectedFolder.value = folder
  isLoadingCafes.value = true

  try {
    const response = await getStoresByFolder(folder.id)
    cafes.value = response.stores
  } catch (error) {
    logger.error('카페 목록 불러오기 실패', error)
    showError('카페 목록을 불러오는데 실패했습니다.')
    selectedFolder.value = null
  } finally {
    isLoadingCafes.value = false
  }
}

const handleBack = () => {
  selectedFolder.value = null
  cafes.value = []
}

const handleSelectCafe = (cafe) => {
  logger.info('카페 선택', cafe)
  showInfo('카페 상세 페이지는 추후 구현 예정입니다.')
}

const handleShowOnMap = () => {
  savedStore.setSelectedFolder(selectedFolder.value, cafes.value)
  router.push({ name: 'map' })
}

const handleAddFolder = async (folderData) => {
  try {
    const newFolder = await createFolder({
      icon: folderData.icon,
      name: folderData.name,
      description: folderData.description || ''
    })

    folders.value.unshift(newFolder)
    showAddFolderModal.value = false
    showSuccess(`"${folderData.name}" 목록이 추가되었습니다.`)
  } catch (error) {
    logger.error('폴더 추가 실패', error)
    showError('목록 추가에 실패했습니다.')
  }
}

const handleEditFolder = (folder) => {
  editingFolder.value = folder
  showEditFolderModal.value = true
}

const handleUpdateFolder = async (folderData) => {
  try {
    const updatedFolder = await updateFolder(editingFolder.value.id, {
      icon: folderData.icon,
      name: folderData.name,
      description: folderData.description
    })

    const index = folders.value.findIndex(f => f.id === editingFolder.value.id)
    if (index !== -1) {
      folders.value[index] = updatedFolder
    }

    showEditFolderModal.value = false
    editingFolder.value = null
    showSuccess('목록이 수정되었습니다.')
  } catch (error) {
    logger.error('폴더 수정 실패', error)
    showError('목록 수정에 실패했습니다.')
  }
}

const handleDeleteFolder = (folder) => {
  deletingFolder.value = folder
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  try {
    await deleteFolder(deletingFolder.value.id)

    const folderName = deletingFolder.value.name
    folders.value = folders.value.filter(f => f.id !== deletingFolder.value.id)

    deletingFolder.value = null
    showSuccess(`"${folderName}" 목록이 삭제되었습니다.`)
  } catch (error) {
    logger.error('폴더 삭제 실패', error)
    showError('목록 삭제에 실패했습니다.')
  }
}

const handleDeleteCafe = async (cafe) => {
  try {
    await removeStoreFromFolder(selectedFolder.value.id, cafe.storeId)

    cafes.value = cafes.value.filter(c => c.storeId !== cafe.storeId)

    const folder = folders.value.find(f => f.id === selectedFolder.value.id)
    if (folder && folder.storeCount > 0) {
      folder.storeCount -= 1
    }
  } catch (error) {
    logger.error('카페 삭제 실패', error)
    showError('카페 삭제에 실패했습니다.')
  }
}

onMounted(() => {
  loadFolders()
})
</script>

