<template>
  <div class="relative w-full">
    
    <div
      :class="[
        'flex items-center gap-3 rounded-xl',
        containerClasses
      ]"
    >
      
      <BaseIcon
        v-if="type === 'search'"
        name="search"
        :size="24"
        :color="iconColor"
      />

      
      <input
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :type="inputType"
        :aria-invalid="status === 'error' ? 'true' : undefined"
        :aria-describedby="helperText ? 'helper-text' : undefined"
        :class="[
          'flex-1 bg-transparent outline-none text-base leading-normal',
          inputClasses
        ]"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      
      <button
        v-if="clearable && modelValue && !disabled"
        class="shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
        type="button"
        aria-label="Clear input"
        @click="handleClear"
      >
        <BaseIcon name="x" :size="12" color="currentColor" />
      </button>
    </div>

    
    <output
      v-if="helperText"
      id="helper-text"
      :class="[
        'mt-2 text-sm',
        helperTextClasses
      ]"
      :role="status === 'error' ? 'alert' : undefined"
      :aria-live="status === 'error' ? 'polite' : undefined"
    >
      {{ helperText }}
    </output>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'

const props = defineProps({
  /**
   * Input value (v-model)
   */
  modelValue: {
    type: String,
    default: ''
  },
  /**
   * Placeholder text
   */
  placeholder: {
    type: String,
    default: ''
  },
  /**
   * Input type: 'text' | 'search' | 'password' | 'email'
   */
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'search', 'password', 'email'].includes(value)
  },
  /**
   * Show clear (X) button when input has value
   */
  clearable: {
    type: Boolean,
    default: false
  },
  /**
   * Disabled state
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * Variant style
   * - default: Light gray background, no border (minimalist)
   * - border: White background with border (outlined)
   */
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'border'].includes(value)
  },
  /**
   * Status state (affects border color)
   * - success: Green border (Warm brown in our case)
   * - error: Red border
   */
  status: {
    type: String,
    default: '',
    validator: (value) => ['', 'success', 'error'].includes(value)
  },
  /**
   * Helper text below input
   */
  helperText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'clear'])

const isFocused = ref(false)

const inputType = computed(() => {
  return props.type === 'search' ? 'text' : props.type
})

const containerClasses = computed(() => {
  const base = 'h-14 pl-5 pr-2.5 py-4 transition-colors transition-shadow duration-200'

  if (props.disabled) {
    return `${base} bg-surface-light cursor-not-allowed border-0`
  }

  if (props.status === 'success') {
    return `${base} bg-white border-2 border-primary-700`
  }
  if (props.status === 'error') {
    return `${base} bg-white border-2 border-error`
  }

  if (isFocused.value) {
    return `${base} bg-white border-2 border-neutral-900 ring-2 ring-primary-200 ring-opacity-50`
  }

  if (props.variant === 'border') {
    return `${base} bg-white border border-border hover:border-neutral-400`
  }

  return `${base} bg-surface-light border-0 hover:bg-neutral-100`
})

const inputClasses = computed(() => {
  if (props.disabled) {
    return 'text-textDisabled cursor-not-allowed'
  }

  if (props.modelValue) {
    return 'text-neutral-900 font-medium'
  }

  return 'text-textSecondary'
})

const iconColor = computed(() => {
  if (props.disabled) return 'var(--color-textDisabled)'
  if (isFocused.value || props.modelValue) return 'var(--color-neutral-900)'
  return 'var(--color-textSecondary)'
})

const helperTextClasses = computed(() => {
  if (props.status === 'success') return 'text-success'
  if (props.status === 'error') return 'text-error'
  return 'text-textSecondary'
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
/* Input autofill styling - matches variant backgrounds */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px var(--color-surface-light) inset;
  -webkit-text-fill-color: var(--color-neutral-900);
}

/* Remove number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
