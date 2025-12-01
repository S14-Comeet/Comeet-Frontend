import { defineStore } from 'pinia'
import { getUserInfo, logout as logoutApi } from '@/api/auth'

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
     * @type {Object|null}
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
     * 사용자 Role
     */
    userRole: (state) => state.user?.role || null,
  },

  actions: {
    /**
     * 사용자 정보 조회
     * 로그인 후 또는 페이지 새로고침 시 호출하여 사용자 정보를 가져옵니다.
     */
    async fetchUser() {
      this.isLoading = true
      try {
        const userData = await getUserInfo()
        this.user = userData
        this.isAuthenticated = true
        return userData
      } catch (error) {
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
      try {
        await logoutApi()
      } catch (error) {
        console.error('Logout API failed', error)
        // API 실패해도 로컬 상태는 초기화
      } finally {
        this.clearUser()
      }
    },

    /**
     * 사용자 상태 초기화
     * 로그아웃 또는 인증 실패 시 호출됩니다.
     */
    clearUser() {
      this.user = null
      this.isAuthenticated = false
    },

    /**
     * 사용자 정보 업데이트
     * @param {Object} userData - 업데이트할 사용자 정보
     */
    updateUser(userData) {
      if (this.user) {
        this.user = { ...this.user, ...userData }
      }
    },
  },

  // LocalStorage에 자동 저장
  persist: {
    key: 'comeet-auth',
    storage: localStorage,
    paths: ['user', 'isAuthenticated'], // user, isAuthenticated만 저장
  },
})
