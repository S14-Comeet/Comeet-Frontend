<template>
  <div class="flavor-wheel-container">
    <!-- Wheel View -->
    <div class="wheel-wrapper" :class="{ 'wheel-collapsed': selectedCategory }">
      <svg
        viewBox="0 0 300 300"
        class="wheel-svg"
        @click.self="clearSelection"
      >
        <!-- Center Circle -->
        <circle
          cx="150"
          cy="150"
          r="45"
          fill="white"
          stroke="#e5e7eb"
          stroke-width="1"
          class="center-circle"
          @click="clearSelection"
        />
        <text
          x="150"
          y="150"
          text-anchor="middle"
          dominant-baseline="middle"
          class="center-text"
          @click="clearSelection"
        >
          {{ selectedCategory ? '뒤로' : 'Flavor' }}
        </text>

        <!-- Level 1 Segments -->
        <g v-for="(l1, idx) in flavors" :key="l1.id">
          <path
            :d="getArcPath(idx, flavors.length, 45, 100)"
            :fill="isL1Selected(l1) ? l1.color : `${l1.color}40`"
            :stroke="l1.color"
            stroke-width="2"
            class="wheel-segment l1-segment"
            :class="{ 'active': !selectedCategory || selectedCategory.id === l1.id }"
            @click="handleL1Click(l1)"
          />
          <text
            :transform="getTextTransform(idx, flavors.length, 72)"
            text-anchor="middle"
            dominant-baseline="middle"
            class="segment-label l1-label"
            :fill="isL1Selected(l1) ? 'white' : l1.color"
            @click="handleL1Click(l1)"
          >
            {{ l1.name }}
          </text>
        </g>

        <!-- Level 2 Segments (shown when L1 selected) -->
        <template v-if="selectedCategory && selectedCategory.subCategories">
          <g v-for="(l2, idx) in selectedCategory.subCategories" :key="l2.id">
            <path
              :d="getArcPath(idx, selectedCategory.subCategories.length, 100, 130)"
              :fill="isSelected(l2.id) ? selectedCategory.color : `${selectedCategory.color}25`"
              :stroke="selectedCategory.color"
              stroke-width="1.5"
              class="wheel-segment l2-segment"
              @click="handleL2Click(l2)"
            />
            <text
              :transform="getTextTransform(idx, selectedCategory.subCategories.length, 115)"
              text-anchor="middle"
              dominant-baseline="middle"
              class="segment-label l2-label"
              :fill="isSelected(l2.id) ? 'white' : '#555'"
              @click="handleL2Click(l2)"
            >
              {{ truncateText(l2.name, 6) }}
            </text>
          </g>
        </template>
      </svg>
    </div>

    <!-- Selected L2 Detail Panel -->
    <transition name="slide-up">
      <div v-if="selectedL2" class="detail-panel">
        <div class="detail-header" :style="{ borderColor: selectedCategory?.color }">
          <button class="back-btn" @click="selectedL2 = null">
            <BaseIcon name="chevron-left" :size="20" />
          </button>
          <h4 class="detail-title">{{ selectedL2.name }}</h4>
          <button
            class="select-all-btn"
            :class="{ 'selected': isSelected(selectedL2.id) }"
            :style="{
              backgroundColor: isSelected(selectedL2.id) ? selectedCategory?.color : 'transparent',
              borderColor: selectedCategory?.color
            }"
            @click="toggleFlavor(selectedL2)"
          >
            {{ isSelected(selectedL2.id) ? '선택됨' : '전체' }}
          </button>
        </div>

        <!-- L3 Flavors -->
        <div class="flavor-chips">
          <button
            v-for="l3 in selectedL2.flavors"
            :key="l3.id"
            class="flavor-chip"
            :class="{ 'selected': isSelected(l3.id) }"
            :style="{
              backgroundColor: isSelected(l3.id) ? l3.color : 'white',
              borderColor: l3.color,
              color: isSelected(l3.id) ? 'white' : l3.color
            }"
            @click="toggleFlavor(l3)"
          >
            <span v-if="!isSelected(l3.id)" class="chip-dot" :style="{ backgroundColor: l3.color }"></span>
            {{ l3.name }}
          </button>

          <div v-if="!selectedL2.flavors?.length" class="no-children">
            <button
              class="select-single-btn"
              :style="{ borderColor: selectedCategory?.color }"
              @click="toggleFlavor(selectedL2)"
            >
              <BaseIcon :name="isSelected(selectedL2.id) ? 'check' : 'plus'" :size="16" />
              {{ selectedL2.name }} 선택
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Quick Selection Bar (Selected Flavors) -->
    <div v-if="modelValue.length > 0" class="selection-bar">
      <div class="selection-chips">
        <span
          v-for="id in modelValue"
          :key="id"
          class="selected-chip"
          :style="{ backgroundColor: getFlavor(id)?.color || '#888' }"
          @click="removeFlavor(id)"
        >
          {{ getFlavor(id)?.name }}
          <BaseIcon name="x" :size="12" />
        </span>
      </div>
      <span class="selection-count">{{ modelValue.length }}/{{ maxSelection }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFlavorStore } from '@/store/flavor'
import BaseIcon from '@/components/common/BaseIcon.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxSelection: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:modelValue'])

const flavorStore = useFlavorStore()
const { flavors } = storeToRefs(flavorStore)

const selectedCategory = ref(null) // L1 category
const selectedL2 = ref(null) // L2 subcategory

onMounted(async () => {
  await flavorStore.fetchFlavors()
})

// SVG Arc Path calculation
const getArcPath = (index, total, innerR, outerR) => {
  const startAngle = (index / total) * 360 - 90
  const endAngle = ((index + 1) / total) * 360 - 90
  const gap = 1 // degree gap between segments

  const start = polarToCartesian(150, 150, outerR, startAngle + gap/2)
  const end = polarToCartesian(150, 150, outerR, endAngle - gap/2)
  const innerStart = polarToCartesian(150, 150, innerR, endAngle - gap/2)
  const innerEnd = polarToCartesian(150, 150, innerR, startAngle + gap/2)

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

  return [
    'M', start.x, start.y,
    'A', outerR, outerR, 0, largeArcFlag, 1, end.x, end.y,
    'L', innerStart.x, innerStart.y,
    'A', innerR, innerR, 0, largeArcFlag, 0, innerEnd.x, innerEnd.y,
    'Z'
  ].join(' ')
}

const polarToCartesian = (cx, cy, r, angleDeg) => {
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  }
}

const getTextTransform = (index, total, radius) => {
  const angle = ((index + 0.5) / total) * 360 - 90
  const pos = polarToCartesian(150, 150, radius, angle)
  return `translate(${pos.x}, ${pos.y})`
}

const truncateText = (text, maxLen) => {
  return text.length > maxLen ? text.slice(0, maxLen) + '..' : text
}

const handleL1Click = (l1) => {
  if (selectedCategory.value?.id === l1.id) {
    // Toggle L1 selection
    toggleFlavor(l1)
  } else {
    selectedCategory.value = l1
    selectedL2.value = null
  }
}

const handleL2Click = (l2) => {
  selectedL2.value = l2
}

const clearSelection = () => {
  if (selectedL2.value) {
    selectedL2.value = null
  } else {
    selectedCategory.value = null
  }
}

const isL1Selected = (l1) => {
  // L1 is selected if it or any of its children are in modelValue
  if (props.modelValue.includes(l1.id)) return true
  return false
}

const isSelected = (id) => {
  return props.modelValue.includes(id)
}

const toggleFlavor = (flavor) => {
  const id = flavor.id
  let newSelection = [...props.modelValue]

  if (isSelected(id)) {
    newSelection = newSelection.filter(item => item !== id)
  } else {
    if (newSelection.length >= props.maxSelection) {
      return // Max reached
    }
    newSelection.push(id)
  }
  emit('update:modelValue', newSelection)
}

const removeFlavor = (id) => {
  const newSelection = props.modelValue.filter(item => item !== id)
  emit('update:modelValue', newSelection)
}

const getFlavor = (id) => {
  return flavorStore.getFlavorById(id)
}
</script>

<style scoped>
.flavor-wheel-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(180deg, #faf9f7 0%, white 100%);
}

.wheel-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  transition: all 0.3s ease;
}

.wheel-wrapper.wheel-collapsed {
  flex: 0.6;
}

.wheel-svg {
  width: 100%;
  max-width: 300px;
  height: auto;
  cursor: pointer;
}

.center-circle {
  cursor: pointer;
  transition: all 0.2s;
}

.center-circle:hover {
  fill: #f5f5f5;
}

.center-text {
  font-size: 12px;
  font-weight: 700;
  fill: #666;
  pointer-events: none;
}

.wheel-segment {
  cursor: pointer;
  transition: all 0.2s ease;
}

.wheel-segment:hover {
  filter: brightness(1.1);
}

.wheel-segment.l1-segment:not(.active) {
  opacity: 0.3;
}

.segment-label {
  font-size: 9px;
  font-weight: 600;
  pointer-events: none;
}

.l1-label {
  font-size: 10px;
}

.l2-label {
  font-size: 8px;
}

/* Detail Panel */
.detail-panel {
  background: white;
  border-top: 1px solid var(--color-border);
  padding: 1rem;
  max-height: 45%;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 2px solid;
}

.back-btn {
  padding: 0.25rem;
  border-radius: 0.375rem;
  color: var(--color-textSecondary);
}

.back-btn:hover {
  background: var(--color-neutral-100);
}

.detail-title {
  flex: 1;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-textPrimary);
}

.select-all-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1.5px solid;
  transition: all 0.2s;
}

.select-all-btn.selected {
  color: white;
}

/* Flavor Chips */
.flavor-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.flavor-chip {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border-radius: 1.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 2px solid;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.flavor-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.12);
}

.flavor-chip:active {
  transform: scale(0.97);
}

.flavor-chip.selected {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.no-children {
  width: 100%;
  padding: 0.5rem 0;
}

.select-single-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px dashed;
  border-radius: 0.75rem;
  color: var(--color-textSecondary);
  font-weight: 500;
  width: 100%;
  justify-content: center;
  transition: all 0.2s;
}

.select-single-btn:hover {
  background: var(--color-neutral-50);
}

/* Selection Bar */
.selection-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border-top: 1px solid var(--color-border);
}

.selection-chips {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  overflow-x: auto;
}

.selected-chip {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.selected-chip:hover {
  opacity: 0.8;
}

.selection-count {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-textSecondary);
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
