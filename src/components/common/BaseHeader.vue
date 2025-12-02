<template>
  <header class="relative w-full h-14 bg-white flex items-center justify-between px-5 border-b border-border">
    <!-- Logo -->
    <div class="flex items-center">
      <span class="text-2xl font-bold text-primary">Comeet</span>
    </div>

    <!-- Action Icons -->
    <div class="flex items-center gap-1">
      <!-- Calendar/Event Icon -->
      <button
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-50 transition-colors"
        aria-label="Events"
        @click="$emit('event-click')"
      >
        <BaseIcon name="event" :size="24" color="var(--color-neutral-900)" />
      </button>

      <!-- Notice/Notification Icon (with badge) -->
      <button
        class="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-50 transition-colors"
        aria-label="Notifications"
        @click="$emit('notice-click')"
      >
        <BaseIcon name="notice" :size="24" color="var(--color-neutral-900)" />
        <!-- Badge (show when hasNotifications is true) -->
        <span
          v-if="hasNotifications"
          class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"
        ></span>
      </button>

      <!-- User Profile Icon -->
      <button
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-50 transition-colors"
        aria-label="User profile"
        @click="$emit('user-click')"
      >
        <BaseIcon name="user-line" :size="24" color="var(--color-neutral-900)" />
      </button>
    </div>
  </header>
</template>

<script setup>
import BaseIcon from '@/components/common/BaseIcon.vue'

defineProps({
  /**
   * Show notification badge
   */
  hasNotifications: {
    type: Boolean,
    default: false
  }
})

defineEmits(['event-click', 'notice-click', 'user-click'])
</script>

<style scoped>
/* Additional styles if needed */
</style>
