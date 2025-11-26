<template>
  <div class="app-shell">
    <BaseHeader v-if="showHeader" />
    <main class="app-main" :class="{ 'no-header': !showHeader }">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import BaseHeader from './components/BaseHeader.vue';

const route = useRoute();

// 헤더를 숨길 페이지 목록
const pagesWithoutHeader = ['login', 'nickname'];

const showHeader = computed(() => {
  return !pagesWithoutHeader.includes(route.name);
});
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f6f8fb;
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
}

.app-main.no-header {
  padding: 0;
  max-width: 100%;
}
</style>

