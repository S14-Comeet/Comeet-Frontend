<template>
  <div
    :class="[
      'box-border flex gap-2 h-10 items-center justify-center rounded-full transition-opacity transition-transform duration-200',
      chipClasses,
      clickable && 'cursor-pointer hover:opacity-80 active:scale-95',
      removable && 'pr-2' // Adjust padding for remove button
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

    <!-- Removable X button -->
    <button
      v-if="removable"
      class="flex items-center justify-center w-5 h-5 rounded-full hover:bg-black/10 transition-colors"
      @click.stop="$emit('remove')"
      aria-label="삭제"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>
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
  },
  /**
   * Show remove button
   */
  removable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'remove'])

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
