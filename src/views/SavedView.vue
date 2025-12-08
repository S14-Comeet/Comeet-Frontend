<template>
  <div class="flex flex-col min-h-full h-full bg-background">
    <!-- 로그인 필요 메시지 -->
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center py-20 px-4 text-center">
      <BaseIcon name="user-line" :size="64" class="text-textSecondary mb-6" />
      <!-- <h2 class="text-2xl font-bold text-textPrimary mb-3">로그인이 필요합니다</h2> -->
      <p class="text-textSecondary text-base mb-6">저장 목록을 확인하려면 로그인해주세요</p>
      <button
        @click="goToLogin"
        class="px-6 py-3 bg-primary text-white rounded-lg text-base font-medium hover:bg-primary-700 transition-colors"
      >
        로그인하기
      </button>
    </div>

    <!-- 인증된 사용자용 컨텐츠 -->
    <template v-else>
      <!-- 폴더 목록 화면 -->
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

      <!-- 카페 목록 화면 -->
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
import { useToast } from 'vue-toastification'
import { useSavedStore } from '@/store/saved'
import { useAuthStore } from '@/store/auth'
import SavedFolderList from '@/components/saved/SavedFolderList.vue'
import SavedCafeList from '@/components/saved/SavedCafeList.vue'
import AddFolderModal from '@/components/saved/AddFolderModal.vue'
import EditFolderModal from '@/components/saved/EditFolderModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import { getFolders, getCafesByFolder } from '@/api/cafe'

const router = useRouter()
const toast = useToast()
const savedStore = useSavedStore()
const authStore = useAuthStore()

// 인증 상태 확인
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

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push('/login')
}

// 폴더 목록 불러오기
const loadFolders = async () => {
  // 인증되지 않은 사용자는 폴더 목록을 불러오지 않음
  if (!isAuthenticated.value) {
    return
  }

  isLoadingFolders.value = true
  try {
    const response = await getFolders()
    folders.value = response.data
  } catch (error) {
    console.error('폴더 목록 불러오기 실패:', error)
    toast.error('폴더 목록을 불러오는데 실패했습니다.')
  } finally {
    isLoadingFolders.value = false
  }
}

// 폴더 선택 핸들러
const handleSelectFolder = async (folder) => {
  selectedFolder.value = folder
  isLoadingCafes.value = true

  try {
    const response = await getCafesByFolder(folder.id)
    cafes.value = response.data
  } catch (error) {
    console.error('카페 목록 불러오기 실패:', error)
    toast.error('카페 목록을 불러오는데 실패했습니다.')
    selectedFolder.value = null
  } finally {
    isLoadingCafes.value = false
  }
}

// 뒤로 가기 핸들러
const handleBack = () => {
  selectedFolder.value = null
  cafes.value = []
}

// 카페 선택 핸들러
// TODO: 추후 카페 상세 페이지로 이동하도록 변경 예정 (알림 페이지와 유사한 방식)
const handleSelectCafe = (cafe) => {
  console.log('카페 선택:', cafe)
  toast.info('카페 상세 페이지는 추후 구현 예정입니다.')
}

// 지도에서 보기 핸들러
const handleShowOnMap = () => {
  // Pinia store에 선택된 폴더 정보 저장
  savedStore.setSelectedFolder(selectedFolder.value, cafes.value)

  // 지도 페이지로 이동
  router.push({ name: 'map' })
}

// 폴더 추가 핸들러
const handleAddFolder = async (folderData) => {
  try {
    // TODO: 실제 API 구현 시 백엔드로 전송
    // const response = await api.post('/api/cafes/folders', folderData)

    // Mock: 임시로 새 폴더를 로컬 배열에 추가
    const currentDate = new Date().toISOString().split('T')[0]
    const newFolder = {
      id: folders.value.length + 1,
      icon: folderData.icon,
      name: folderData.name,
      description: folderData.description || '',
      cafeCount: 0,
      createdAt: currentDate,
      lastAddedAt: currentDate
    }

    folders.value.unshift(newFolder)
    showAddFolderModal.value = false
    toast.success(`"${folderData.name}" 목록이 추가되었습니다.`)
  } catch (error) {
    console.error('폴더 추가 실패:', error)
    toast.error('목록 추가에 실패했습니다.')
  }
}

// 폴더 수정 모달 열기
const handleEditFolder = (folder) => {
  editingFolder.value = folder
  showEditFolderModal.value = true
}

// 폴더 수정 핸들러
const handleUpdateFolder = async (folderData) => {
  try {
    // TODO: 실제 API 구현 시 백엔드로 전송
    // const response = await api.put(`/api/cafes/folders/${editingFolder.value.id}`, folderData)

    // Mock: 로컬 배열에서 해당 폴더 찾아서 업데이트
    const index = folders.value.findIndex(f => f.id === editingFolder.value.id)
    if (index !== -1) {
      folders.value[index] = {
        ...folders.value[index],
        icon: folderData.icon,
        name: folderData.name,
        description: folderData.description
      }
    }

    showEditFolderModal.value = false
    editingFolder.value = null
    toast.success('목록이 수정되었습니다.')
  } catch (error) {
    console.error('폴더 수정 실패:', error)
    toast.error('목록 수정에 실패했습니다.')
  }
}

// 폴더 삭제 확인 다이얼로그 열기
const handleDeleteFolder = (folder) => {
  deletingFolder.value = folder
  showDeleteConfirm.value = true
}

// 폴더 삭제 확인
const confirmDelete = async () => {
  try {
    // TODO: 실제 API 구현 시 백엔드로 전송
    // await api.delete(`/api/cafes/folders/${deletingFolder.value.id}`)

    // Mock: 로컬 배열에서 해당 폴더 제거
    const folderName = deletingFolder.value.name
    folders.value = folders.value.filter(f => f.id !== deletingFolder.value.id)

    deletingFolder.value = null
    toast.success(`"${folderName}" 목록이 삭제되었습니다.`)
  } catch (error) {
    console.error('폴더 삭제 실패:', error)
    toast.error('목록 삭제에 실패했습니다.')
  }
}

// 카페 삭제 핸들러
const handleDeleteCafe = async (cafe) => {
  try {
    // TODO: 실제 API 구현 시 백엔드로 전송
    // await api.delete(`/api/cafes/folders/${selectedFolder.value.id}/cafes/${cafe.storeId}`)

    // Mock: 로컬 배열에서 해당 카페 제거
    cafes.value = cafes.value.filter(c => c.storeId !== cafe.storeId)

    // 폴더 목록에서도 카페 개수 업데이트
    const folder = folders.value.find(f => f.id === selectedFolder.value.id)
    if (folder && folder.cafeCount > 0) {
      folder.cafeCount -= 1
    }
  } catch (error) {
    console.error('카페 삭제 실패:', error)
    toast.error('카페 삭제에 실패했습니다.')
  }
}

onMounted(() => {
  loadFolders()
})
</script>

