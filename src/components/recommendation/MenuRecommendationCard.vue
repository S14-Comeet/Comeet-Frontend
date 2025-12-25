<template>
  <div class="menu-recommendation-card" @click="handleClick">
    
    <div class="menu-thumbnail">
      <img
        v-if="hasValidImage"
        :src="menu.menuImageUrl"
        :alt="menu.menuName"
        class="thumbnail-img"
        @error="handleImageError"
      />
      <BaseIcon v-else name="coffee" :size="32" class="text-primary-300" />
      <span v-if="showRank && menu.rank" class="rank-overlay">#{{ menu.rank }}</span>
    </div>

    
    <div class="menu-content">
      <div class="menu-header">
        <h3 class="menu-name">{{ menu.menuName }}</h3>
      </div>

      <p class="store-name">{{ menu.storeName }}</p>

      <div class="menu-meta">
        <span v-if="menu.distanceKm != null" class="distance">
          <BaseIcon name="map-marker" :size="12" class="distance-icon" />
          {{ formatDistance(menu.distanceKm) }}
        </span>
        <span v-if="menu.price" class="price">{{ formatPrice(menu.price) }}</span>
      </div>

      
      <div v-if="menu.flavors?.length" class="flavor-list">
        <FlavorChip
          v-for="flavor in menu.flavors.slice(0, 3)"
          :key="flavor.flavorId"
          :flavor="flavor"
        />
        <span v-if="menu.flavors.length > 3" class="more-flavors">
          +{{ menu.flavors.length - 3 }}
        </span>
      </div>
    </div>

    
    <RecommendationReason
      v-if="showReason && menu.reason"
      :reason="menu.reason"
      class="menu-reason"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import FlavorChip from '@/components/common/FlavorChip.vue'
import RecommendationReason from './RecommendationReason.vue'
import { formatDistance, formatPrice } from '@/api/recommendation'

const props = defineProps({
  menu: {
    type: Object,
    required: true

  },
  showRank: {
    type: Boolean,
    default: true
  },
  showReason: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const imageError = ref(false)

const hasValidImage = computed(() => {
  return props.menu.menuImageUrl &&
         !props.menu.menuImageUrl.includes('example.com') &&
         !imageError.value
})

const handleClick = () => {
  emit('click', props.menu)
}

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.menu-recommendation-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
  display: grid;
  grid-template-columns: 5rem 1fr;
  grid-template-rows: auto auto;
  gap: 0.75rem 1rem;
}

.menu-recommendation-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.menu-recommendation-card:active {
  transform: scale(0.99);
}

.menu-thumbnail {
  position: relative;
  width: 5rem;
  height: 5rem;
  border-radius: 0.5rem;
  background-color: var(--color-primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  grid-row: 1;
  grid-column: 1;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rank-overlay {
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-primary-700);
  font-size: 0.625rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  border: 1px solid var(--color-primary-200);
}

.menu-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  grid-row: 1;
  grid-column: 2;
}

.menu-header {
  margin-bottom: 0.125rem;
}

.menu-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.store-name {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
  margin: 0 0 0.375rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.distance {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary-600);
}

.distance-icon {
  color: var(--color-primary-500);
}

.price {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-textPrimary);
}

.flavor-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

.more-flavors {
  font-size: 0.6875rem;
  color: var(--color-textSecondary);
  padding: 0.125rem 0.375rem;
}

.menu-reason {
  grid-row: 2;
  grid-column: 1 / -1;
  margin-top: 0;
}
</style>
