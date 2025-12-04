<template>
  <!-- Outer wrapper: 데스크톱에서 회색 배경 -->
  <div class="min-h-screen bg-gray-100">
    <!-- Inner wrapper: 모바일 뷰 컨테이너 -->
    <div class="app-shell">
      <BaseHeader v-if="showHeader" />
      <main class="app-main" :class="{ 'no-header': !showHeader, 'with-nav': showNavigation, 'full-screen': isFullScreenPage }">
        <RouterView />
      </main>
      <BaseNavigationBar v-if="showNavigation" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import BaseHeader from '@/components/common/BaseHeader.vue';
import BaseNavigationBar from '@/components/common/BaseNavigationBar.vue';

const route = useRoute();

// 헤더를 숨길 페이지 목록
const pagesWithoutHeader = new Set(['login', 'nickname', 'map']);

// 네비게이션 바를 숨길 페이지 목록 (로그인, 닉네임, 설문)
const pagesWithoutNavigation = new Set(['login', 'nickname', 'survey']);

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

