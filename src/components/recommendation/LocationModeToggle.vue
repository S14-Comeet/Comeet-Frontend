<template>
  <div class="location-mode-toggle">
    <button
      class="toggle-btn"
      :class="{ active: modelValue === 'nearby' }"
      @click="selectMode('nearby')"
    >
      <BaseIcon name="map-marker" :size="14" class="mr-1" />
      내 주변
    </button>
    <button
      class="toggle-btn"
      :class="{ active: modelValue === 'global' }"
      @click="selectMode('global')"
    >
      전체
    </button>
  </div>
</template>

<script setup>
import BaseIcon from '@/components/common/BaseIcon.vue'

defineProps({
  modelValue: {
    type: String,
    default: 'global',
    validator: (value) => ['global', 'nearby'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

const selectMode = (mode) => {
  emit('update:modelValue', mode)
}
</script>

<style scoped>
.location-mode-toggle {
  display: inline-flex;
  background-color: var(--color-primary-100);
  border-radius: 0.5rem;
  padding: 0.25rem;
  gap: 0.25rem;
}

.toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary-600);
  background: transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.toggle-btn:hover {
  background-color: var(--color-primary-200);
}

.toggle-btn.active {
  background-color: var(--color-primary-600);
  color: white;
}

.toggle-btn.active:hover {
  background-color: var(--color-primary-700);
}

.mr-1 {
  margin-right: 0.25rem;
}
</style>
