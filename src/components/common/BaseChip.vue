<template>
  <div
    :class="[
      'box-border flex gap-2.5 h-10 items-center justify-center py-2.5 rounded-full transition-all',
      chipClasses,
      clickable && 'cursor-pointer hover:opacity-80 active:scale-95'
    ]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="handleClick"
    @keydown="handleKeyDown"
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
      <BaseIcon
        v-if="dropdown"
        name="chevron-down"
        :size="16"
        color="var(--color-primary-700)"
      />
      <BaseIcon
        v-if="sort"
        name="sort"
        :size="16"
        color="var(--color-primary-700)"
      />
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
import BaseIcon from '@/components/common/BaseIcon.vue'

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
  },
  /**
   * Make chip clickable (adds hover, cursor, and keyboard support)
   */
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}

const handleKeyDown = (event) => {
  if (!props.clickable) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click')
  }
}

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
