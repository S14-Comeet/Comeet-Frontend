<template>
  <nav class="absolute bottom-0 left-0 right-0 bg-white shadow-nav z-[9999]">
    <div class="max-w-screen-sm mx-auto px-4 pb-safe">
      <div class="flex items-center justify-around h-16 border-t border-border">
        <!-- 홈 -->
        <router-link
          to="/"
          class="nav-item"
          :class="{ 'nav-item-active': isActive('/') }"
        >
          <component :is="getIcon('home')" class="nav-icon" />
          <span class="nav-label">홈</span>
        </router-link>

        <!-- 지도 -->
        <router-link
          to="/map"
          class="nav-item"
          :class="{ 'nav-item-active': isActive('/map') }"
        >
          <component :is="getIcon('map')" class="nav-icon" />
          <span class="nav-label">지도</span>
        </router-link>

        <!-- 저장 -->
        <router-link
          to="/saved"
          class="nav-item"
          :class="{ 'nav-item-active': isActive('/saved') }"
        >
          <component :is="getIcon('bookmark')" class="nav-icon" />
          <span class="nav-label">저장</span>
        </router-link>

        <!-- 마이 -->
        <router-link
          to="/profile"
          class="nav-item"
          :class="{ 'nav-item-active': isActive('/profile') }"
        >
          <component :is="getIcon('user')" class="nav-icon" />
          <span class="nav-label">마이</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

// SVG 아이콘 임포트
import HomeLineIcon from '@/assets/icons/home-line.svg?component'
import HomeFillIcon from '@/assets/icons/home-fill.svg?component'
import MapLineIcon from '@/assets/icons/map-line.svg?component'
import MapFillIcon from '@/assets/icons/map-fill.svg?component'
import BookmarkLineIcon from '@/assets/icons/bookmark-line.svg?component'
import BookmarkFillIcon from '@/assets/icons/bookmark-fill.svg?component'
import UserLineIcon from '@/assets/icons/user-line.svg?component'

const route = useRoute()

/**
 * 현재 라우트가 활성 상태인지 확인
 */
const isActive = (path) => {
  if (path === '/') {
    return route.path === '/' || route.path === '/home'
  }
  return route.path.startsWith(path)
}

/**
 * 라우트에 따라 적절한 아이콘 반환 (line/fill)
 */
const getIcon = (type) => {
  const icons = {
    home: isActive('/') ? HomeFillIcon : HomeLineIcon,
    map: isActive('/map') ? MapFillIcon : MapLineIcon,
    bookmark: isActive('/saved') ? BookmarkFillIcon : BookmarkLineIcon,
    user: UserLineIcon, // user는 fill 버전이 없으므로 항상 line
  }
  return icons[type]
}
</script>

<style scoped>
/* 네비게이션 아이템 기본 스타일 */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  color: var(--color-textSecondary);
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 60px;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  position: relative;
}

/* 네비게이션 아이콘 */
.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* 네비게이션 라벨 */
.nav-label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}

/* 활성 상태 */
.nav-item-active {
  color: var(--color-primary);
  background-color: rgba(132, 97, 72, 0.08); /* Primary 600 8% opacity */
}

.nav-item-active .nav-icon {
  transform: scale(1.1);
}

.nav-item-active .nav-label {
  font-weight: 600;
}

/* 호버 상태 (데스크톱) */
@media (hover: hover) {
  .nav-item:hover {
        color: var(--color-primary);
    background-color: rgba(164, 121, 91, 0.06); /* Primary 500 6% opacity */
  }

  .nav-item:hover .nav-icon {
    transform: scale(1.05);
  }
}

/* 상단 그림자 (네비게이션바) */
nav {
  box-shadow: 0 -2px 8px rgba(99, 73, 54, 0.08); /* Primary 700 8% opacity */
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.95);
}

/* iOS Safe Area 대응 */
.pb-safe {
  padding-bottom: max(env(safe-area-inset-bottom), 0.5rem);
}
</style>
