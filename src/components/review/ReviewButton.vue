<template>
  <button
    class="review-button"
    @click="$emit('click')"
  >
    <BaseIcon name="edit" :size="18" />
    <span>리뷰 하러가기</span>
    <BaseIcon name="chevron-right" :size="16" class="arrow-icon" />
  </button>
</template>

<script setup>
import BaseIcon from '@/components/common/BaseIcon.vue'

defineEmits(['click'])
</script>

<style scoped>
.review-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-700) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(132, 97, 72, 0.3);
}

.review-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(132, 97, 72, 0.4);
}

.review-button:active {
  transform: translateY(0);
}

.arrow-icon {
  margin-left: auto;
  opacity: 0.8;
}
</style>
