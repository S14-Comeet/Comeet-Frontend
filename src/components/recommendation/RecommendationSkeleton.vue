<template>
  <div class="recommendation-skeleton">
    <!-- Bean skeleton -->
    <template v-if="type === 'bean'">
      <div class="skeleton-card bean-skeleton">
        <div class="skeleton-header">
          <div class="skeleton skeleton-rank"></div>
          <div class="skeleton skeleton-title"></div>
        </div>
        <div class="skeleton skeleton-subtitle"></div>
        <div class="skeleton-flavors">
          <div class="skeleton skeleton-badge"></div>
          <div class="skeleton skeleton-badge"></div>
          <div class="skeleton skeleton-badge"></div>
        </div>
        <div class="skeleton skeleton-reason"></div>
      </div>
    </template>

    <!-- Menu skeleton -->
    <template v-else-if="type === 'menu'">
      <div class="skeleton-card menu-skeleton">
        <div class="skeleton skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-header">
            <div class="skeleton skeleton-rank-small"></div>
            <div class="skeleton skeleton-title"></div>
          </div>
          <div class="skeleton skeleton-store"></div>
          <div class="skeleton skeleton-meta"></div>
          <div class="skeleton-flavors">
            <div class="skeleton skeleton-badge-small"></div>
            <div class="skeleton skeleton-badge-small"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'bean', // 'bean' | 'menu'
    validator: (value) => ['bean', 'menu'].includes(value)
  }
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.25rem;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
}

/* Bean skeleton */
.bean-skeleton .skeleton-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.skeleton-rank {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.skeleton-title {
  height: 1.25rem;
  flex: 1;
  max-width: 60%;
}

.skeleton-subtitle {
  height: 0.875rem;
  width: 40%;
  margin-bottom: 0.75rem;
}

.skeleton-flavors {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.skeleton-badge {
  height: 1.5rem;
  width: 4rem;
  border-radius: 9999px;
}

.skeleton-badge-small {
  height: 1.25rem;
  width: 3rem;
  border-radius: 9999px;
}

.skeleton-reason {
  height: 3.5rem;
  border-radius: 0.5rem;
}

/* Menu skeleton */
.menu-skeleton {
  display: flex;
  gap: 1rem;
}

.skeleton-image {
  width: 5rem;
  height: 5rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  min-width: 0;
}

.menu-skeleton .skeleton-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.skeleton-rank-small {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

.skeleton-store {
  height: 0.875rem;
  width: 50%;
  margin-bottom: 0.375rem;
}

.skeleton-meta {
  height: 0.75rem;
  width: 30%;
  margin-bottom: 0.5rem;
}

.menu-skeleton .skeleton-flavors {
  margin-bottom: 0;
}
</style>
