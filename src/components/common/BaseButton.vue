<template>
  <button
    :type="buttonType"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2.5 font-bold text-center rounded-xl transition-all',
      sizeClasses,
      variantClasses,
      disabled && 'cursor-not-allowed'
    ]"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Button label text (or use slot)
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * Button variant
   * - primary: Warm brown background + white text
   * - secondary: White background + border + dark text
   * - ghost: Transparent background + primary text
   * - tertiary: Light background + primary text
   */
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost', 'tertiary'].includes(value)
  },
  /**
   * Button size
   * - large: 56px height (16pt text)
   * - medium: 48px height (14pt text)
   * - small: 40px height (14pt text)
   */
  size: {
    type: String,
    default: 'large',
    validator: (value) => ['large', 'medium', 'small'].includes(value)
  },
  /**
   * Disabled state
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * Button type attribute
   */
  buttonType: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  }
})

const emit = defineEmits(['click'])

const sizeClasses = computed(() => {
  const sizes = {
    large: 'h-14 px-6 text-base leading-tight', // 56px, 16pt
    medium: 'h-12 px-5 text-sm leading-tight', // 48px, 14pt
    small: 'h-10 px-4 text-sm leading-tight'   // 40px, 14pt
  }
  return sizes[props.size] || sizes.large
})

const variantClasses = computed(() => {
  if (props.disabled) {
    return 'bg-border text-textDisabled'
  }

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-button-hover',
    secondary: 'bg-white text-neutral-900 border-2 border-border hover:border-neutral-900 hover:bg-primary-50',
    ghost: 'bg-transparent text-primary hover:bg-primary-50 hover:text-primary-700',
    tertiary: 'bg-primary-100 text-primary-700 hover:bg-primary-200'
  }

  return variants[props.variant] || variants.primary
})

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
button {
  font-family: 'Pretendard', sans-serif;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* Active/Pressed state */
button:active:not(:disabled) {
  transform: scale(0.98);
}

/* Focus visible for accessibility */
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
