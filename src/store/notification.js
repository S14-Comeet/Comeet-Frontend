import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/storage'
import { createLogger } from '@/utils/logger'

const logger = createLogger('NotificationStore')

/**
 * 알림 상태 관리 Store
 * 사용자의 알림 목록을 관리하고 LocalStorage에 자동 persist
 */
export const useNotificationStore = defineStore('notification', {
  state: () => ({
    /** 알림 목록 */
    notifications: [],
    /** 로딩 상태 */
    isLoading: false,
  }),

  getters: {
    /** 읽지 않은 알림 개수 */
    unreadCount: (state) => state.notifications.filter(n => !n.isRead).length,
    /** 읽지 않은 알림 존재 여부 */
    hasUnread: (state) => state.notifications.some(n => !n.isRead),
    /** 읽지 않은 알림 목록 */
    unreadNotifications: (state) => state.notifications.filter(n => !n.isRead),
    /** 읽은 알림 목록 */
    readNotifications: (state) => state.notifications.filter(n => n.isRead),
    /** 최신순 정렬된 알림 */
    sortedNotifications: (state) => {
      return [...state.notifications].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    },
    /** 전체 알림 개수 */
    totalCount: (state) => state.notifications.length,
  },

  actions: {
    /**
     * 알림 목록 조회
     * TODO: 실제 API 연동 필요
     */
    async fetchNotifications() {
      this.isLoading = true
      try {
        // TODO: 실제 API 호출로 교체
        await new Promise(resolve => setTimeout(resolve, 300))
        return this.notifications
      } catch (error) {
        logger.error('알림 목록 조회 실패', error)
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
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.isRead = true
        // TODO: 실제 API 호출로 교체
      }
    },

    /**
     * 모든 알림 읽음 처리
     */
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.isRead = true
      })
      // TODO: 실제 API 호출로 교체
    },

    /**
     * 개별 알림 삭제
     * @param {string|number} notificationId - 알림 ID
     */
    deleteNotification(notificationId) {
      const index = this.notifications.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        this.notifications.splice(index, 1)
        // TODO: 실제 API 호출로 교체
      }
    },

    /**
     * 모든 알림 삭제
     */
    deleteAllNotifications() {
      this.notifications = []
      // TODO: 실제 API 호출로 교체
    },

    /**
     * 알림 추가 (실시간 알림용)
     * @param {Object} notification - 추가할 알림 객체
     */
    addNotification(notification) {
      const newNotification = {
        id: Date.now(),
        isRead: false,
        createdAt: new Date().toISOString(),
        ...notification
      }
      this.notifications.unshift(newNotification)
    },

    /**
     * Mock 알림 데이터 생성 (개발용)
     */
    generateMockNotifications() {
      const mockNotifications = [
        {
          id: 1,
          type: 'bookmark',
          title: '새로운 북마크',
          message: '카페 라떼님이 스타벅스 강남역점을 북마크했습니다.',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          link: '/saved'
        },
        {
          id: 2,
          type: 'review',
          title: '새로운 리뷰',
          message: '내가 저장한 가게에 새 리뷰가 등록되었습니다.',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          link: '/map'
        },
        {
          id: 3,
          type: 'system',
          title: '시스템 공지',
          message: 'Comeet 서비스가 업데이트되었습니다.',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        }
      ]
      this.notifications = mockNotifications
    },
  },

  persist: {
    key: 'comeet-notifications',
    storage: safeStorage,
    paths: ['notifications'],
  },
})
