<template>
  <div class="preference-slider">
    <div class="slider-header">
      <span class="slider-label">{{ label }}</span>
      <span class="slider-value">{{ modelValue }}</span>
    </div>
    <div class="slider-container">
      <span class="slider-hint low">{{ lowLabel }}</span>
      <input
        type="range"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        class="slider-input"
        @input="handleInput"
      />
      <span class="slider-hint high">{{ highLabel }}</span>
    </div>
    <div class="slider-ticks">
      <span
        v-for="tick in ticks"
        :key="tick"
        class="tick"
        :class="{ active: tick <= modelValue }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  lowLabel: {
    type: String,
    default: '약하게'
  },
  highLabel: {
    type: String,
    default: '강하게'
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 10
  },
  step: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:modelValue'])

const ticks = computed(() => {
  const result = []
  for (let i = props.min; i <= props.max; i += props.step) {
    result.push(i)
  }
  return result
})

const handleInput = (event) => {
  emit('update:modelValue', Number(event.target.value))
}
</script>

<style scoped>
.preference-slider {
  padding: 0.75rem 0;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.slider-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-textPrimary);
}

.slider-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
  min-width: 1.5rem;
  text-align: center;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.slider-hint {
  font-size: 0.6875rem;
  color: var(--color-textSecondary);
  white-space: nowrap;
  min-width: 2.5rem;
}

.slider-hint.low {
  text-align: left;
}

.slider-hint.high {
  text-align: right;
}

.slider-input {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 0.5rem;
  background: var(--color-primary-100);
  border-radius: 0.25rem;
  outline: none;
  cursor: pointer;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s ease;
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider-input::-webkit-slider-thumb:active {
  transform: scale(0.95);
}

.slider-input::-moz-range-thumb {
  width: 1.5rem;
  height: 1.5rem;
  background: var(--color-primary);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.slider-ticks {
  display: flex;
  justify-content: space-between;
  padding: 0.375rem 0.75rem 0;
}

.tick {
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 50%;
  background: var(--color-primary-200);
  transition: background-color 0.15s ease;
}

.tick.active {
  background: var(--color-primary);
}
</style>
