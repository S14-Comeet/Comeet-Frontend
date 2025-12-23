<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- 폴더 목록 헤더 -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-textPrimary">즐겨찾기 목록</h2>
      <button
        class="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        @click="$emit('add-folder')"
      >
        <BaseIcon name="plus" :size="18" color="currentColor" />
        <span>추가</span>
      </button>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <BaseIcon name="spinner" :size="32" class="text-primary animate-spin" />
    </div>

    <!-- 폴더 목록 (1열 레이아웃) -->
    <div v-else-if="folders.length > 0" class="flex flex-col gap-3">
      <div
        v-for="folder in folders"
        :key="folder.id"
        :class="[
          'flex items-start gap-4 p-4 rounded-xl border-2 transition-all relative',
          selectedFolderId === folder.id
            ? 'bg-primary-50 border-primary shadow-md'
            : 'bg-white border-border hover:border-primary-300 hover:bg-primary-25'
        ]"
      >
        <!-- 클릭 가능한 영역 -->
        <div
          class="flex items-start gap-4 flex-1 min-w-0 cursor-pointer"
          @click="selectFolder(folder)"
        >
          <!-- 아이콘 -->
          <div class="flex-shrink-0 pt-1">
            <BaseIcon
              :name="folder.icon || 'bookmark-fill'"
              :size="24"
              :color="selectedFolderId === folder.id ? 'var(--color-primary-700)' : 'var(--color-primary)'"
            />
          </div>

          <!-- 폴더 정보 -->
          <div class="flex-1 min-w-0">
            <h3
              :class="[
                'font-bold text-base mb-1',
                selectedFolderId === folder.id ? 'text-primary-700' : 'text-textPrimary'
              ]"
            >
              {{ folder.name }}
            </h3>
            <p class="text-sm text-textSecondary mb-2 line-clamp-2">
              {{ folder.description }}
            </p>
            <div class="flex items-center gap-2 text-xs text-textSecondary">
              <span>카페 {{ folder.storeCount }}개</span>
              <span>•</span>
              <span>생성 {{ formatDate(folder.createdAt) }}</span>
              <span>•</span>
              <span>최근 {{ formatDate(folder.lastAddedAt) }}</span>
            </div>
          </div>

          <!-- 화살표 아이콘 -->
          <div class="flex-shrink-0 pt-1">
            <BaseIcon
              name="chevron-right"
              :size="20"
              color="var(--color-text-secondary)"
            />
          </div>
        </div>

        <!-- More 버튼 -->
        <div class="flex-shrink-0 pt-1 relative">
          <button
            class="p-1 hover:bg-primary-100 rounded-full transition-colors"
            :aria-label="`${folder.name} 옵션`"
            @click.stop="toggleMenu(folder.id)"
          >
            <BaseIcon
              name="more"
              :size="24"
            />
          </button>

          <!-- 드롭다운 메뉴 -->
          <transition name="fade-scale">
            <div
              v-if="openMenuId === folder.id"
              class="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-border py-1 z-10 min-w-[120px]"
            >
              <button
                class="w-full px-4 py-2 text-left text-sm text-textPrimary hover:bg-primary-50 transition-colors flex items-center gap-2"
                @click.stop="handleEdit(folder)"
              >
                <BaseIcon name="check" :size="16" color="var(--color-text-primary)" />
                <span>수정</span>
              </button>
              <button
                class="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2"
                @click.stop="handleDelete(folder)"
              >
                <BaseIcon name="x" :size="16" color="var(--color-error)" />
                <span>삭제</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <BaseIcon name="bookmark-line" :size="48" class="text-textSecondary mb-4" />
      <p class="text-textPrimary text-lg font-medium mb-2">즐겨찾기 목록이 없습니다</p>
      <p class="text-textSecondary text-sm mb-4">마음에 드는 카페를 폴더에 저장해보세요</p>
      <button
        class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        @click="$emit('add-folder')"
      >
        첫 목록 만들기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'

defineProps({
  folders: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  selectedFolderId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['select', 'add-folder', 'edit', 'delete'])

const openMenuId = ref(null)

const selectFolder = (folder) => {
  emit('select', folder)
}

// 메뉴 토글
const toggleMenu = (folderId) => {
  openMenuId.value = openMenuId.value === folderId ? null : folderId
}

// 메뉴 외부 클릭 시 닫기
const closeMenu = () => {
  openMenuId.value = null
}

// 수정 핸들러
const handleEdit = (folder) => {
  emit('edit', folder)
  closeMenu()
}

// 삭제 핸들러
const handleDelete = (folder) => {
  emit('delete', folder)
  closeMenu()
}

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

// 전역 클릭 이벤트 리스너 추가
onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})
</script>

<style scoped>
.bg-primary-25 {
  background-color: rgba(102, 126, 234, 0.05);
}

/* 드롭다운 애니메이션 */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
