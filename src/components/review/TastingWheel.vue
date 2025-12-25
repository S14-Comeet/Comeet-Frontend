<template>
  <div class="flavor-explorer">
    
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>플레이버 로딩 중...</p>
    </div>

    <template v-else>
      
      <div class="selection-summary" :class="{ 'has-items': modelValue.length > 0 }">
        <div class="summary-header">
          <span class="summary-label">선택한 향미</span>
          <span class="summary-count" :class="{ 'limit-near': maxSelection > 0 && modelValue.length >= maxSelection - 1 }">
            {{ modelValue.length }}{{ maxSelection > 0 ? ` / ${maxSelection}` : '개' }}
          </span>
        </div>
        <div v-if="modelValue.length > 0" class="selected-tags">
          <button
            v-for="id in modelValue"
            :key="id"
            class="selected-tag"
            :style="{ backgroundColor: getFlavorColor(id) }"
            @click="toggleSelection(id)"
          >
            {{ getFlavorName(id) }}
            <span class="tag-remove">×</span>
          </button>
        </div>
        <p v-else class="empty-hint">아래에서 향미를 선택해주세요</p>
      </div>

      
      <div class="categories-container">
        <div
          v-for="category in flavors"
          :key="category.id"
          class="category-section"
        >
          
          <div
            class="category-header"
            :style="{ backgroundColor: category.colorHex || category.color }"
            @click="toggleCategory(category.id)"
          >
            <div class="header-left">
              <span class="category-name">{{ category.name }}</span>
              <span class="subcategory-count">{{ getSubcategoryCount(category) }}개 하위 분류</span>
            </div>
            <div class="header-right">
              
              <button
                class="direct-select-btn"
                :class="{ 'selected': isSelected(category.id) }"
                @click.stop="toggleSelection(category.id)"
              >
                <span v-if="isSelected(category.id)">✓</span>
                <span v-else>선택</span>
              </button>
              
              <span class="expand-icon" :class="{ 'expanded': expandedCategories.includes(category.id) }">
                ▼
              </span>
            </div>
          </div>

          
          <transition name="expand">
            <div
              v-if="expandedCategories.includes(category.id)"
              class="subcategories"
            >
              <div
                v-for="subcat in category.subCategories"
                :key="subcat.id"
                class="subcategory-item"
              >
                
                <div
                  class="subcategory-header"
                  :class="{ 'selected': isSelected(subcat.id), 'has-children': subcat.flavors?.length > 0 }"
                  :style="getSubcategoryStyle(subcat, category)"
                  @click="handleSubcategoryClick(subcat)"
                >
                  <span class="subcat-color" :style="{ backgroundColor: category.colorHex || category.color }"></span>
                  <span class="subcat-name">{{ subcat.name }}</span>

                  
                  <span v-if="isSelected(subcat.id)" class="check-mark">✓</span>
                  <span v-else-if="subcat.flavors?.length > 0" class="expand-hint">
                    {{ expandedSubcategories.includes(subcat.id) ? '접기' : `${subcat.flavors.length}개` }}
                  </span>
                  <span v-else class="tap-hint">탭하여 선택</span>
                </div>

                
                <transition name="expand">
                  <div
                    v-if="subcat.flavors?.length > 0 && expandedSubcategories.includes(subcat.id)"
                    class="flavor-chips"
                  >
                    <button
                      v-for="flavor in subcat.flavors"
                      :key="flavor.id"
                      class="flavor-chip"
                      :class="{ 'selected': isSelected(flavor.id) }"
                      :style="getChipStyle(flavor, category)"
                      @click="toggleSelection(flavor.id)"
                    >
                      {{ flavor.name }}
                      <span v-if="isSelected(flavor.id)" class="chip-check">✓</span>
                    </button>
                  </div>
                </transition>
              </div>

              
              <div v-if="!category.subCategories?.length" class="no-subcategories">
                <button
                  class="flavor-chip large"
                  :class="{ 'selected': isSelected(category.id) }"
                  :style="getChipStyle(category, category)"
                  @click="toggleSelection(category.id)"
                >
                  {{ category.name }} 선택
                  <span v-if="isSelected(category.id)" class="chip-check">✓</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFlavorStore } from '@/store/flavor'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxSelection: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue'])

const flavorStore = useFlavorStore()
const { flavors, isLoading } = storeToRefs(flavorStore)

const expandedCategories = ref([])
const expandedSubcategories = ref([])

onMounted(async () => {
  await flavorStore.fetchFlavors()

  if (flavors.value.length > 0) {
    expandedCategories.value = [flavors.value[0].id]
  }
})

const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index === -1) {
    expandedCategories.value.push(categoryId)
  } else {
    expandedCategories.value.splice(index, 1)

    const category = flavors.value.find(c => c.id === categoryId)
    if (category?.subCategories) {
      category.subCategories.forEach(sub => {
        const subIndex = expandedSubcategories.value.indexOf(sub.id)
        if (subIndex !== -1) {
          expandedSubcategories.value.splice(subIndex, 1)
        }
      })
    }
  }
}

const handleSubcategoryClick = (subcat) => {

  if (!subcat.flavors || subcat.flavors.length === 0) {
    toggleSelection(subcat.id)
  } else {

    const index = expandedSubcategories.value.indexOf(subcat.id)
    if (index === -1) {
      expandedSubcategories.value.push(subcat.id)
    } else {
      expandedSubcategories.value.splice(index, 1)
    }
  }
}

const isSelected = (id) => props.modelValue.includes(id)

const toggleSelection = (id) => {
  let newSelection = [...props.modelValue]

  if (isSelected(id)) {
    newSelection = newSelection.filter(item => item !== id)
  } else {

    if (props.maxSelection > 0 && newSelection.length >= props.maxSelection) {

      return
    }
    newSelection.push(id)
  }

  emit('update:modelValue', newSelection)
}

const getFlavorById = (id) => flavorStore.getFlavorById(id)
const getFlavorName = (id) => getFlavorById(id)?.name || ''
const getFlavorColor = (id) => {
  const flavor = getFlavorById(id)
  return flavor?.colorHex || flavor?.color || '#888'
}

const getSubcategoryCount = (category) => {
  let count = category.subCategories?.length || 0
  category.subCategories?.forEach(sub => {
    count += sub.flavors?.length || 0
  })
  return count
}

const getSubcategoryStyle = (subcat, category) => {
  const color = category.colorHex || category.color
  const selected = isSelected(subcat.id)
  return {
    backgroundColor: selected ? color : 'white',
    borderColor: color,
    color: selected ? 'white' : '#333'
  }
}

const getChipStyle = (flavor, category) => {
  const color = flavor.colorHex || flavor.color || category.colorHex || category.color
  const selected = isSelected(flavor.id)
  return {
    backgroundColor: selected ? color : 'white',
    borderColor: color,
    color: selected ? 'white' : '#555'
  }
}
</script>

<style scoped>
.flavor-explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #faf9f8;
  overflow: hidden;
}

/* Loading */
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--color-textSecondary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-primary-200);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Selection Summary */
.selection-summary {
  flex-shrink: 0;
  padding: 0.875rem 1rem;
  background: white;
  border-bottom: 1px solid var(--color-border);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.summary-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-textPrimary);
}

.summary-count {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 1rem;
  background: var(--color-primary-100);
  color: var(--color-primary);
}

.summary-count.limit-near {
  background: var(--color-accent);
  color: white;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  transition: all 0.2s;
}

.selected-tag:hover {
  opacity: 0.85;
  transform: scale(1.02);
}

.tag-remove {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-left: 0.125rem;
}

.empty-hint {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
  text-align: center;
  padding: 0.25rem 0;
}

/* Categories Container */
.categories-container {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
}

.category-section {
  margin-bottom: 0.75rem;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

/* Category Header (L1) */
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.category-header:hover {
  filter: brightness(1.05);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.category-name {
  font-size: 1rem;
  font-weight: 700;
}

.subcategory-count {
  font-size: 0.6875rem;
  opacity: 0.85;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.direct-select-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255,255,255,0.25);
  color: white;
  border: 1.5px solid rgba(255,255,255,0.5);
  transition: all 0.2s;
}

.direct-select-btn:hover {
  background: rgba(255,255,255,0.35);
}

.direct-select-btn.selected {
  background: white;
  color: inherit;
  border-color: white;
}

.expand-icon {
  font-size: 0.625rem;
  transition: transform 0.3s;
  opacity: 0.8;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* Subcategories (L2) */
.subcategories {
  background: white;
  padding: 0.5rem;
}

.subcategory-item {
  margin-bottom: 0.5rem;
}

.subcategory-item:last-child {
  margin-bottom: 0;
}

.subcategory-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 0.875rem;
  border-radius: 0.625rem;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.2s;
}

.subcategory-header:hover {
  transform: translateX(2px);
}

.subcategory-header.selected {
  font-weight: 600;
}

.subcat-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.subcategory-header.selected .subcat-color {
  background-color: white !important;
}

.subcat-name {
  flex: 1;
  font-size: 0.9375rem;
}

.check-mark {
  font-size: 0.875rem;
  font-weight: 700;
}

.expand-hint {
  font-size: 0.75rem;
  opacity: 0.6;
  padding: 0.125rem 0.5rem;
  background: rgba(0,0,0,0.05);
  border-radius: 0.5rem;
}

.tap-hint {
  font-size: 0.6875rem;
  opacity: 0.5;
}

/* Flavor Chips (L3) */
.flavor-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.625rem 0.625rem 0.625rem 1.75rem;
}

.flavor-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 1.25rem;
  border: 2px solid;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.flavor-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

.flavor-chip:active {
  transform: scale(0.97);
}

.flavor-chip.selected {
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.flavor-chip.large {
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
}

.chip-check {
  font-size: 0.75rem;
}

.no-subcategories {
  padding: 0.75rem;
  text-align: center;
}

/* Expand Transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
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
  max-height: 1000px;
}

/* Scrollbar */
.categories-container::-webkit-scrollbar {
  width: 4px;
}

.categories-container::-webkit-scrollbar-track {
  background: transparent;
}

.categories-container::-webkit-scrollbar-thumb {
  background: var(--color-primary-200);
  border-radius: 2px;
}

/* Safe area */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .categories-container {
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
  }
}
</style>
