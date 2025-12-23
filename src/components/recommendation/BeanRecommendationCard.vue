<template>
  <div class="bean-recommendation-card" @click="handleClick">
    <!-- Header: Rank + Name -->
    <div class="card-header">
      <span class="rank-badge">#{{ bean.rank }}</span>
      <div class="bean-info">
        <h3 class="bean-name">{{ bean.beanName }}</h3>
        <p class="bean-origin">
          {{ bean.origin }}
          <span v-if="bean.roastLevel" class="separator">·</span>
          <span v-if="bean.roastLevel" class="roast-level">{{ formatRoastingLevel(bean.roastLevel) }}</span>
        </p>
      </div>
    </div>

    <!-- Flavor badges -->
    <div v-if="bean.flavors?.length" class="flavor-list">
      <FlavorBadge
        v-for="flavor in bean.flavors"
        :key="flavor.flavorId"
        :flavor="flavor"
      />
    </div>

    <!-- AI Reason -->
    <RecommendationReason v-if="bean.reason" :reason="bean.reason" />
  </div>
</template>

<script setup>
import FlavorBadge from './FlavorBadge.vue'
import RecommendationReason from './RecommendationReason.vue'
import { formatRoastingLevel } from '@/api/recommendation'

const props = defineProps({
  bean: {
    type: Object,
    required: true
    // { beanId, beanName, description, origin, roastLevel, flavors, totalScore, rank, reason, similarityScore }
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.bean)
}
</script>

<style scoped>
.bean-recommendation-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.bean-recommendation-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.bean-recommendation-card:active {
  transform: scale(0.99);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.rank-badge {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: var(--color-primary-600);
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 50%;
}

.bean-info {
  flex: 1;
  min-width: 0;
}

.bean-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bean-origin {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
  margin: 0;
}

.separator {
  margin: 0 0.25rem;
}

.roast-level {
  color: var(--color-primary-500);
}

.flavor-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
</style>
