<template>
  <span
    class="flavor-badge"
    :style="{
      backgroundColor: flavor.colorHex,
      color: textColor
    }"
  >
    {{ flavor.code }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { getContrastColor } from '@/api/recommendation'

const props = defineProps({
  flavor: {
    type: Object,
    required: true
    // { flavorId, code, colorHex }
  }
})

const textColor = computed(() => getContrastColor(props.flavor.colorHex))
</script>

<style scoped>
.flavor-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>
