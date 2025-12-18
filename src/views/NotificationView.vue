<template>
  <div class="notification-view">
      <!-- 헤더 -->
      <div class="notification-header">
        <h1 class="text-xl font-bold text-textPrimary">알림</h1>
        <div class="flex gap-2">
          <button
            v-if="notifications.length > 0"
            class="text-sm text-primary hover:text-primary-700 font-medium transition-colors"
            @click="handleMarkAllAsRead"
          >
            모두 읽음
          </button>
          <button
            v-if="notifications.length > 0"
            class="text-sm text-textSecondary hover:text-error font-medium transition-colors"
            @click="showDeleteAllModal = true"
          >
            모두 지우기
          </button>
        </div>
      </div>

      <!-- 알림 목록 -->
      <div class="notification-list">
      <!-- 읽지 않은 알림 -->
      <template v-if="unreadNotifications.length > 0">
        <div class="notification-section">
          <h2 class="section-title">새 알림</h2>
          <div
            v-for="notification in unreadNotifications"
            :key="notification.id"
            class="notification-item unread"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-icon">
              <BaseIcon
                :name="getNotificationIcon(notification.type)"
                :size="24"
                :color="getNotificationColor(notification.type)"
              />
            </div>
            <div class="notification-content">
              <div class="notification-header-row">
                <h3 class="notification-title">{{ notification.title }}</h3>
                <span class="unread-dot"></span>
              </div>
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
            </div>
            <button
              class="delete-button"
              aria-label="삭제"
              @click.stop="handleDeleteNotification(notification.id)"
            >
              <BaseIcon name="x" :size="20" color="var(--color-textSecondary)" />
            </button>
          </div>
        </div>
      </template>

      <!-- 읽은 알림 -->
      <template v-if="readNotifications.length > 0">
        <div class="notification-section">
          <h2 class="section-title">이전 알림</h2>
          <div
            v-for="notification in readNotifications"
            :key="notification.id"
            class="notification-item read"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-icon">
              <BaseIcon
                :name="getNotificationIcon(notification.type)"
                :size="24"
                :color="getNotificationColor(notification.type)"
              />
            </div>
            <div class="notification-content">
              <h3 class="notification-title">{{ notification.title }}</h3>
              <p class="notification-message">{{ notification.message }}</p>
              <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
            </div>
            <button
              class="delete-button"
              aria-label="삭제"
              @click.stop="handleDeleteNotification(notification.id)"
            >
              <BaseIcon name="x" :size="20" color="var(--color-textSecondary)" />
            </button>
          </div>
        </div>
      </template>

        <!-- 빈 상태 -->
        <div v-if="notifications.length === 0" class="empty-state">
          <BaseIcon name="notice" :size="64" color="var(--color-textDisabled)" />
          <p class="empty-text">알림이 없습니다</p>
        </div>
      </div>

      <!-- 모두 지우기 확인 모달 -->
      <div
        v-if="showDeleteAllModal"
        class="modal-overlay"
        @click="showDeleteAllModal = false"
      >
        <div class="modal-content" @click.stop>
          <h3 class="modal-title">모든 알림을 삭제하시겠습니까?</h3>
          <p class="modal-description">삭제된 알림은 복구할 수 없습니다.</p>
          <div class="modal-buttons">
            <BaseButton
              variant="secondary"
              size="medium"
              label="취소"
              @click="showDeleteAllModal = false"
            />
            <BaseButton
              variant="primary"
              size="medium"
              label="삭제"
              @click="handleDeleteAll"
            />
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/store/notification'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const notificationStore = useNotificationStore()

const showDeleteAllModal = ref(false)

// Computed
const notifications = computed(() => notificationStore.sortedNotifications)
const unreadNotifications = computed(() => notificationStore.unreadNotifications)
const readNotifications = computed(() => notificationStore.readNotifications)

// 알림 타입별 아이콘 반환
const getNotificationIcon = (type) => {
  const icons = {
    bookmark: 'bookmark-fill',
    review: 'user-line',
    event: 'notice',
    system: 'notice'
  }
  return icons[type] || 'notice'
}

// 알림 타입별 색상 반환
const getNotificationColor = (type) => {
  const colors = {
    bookmark: 'var(--color-primary)',
    review: 'var(--color-primary-700)',
    event: 'var(--color-accent)',
    system: 'var(--color-textSecondary)'
  }
  return colors[type] || 'var(--color-textSecondary)'
}

// 시간 포맷팅 (상대 시간)
const formatTime = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return '방금 전'
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}분 전`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}시간 전`
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)}일 전`
  } else {
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
  }
}

// 알림 클릭 핸들러
const handleNotificationClick = (notification) => {
  // 읽음 처리
  if (!notification.isRead) {
    notificationStore.markAsRead(notification.id)
  }

  // 링크가 있으면 이동
  if (notification.link) {
    router.push(notification.link)
  }
}

// 모두 읽음 처리
const handleMarkAllAsRead = () => {
  notificationStore.markAllAsRead()
}

// 개별 알림 삭제
const handleDeleteNotification = (notificationId) => {
  notificationStore.deleteNotification(notificationId)
}

// 모든 알림 삭제
const handleDeleteAll = () => {
  notificationStore.deleteAllNotifications()
  showDeleteAllModal.value = false
}

// 컴포넌트 마운트 시 Mock 데이터 생성 (개발용)
onMounted(() => {
  // Mock 데이터가 없으면 생성
  if (notificationStore.notifications.length === 0) {
    notificationStore.generateMockNotifications()
  }
})
</script>

<style scoped>
.notification-view {
  min-height: 100vh;
  background-color: var(--color-background);
  padding-bottom: 2rem;
}

/* 헤더 */
.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.25rem 1rem;
  background-color: white;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 알림 목록 */
.notification-list {
  padding: 0;
}

.notification-section {
  margin-bottom: 1.5rem;
}

.section-title {
  padding: 1rem 1.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-textSecondary);
  letter-spacing: 0.025em;
}

/* 알림 아이템 */
.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background-color: white;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 200ms ease;
  position: relative;
}

.notification-item:hover {
  background-color: var(--color-surface-light);
}

.notification-item:active {
  background-color: var(--color-primary-50);
}

/* 읽지 않은 알림 강조 */
.notification-item.unread {
  background-color: var(--color-primary-50);
}

.notification-item.unread:hover {
  background-color: var(--color-primary-100);
}

/* 읽은 알림 */
.notification-item.read {
  opacity: 0.75;
}

/* 알림 아이콘 */
.notification-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-light);
  border-radius: 50%;
}

/* 알림 콘텐츠 */
.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.notification-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-textPrimary);
  line-height: 1.4;
}

.unread-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--color-primary);
  border-radius: 50%;
  flex-shrink: 0;
}

.notification-message {
  font-size: 0.875rem;
  color: var(--color-textSecondary);
  line-height: 1.5;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--color-textDisabled);
}

/* 삭제 버튼 */
.delete-button {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 200ms ease;
  opacity: 0;
}

.notification-item:hover .delete-button {
  opacity: 1;
}

.delete-button:hover {
  background-color: var(--color-error-light);
}

.delete-button:active {
  background-color: var(--color-error);
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1.25rem;
  gap: 1rem;
}

.empty-text {
  font-size: 1rem;
  color: var(--color-textSecondary);
}

/* 모달 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin-bottom: 0.5rem;
}

.modal-description {
  font-size: 0.875rem;
  color: var(--color-textSecondary);
  margin-bottom: 1.5rem;
}

.modal-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* 모바일 최적화 */
@media (max-width: 640px) {
  .delete-button {
    opacity: 1; /* 모바일에서는 항상 표시 */
  }
}
</style>
