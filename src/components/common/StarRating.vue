<template>
  <div class="star-rating-container" @mouseleave="hoverRating = 0">
    <div
      v-for="i in max"
      :key="i"
      class="star-item"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <!-- 배경 별 (빈 별) -->
      <BaseIcon
        name="star-line"
        :size="size"
        color="#E5E5E5"
        class="absolute inset-0"
      />
      <!-- 채워진 별 -->
      <div
        class="absolute inset-0 overflow-hidden"
        :style="{ width: getFillWidth(i) }"
      >
        <BaseIcon
          name="star-fill"
          :size="size"
          :color="getColor(i)"
          class="transition-colors duration-200"
        />
      </div>
      <!-- 클릭 영역 (allowHalf일 때만 반으로 나눔) -->
      <template v-if="!readonly">
        <template v-if="allowHalf">
          <button
            type="button"
            class="absolute left-0 top-0 h-full w-1/2 focus:outline-none"
            @click="updateRating(i - 0.5)"
            @mouseenter="hoverRating = i - 0.5"
          />
          <button
            type="button"
            class="absolute right-0 top-0 h-full w-1/2 focus:outline-none"
            @click="updateRating(i)"
            @mouseenter="hoverRating = i"
          />
        </template>
        <button
          v-else
          type="button"
          class="absolute inset-0 focus:outline-none transition-transform active:scale-90"
          @click="updateRating(i)"
          @mouseenter="hoverRating = i"
        />
      </template>
    </div>
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
  },
  allowHalf: {
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

const getCurrentRating = () => {
  return hoverRating.value || props.modelValue
}

const getFillWidth = (index) => {
  const rating = getCurrentRating()
  if (rating >= index) {
    return '100%'
  } else if (rating >= index - 0.5) {
    return '50%'
  }
  return '0%'
}

const getColor = (index) => {
  const rating = getCurrentRating()
  if (rating >= index - 0.5) {
    return '#FFD700' // Gold
  }
  return '#E5E5E5' // Gray
}
</script>

<style scoped>
.star-rating-container {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  line-height: 1;
  vertical-align: middle;
}

.star-item {
  position: relative;
  flex-shrink: 0;
}
</style>
