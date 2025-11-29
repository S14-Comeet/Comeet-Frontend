<template>
  <div class="profile-view">
    <div class="header">
      <h1 class="title">마이페이지</h1>
    </div>

    <div class="profile-card">
      <div class="profile-avatar">
        <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
      </div>
      <h2 class="profile-name">{{ userName }}</h2>
      <p class="profile-email">{{ userEmail }}</p>
      <p v-if="!isAuthenticated" class="text-xs text-warning mt-2">로그인이 필요합니다</p>
    </div>

    <div class="menu-section">
      <h3 class="section-title">설정</h3>
      <div class="menu-list">
        <button class="menu-item" @click="handleResetPreferences">
          <span>취향 다시 설정</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button class="menu-item" @click="handleNotificationSettings">
          <span>알림 설정</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button class="menu-item text-error" @click="handleLogout">
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

// 사용자 정보
const userName = computed(() => authStore.userNickname)
const userEmail = computed(() => authStore.userEmail || '이메일 정보 없음')
const isAuthenticated = computed(() => authStore.isAuthenticated)

// 컴포넌트 마운트 시 사용자 정보 로드
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    // 인증되지 않은 경우 사용자 정보 조회 시도
    try {
      await authStore.fetchUser()
    } catch (error) {
      console.log('Not authenticated:', error)
      // 인증되지 않은 상태는 정상 (로그인 전)
    }
  }
})

// 로그아웃 핸들러
const handleLogout = async () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    try {
      await authStore.logout()
      toast.success('로그아웃 되었습니다')
      router.push('/login')
    } catch (error) {
      console.error('Logout failed', error)
      toast.error('로그아웃에 실패했습니다')
    }
  }
}

// 취향 재설정 (설문조사 페이지로 이동)
const handleResetPreferences = () => {
  router.push('/survey')
}

// 알림 설정
const handleNotificationSettings = () => {
  toast.info('알림 설정 기능은 준비 중입니다')
}
</script>

<style scoped>
@import "tailwindcss" reference;

.profile-view {
  @apply min-h-screen p-4;
}

.header {
  @apply mb-6;
}

.title {
  @apply text-2xl font-bold text-textPrimary;
}

.profile-card {
  @apply bg-white rounded-xl p-6 mb-6 text-center shadow-sm;
}

.profile-avatar {
  @apply mx-auto mb-4 w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center;
}

.profile-name {
  @apply text-xl font-bold text-textPrimary mb-1;
}

.profile-email {
  @apply text-sm text-textSecondary;
}

.menu-section {
  @apply mb-6;
}

.section-title {
  @apply text-sm font-medium text-textSecondary mb-3 px-2;
}

.menu-list {
  @apply bg-white rounded-xl overflow-hidden shadow-sm;
}

.menu-item {
  @apply w-full px-4 py-4 flex items-center justify-between
         text-left text-textPrimary hover:bg-gray-50 transition-colors
         border-b border-gray-100 last:border-b-0;
}
</style>
