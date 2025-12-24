<template>
  <header class="relative w-full h-14 bg-white flex items-center justify-center px-5 border-b border-border">
    <!-- Back Button (좌측 절대 위치) -->
    <div v-if="showBackButton || showBack" class="absolute left-5 flex items-center">
      <button
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-50 transition-colors"
        aria-label="뒤로가기"
        @click="handleBack"
      >
        <BaseIcon name="chevron-left" :size="24" color="var(--color-neutral-900)" />
      </button>
    </div>

    <!-- Title or Logo (중앙) -->
    <template v-if="title">
      <h1 class="text-lg font-bold text-textPrimary">{{ title }}</h1>
    </template>
    <template v-else>
      <router-link to="/" class="logo-link" aria-label="Comeet 홈">
        <img :src="logoUrl" alt="Comeet" class="logo-icon" />
      </router-link>
    </template>

    <!-- Right Action (우측 절대 위치) -->
    <div class="absolute right-5 flex items-center">
      <!-- 비로그인 상태: 로그인 버튼 표시 -->
      <template v-if="!isAuthenticated">
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
import logoUrl from '@/assets/logo.svg?url'

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
  /**
   * Page title (if provided, replaces Comeet logo)
   */
  title: {
    type: String,
    default: ''
  },
  /**
   * Show back button
   */
  showBackButton: {
    type: Boolean,
    default: false
  },
  /**
   * Show back button (alias for showBackButton)
   */
  showBack: {
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

const emit = defineEmits(['back', 'login'])

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
.logo-link {
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
}

.logo-link:hover {
  opacity: 0.8;
}

.logo-icon {
  height: 44px;
  width: auto;
}
</style>
