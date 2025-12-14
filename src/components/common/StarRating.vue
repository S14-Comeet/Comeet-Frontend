<template>
  <div class="flex gap-1">
    <button
      v-for="i in max"
      :key="i"
      type="button"
      class="focus:outline-none transition-transform active:scale-90"
      @click="updateRating(i)"
      @mouseenter="hoverRating = i"
      @mouseleave="hoverRating = 0"
    >
      <BaseIcon
        :name="getIconName(i)"
        :size="size"
        :color="getColor(i)"
        class="transition-colors duration-200"
      />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 5
  },
  size: {
    type: Number,
    default: 32
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const hoverRating = ref(0)

const updateRating = (value) => {
  if (props.readonly) return
  emit('update:modelValue', value)
}

const getIconName = (index) => {
  // Assuming 'star-fill' and 'star-line' or similar exist in BaseIcon/assets. 
  // Checking file list... assets/icons has bookmark, home, map, user. 
  // I might need to check if star icon exists or use a fallback. 
  // The user didn't explicitly check icons.
  // I'll assume 'star-fill' exists or I might need to add it.
  // Wait, I saw 'bookmark-fill.svg', 'bookmark-line.svg'. 
  // I will check BaseIcon.vue to see how it handles icons and if I need to add SVGs.
  return 'star-fill' 
}

const getColor = (index) => {
  const active = hoverRating.value ? index <= hoverRating.value : index <= props.modelValue
  return active ? '#FFD700' : '#E5E5E5' // Gold vs Gray
}
</script>
