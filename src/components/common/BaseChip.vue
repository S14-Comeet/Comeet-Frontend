<template>
  <div
    :class="[
      'box-border flex gap-2.5 h-10 items-center justify-center py-2.5 rounded-full transition-all',
      chipClasses
    ]"
  >
    <!-- Default variant -->
    <p
      v-if="variant === 'default'"
      class="font-sans text-sm text-center text-neutral-900 leading-tight"
    >
      {{ label }}
    </p>

    <!-- Black/Selected variant -->
    <p
      v-else-if="variant === 'black'"
      class="font-sans font-bold text-sm text-center text-white leading-tight"
    >
      {{ label }}
    </p>

    <!-- Primary variant (with optional dropdown) -->
    <div
      v-else-if="variant === 'primary'"
      class="flex gap-1 items-center"
    >
      <p
        :class="[
          'font-sans text-sm text-center leading-tight',
          selected ? 'font-bold text-primary-700' : 'font-medium text-primary'
        ]"
      >
        {{ label }}
      </p>
      <ChevronDownIcon v-if="dropdown" class="w-4 h-4 text-primary-700" />
      <SortIcon v-if="sort" class="w-4 h-4 text-primary-700" />
    </div>

    <!-- Primary Selected variant -->
    <p
      v-else-if="variant === 'primary-selected'"
      class="font-sans font-bold text-sm text-center text-primary-700 leading-tight"
    >
      {{ label }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Icons (placeholder - will be implemented in BaseIcon)
const ChevronDownIcon = {
  template: `
    <svg viewBox="0 0 16 16" fill="none" class="w-4 h-4">
      <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const SortIcon = {
  template: `
    <svg viewBox="0 0 16 16" fill="none" class="w-4 h-4">
      <path d="M4 8L8 4L12 8M4 12L8 8L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const props = defineProps({
  /**
   * Label text to display
   */
  label: {
    type: String,
    default: 'text 14pt'
  },
  /**
   * Chip variant
   * - default: White background with gray border
   * - black: Black background with white text (selected state)
   * - primary: Warm brown border with brown text
   * - primary-selected: Light brown background with brown border
   */
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'black', 'primary', 'primary-selected'].includes(value)
  },
  /**
   * Show dropdown icon (only for primary variant)
   */
  dropdown: {
    type: Boolean,
    default: false
  },
  /**
   * Show sort icon (only for primary variant)
   */
  sort: {
    type: Boolean,
    default: false
  },
  /**
   * Selected state (affects styling for primary variant)
   */
  selected: {
    type: Boolean,
    default: false
  }
})

const chipClasses = computed(() => {
  const base = {
    'default': 'bg-white border border-border px-4',
    'black': 'bg-neutral-900 px-4',
    'primary': props.selected
      ? 'bg-primary-300 border border-primary-700 px-4 pl-4 pr-3'
      : 'bg-white border border-primary px-4 pl-4 pr-3',
    'primary-selected': 'bg-primary-300 border border-primary-700 px-4'
  }

  return base[props.variant] || base.default
})
</script>

<style scoped>
/* Custom styles if needed - currently using Tailwind only */
</style>
