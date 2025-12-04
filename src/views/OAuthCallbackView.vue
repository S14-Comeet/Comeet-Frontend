<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center">
      <div class="mb-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
      <p class="text-textPrimary text-lg">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { setAccessToken } from '@/utils/storage'
import { createLogger } from '@/utils/logger'
import { showSuccess, showError, showInfo } from '@/utils/toast'

const logger = createLogger('OAuth')
const router = useRouter()
const authStore = useAuthStore()
const message = ref('로그인 처리 중...')

/**
 * OAuth 콜백 처리
 * URL 파라미터에서 accessToken을 추출하여 저장하고 사용자 정보를 가져옴
 */
onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(globalThis.location.search)
    const accessToken = urlParams.get('accessToken')
    const error = urlParams.get('error')

    // 에러 또는 토큰 없음
    if (error || !accessToken) {
      logger.warn('OAuth 콜백 실패', { error, hasToken: !!accessToken })
      showError('로그인에 실패했습니다. 다시 시도해주세요.')
      router.push('/login')
      return
    }

    // AccessToken 저장
    setAccessToken(accessToken)
    logger.info('OAuth 토큰 저장 완료')

    // 사용자 정보 가져오기
    message.value = '사용자 정보를 가져오는 중...'
    await authStore.fetchUser()

    // role에 따라 페이지 이동
    if (authStore.isRegistered) {
      logger.info('등록된 사용자 → 메인 페이지')
      const nickname = authStore.user?.nickname || authStore.user?.name || '사용자'
      showSuccess(`환영합니다, ${nickname}님!`)
      router.push('/')
    } else {
      logger.info('미등록 사용자 → 닉네임 등록')
      showInfo('닉네임을 등록해주세요.')
      router.push('/nickname')
    }
  } catch (err) {
    logger.error('OAuth 콜백 처리 실패', err)
    showError('로그인 처리 중 오류가 발생했습니다.')
    router.push('/login')
  }
})
</script>
