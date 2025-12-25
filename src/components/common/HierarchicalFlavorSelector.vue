<template>
  <div class="hierarchical-flavor-selector">
    
    <div class="selected-display">
      <div class="selected-chips">
        <span
          v-for="code in modelValue"
          :key="code"
          class="selected-chip"
          :class="{ 'light-bg': isLightColor(getFlavorColor(code)) }"
          :style="{ backgroundColor: getFlavorColor(code) }"
          @click="removeFlavor(code)"
        >
          {{ getFlavorName(code) }}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </span>
        <span v-if="!modelValue.length" class="placeholder-text">
          선택된 향미가 여기에 표시됩니다
        </span>
      </div>
    </div>

    
    <div class="selection-area">
      
      <div class="category-list">
        <div
          v-for="cat in FLAVOR_WHEEL"
          :key="cat.id"
          class="category-row"
        >
          
          <div class="category-line">
            <button
              type="button"
              class="flavor-chip"
              :class="{
                'selected': isSelected(cat.code),
                'expanded': expandedLevel1?.id === cat.id
              }"
              :style="getChipStyle(cat)"
              @click="handleLevel1Click(cat)"
            >
              <span>{{ cat.name }}</span>
              <svg v-if="isSelected(cat.code)" class="check-icon" width="8" height="8" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            
            <TransitionGroup name="chip-expand" tag="div" class="subcategory-chips">
              <div
                v-for="sub in (expandedLevel1?.id === cat.id ? cat.children : [])"
                :key="sub.id"
                class="subcategory-wrapper"
              >
                <button
                  type="button"
                  class="flavor-chip sub"
                  :class="{
                    'selected': isSelected(sub.code),
                    'expanded': expandedLevel2?.id === sub.id
                  }"
                  :style="getChipStyle(sub)"
                  @click="handleLevel2Click(sub)"
                >
                  <span>{{ sub.name }}</span>
                  <svg v-if="isSelected(sub.code)" class="check-icon" width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>

                
                <Transition name="slide-down">
                  <div
                    v-if="expandedLevel2?.id === sub.id && sub.children?.length"
                    class="detail-list"
                    :style="{ '--line-color': sub.colorHex }"
                  >
                    <button
                      v-for="detail in sub.children"
                      :key="detail.id"
                      type="button"
                      class="flavor-chip detail"
                      :class="{ 'selected': isSelected(detail.code) }"
                      :style="getChipStyle(detail)"
                      @click="handleLevel3Click(detail)"
                    >
                      <span>{{ detail.name }}</span>
                      <svg v-if="isSelected(detail.code)" class="check-icon" width="8" height="8" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </Transition>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FLAVOR_WHEEL, findFlavorInWheel, getFlavorPath } from '@/constants'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxSelection: {
    type: Number,
    default: 10
  },
  excludeCodes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const expandedLevel1 = ref(null)
const expandedLevel2 = ref(null)

const getFlavorName = (code) => {
  const found = findFlavorInWheel(code)
  return found?.name || code
}

const getFlavorColor = (code) => {
  const found = findFlavorInWheel(code)
  return found?.colorHex || '#846148'
}

const isSelected = (code) => {
  return props.modelValue.includes(code)
}

const isExcluded = (code) => {
  if (props.excludeCodes.length === 0) return false

  if (props.excludeCodes.includes(code)) return true

  const ancestors = getAncestorCodes(code)
  if (ancestors.some(c => props.excludeCodes.includes(c))) return true

  return false
}

const isLightColor = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return false
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55
}

const getChipStyle = (item) => {
  const excluded = isExcluded(item.code)
  const selected = isSelected(item.code)
  const color = item.colorHex
  const isLight = isLightColor(color)

  if (excluded) {
    return {
      '--chip-color': '#ccc',
      borderColor: '#ddd',
      backgroundColor: '#f5f5f5',
      color: '#bbb',
      boxShadow: 'none',
      textShadow: 'none',
      cursor: 'not-allowed',
      opacity: '0.6'
    }
  }

  if (selected) {
    return {
      '--chip-color': color,
      borderColor: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)',
      backgroundColor: color,
      color: isLight ? '#3d3d3d' : 'white',
      boxShadow: isLight
        ? 'inset 0 0 0 1px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.2)'
        : 'inset 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.15)',
      textShadow: isLight ? 'none' : '0 0 1px rgba(0,0,0,0.3)'
    }
  }

  if (isLight) {
    return {
      '--chip-color': color,
      borderColor: `${color}`,
      backgroundColor: `${color}30`,
      color: '#5a5a5a',
      boxShadow: 'none',
      textShadow: 'none'
    }
  }

  return {
    '--chip-color': color,
    borderColor: `${color}99`,
    backgroundColor: `${color}18`,
    color: color,
    boxShadow: 'none',
    textShadow: 'none'
  }
}

const getAncestorCodes = (code) => {
  const path = getFlavorPath(code)
  return path.slice(0, -1).map(item => item.code)
}

const getDescendantCodes = (code) => {
  const found = findFlavorInWheel(code)
  if (!found) return []

  const descendants = []
  const collectDescendants = (item) => {
    if (item.children?.length) {
      for (const child of item.children) {
        descendants.push(child.code)
        collectDescendants(child)
      }
    }
  }
  collectDescendants(found)
  return descendants
}

const toggleFlavor = (code) => {
  let newValue = [...props.modelValue]

  if (newValue.includes(code)) {

    newValue = newValue.filter(c => c !== code)
  } else {

    const ancestorCodes = getAncestorCodes(code)
    const descendantCodes = getDescendantCodes(code)
    const codesToRemove = new Set([...ancestorCodes, ...descendantCodes])

    newValue = newValue.filter(c => !codesToRemove.has(c))

    if (newValue.length < props.maxSelection) {
      newValue.push(code)
    }
  }

  emit('update:modelValue', newValue)
}

const removeFlavor = (code) => {
  const newValue = props.modelValue.filter(c => c !== code)
  emit('update:modelValue', newValue)
}

const handleLevel1Click = (cat) => {

  if (!isExcluded(cat.code)) {
    toggleFlavor(cat.code)
  }

  if (expandedLevel1.value?.id === cat.id) {
    expandedLevel1.value = null
    expandedLevel2.value = null
  } else {
    expandedLevel1.value = cat
    expandedLevel2.value = null
  }
}

const handleLevel2Click = (sub) => {

  if (!isExcluded(sub.code)) {
    toggleFlavor(sub.code)
  }

  if (sub.children?.length) {
    if (expandedLevel2.value?.id === sub.id) {
      expandedLevel2.value = null
    } else {
      expandedLevel2.value = sub
    }
  }
}

const handleLevel3Click = (detail) => {
  if (!isExcluded(detail.code)) {
    toggleFlavor(detail.code)
  }
}
</script>

<style scoped>
.hierarchical-flavor-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
}

/* Selected Display */
.selected-display {
  padding: 0.625rem;
  background: var(--color-primary-50);
  border-radius: 0.625rem;
  min-height: 4rem;
}

.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  min-height: 2.75rem;
  align-content: flex-start;
}

.selected-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.275rem 0.575rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
}

.selected-chip.light-bg {
  color: #3d3d3d;
  border-color: rgba(0, 0, 0, 0.25);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.15);
  text-shadow: none;
}

.selected-chip:hover {
  opacity: 0.9;
  transform: scale(0.98);
}

.placeholder-text {
  font-size: 0.75rem;
  color: var(--color-textTertiary);
  padding: 0.5rem 0;
}

/* Selection Area */
.selection-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Category List - vertical */
.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Category Line - horizontal flow */
.category-line {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.375rem;
}

/* Subcategory chips container */
.subcategory-chips {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.375rem;
}

.subcategory-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Unified Flavor Chip */
.flavor-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.3rem 0.6rem;
  border: 1.5px solid;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  background: white;
}

.flavor-chip:hover {
  transform: scale(1.03);
}

.flavor-chip.expanded {
  box-shadow: 0 0 0 2px var(--chip-color, #846148);
}

.flavor-chip.sub {
  /* same style as category chip */
}

.flavor-chip.detail {
  font-weight: 500;
  font-size: 0.65rem;
  padding: 0.225rem 0.45rem;
}

.check-icon {
  flex-shrink: 0;
}

/* Detail List - vertical column with line */
.detail-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  margin-top: 0.375rem;
  margin-left: 0;
  padding-left: 0.625rem;
  border-left: 2px solid var(--line-color, #ccc);
}

/* Chip Expand Transition (TransitionGroup) */
.chip-expand-enter-active {
  transition: all 0.25s ease-out;
}

.chip-expand-leave-active {
  transition: all 0.2s ease-in;
}

.chip-expand-enter-from {
  opacity: 0;
  transform: translateX(-10px) scale(0.8);
}

.chip-expand-leave-to {
  opacity: 0;
  transform: translateX(-10px) scale(0.8);
}

.chip-expand-move {
  transition: transform 0.25s ease;
}

/* Slide Down Transition */
.slide-down-enter-active {
  transition: all 0.25s ease-out;
}

.slide-down-leave-active {
  transition: all 0.2s ease-in;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
