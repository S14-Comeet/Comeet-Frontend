<template>
  <header class="relative w-full h-14 bg-white flex items-center justify-between px-5 border-b border-border">
    <!-- Logo -->
    <div class="flex items-center">
      <router-link to="/" class="text-2xl font-bold text-primary hover:text-primary-700 transition-colors">
        Comeet
      </router-link>
    </div>

    <!-- Action Icons -->
    <div class="flex items-center gap-1">
      <!-- 로그인 상태일 때만 표시 -->
      <template v-if="isAuthenticated">
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

        <!-- User Profile Icon with Avatar -->
        <button
          class="flex items-center gap-2 px-2 h-10 rounded-full hover:bg-primary-50 transition-colors"
          aria-label="User profile"
          @click="handleUserClick"
        >
          <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            <img
              v-if="userProfileImage"
              :src="userProfileImage"
              :alt="userDisplayName"
              class="w-full h-full object-cover"
            />
            <BaseIcon v-else name="user-line" :size="20" color="var(--color-primary-600)" />
          </div>
          <span class="text-sm font-medium text-textPrimary hidden sm:inline">{{ userDisplayName }}</span>
        </button>
      </template>

      <!-- 비로그인 상태일 때는 아무것도 표시하지 않음 -->
    </div>
  </header>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import BaseIcon from '@/components/common/BaseIcon.vue'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
  /**
   * Show notification badge
   */
  hasNotifications: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['event-click', 'notice-click', 'user-click'])

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userDisplayName = computed(() => {
  if (authStore.userNickname && authStore.userNickname !== 'Guest') {
    return authStore.userNickname
  }
  return authStore.userName || 'Guest'
})
const userProfileImage = computed(() => authStore.userProfileImage)

// Watch for auth state changes and log
watch(
  () => authStore.isAuthenticated,
  (newVal, oldVal) => {
    console.group('[BaseHeader] 인증 상태 변경')
    console.log('🔹 이전 상태:', oldVal)
    console.log('🔹 새 상태:', newVal)
    if (newVal && authStore.user) {
      console.log('🔹 사용자:', {
        id: authStore.userId,
        name: authStore.userName,
        nickname: authStore.userNickname,
        email: authStore.userEmail,
        profileImage: authStore.userProfileImage,
        role: authStore.userRole
      })
    }
    console.groupEnd()
  },
  { immediate: true }
)

// Event handlers
const handleUserClick = () => {
  emit('user-click')
  router.push('/profile')
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
