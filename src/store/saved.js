import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSavedStore = defineStore('saved', () => {
  // 선택된 폴더 정보
  const selectedFolder = ref(null)
  const selectedFolderCafes = ref([])

  /**
   * 폴더와 해당 카페 목록을 저장
   */
  const setSelectedFolder = (folder, cafes) => {
    selectedFolder.value = folder
    selectedFolderCafes.value = cafes
  }

  /**
   * 선택된 폴더 정보 초기화
   */
  const clearSelectedFolder = () => {
    selectedFolder.value = null
    selectedFolderCafes.value = []
  }

  return {
    selectedFolder,
    selectedFolderCafes,
    setSelectedFolder,
    clearSelectedFolder
  }
})
