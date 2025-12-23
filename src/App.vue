<template>
  <!-- 데스크톱 배경 -->
  <div class="min-h-screen bg-gray-100">
    <!-- 모바일 뷰 컨테이너 -->
    <div class="app-shell">
      <BaseHeader
        v-if="showHeader"
        :has-notifications="hasUnreadNotifications"
        :show-back-button="showBackButton"
        @notice-click="handleNoticeClick"
        @login="handleLogin"
      />
      <main class="app-main" :class="{ 'no-header': !showHeader, 'with-nav': showNavigation, 'full-screen': isFullScreenPage }">
        <RouterView />
      </main>
      <BaseNavigationBar v-if="showNavigation" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import BaseHeader from '@/components/common/BaseHeader.vue';
import BaseNavigationBar from '@/components/common/BaseNavigationBar.vue';
import { useNotificationStore } from '@/store/notification';

const route = useRoute();
const router = useRouter();
const notificationStore = useNotificationStore();

// 헤더를 숨길 페이지 목록
const pagesWithoutHeader = new Set(['login', 'nickname', 'map', 'review-write', 'review-select', 'recommendation', 'bean-detail']);

// 네비게이션 바를 숨길 페이지 목록 (로그인, 닉네임, 설문, 리뷰 작성)
const pagesWithoutNavigation = new Set(['login', 'nickname', 'survey', 'review-write', 'review-select']);

const showHeader = computed(() => {
  return !pagesWithoutHeader.has(route.name);
});

const showNavigation = computed(() => {
  return !pagesWithoutNavigation.has(route.name);
});

// 전체 화면을 사용하는 페이지 목록 (지도 등)
const isFullScreenPage = computed(() => {
  return route.name === 'map';
});

// 뒤로가기 버튼을 표시할 페이지 목록
const pagesWithBackButton = new Set([
  'notifications', 'menu', 'store-detail', 'my-reviews',
  'owner-stores', 'owner-store-new', 'owner-store-edit',
  'owner-menus', 'owner-menu-new', 'owner-menu-edit'
]);
const showBackButton = computed(() => pagesWithBackButton.has(route.name));

// 읽지 않은 알림이 있는지
const hasUnreadNotifications = computed(() => notificationStore.hasUnread);

// 알림 아이콘 클릭 핸들러
const handleNoticeClick = () => {
  router.push('/notifications');
};

// 로그인 버튼 클릭 핸들러
const handleLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.app-shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: 100%;
}

/* 데스크톱: 중앙 정렬 + 최대 너비 + 그림자 */
@media (min-width: 768px) {
  .app-shell {
    max-width: 448px;
    margin: 0 auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
}

.app-main {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  background-color: var(--color-background);
}

.app-main.no-header {
  /* 헤더 없는 페이지도 동일한 스타일 유지 */
}

/* 전체 화면 페이지 (지도 등) */
.app-main.full-screen {
  padding: 0;
  max-width: 100%;
  margin: 0;
  overflow: hidden;
}

/* 지도 페이지용 app-shell 수정 */
.app-shell:has(.app-main.full-screen) {
  height: 100vh;
  overflow: hidden;
}

/* 네비게이션 바가 있을 때 하단 패딩 추가 (64px = h-16) */
.app-main.with-nav {
  padding-bottom: 64px;
}

/* 전체 화면 + 네비게이션 바: 패딩 없음 (NavigationBar가 absolute이므로) */
.app-main.full-screen.with-nav {
  padding-bottom: 0;
}

/* 모바일에서 네비게이션 바 표시 시 패딩 조정 */
@media (max-width: 640px) {
  .app-main.with-nav {
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }

  .app-main.full-screen.with-nav {
    padding: 0;
  }
}
</style>

