<template>
  <div v-if="reason" class="recommendation-reason">
    <span class="quote-icon">"</span>
    <p class="reason-text">{{ reason }}</p>
    <span class="ai-badge">AI 추천</span>
  </div>
</template>

<script setup>
defineProps({
  reason: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.recommendation-reason {
  position: relative;
  background: linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100));
  border-left: 3px solid var(--color-primary-600);
  padding: 0.75rem 1rem;
  padding-right: 3.5rem;
  border-radius: 0.5rem;
  margin-top: 0.75rem;
}

.quote-icon {
  position: absolute;
  top: 0.25rem;
  left: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-400);
  line-height: 1;
  opacity: 0.6;
}

.reason-text {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-textPrimary);
  margin: 0;
  padding-left: 0.75rem;
}

.ai-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.625rem;
  font-weight: 600;
  background: var(--color-primary-600);
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}
</style>
