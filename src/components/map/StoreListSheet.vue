<template>
  <div
    class="store-list-sheet"
    :class="sheetStateClass"
    :style="sheetStyle"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- 드래그 핸들 -->
    <div class="sheet-handle" @click="toggleSheet">
      <div class="handle-bar"></div>
    </div>

    <!-- 헤더 -->
    <div class="sheet-header">
      <div class="header-content">
        <h3 class="header-title">주변 카페</h3>
        <span class="store-count">{{ stores.length }}개</span>
      </div>
      <button
        v-if="sheetState !== 'collapsed'"
        @click="collapseSheet"
        class="collapse-button"
        aria-label="접기"
      >
        <BaseIcon name="chevron-down" :size="20" />
      </button>
    </div>

    <!-- 가게 리스트 -->
    <div
      ref="listContainer"
      class="store-list"
      :class="{ 'scrollable': sheetState !== 'collapsed' }"
    >
      <div v-if="stores.length === 0" class="empty-state">
        <BaseIcon name="search" :size="32" class="text-primary-300" />
        <p>주변에 등록된 카페가 없습니다.</p>
        <p class="text-sm">지도를 이동한 후 "이 지역 검색"을 눌러보세요.</p>
      </div>

      <StoreCard
        v-for="store in stores"
        :key="store.storeId || store.id"
        :store="store"
        variant="compact"
        @click="handleStoreClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import StoreCard from '@/components/common/StoreCard.vue'

const props = defineProps({
  stores: {
    type: Array,
    default: () => []
  },
  visible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['select-store', 'state-change'])

// 시트 상태: collapsed (접힘), half (반), full (전체)
const sheetState = ref('collapsed')
const listContainer = ref(null)

// 드래그 관련
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const dragOffset = ref(0)

// 높이 값 (vh 단위로 계산)
const heights = {
  collapsed: 80, // px
  half: 50, // vh
  full: 85 // vh
}

const sheetStateClass = computed(() => ({
  'state-collapsed': sheetState.value === 'collapsed',
  'state-half': sheetState.value === 'half',
  'state-full': sheetState.value === 'full',
  'is-dragging': isDragging.value
}))

const sheetStyle = computed(() => {
  if (isDragging.value && dragOffset.value !== 0) {
    return {
      transform: `translateY(${dragOffset.value}px)`,
      transition: 'none'
    }
  }
  return {}
})

// 시트 토글 (클릭 시)
const toggleSheet = () => {
  if (sheetState.value === 'collapsed') {
    sheetState.value = 'half'
  } else if (sheetState.value === 'half') {
    sheetState.value = 'full'
  } else {
    sheetState.value = 'half'
  }
  emit('state-change', sheetState.value)
}

// 시트 접기
const collapseSheet = () => {
  sheetState.value = 'collapsed'
  emit('state-change', sheetState.value)
}

// 터치 이벤트 핸들러
const handleTouchStart = (e) => {
  // 리스트 스크롤 중이면 드래그 무시
  if (listContainer.value && listContainer.value.scrollTop > 0 && sheetState.value === 'full') {
    return
  }
  isDragging.value = true
  startY.value = e.touches[0].clientY
  currentY.value = startY.value
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return

  currentY.value = e.touches[0].clientY
  const diff = currentY.value - startY.value

  // 위로 드래그는 full 상태에서 리스트 스크롤이 맨 위일 때만 허용
  if (diff < 0 && sheetState.value === 'full') {
    if (listContainer.value && listContainer.value.scrollTop > 0) {
      isDragging.value = false
      return
    }
  }

  dragOffset.value = diff
}

const handleTouchEnd = () => {
  if (!isDragging.value) return

  const diff = currentY.value - startY.value
  const threshold = 50

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // 아래로 드래그
      if (sheetState.value === 'full') {
        sheetState.value = 'half'
      } else if (sheetState.value === 'half') {
        sheetState.value = 'collapsed'
      }
    } else {
      // 위로 드래그
      if (sheetState.value === 'collapsed') {
        sheetState.value = 'half'
      } else if (sheetState.value === 'half') {
        sheetState.value = 'full'
      }
    }
    emit('state-change', sheetState.value)
  }

  isDragging.value = false
  dragOffset.value = 0
}

// 가게 클릭
const handleStoreClick = (store) => {
  emit('select-store', store)
}

// stores가 업데이트되면 half 상태로
watch(() => props.stores, (newStores) => {
  if (newStores.length > 0 && sheetState.value === 'collapsed') {
    sheetState.value = 'half'
    emit('state-change', sheetState.value)
  }
})
</script>

<style scoped>
.store-list-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 1.25rem 1.25rem 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 40;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  max-width: 448px;
  margin: 0 auto;
}

.store-list-sheet.is-dragging {
  transition: none;
}

.store-list-sheet.state-collapsed {
  height: 80px;
}

.store-list-sheet.state-half {
  height: 50vh;
}

.store-list-sheet.state-full {
  height: 85vh;
}

/* 드래그 핸들 */
.sheet-handle {
  padding: 0.75rem;
  cursor: grab;
  display: flex;
  justify-content: center;
}

.sheet-handle:active {
  cursor: grabbing;
}

.handle-bar {
  width: 2.5rem;
  height: 0.25rem;
  background-color: var(--color-primary-200);
  border-radius: 9999px;
}

/* 헤더 */
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-neutral-900);
}

.store-count {
  font-size: 0.875rem;
  color: var(--color-textSecondary);
}

.collapse-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--color-textSecondary);
  transition: all 0.2s;
}

.collapse-button:hover {
  background-color: var(--color-primary-50);
  color: var(--color-primary-600);
}

/* 가게 리스트 */
.store-list {
  flex: 1;
  overflow: hidden;
  padding: 0.5rem 0;
}

.store-list.scrollable {
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  color: var(--color-textSecondary);
  text-align: center;
}

/* Safe Area */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .store-list-sheet.state-half,
  .store-list-sheet.state-full {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
