<template>
  <div class="flavor-wheel-container" @click="clearSelection">
    <div class="wheel-wrapper" @click.stop>
      <svg
        :viewBox="`0 0 ${size} ${size}`"
        :width="size"
        :height="size"
        class="flavor-wheel"
        :class="{ 'has-selection': selectedFlavor }"
      >
        
        <circle
          :cx="center"
          :cy="center"
          :r="outerRadius"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          stroke-width="1"
        />

        
        <g class="level-3">
          <template v-for="segment in level3Segments" :key="segment.id">
            <path
              :d="segment.path"
              :fill="segment.fill"
              :stroke="segment.isHighlighted ? segment.color : 'white'"
              stroke-width="0.5"
              :class="{
                highlighted: segment.isHighlighted,
                selected: selectedFlavor?.id === segment.id,
                dimmed: selectedFlavor && selectedFlavor.id !== segment.id
              }"
              @click.stop="handleSegmentClick(segment)"
            >
              <title>{{ segment.name }}</title>
            </path>
          </template>
        </g>

        <!-- Level 2 (Middle ring) - Sub-categories -->
        <g class="level-2">
          <template v-for="segment in level2Segments" :key="segment.id">
            <path
              :d="segment.path"
              :fill="segment.fill"
              :stroke="segment.isHighlighted ? segment.color : 'white'"
              stroke-width="0.5"
              :class="{
                highlighted: segment.isHighlighted,
                selected: selectedFlavor?.id === segment.id,
                dimmed: selectedFlavor && selectedFlavor.id !== segment.id
              }"
              @click.stop="handleSegmentClick(segment)"
            >
              <title>{{ segment.name }}</title>
            </path>
          </template>
        </g>

        <!-- Level 1 (Inner ring) - Main categories -->
        <g class="level-1">
          <template v-for="segment in level1Segments" :key="segment.id">
            <path
              :d="segment.path"
              :fill="segment.fill"
              :stroke="segment.isHighlighted ? segment.color : 'white'"
              stroke-width="1"
              :class="{
                highlighted: segment.isHighlighted,
                selected: selectedFlavor?.id === segment.id,
                dimmed: selectedFlavor && selectedFlavor.id !== segment.id
              }"
              @click.stop="handleSegmentClick(segment)"
            >
              <title>{{ segment.name }}</title>
            </path>
          </template>
        </g>

        <!-- Center circle (background) -->
        <circle
          :cx="center"
          :cy="center"
          :r="innerRadius"
          :fill="selectedFlavor ? selectedFlavor.color : 'var(--color-surface)'"
          :stroke="selectedFlavor ? (isLightColor(selectedFlavor.color) ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)') : 'var(--color-border)'"
          stroke-width="1"
          class="center-circle"
          @click.stop="clearSelection"
        />

        <!-- Center text -->
        <text
          :x="center"
          :y="center"
          text-anchor="middle"
          dominant-baseline="middle"
          class="center-text"
          :fill="centerTextColor"
        >
          {{ selectedFlavor ? selectedFlavor.name : centerLabel }}
        </text>
      </svg>
    </div>

    <!-- Legend for highlighted flavors -->
    <div v-if="showLegend && highlightedFlavorDetails.length" class="flavor-legend" @click.stop>
      <FlavorChip
        v-for="flavor in highlightedFlavorDetails"
        :key="flavor.id"
        :flavor="{ id: flavor.id, name: flavor.name, colorHex: flavor.color }"
        :active="selectedFlavor?.id === flavor.id"
        :clickable="true"
        @click="selectFlavorById(flavor.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { FLAVOR_WHEEL, getFlavorPath } from '@/constants'
import FlavorChip from '@/components/common/FlavorChip.vue'

const props = defineProps({
  /** Size of the wheel in pixels */
  size: {
    type: Number,
    default: 300
  },
  /** Array of flavor IDs or codes to highlight */
  highlightedFlavors: {
    type: Array,
    default: () => []
  },
  /** Opacity for non-highlighted segments */
  dimOpacity: {
    type: Number,
    default: 0.15
  },
  /** Show legend below the wheel */
  showLegend: {
    type: Boolean,
    default: true
  },
  /** Center label text */
  centerLabel: {
    type: String,
    default: 'Flavor'
  }
})

const emit = defineEmits(['select'])

const selectedFlavor = ref(null)

const isLightColor = (hex) => {
  if (!hex) return false
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return false
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55
}

const centerTextColor = computed(() => {
  if (!selectedFlavor.value) return 'var(--color-accent)'
  return isLightColor(selectedFlavor.value.color) ? '#3d3d3d' : 'white'
})

const center = computed(() => props.size / 2)
const outerRadius = computed(() => props.size / 2 - 2)
const innerRadius = computed(() => props.size * 0.12)
const level1OuterRadius = computed(() => props.size * 0.28)
const level2OuterRadius = computed(() => props.size * 0.40)

const isHighlighted = (idOrCode) => {
  if (!props.highlightedFlavors.length) return true
  return props.highlightedFlavors.some(f => {
    const fId = typeof f === 'object' ? (f.flavorId || f.id || f.code) : f
    return fId === idOrCode || fId === String(idOrCode)
  })
}

const hasHighlightedChild = (item) => {
  if (isHighlighted(item.id) || isHighlighted(item.code)) return true
  if (item.children?.length) {
    return item.children.some(child => hasHighlightedChild(child))
  }
  return false
}

const handleSegmentClick = (segment) => {
  if (segment.isHighlighted) {
    if (selectedFlavor.value?.id === segment.id) {
      selectedFlavor.value = null
    } else {
      selectedFlavor.value = segment
      emit('select', segment)
    }
  }
}

const clearSelection = () => {
  selectedFlavor.value = null
}

const selectFlavorById = (id) => {

  if (selectedFlavor.value?.id === id) {
    selectedFlavor.value = null
    return
  }

  const allSegments = [...level1Segments.value, ...level2Segments.value, ...level3Segments.value]
  const segment = allSegments.find(s => s.id === id)
  if (segment && segment.isHighlighted) {
    selectedFlavor.value = segment
    emit('select', segment)
  }
}

const createArcPath = (startAngle, endAngle, innerR, outerR) => {
  const startAngleRad = (startAngle - 90) * Math.PI / 180
  const endAngleRad = (endAngle - 90) * Math.PI / 180

  const x1 = center.value + innerR * Math.cos(startAngleRad)
  const y1 = center.value + innerR * Math.sin(startAngleRad)
  const x2 = center.value + outerR * Math.cos(startAngleRad)
  const y2 = center.value + outerR * Math.sin(startAngleRad)
  const x3 = center.value + outerR * Math.cos(endAngleRad)
  const y3 = center.value + outerR * Math.sin(endAngleRad)
  const x4 = center.value + innerR * Math.cos(endAngleRad)
  const y4 = center.value + innerR * Math.sin(endAngleRad)

  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return `M ${x1} ${y1}
          L ${x2} ${y2}
          A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3}
          L ${x4} ${y4}
          A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1} ${y1}
          Z`
}

const countLeaves = (item) => {
  if (!item.children?.length) return 1
  return item.children.reduce((sum, child) => sum + countLeaves(child), 0)
}

const totalLeaves = computed(() => {
  return FLAVOR_WHEEL.reduce((sum, cat) => sum + countLeaves(cat), 0)
})

const level1Segments = computed(() => {
  const segments = []
  let currentAngle = 0

  FLAVOR_WHEEL.forEach(category => {
    const leafCount = countLeaves(category)
    const angleSpan = (leafCount / totalLeaves.value) * 360

    const highlighted = hasHighlightedChild(category)
    const fill = highlighted ? category.colorHex : hexWithOpacity(category.colorHex, props.dimOpacity)

    segments.push({
      id: category.id,
      code: category.code,
      name: category.name,
      color: category.colorHex,
      fill,
      isHighlighted: highlighted,
      path: createArcPath(currentAngle, currentAngle + angleSpan, innerRadius.value, level1OuterRadius.value)
    })

    currentAngle += angleSpan
  })

  return segments
})

const level2Segments = computed(() => {
  const segments = []
  let currentAngle = 0

  FLAVOR_WHEEL.forEach(category => {
    const catLeaves = countLeaves(category)
    const catAngleSpan = (catLeaves / totalLeaves.value) * 360

    if (category.children?.length) {
      category.children.forEach(subcat => {
        const subLeaves = countLeaves(subcat)
        const angleSpan = (subLeaves / catLeaves) * catAngleSpan

        const highlighted = hasHighlightedChild(subcat)
        const color = subcat.colorHex || category.colorHex
        const fill = highlighted ? color : hexWithOpacity(color, props.dimOpacity)

        segments.push({
          id: subcat.id,
          code: subcat.code,
          name: subcat.name,
          color,
          fill,
          isHighlighted: highlighted,
          path: createArcPath(currentAngle, currentAngle + angleSpan, level1OuterRadius.value, level2OuterRadius.value)
        })

        currentAngle += angleSpan
      })
    } else {

      const highlighted = isHighlighted(category.id) || isHighlighted(category.code)
      const fill = highlighted ? category.colorHex : hexWithOpacity(category.colorHex, props.dimOpacity)

      segments.push({
        id: category.id,
        code: category.code,
        name: category.name,
        color: category.colorHex,
        fill,
        isHighlighted: highlighted,
        path: createArcPath(currentAngle, currentAngle + catAngleSpan, level1OuterRadius.value, level2OuterRadius.value)
      })

      currentAngle += catAngleSpan
    }
  })

  return segments
})

const level3Segments = computed(() => {
  const segments = []
  let currentAngle = 0

  FLAVOR_WHEEL.forEach(category => {
    const catLeaves = countLeaves(category)
    const catAngleSpan = (catLeaves / totalLeaves.value) * 360

    if (category.children?.length) {
      category.children.forEach(subcat => {
        const subLeaves = countLeaves(subcat)
        const subAngleSpan = (subLeaves / catLeaves) * catAngleSpan

        if (subcat.children?.length) {
          subcat.children.forEach(flavor => {
            const flavorAngleSpan = subAngleSpan / subcat.children.length

            const highlighted = isHighlighted(flavor.id) || isHighlighted(flavor.code)
            const color = flavor.colorHex || subcat.colorHex || category.colorHex
            const fill = highlighted ? color : hexWithOpacity(color, props.dimOpacity)

            segments.push({
              id: flavor.id,
              code: flavor.code,
              name: flavor.name,
              color,
              fill,
              isHighlighted: highlighted,
              path: createArcPath(currentAngle, currentAngle + flavorAngleSpan, level2OuterRadius.value, outerRadius.value)
            })

            currentAngle += flavorAngleSpan
          })
        } else {

          const highlighted = isHighlighted(subcat.id) || isHighlighted(subcat.code)
          const color = subcat.colorHex || category.colorHex
          const fill = highlighted ? color : hexWithOpacity(color, props.dimOpacity)

          segments.push({
            id: subcat.id,
            code: subcat.code,
            name: subcat.name,
            color,
            fill,
            isHighlighted: highlighted,
            path: createArcPath(currentAngle, currentAngle + subAngleSpan, level2OuterRadius.value, outerRadius.value)
          })

          currentAngle += subAngleSpan
        }
      })
    } else {

      const highlighted = isHighlighted(category.id) || isHighlighted(category.code)
      const fill = highlighted ? category.colorHex : hexWithOpacity(category.colorHex, props.dimOpacity)

      segments.push({
        id: category.id,
        code: category.code,
        name: category.name,
        color: category.colorHex,
        fill,
        isHighlighted: highlighted,
        path: createArcPath(currentAngle, currentAngle + catAngleSpan, level2OuterRadius.value, outerRadius.value)
      })

      currentAngle += catAngleSpan
    }
  })

  return segments
})

const highlightedFlavorDetails = computed(() => {
  if (!props.highlightedFlavors.length) return []

  return props.highlightedFlavors.map(f => {
    const id = typeof f === 'object' ? (f.flavorId || f.id || f.code) : f
    const path = getFlavorPath(id)
    if (path.length) {
      const flavor = path[path.length - 1]
      return {
        id: flavor.id,
        name: flavor.name,
        color: flavor.colorHex
      }
    }
    return null
  }).filter(Boolean)
})

const hexWithOpacity = (hex, opacity) => {

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
</script>

<style scoped>
.flavor-wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  cursor: default;
}

.wheel-wrapper {
  position: relative;
}

.flavor-wheel {
  display: block;
}

.flavor-wheel path {
  cursor: pointer;
  transition: opacity 0.25s ease, filter 0.25s ease;
}

.flavor-wheel path:hover {
  filter: brightness(1.1);
}

.flavor-wheel path.highlighted {
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.3));
}

.flavor-wheel path.highlighted:hover {
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.4)) brightness(1.05);
}

/* 선택 시 나머지 하이라이트된 세그먼트 살짝 연하게 */
.flavor-wheel path.dimmed.highlighted {
  opacity: 0.5;
}

.center-circle {
  transition: fill 0.25s ease, stroke 0.25s ease;
  cursor: pointer;
}

.center-text {
  font-size: 0.7rem;
  font-weight: 600;
  pointer-events: none;
  transition: fill 0.25s ease;
}

/* Legend */
.flavor-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  max-width: 100%;
}
</style>
