import { defineStore } from 'pinia'
import { getUserInfo, logout as logoutApi } from '@/api/auth'
import { safeStorage, removeAccessToken } from '@/utils/storage'

/**
 * 인증 상태 관리 Store
 *
 * 사용자 로그인 상태, 사용자 정보를 관리하고
 * LocalStorage에 자동으로 persist 합니다.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    /**
     * 현재 로그인한 사용자 정보
     * API 응답 필드: userId, name, email, nickname, profileImageUrl, role
     * @type {{
     *   userId: number|null,
     *   name: string|null,
     *   email: string|null,
     *   nickname: string|null,
     *   profileImageUrl: string|null,
     *   role: 'GUEST'|'USER'|'OWNER'|null
     * }|null}
     */
    user: null,

    /**
     * 로그인 상태
     * @type {boolean}
     */
    isAuthenticated: false,

    /**
     * 로딩 상태 (API 요청 중)
     * @type {boolean}
     */
    isLoading: false,
  }),

  getters: {
    /**
     * 사용자 ID
     */
    userId: (state) => state.user?.userId || null,

    /**
     * 사용자 이름
     */
    userName: (state) => state.user?.name || '',

    /**
     * 사용자 닉네임 반환 (없으면 'Guest')
     */
    userNickname: (state) => state.user?.nickname || 'Guest',

    /**
     * 게스트 상태 여부
     */
    isGuest: (state) => !state.isAuthenticated,

    /**
     * 사용자 이메일
     */
    userEmail: (state) => state.user?.email || '',

    /**
     * 사용자 프로필 이미지 URL
     */
    userProfileImage: (state) => state.user?.profileImageUrl || null,

    /**
     * 사용자 Role (USER/OWNER)
     */
    userRole: (state) => state.user?.role || null,

    /**
     * 점주(OWNER) 여부
     */
    isOwner: (state) => state.user?.role === 'OWNER',

    /**
     * 서비스 등록 완료 여부
     * GUEST가 아닌 경우(USER 또는 OWNER) 등록 완료로 판단
     */
    isRegistered: (state) => state.user?.role && state.user.role !== 'GUEST',

    /**
     * 닉네임 등록 여부
     */
    hasNickname: (state) => Boolean(state.user?.nickname),
  },

  actions: {
    /**
     * 사용자 정보 조회
     * 로그인 후 또는 페이지 새로고침 시 호출하여 사용자 정보를 가져옵니다.
     */
    async fetchUser() {
      this.isLoading = true
      console.group('[AuthStore] fetchUser 호출')
      console.log('🔹 로딩 시작')
      try {
        const userData = await getUserInfo()
        this.user = userData
        this.isAuthenticated = true
        console.log('✅ 사용자 정보 조회 성공:')
        console.log('   - ID:', userData.userId)
        console.log('   - 이름:', userData.name)
        console.log('   - 닉네임:', userData.nickname)
        console.log('   - 이메일:', userData.email)
        console.log('   - 프로필 이미지:', userData.profileImageUrl)
        console.log('   - 역할:', userData.role)
        console.groupEnd()
        return userData
      } catch (error) {
        console.error('❌ 사용자 정보 조회 실패:', error)
        console.groupEnd()
        // 인증 실패 시 상태 초기화
        this.clearUser()
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 로그아웃
     * 서버에 로그아웃 요청 후 로컬 상태를 초기화합니다.
     */
    async logout() {
      console.group('[AuthStore] logout 호출')
      try {
        await logoutApi()
        console.log('✅ 로그아웃 API 성공')
      } catch (error) {
        console.error('❌ 로그아웃 API 실패:', error)
        // API 실패해도 로컬 상태는 초기화
      } finally {
        this.clearUser()
        console.log('🔹 사용자 상태 초기화 완료')
        console.groupEnd()
      }
    },

    /**
     * 사용자 상태 초기화
     * 로그아웃 또는 인증 실패 시 호출됩니다.
     */
    clearUser() {
      console.log('[AuthStore] clearUser 호출 - 사용자 상태 초기화')
      this.user = null
      this.isAuthenticated = false
      // 액세스 토큰도 함께 제거
      try {
        removeAccessToken()
        console.log('🔹 액세스 토큰 제거 완료')
      } catch {
        console.warn('[인증] 토큰 삭제 실패')
      }
    },

    /**
     * 사용자 정보 업데이트
     * @param {Object} userData - 업데이트할 사용자 정보
     */
    updateUser(userData) {
      if (this.user) {
        console.group('[AuthStore] updateUser 호출')
        console.log('🔹 기존 정보:', this.user)
        console.log('🔹 업데이트 정보:', userData)
        this.user = { ...this.user, ...userData }
        console.log('🔹 업데이트 후:', this.user)
        console.groupEnd()
      }
    },
  },

  // LocalStorage에 자동 저장 (안전한 스토리지 어댑터 사용)
  persist: {
    key: 'comeet-auth',
    storage: safeStorage,
    paths: ['user', 'isAuthenticated'], // user, isAuthenticated만 저장
  },
})
