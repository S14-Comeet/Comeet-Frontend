<template>
  <div
class="store-list-sheet" :class="sheetStateClass" :style="sheetStyle" @touchstart="handleTouchStart"
    @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <!-- 드래그 핸들 -->
    <div
class="sheet-handle" role="button" tabindex="0" aria-label="시트 크기 조절" @click="toggleSheet"
      @keydown.enter="toggleSheet" @keydown.space.prevent="toggleSheet">
      <div class="handle-bar"></div>
    </div>

    <!-- 카테고리 필터 -->
    <div class="category-filter-row">
      <button
        v-for="cat in MENU_CATEGORIES"
        :key="cat.value"
        :class="['category-chip', selectedCategories.includes(cat.value) && 'selected']"
        @click="toggleCategory(cat.value)"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- 결과 헤더 -->
    <div class="results-header">
      <div class="results-info">
        <span class="results-count">{{ stores.length }}개의 카페</span>
        <span v-if="hasActiveFilters" class="filter-badge" @click="clearAllFilters">
          필터 초기화
        </span>
      </div>
      <button v-if="sheetState !== 'collapsed'" class="collapse-button" @click="collapseSheet">
        <BaseIcon name="chevron-down" :size="18" />
      </button>
    </div>

    <!-- 가게 리스트 (확장 시에만 표시) -->
    <div v-if="sheetState !== 'collapsed'" ref="listContainer" class="store-list scrollable">
      <div v-if="stores.length === 0 && !isSearching" class="empty-state">
        <BaseIcon name="coffee" :size="40" class="empty-icon" />
        <p class="empty-title">검색 결과가 없습니다</p>
        <p class="empty-desc">다른 검색어나 필터를 시도해보세요</p>
      </div>

      <div v-else-if="isSearching" class="loading-state">
        <BaseIcon name="spinner" :size="32" class="animate-spin text-primary-400" />
        <p>검색 중...</p>
      </div>

      <StoreCard
v-for="store in stores" v-else :key="store.storeId || store.id" :store="store" variant="compact"
        @click="handleStoreClick" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { MENU_CATEGORIES } from '@/constants'
import BaseIcon from '@/components/common/BaseIcon.vue'
import StoreCard from '@/components/common/StoreCard.vue'

const props = defineProps({
  stores: {
    type: Array,
    default: () => []
  },
  isSearching: {
    type: Boolean,
    default: false
  },
  initialKeyword: {
    type: String,
    default: ''
  },
  initialCategories: {
    type: Array,
    default: () => []
  },
  initialGlobalSearch: {
    type: Boolean,
    default: false
  },
  forceState: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select-store', 'state-change', 'search', 'search-area'])

// 검색 상태
const keyword = ref(props.initialKeyword)
const selectedCategories = ref([...props.initialCategories])
const isGlobalSearch = ref(props.initialGlobalSearch)
const searchInput = ref(null)

// 시트 상태
const sheetState = ref('half')
const listContainer = ref(null)

// 드래그 관련
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const dragHeight = ref(0) // 드래그 중 실시간 높이

// 시트 높이 설정값
const COLLAPSED_HEIGHT = 100
const HALF_HEIGHT_RATIO = 0.33 // 화면의 1/3
const FULL_HEIGHT_RATIO = 0.85

// 활성 필터 여부
const hasActiveFilters = computed(() => {
  return keyword.value || selectedCategories.value.length > 0
})

const sheetStateClass = computed(() => ({
  'state-collapsed': sheetState.value === 'collapsed',
  'state-half': sheetState.value === 'half',
  'state-full': sheetState.value === 'full',
  'is-dragging': isDragging.value
}))

// 현재 상태의 높이 계산
const getStateHeight = (state) => {
  const vh = window.innerHeight
  switch (state) {
    case 'collapsed': return COLLAPSED_HEIGHT
    case 'half': return vh * HALF_HEIGHT_RATIO
    case 'full': return vh * FULL_HEIGHT_RATIO
    default: return COLLAPSED_HEIGHT
  }
}

const sheetStyle = computed(() => {
  if (isDragging.value && dragHeight.value > 0) {
    return {
      height: `${dragHeight.value}px`,
      transition: 'none'
    }
  }
  return {}
})

// 검색 입력창 포커스 시 시트 확장
const handleSearchFocus = () => {
  if (sheetState.value === 'collapsed') {
    sheetState.value = 'half'
    emit('state-change', sheetState.value)
  }
}

// 카테고리 토글 및 즉시 검색
const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category)
  if (index === -1) {
    selectedCategories.value.push(category)
  } else {
    selectedCategories.value.splice(index, 1)
  }

  // 카테고리 변경 시 즉시 검색 (위치 업데이트 없이)
  emit('search', {
    keyword: keyword.value.trim(),
    categories: selectedCategories.value.length > 0
      ? selectedCategories.value.join(',')
      : undefined,
    isGlobalSearch: isGlobalSearch.value,
    searchType: 'category' // 카테고리 검색 구분
  })
}

// 전역 검색 토글
const toggleGlobalSearch = () => {
  isGlobalSearch.value = !isGlobalSearch.value
}

// 검색어 지우기
const clearKeyword = () => {
  keyword.value = ''
  searchInput.value?.focus()
}

// 모든 필터 초기화
const clearAllFilters = () => {
  keyword.value = ''
  selectedCategories.value = []
  handleSearch()
}

// 검색 실행 (키워드 검색 - 위치 업데이트 필요)
const handleSearch = () => {
  emit('search', {
    keyword: keyword.value.trim(),
    categories: selectedCategories.value.length > 0
      ? selectedCategories.value.join(',')
      : undefined,
    isGlobalSearch: isGlobalSearch.value,
    searchType: 'keyword' // 키워드 검색 구분
  })
}

// 시트 토글
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

// 시트 확장 (collapsed → half)
const expandSheet = () => {
  sheetState.value = 'half'
  emit('state-change', sheetState.value)
}

// 터치 이벤트 핸들러
const handleTouchStart = (e) => {
  // full 상태에서 리스트가 스크롤된 경우 드래그 시작 안함
  if (listContainer.value && listContainer.value.scrollTop > 0 && sheetState.value === 'full') {
    return
  }
  isDragging.value = true
  startY.value = e.touches[0].clientY
  currentY.value = startY.value
  dragHeight.value = getStateHeight(sheetState.value)
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return

  currentY.value = e.touches[0].clientY
  const diff = startY.value - currentY.value // 양수면 위로 드래그 (확장)

  // full 상태에서 위로 더 드래그하려 하면 무시
  if (diff > 0 && sheetState.value === 'full') {
    if (listContainer.value && listContainer.value.scrollTop > 0) {
      isDragging.value = false
      dragHeight.value = 0
      return
    }
  }

  // 드래그 중 높이 계산
  const baseHeight = getStateHeight(sheetState.value)
  const newHeight = baseHeight + diff
  const vh = window.innerHeight

  // 최소/최대 높이 제한
  const minHeight = COLLAPSED_HEIGHT * 0.8
  const maxHeight = vh * FULL_HEIGHT_RATIO * 1.05
  dragHeight.value = Math.max(minHeight, Math.min(maxHeight, newHeight))
}

const handleTouchEnd = () => {
  if (!isDragging.value) return

  const vh = window.innerHeight
  const currentHeight = dragHeight.value

  // 스냅 지점 계산
  const collapsedH = COLLAPSED_HEIGHT
  const halfH = vh * HALF_HEIGHT_RATIO
  const fullH = vh * FULL_HEIGHT_RATIO

  // 가장 가까운 스냅 지점 찾기
  const distances = [
    { state: 'collapsed', dist: Math.abs(currentHeight - collapsedH) },
    { state: 'half', dist: Math.abs(currentHeight - halfH) },
    { state: 'full', dist: Math.abs(currentHeight - fullH) }
  ]
  distances.sort((a, b) => a.dist - b.dist)

  const newState = distances[0].state

  if (newState !== sheetState.value) {
    sheetState.value = newState
    emit('state-change', sheetState.value)
  }

  isDragging.value = false
  dragHeight.value = 0
}

// 가게 클릭
const handleStoreClick = (store) => {
  emit('select-store', store)
}

// Props 동기화 및 상태 변경 통합 watch
watch(
  () => ({
    stores: props.stores,
    initialKeyword: props.initialKeyword,
    initialCategories: props.initialCategories,
    initialGlobalSearch: props.initialGlobalSearch,
    forceState: props.forceState
  }),
  (newVal, oldVal) => {
    // stores 업데이트 시 half 상태로
    if (newVal.stores !== oldVal?.stores && newVal.stores.length > 0 && sheetState.value === 'collapsed') {
      sheetState.value = 'half'
      emit('state-change', sheetState.value)
    }

    // initialKeyword 동기화
    if (newVal.initialKeyword !== oldVal?.initialKeyword) {
      keyword.value = newVal.initialKeyword
    }

    // initialCategories 동기화
    if (newVal.initialCategories !== oldVal?.initialCategories) {
      selectedCategories.value = [...newVal.initialCategories]
    }

    // initialGlobalSearch 동기화
    if (newVal.initialGlobalSearch !== oldVal?.initialGlobalSearch) {
      isGlobalSearch.value = newVal.initialGlobalSearch
    }

    // 외부에서 상태 강제 변경
    if (newVal.forceState && newVal.forceState !== sheetState.value) {
      sheetState.value = newVal.forceState
      emit('state-change', sheetState.value)
    }
  },
  { deep: true }
)
</script>

<style scoped>
.store-list-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
  z-index: 40;
  transition: height 0.25s cubic-bezier(0.32, 0.72, 0, 1);
  display: flex;
  flex-direction: column;
  width: 100%;
  will-change: height;
}

.store-list-sheet.is-dragging {
  transition: none;
}

.store-list-sheet.state-collapsed {
  height: auto;
  border-radius: 1rem 1rem 0 0;
  margin-bottom: env(safe-area-inset-bottom, 0);
}

.store-list-sheet.state-half {
  height: 33vh;
}

.store-list-sheet.state-full {
  height: 85vh;
}

/* 드래그 핸들 */
.sheet-handle {
  padding: 0.5rem;
  cursor: grab;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

.sheet-handle:active {
  cursor: grabbing;
}

.handle-bar {
  width: 2.5rem;
  height: 0.25rem;
  background-color: var(--color-neutral-300);
  border-radius: 9999px;
}

/* 이 지역 검색 버튼 행 */
.search-area-row {
  padding: 0 var(--page-padding, 1rem);
  margin-bottom: 0.5rem;
}

.search-area-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 1rem;
  background-color: var(--color-primary-600);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(132, 97, 72, 0.25);
  transition: all 200ms ease;
}

.search-area-btn:hover:not(:disabled) {
  background-color: var(--color-primary-700);
}

.search-area-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.search-area-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 카테고리 필터 행 (2줄 그리드) */
.category-filter-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.375rem;
  padding: 0 var(--page-padding, 1rem);
  margin-bottom: 0.75rem;
}

.category-filter-row .category-chip {
  padding: 0.4rem 0.25rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-neutral-700);
  text-align: center;
  transition: all 0.2s;
  white-space: nowrap;
}

.category-filter-row .category-chip:hover {
  border-color: var(--color-primary-300);
  background: var(--color-primary-50);
}

.category-filter-row .category-chip.selected {
  background: var(--color-primary-600);
  border-color: var(--color-primary-600);
  color: white;
}

/* 결과 헤더 (반응형 패딩) */
.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem var(--page-padding, 1rem);
  border-bottom: 1px solid var(--color-border);
}

.results-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-count {
  font-size: var(--text-sm, 0.875rem);
  font-weight: 600;
  color: var(--color-neutral-800);
}

.filter-badge {
  font-size: 0.6875rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-badge:hover {
  background: var(--color-primary-200);
}

.collapse-button {
  padding: 0.375rem;
  border-radius: 0.5rem;
  color: var(--color-textSecondary);
  transition: all 0.2s;
}

.collapse-button:hover {
  background-color: var(--color-primary-50);
  color: var(--color-primary-600);
}

/* 검색 영역 (사용 안 함 - 상단으로 이동됨) */
.search-section {
  padding: 0 0.875rem;
  flex-shrink: 0;
}

/* Collapsed 모드에서 검색 영역 스타일 */
.search-section.collapsed-mode {
  padding: 0.75rem;
}

/* 검색 입력 행 */
.search-input-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.625rem;
  height: 2.5rem;
  background: var(--color-surface-light);
  border-radius: 0.75rem;
  border: 1.5px solid transparent;
  transition: all 0.2s;
}

.search-input-wrapper:focus-within {
  background: white;
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px rgba(132, 97, 72, 0.1);
}

.search-icon {
  flex-shrink: 0;
  color: var(--color-textSecondary);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9375rem;
  color: var(--color-neutral-900);
  outline: none;
}

.search-input::placeholder {
  color: var(--color-neutral-400);
}

.clear-button {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-neutral-300);
  color: white;
  transition: all 0.2s;
}

.clear-button:hover {
  background: var(--color-neutral-400);
}

/* 지도/전국 토글 버튼 (검색 인풋 안쪽) */
.search-scope-toggle {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-light);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-neutral-500);
  transition: all 0.2s;
}

.search-scope-toggle:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-300);
  color: var(--color-primary-600);
}

.search-scope-toggle.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

/* 확장 버튼 */
.expand-button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-primary-600);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(132, 97, 72, 0.25);
}

.expand-button:hover {
  background: var(--color-primary-700);
  box-shadow: 0 4px 12px rgba(132, 97, 72, 0.35);
}

.expand-button:active {
  transform: scale(0.97);
}

.expand-count {
  background: rgba(255, 255, 255, 0.25);
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

/* 필터 행 */
.filter-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.category-chips {
  flex: 1;
  display: flex;
  gap: 0.375rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 2px 0;
}

.category-chips::-webkit-scrollbar {
  display: none;
}

.category-chip {
  flex-shrink: 0;
  padding: 0.375rem 0.625rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  font-size: 0.75rem;
  color: var(--color-neutral-600);
  transition: all 0.2s;
  white-space: nowrap;
}

.category-chip:hover {
  border-color: var(--color-primary-300);
  color: var(--color-primary-600);
}

.category-chip.selected {
  background: var(--color-primary-600);
  border-color: var(--color-primary-600);
  color: white;
}

/* 결과 헤더 */
.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.5rem;
}

.results-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-neutral-800);
}

.filter-badge {
  font-size: 0.6875rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-badge:hover {
  background: var(--color-primary-200);
}

.collapse-button {
  padding: 0.375rem;
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
  padding: 0 0.875rem;
}

.store-list.scrollable {
  overflow-y: auto;
  /* 4rem(네비게이션 바) + 1rem(여유 공간) */
  padding-bottom: 5rem;
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .store-list.scrollable {
    padding-bottom: calc(5rem + env(safe-area-inset-bottom));
  }
}

/* 빈 상태 */
.empty-state,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2.5rem 1rem;
  text-align: center;
}

.empty-icon {
  color: var(--color-primary-200);
  margin-bottom: 0.5rem;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-neutral-700);
}

.empty-desc {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
}

.loading-state {
  color: var(--color-textSecondary);
  font-size: 0.875rem;
}

/* Safe Area */
@supports (padding-bottom: env(safe-area-inset-bottom)) {

  .store-list-sheet.state-half,
  .store-list-sheet.state-full {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
