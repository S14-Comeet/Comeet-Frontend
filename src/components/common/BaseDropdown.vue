<template>
  <div
    ref="dropdownRef"
    :class="[
      'relative w-full',
      isOpen && 'h-auto'
    ]"
  >
    <!-- Dropdown Button -->
    <div
      :class="[
        'flex items-center justify-between pl-5 pr-3 py-2 rounded-xl transition-all cursor-pointer',
        dropdownClasses
      ]"
      @click="toggleDropdown"
      :disabled="disabled"
    >
      <!-- Label -->
      <p
        :class="[
          'text-base leading-normal',
          labelClasses
        ]"
      >
        {{ displayValue }}
      </p>

      <!-- Chevron Icon -->
      <div class="overflow-hidden shrink-0 w-10 h-10 flex items-center justify-center">
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
      </div>
    </div>

    <!-- Dropdown List -->
    <transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 top-full mt-2 bg-white border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto"
      >
        <div class="px-5 py-4 flex flex-col gap-8">
          <p
            v-for="option in options"
            :key="option.value"
            class="text-base text-neutral-900 cursor-pointer hover:text-primary transition-colors"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  /**
   * Current selected value
   */
  modelValue: {
    type: [String, Number],
    default: ''
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
   * - default: Gray background
   * - border: White background with border
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

const displayValue = computed(() => {
  if (!props.modelValue) return props.placeholder
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder
})

const dropdownClasses = computed(() => {
  if (props.disabled) {
    return 'bg-surface-light border-0 cursor-not-allowed'
  }

  if (isOpen.value) {
    return 'bg-white border border-neutral-900'
  }

  if (props.modelValue) {
    return 'bg-white border border-border'
  }

  return props.variant === 'border'
    ? 'bg-white border border-border'
    : 'bg-surface-light border-0'
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
  if (props.disabled) return '#757575'
  if (isOpen.value || props.modelValue) return '#171717'
  return '#9e9e9e'
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
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

<style scoped>
/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
