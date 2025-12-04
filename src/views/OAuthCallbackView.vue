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
import { useToast } from 'vue-toastification'
import { setAccessToken } from '@/utils/storage'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const message = ref('로그인 처리 중...')

onMounted(async () => {
  console.group('[OAuth 콜백] 처리 시작')

  try {
    // URL에서 파라미터 추출
    let urlParams
    try {
      urlParams = new URLSearchParams(globalThis.location.search)
    } catch (e) {
      console.error('[OAuth] URL 파라미터 파싱 실패:', e)
      toast.error('URL 파라미터를 읽지 못했습니다.')
      router.push('/login')
      console.groupEnd()
      return
    }

    const accessToken = urlParams.get('accessToken')
    const error = urlParams.get('error')

    console.log('[OAuth] accessToken 존재:', !!accessToken)
    console.log('[OAuth] error:', error)

    // 에러가 있는 경우
    if (error) {
      console.error('[OAuth] 인증 실패:', error)
      toast.error('로그인에 실패했습니다.')
      router.push('/login')
      console.groupEnd()
      return
    }

    // AccessToken이 없는 경우
    if (!accessToken) {
      console.error('[OAuth] AccessToken이 URL 파라미터에 없습니다.')
      toast.error('인증 정보를 받지 못했습니다.')
      router.push('/login')
      console.groupEnd()
      return
    }

    // AccessToken 저장
    console.log('[OAuth] AccessToken 저장 시도...')
    let saved = false
    try {
      saved = setAccessToken(accessToken)
      console.log('[OAuth] AccessToken 저장 결과:', saved)
    } catch (e) {
      console.error('[OAuth] AccessToken 저장 중 에러:', e)
      // 에러가 발생해도 계속 진행 (메모리에 저장되었을 수 있음)
      saved = true
    }

    if (!saved) {
      console.error('[OAuth] AccessToken 저장 실패')
      toast.error('로그인 정보를 저장하지 못했습니다.')
      router.push('/login')
      console.groupEnd()
      return
    }

    console.log('[OAuth] AccessToken 저장 완료:', accessToken.substring(0, 20) + '...')

    // 사용자 정보 가져오기
    message.value = '사용자 정보를 가져오는 중...'
    console.log('[OAuth] fetchUser() 호출...')

    try {
      await authStore.fetchUser()
      console.log('[OAuth] fetchUser() 성공')
      console.log('[OAuth] 사용자:', authStore.user)
    } catch (fetchError) {
      console.error('[OAuth] fetchUser() 실패:', fetchError)
      toast.error('사용자 정보를 가져오지 못했습니다.')
      router.push('/login')
      console.groupEnd()
      return
    }

    // role에 따라 적절한 페이지로 이동
    // GUEST: 소셜 로그인만 완료, 닉네임/역할 미설정 → 회원가입 페이지
    // USER/OWNER: 서비스 등록 완료 → 메인 페이지
    if (authStore.isRegistered) {
      console.log('[OAuth] 등록된 사용자, 홈으로 이동')
      toast.success(`환영합니다, ${authStore.user.nickname || authStore.user.name}님!`)
      router.push('/')
    } else {
      console.log('[OAuth] GUEST 사용자, 닉네임 등록 페이지로 이동')
      toast.info('닉네임을 등록해주세요.')
      router.push('/nickname')
    }

    console.groupEnd()
  } catch (err) {
    console.error('[OAuth 콜백 오류]', err)
    toast.error('로그인 처리 중 오류가 발생했습니다.')
    router.push('/login')
    console.groupEnd()
  }
})
</script>
