<template>
  <div class="flex flex-col min-h-full h-full bg-background">
    <div class="flex-1 p-4 overflow-y-auto">
      <!-- 프로필 정보 -->
      <div class="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            <img
              v-if="authStore.userProfileImage"
              :src="authStore.userProfileImage"
              alt="프로필"
              class="w-full h-full rounded-full object-cover"
            />
            <BaseIcon v-else name="user-line" :size="32" class="text-primary-600" />
          </div>
          <div>
            <p class="text-textPrimary text-lg font-bold">{{ authStore.userNickname }}</p>
            <p class="text-textSecondary text-sm">{{ authStore.userEmail }}</p>
          </div>
        </div>
      </div>

      <!-- 메뉴 목록 -->
      <div class="bg-white rounded-lg shadow-sm">
        <!-- TODO: 내 정보 수정 기능 구현 필요 -->
        <button class="w-full flex items-center justify-between p-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
          <span class="text-textPrimary">내 정보 수정</span>
          <span class="text-textSecondary">›</span>
        </button>
        <!-- TODO: 알림 설정 기능 구현 필요 -->
        <button class="w-full flex items-center justify-between p-4 border-b border-primary-200 hover:bg-primary-50 transition-colors">
          <span class="text-textPrimary">알림 설정</span>
          <span class="text-textSecondary">›</span>
        </button>
        <button
          class="w-full flex items-center justify-between p-4 text-error hover:bg-error-light hover:bg-opacity-10 transition-colors"
          @click="handleLogout"
        >
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useToast } from 'vue-toastification'
import BaseIcon from '@/components/common/BaseIcon.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.success('로그아웃되었습니다.')
    router.push('/login')
  } catch {
    toast.error('로그아웃에 실패했습니다.')
  }
}
</script>

