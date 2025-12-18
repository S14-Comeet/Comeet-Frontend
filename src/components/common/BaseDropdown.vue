<template>
  <div
      ref="dropdownRef"
      :class="[
      'relative w-full',
      isOpen && 'h-auto'
    ]"
  >
    <!-- Dropdown Button -->
    <button
        type="button"
        :class="[
        'flex items-center justify-between pl-5 pr-3 py-2 rounded-xl w-full',
        dropdownClasses
      ]"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        aria-haspopup="listbox"
        :disabled="disabled"
        @click="toggleDropdown"
        @keydown="handleKeyDown"
        @focus="isFocused = true"
        @blur="isFocused = false"
    >
      <!-- Label -->
      <span
          :class="[
          'text-base leading-normal',
          labelClasses
        ]"
      >
        {{ displayValue }}
      </span>

      <!-- Chevron Icon -->
      <span class="overflow-hidden shrink-0 w-10 h-10 flex items-center justify-center" aria-hidden="true">
        <svg
            :class="[
            'w-6 h-6 transition-transform',
            isOpen && 'rotate-180'
          ]"
            viewBox="0 0 24 24"
            fill="none"
        >
          <path
              d="M6 9L12 15L18 9"
              :stroke="chevronColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
        </svg>
      </span>
    </button>


    <!-- Dropdown List -->
    <transition name="dropdown">
      <ul
          v-if="isOpen"
          :id="listboxId"
          class="absolute left-0 right-0 top-full mt-2 bg-white border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto px-5 py-4 flex flex-col gap-2 list-none m-0"
      >
        <li
            v-for="(option, index) in options"
            :key="option.value"
            :class="[
              'text-base cursor-pointer transition-colors duration-200 px-2 py-1 rounded',
              index === highlightedIndex
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-neutral-900 hover:text-primary'
            ]"
            :aria-selected="option.value === modelValue"
            @click="selectOption(option)"
            @mouseenter="highlightedIndex = index"
        >
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'

const props = defineProps({
  /**
   * Current selected value
   */
  modelValue: {
    type: [String, Number],
    default: null
  },
  /**
   * Dropdown options
   */
  options: {
    type: Array,
    required: true,
    validator: (options) => options.every(opt => opt.label && opt.value !== undefined)
  },
  /**
   * Placeholder text when no option is selected
   */
  placeholder: {
    type: String,
    default: 'Select an option'
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
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const dropdownRef = ref(null)
const isOpen = ref(false)
const isFocused = ref(false)
const highlightedIndex = ref(-1)
const listboxId = `dropdown-listbox-${Math.random().toString(36).substr(2, 9)}`

const displayValue = computed(() => {
  if (!props.modelValue) return props.placeholder
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder
})

const dropdownClasses = computed(() => {
  const base = 'transition-colors transition-shadow duration-200'

  if (props.disabled) {
    return `${base} bg-surface-light border-0 cursor-not-allowed`
  }

  // Open state (highest priority)
  if (isOpen.value) {
    return `${base} bg-white border-2 border-neutral-900 cursor-pointer ring-2 ring-primary-200 ring-opacity-50`
  }

  // Focus state (keyboard navigation)
  if (isFocused.value) {
    return `${base} bg-white border-2 border-neutral-900 cursor-pointer ring-2 ring-primary-200 ring-opacity-50`
  }

  // Has value selected
  if (props.modelValue) {
    return props.variant === 'border'
      ? `${base} bg-white border border-border cursor-pointer hover:border-neutral-400`
      : `${base} bg-surface-light border-0 cursor-pointer hover:bg-neutral-100`
  }

  // Default empty state
  return props.variant === 'border'
      ? `${base} bg-white border border-border cursor-pointer hover:border-neutral-400`
      : `${base} bg-surface-light border-0 cursor-pointer hover:bg-neutral-100`
})

const labelClasses = computed(() => {
  if (props.disabled) {
    return 'text-textDisabled font-normal'
  }

  if (isOpen.value || props.modelValue) {
    return 'text-neutral-900 font-medium'
  }

  return 'text-textSecondary font-normal'
})

const chevronColor = computed(() => {
  if (props.disabled) return 'var(--color-textDisabled)'
  if (isOpen.value || props.modelValue) return 'var(--color-neutral-900)'
  return 'var(--color-textSecondary)'
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    highlightedIndex.value = props.options.findIndex(opt => opt.value === props.modelValue)
  }
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
  highlightedIndex.value = -1
}

const handleEnterOrSpace = (event) => {
  event.preventDefault()
  if (isOpen.value && highlightedIndex.value >= 0) {
    selectOption(props.options[highlightedIndex.value])
  } else {
    toggleDropdown()
  }
}

const handleEscape = (event) => {
  if (isOpen.value) {
    event.preventDefault()
    isOpen.value = false
    highlightedIndex.value = -1
  }
}

const handleArrowDown = (event) => {
  event.preventDefault()
  if (isOpen.value) {
    highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1)
  } else {
    toggleDropdown()
  }
}

const handleArrowUp = (event) => {
  event.preventDefault()
  if (isOpen.value) {
    highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
  }
}

const handleHome = (event) => {
  if (isOpen.value) {
    event.preventDefault()
    highlightedIndex.value = 0
  }
}

const handleEnd = (event) => {
  if (isOpen.value) {
    event.preventDefault()
    highlightedIndex.value = props.options.length - 1
  }
}

const handleKeyDown = (event) => {
  if (props.disabled) return

  const keyHandlers = {
    'Enter': handleEnterOrSpace,
    ' ': handleEnterOrSpace,
    'Escape': handleEscape,
    'ArrowDown': handleArrowDown,
    'ArrowUp': handleArrowUp,
    'Home': handleHome,
    'End': handleEnd
  }

  const handler = keyHandlers[event.key]
  if (handler) {
    handler(event)
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

