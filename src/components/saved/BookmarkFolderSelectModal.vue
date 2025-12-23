<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="handleBackdropClick"
    >
      <div
        class="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col"
        @click.stop
      >
        <!-- 헤더 -->
        <div class="flex items-center justify-between p-6 pb-4 border-b border-border">
          <h2 class="text-xl font-bold text-textPrimary">폴더에 저장</h2>
          <button
            class="text-textSecondary hover:text-primary hover:bg-primary-50 rounded-full p-1 transition-all"
            @click="handleClose"
          >
            <BaseIcon name="x" :size="24" />
          </button>
        </div>

        <!-- 폴더 목록 -->
        <div class="flex-1 overflow-y-auto p-4">
          <!-- 로딩 상태 -->
          <div v-if="isLoading" class="flex items-center justify-center py-8">
            <BaseIcon name="spinner" :size="32" class="text-primary animate-spin" />
          </div>

          <!-- 폴더가 없을 때 -->
          <div v-else-if="folders.length === 0" class="text-center py-8">
            <BaseIcon name="bookmark-fill" :size="48" class="text-primary-200 mx-auto mb-3" />
            <p class="text-textSecondary text-sm mb-4">저장 목록이 없습니다</p>
            <BaseButton
              variant="primary"
              size="small"
              @click="showAddFolder = true"
            >
              새 목록 만들기
            </BaseButton>
          </div>

          <!-- 폴더 목록 -->
          <div v-else class="space-y-2">
            <button
              v-for="folder in folders"
              :key="folder.id"
              class="folder-item"
              :class="{ 'is-selected': isSelected(folder.id) }"
              :disabled="isProcessing"
              @click="handleFolderClick(folder)"
            >
              <div class="folder-icon">
                <BaseIcon :name="folder.icon || 'bookmark-fill'" :size="20" />
              </div>
              <div class="folder-info">
                <span class="folder-name">{{ folder.name }}</span>
                <span class="folder-count">카페 {{ folder.storeCount }}개</span>
              </div>
              <div class="folder-check">
                <BaseIcon
                  v-if="isSelected(folder.id)"
                  name="check"
                  :size="20"
                  class="text-primary"
                />
              </div>
            </button>
          </div>
        </div>

        <!-- 하단 버튼 -->
        <div class="p-4 pt-2 border-t border-border">
          <button
            class="w-full flex items-center justify-center gap-2 py-3 text-primary font-medium hover:bg-primary-50 rounded-lg transition-colors"
            @click="showAddFolder = true"
          >
            <BaseIcon name="plus" :size="20" />
            <span>새 목록 만들기</span>
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- 새 폴더 추가 모달 -->
  <AddFolderModal
    :is-open="showAddFolder"
    @close="showAddFolder = false"
    @submit="handleAddFolder"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import AddFolderModal from '@/components/saved/AddFolderModal.vue'
import {
  getFolders,
  createFolder,
  addStoreToFolder,
  removeStoreFromFolder
} from '@/api/bookmark'
import { showSuccess, showError } from '@/utils/toast'
import { createLogger } from '@/utils/logger'

const logger = createLogger('BookmarkFolderSelectModal')

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  storeId: {
    type: [String, Number],
    required: true
  },
  storeName: {
    type: String,
    default: ''
  },
  // 이미 저장된 폴더 ID 목록
  bookmarkedFolderIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'update'])

const folders = ref([])
const isLoading = ref(false)
const isProcessing = ref(false)
const showAddFolder = ref(false)
const selectedFolderIds = ref([])

// 선택 여부 확인
const isSelected = (folderId) => {
  return selectedFolderIds.value.includes(folderId)
}

// 모달이 열릴 때 폴더 목록 로드
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    selectedFolderIds.value = [...props.bookmarkedFolderIds]
    await loadFolders()
  }
})

// bookmarkedFolderIds가 변경될 때 동기화
watch(() => props.bookmarkedFolderIds, (newValue) => {
  selectedFolderIds.value = [...newValue]
}, { deep: true })

const loadFolders = async () => {
  isLoading.value = true
  try {
    folders.value = await getFolders()
  } catch (error) {
    logger.error('폴더 목록 불러오기 실패', error)
    showError('폴더 목록을 불러오는데 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const handleBackdropClick = () => {
  handleClose()
}

const handleClose = () => {
  emit('close')
}

const handleFolderClick = async (folder) => {
  if (isProcessing.value) return

  isProcessing.value = true
  const wasSelected = isSelected(folder.id)

  try {
    if (wasSelected) {
      // 폴더에서 제거
      await removeStoreFromFolder(folder.id, props.storeId)
      selectedFolderIds.value = selectedFolderIds.value.filter(id => id !== folder.id)
      folder.storeCount = Math.max(0, folder.storeCount - 1)
      showSuccess(`'${folder.name}'에서 제거했습니다`)
    } else {
      // 폴더에 추가
      await addStoreToFolder(folder.id, props.storeId)
      selectedFolderIds.value.push(folder.id)
      folder.storeCount += 1
      showSuccess(`'${folder.name}'에 저장했습니다`)
    }

    // 부모에게 업데이트 알림
    emit('update', {
      folderIds: [...selectedFolderIds.value],
      isBookmarked: selectedFolderIds.value.length > 0
    })
  } catch (error) {
    logger.error('북마크 처리 실패', error)
    // 409 에러 (이미 저장됨)인 경우 처리
    if (error.response?.status === 409) {
      showError('이미 폴더에 저장된 카페입니다.')
      // 상태 동기화
      if (!wasSelected) {
        selectedFolderIds.value.push(folder.id)
      }
    } else {
      showError(wasSelected ? '제거에 실패했습니다.' : '저장에 실패했습니다.')
    }
  } finally {
    isProcessing.value = false
  }
}

const handleAddFolder = async (folderData) => {
  try {
    const newFolder = await createFolder(folderData)
    folders.value.unshift(newFolder)
    showAddFolder.value = false
    showSuccess(`'${folderData.name}' 목록이 추가되었습니다.`)
  } catch (error) {
    logger.error('폴더 추가 실패', error)
    showError('목록 추가에 실패했습니다.')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem;
  background-color: var(--color-neutral-50);
  border-radius: 0.75rem;
  border: 2px solid transparent;
  transition: all 0.2s;
  text-align: left;
}

.folder-item:hover:not(:disabled) {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-200);
}

.folder-item.is-selected {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary);
}

.folder-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.folder-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-100);
  border-radius: 0.5rem;
  color: var(--color-primary);
}

.folder-info {
  flex: 1;
  min-width: 0;
}

.folder-name {
  display: block;
  font-weight: 600;
  color: var(--color-textPrimary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.folder-count {
  display: block;
  font-size: 0.75rem;
  color: var(--color-textSecondary);
  margin-top: 0.125rem;
}

.folder-check {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
