import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/storage'

/**
 * 알림 상태 관리 Store
 *
 * 사용자의 알림 목록을 관리하고
 * LocalStorage에 자동으로 persist 합니다.
 */
export const useNotificationStore = defineStore('notification', {
  state: () => ({
    /**
     * 알림 목록
     * @type {Array<{
     *   id: string|number,
     *   type: 'bookmark'|'review'|'system'|'event',
     *   title: string,
     *   message: string,
     *   isRead: boolean,
     *   createdAt: string,
     *   link?: string
     * }>}
     */
    notifications: [],

    /**
     * 로딩 상태
     * @type {boolean}
     */
    isLoading: false,
  }),

  getters: {
    /**
     * 읽지 않은 알림 개수
     */
    unreadCount: (state) => {
      return state.notifications.filter(n => !n.isRead).length
    },

    /**
     * 읽지 않은 알림이 있는지
     */
    hasUnread: (state) => {
      return state.notifications.some(n => !n.isRead)
    },

    /**
     * 읽지 않은 알림 목록
     */
    unreadNotifications: (state) => {
      return state.notifications.filter(n => !n.isRead)
    },

    /**
     * 읽은 알림 목록
     */
    readNotifications: (state) => {
      return state.notifications.filter(n => n.isRead)
    },

    /**
     * 최신순으로 정렬된 모든 알림
     */
    sortedNotifications: (state) => {
      return [...state.notifications].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    },

    /**
     * 전체 알림 개수
     */
    totalCount: (state) => state.notifications.length,
  },

  actions: {
    /**
     * 알림 목록 조회 (Mock)
     * TODO: 실제 API 연동 시 api/notification.js 사용
     */
    async fetchNotifications() {
      this.isLoading = true
      console.log('[NotificationStore] fetchNotifications 호출')

      try {
        // TODO: 실제 API 호출로 교체
        // const response = await getNotifications()
        // this.notifications = response.data

        // Mock 데이터 (개발용)
        await new Promise(resolve => setTimeout(resolve, 300))

        console.log('✅ 알림 목록 조회 성공')
        return this.notifications
      } catch (error) {
        console.error('❌ 알림 목록 조회 실패:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 개별 알림 읽음 처리
     * @param {string|number} notificationId - 알림 ID
     */
    markAsRead(notificationId) {
      console.log('[NotificationStore] markAsRead 호출:', notificationId)

      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.isRead = true
        console.log('✅ 알림 읽음 처리 완료:', notificationId)

        // TODO: 실제 API 호출로 교체
        // await markNotificationAsRead(notificationId)
      }
    },

    /**
     * 모든 알림 읽음 처리
     */
    markAllAsRead() {
      console.log('[NotificationStore] markAllAsRead 호출')

      this.notifications.forEach(notification => {
        notification.isRead = true
      })

      console.log('✅ 모든 알림 읽음 처리 완료')

      // TODO: 실제 API 호출로 교체
      // await markAllNotificationsAsRead()
    },

    /**
     * 개별 알림 삭제
     * @param {string|number} notificationId - 알림 ID
     */
    deleteNotification(notificationId) {
      console.log('[NotificationStore] deleteNotification 호출:', notificationId)

      const index = this.notifications.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        this.notifications.splice(index, 1)
        console.log('✅ 알림 삭제 완료:', notificationId)

        // TODO: 실제 API 호출로 교체
        // await deleteNotification(notificationId)
      }
    },

    /**
     * 모든 알림 삭제
     */
    deleteAllNotifications() {
      console.log('[NotificationStore] deleteAllNotifications 호출')

      this.notifications = []
      console.log('✅ 모든 알림 삭제 완료')

      // TODO: 실제 API 호출로 교체
      // await deleteAllNotifications()
    },

    /**
     * 알림 추가 (실시간 알림용)
     * @param {Object} notification - 추가할 알림 객체
     */
    addNotification(notification) {
      console.log('[NotificationStore] addNotification 호출:', notification)

      const newNotification = {
        id: Date.now(), // 임시 ID (실제로는 서버에서 부여)
        isRead: false,
        createdAt: new Date().toISOString(),
        ...notification
      }

      this.notifications.unshift(newNotification)
      console.log('✅ 알림 추가 완료:', newNotification.id)
    },

    /**
     * Mock 알림 데이터 생성 (개발용)
     */
    generateMockNotifications() {
      console.log('[NotificationStore] generateMockNotifications 호출')

      const mockNotifications = [
        {
          id: 1,
          type: 'bookmark',
          title: '새로운 북마크',
          message: '카페 라떼님이 스타벅스 강남역점을 북마크했습니다.',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5분 전
          link: '/saved'
        },
        {
          id: 2,
          type: 'review',
          title: '새로운 리뷰',
          message: '커피러버님이 블루보틀 삼청점에 리뷰를 남겼습니다.',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
        },
        {
          id: 3,
          type: 'event',
          title: '이벤트 알림',
          message: '오늘의 추천 카페를 확인해보세요!',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
          link: '/map'
        },
        {
          id: 4,
          type: 'system',
          title: '시스템 공지',
          message: 'Comeet 서비스 점검이 완료되었습니다.',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
        },
      ]

      this.notifications = mockNotifications
      console.log('✅ Mock 알림 데이터 생성 완료:', mockNotifications.length, '개')
    },
  },

  // LocalStorage에 자동 저장 (안전한 스토리지 어댑터 사용)
  persist: {
    key: 'comeet-notifications',
    storage: safeStorage,
    paths: ['notifications'], // notifications만 저장
  },
})
