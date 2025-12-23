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
            <p class="text-xs text-primary mt-1">
              {{ authStore.isOwner ? '가맹점주' : '일반 사용자' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 점주 전용 메뉴 -->
      <div v-if="authStore.isOwner" class="bg-white rounded-lg shadow-sm mb-4">
        <button
          class="w-full flex items-center justify-between p-4 hover:bg-primary-50 transition-colors"
          @click="goToOwnerStores"
        >
          <span class="text-textPrimary font-medium">내 가게 관리</span>
          <span class="text-textSecondary">›</span>
        </button>
      </div>

      <!-- 메뉴 목록 -->
      <div class="bg-white rounded-lg shadow-sm">
        <button
          class="w-full flex items-center justify-between p-4 border-b border-primary-200 hover:bg-primary-50 transition-colors"
          @click="goToMyPreference"
        >
          <span class="text-textPrimary">내 취향</span>
          <span class="text-textSecondary">›</span>
        </button>
        <button
          class="w-full flex items-center justify-between p-4 border-b border-primary-200 hover:bg-primary-50 transition-colors"
          @click="goToMyReviews"
        >
          <span class="text-textPrimary">내 리뷰</span>
          <span class="text-textSecondary">›</span>
        </button>
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
          class="w-full flex items-center justify-between p-4 text-error hover:bg-error-light hover:bg-opacity-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoggingOut"
          @click="confirmLogout"
        >
          <span>{{ isLoggingOut ? '로그아웃 중...' : '로그아웃' }}</span>
        </button>
      </div>
    </div>

    <!-- 로그아웃 확인 모달 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showLogoutModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          @click.self="cancelLogout"
        >
          <div class="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl">
            <h3 class="text-lg font-bold text-neutral-900 mb-2">로그아웃</h3>
            <p class="text-textSecondary mb-6">정말 로그아웃 하시겠습니까?</p>
            <div class="flex gap-3">
              <BaseButton
                variant="secondary"
                size="medium"
                class="flex-1"
                @click="cancelLogout"
              >
                취소
              </BaseButton>
              <BaseButton
                variant="primary"
                size="medium"
                class="flex-1"
                :loading="isLoggingOut"
                @click="handleLogout"
              >
                로그아웃
              </BaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 하단 네비게이션 -->
    <BaseNavigationBar />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { createLogger } from '@/utils/logger'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseNavigationBar from '@/components/common/BaseNavigationBar.vue'

const logger = createLogger('ProfileView')

const router = useRouter()
const authStore = useAuthStore()

// 로그아웃 상태 관리
const showLogoutModal = ref(false)
const isLoggingOut = ref(false)

/**
 * 로그아웃 확인 모달 표시
 */
const confirmLogout = () => {
  showLogoutModal.value = true
}

/**
 * 로그아웃 취소
 */
const cancelLogout = () => {
  showLogoutModal.value = false
}

/**
 * 내 취향 페이지로 이동
 */
const goToMyPreference = () => {
  router.push('/my-preference')
}

/**
 * 내 리뷰 페이지로 이동
 */
const goToMyReviews = () => {
  router.push('/my-reviews')
}

/**
 * 내 가게 관리 페이지로 이동 (점주 전용)
 */
const goToOwnerStores = () => {
  router.push('/owner/stores')
}

/**
 * 로그아웃 처리
 */
const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await authStore.logout()
    showLogoutModal.value = false
    // 로그인 페이지로 이동
    router.push('/login')
  } catch (error) {
    logger.error('로그아웃 실패', error)
    // 에러가 발생해도 로그인 페이지로 이동 (로컬 상태는 이미 초기화됨)
    router.push('/login')
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
/* 모달 페이드 트랜지션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
