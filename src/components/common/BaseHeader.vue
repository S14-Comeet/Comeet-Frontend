<template>
  <header class="relative w-full h-14 bg-white flex items-center justify-center px-5 border-b border-border">
    <!-- Back Button (좌측 절대 위치) -->
    <div v-if="showBackButton" class="absolute left-5 flex items-center">
      <button
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-50 transition-colors"
        aria-label="뒤로가기"
        @click="handleBack"
      >
        <BaseIcon name="chevron-left" :size="24" color="var(--color-neutral-900)" />
      </button>
    </div>

    <!-- Logo (중앙) -->
    <router-link to="/" class="text-2xl font-bold text-primary hover:text-primary-700 transition-colors">
      Comeet
    </router-link>

    <!-- Right Action (우측 절대 위치) -->
    <div class="absolute right-5 flex items-center">
      <!-- 로그인 상태: 알림 아이콘 표시 -->
      <template v-if="isAuthenticated">
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
      </template>

      <!-- 비로그인 상태: 로그인 버튼 표시 -->
      <template v-else>
        <BaseButton
          variant="ghost"
          size="small"
          label="로그인"
          @click="handleLogin"
        />
      </template>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
  /**
   * Show notification badge
   */
  hasNotifications: {
    type: Boolean,
    default: false
  },
  /**
   * Show back button
   */
  showBackButton: {
    type: Boolean,
    default: false
  },
  /**
   * Force authentication state (for testing purposes)
   * If null, uses actual auth state
   */
  forceAuthState: {
    type: Boolean,
    default: null
  }
})

const emit = defineEmits(['notice-click', 'back', 'login'])

// Computed properties
const isAuthenticated = computed(() => {
  // 테스트용 강제 상태가 있으면 그것을 사용
  if (props.forceAuthState !== null) {
    return props.forceAuthState
  }
  // 아니면 실제 인증 상태 사용
  return authStore.isAuthenticated
})

// 뒤로가기 핸들러
const handleBack = () => {
  emit('back')
  router.back()
}

// 로그인 핸들러
const handleLogin = () => {
  emit('login')
  router.push('/login')
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
