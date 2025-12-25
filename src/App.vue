<template>
  <div class="min-h-screen bg-gray-100">
    <div class="app-shell">
      <BaseHeader
        v-if="showHeader"
        :show-back-button="showBackButton"
        @login="handleLogin"
      />
      <main class="app-main" :class="{ 'no-header': !showHeader, 'with-nav': showNavigation, 'full-screen': isFullScreenPage }">
        <RouterView v-slot="{ Component }">
          <KeepAlive :include="keepAlivePages">
            <component :is="Component" :key="route.name" />
          </KeepAlive>
        </RouterView>
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

const keepAlivePages = ['MapView', 'RecommendationView', 'PassportView', 'SavedView', 'ProfileView'];

const route = useRoute();
const router = useRouter();

const pagesWithoutHeader = new Set(['login', 'nickname', 'map', 'review-write', 'preference-onboarding']);

const pagesWithoutNavigation = new Set(['login', 'nickname', 'survey', 'review-write', 'review-detail', 'review-edit', 'preference-onboarding']);

const showHeader = computed(() => {
  return !pagesWithoutHeader.has(route.name);
});

const showNavigation = computed(() => {
  return !pagesWithoutNavigation.has(route.name);
});

const isFullScreenPage = computed(() => {
  return route.name === 'map';
});

const pagesWithBackButton = new Set([
  'store-detail', 'my-reviews', 'review-detail', 'review-edit',
  'owner-stores', 'owner-store-new', 'owner-store-edit',
  'owner-menus', 'owner-menu-new', 'owner-menu-edit',
  'bean-detail', 'menu-detail', 'my-preference', 'my-profile-edit'
]);
const showBackButton = computed(() => pagesWithBackButton.has(route.name));

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

.app-main.full-screen {
  padding: 0;
  max-width: 100%;
  margin: 0;
  overflow: hidden;
}

.app-shell:has(.app-main.full-screen) {
  height: 100vh;
  overflow: hidden;
}

.app-main.with-nav {
  padding-bottom: 64px;
}

.app-main.full-screen.with-nav {
  padding-bottom: 0;
}

@media (max-width: 640px) {
  .app-main.with-nav {
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }

  .app-main.full-screen.with-nav {
    padding: 0;
  }
}
</style>

