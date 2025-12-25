<template>
  <span
    class="flavor-chip"
    :class="{ clickable: clickable }"
    :style="chipStyle"
    @click="handleClick"
  >
    {{ displayName }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { findFlavorInWheel } from '@/constants'

const props = defineProps({
  /** Flavor object with code, flavorId, id, name, colorHex */
  flavor: {
    type: Object,
    required: true
  },
  /** Whether the chip is clickable */
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const flavorInfo = computed(() => {
  if (!props.flavor) return null
  return findFlavorInWheel(props.flavor.code) ||
         findFlavorInWheel(props.flavor.flavorId) ||
         findFlavorInWheel(props.flavor.id)
})

const displayName = computed(() => {
  return flavorInfo.value?.name || props.flavor.name || props.flavor.code
})

const displayColor = computed(() => {
  return flavorInfo.value?.colorHex || props.flavor.colorHex || '#846148'
})

const isLightColor = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return false
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55
}

const chipStyle = computed(() => {
  const color = displayColor.value
  const isLight = isLightColor(color)

  return {
    backgroundColor: color,
    color: isLight ? '#3d3d3d' : 'white',
    border: isLight ? '1px solid rgba(0,0,0,0.12)' : '1px solid transparent',
    boxShadow: isLight ? 'inset 0 0 0 1px rgba(0,0,0,0.06)' : 'none'
  }
})

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.flavor)
  }
}
</script>

<style scoped>
.flavor-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;
}

.flavor-chip.clickable {
  cursor: pointer;
}

.flavor-chip.clickable:hover {
  opacity: 0.85;
  transform: scale(1.02);
}
</style>
