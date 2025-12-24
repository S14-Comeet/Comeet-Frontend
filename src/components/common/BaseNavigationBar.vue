<template>
  <nav class="nav-container">
    <div class="nav-content">
      <div class="w-full px-4 pb-safe">
        <div class="flex items-center justify-around h-16">
          <!-- 지도 -->
          <router-link to="/map" class="nav-item" :class="{ 'nav-item-active': isActive('/map') }">
            <component :is="getIcon('map')" class="nav-icon" />
            <span class="nav-label">지도</span>
          </router-link>

          <!-- 추천 -->
          <router-link to="/recommendation" class="nav-item" :class="{ 'nav-item-active': isActive('/recommendation') }">
            <component :is="getIcon('sparkle')" class="nav-icon" />
            <span class="nav-label">추천</span>
          </router-link>

          <!-- 여권 -->
          <router-link to="/passport" class="nav-item" :class="{ 'nav-item-active': isActive('/passport') }">
            <component :is="getIcon('passport')" class="nav-icon" />
            <span class="nav-label">여권</span>
          </router-link>

          <!-- 저장 -->
          <router-link to="/saved" class="nav-item" :class="{ 'nav-item-active': isActive('/saved') }">
            <component :is="getIcon('bookmark')" class="nav-icon" />
            <span class="nav-label">저장</span>
          </router-link>

          <!-- 마이 -->
          <router-link to="/profile" class="nav-item" :class="{ 'nav-item-active': isActive('/profile') }">
            <component :is="getIcon('user')" class="nav-icon" />
            <span class="nav-label">마이</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

// SVG 아이콘 임포트
import MapLineIcon from '@/assets/icons/map-line.svg?component'
import MapFillIcon from '@/assets/icons/map-fill.svg?component'
import SparkleLineIcon from '@/assets/icons/sparkle-line.svg?component'
import SparkleFillIcon from '@/assets/icons/sparkle-fill.svg?component'
import PassportLineIcon from '@/assets/icons/passport-line.svg?component'
import PassportFillIcon from '@/assets/icons/passport-fill.svg?component'
import BookmarkLineIcon from '@/assets/icons/bookmark-line.svg?component'
import BookmarkFillIcon from '@/assets/icons/bookmark-fill.svg?component'
import UserLineIcon from '@/assets/icons/user-line.svg?component'

const route = useRoute()

/**
 * 현재 라우트가 활성 상태인지 확인
 */
const isActive = (path) => {
  return route.path.startsWith(path)
}

/**
 * 라우트에 따라 적절한 아이콘 반환 (line/fill)
 */
const getIcon = (type) => {
  const icons = {
    map: isActive('/map') ? MapFillIcon : MapLineIcon,
    sparkle: isActive('/recommendation') ? SparkleFillIcon : SparkleLineIcon,
    passport: isActive('/passport') ? PassportFillIcon : PassportLineIcon,
    bookmark: isActive('/saved') ? BookmarkFillIcon : BookmarkLineIcon,
    user: UserLineIcon, // user는 fill 버전이 없으므로 항상 line
  }
  return icons[type]
}
</script>

<style scoped>
/* 네비게이션 컨테이너 - 화면 하단 고정, 가로 중앙 정렬 */
.nav-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

/* 네비게이션 콘텐츠 - 실제 네비게이션 바 */
.nav-content {
  position: relative;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 -2px 8px rgba(99, 73, 54, 0.08);
  pointer-events: auto;
}

/* 데스크톱: app-shell과 동일하게 448px로 제한 */
@media (min-width: 768px) {
  .nav-content {
    max-width: 448px;
  }
}

/* 네비게이션 바 위 그라데이션 그림자 - 떠있는 효과 */
.nav-content::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.15), transparent);
  pointer-events: none;
}

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
  background-color: rgba(132, 97, 72, 0.08);
  /* Primary 600 8% opacity */
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
    background-color: rgba(164, 121, 91, 0.06);
    /* Primary 500 6% opacity */
  }

  .nav-item:hover .nav-icon {
    transform: scale(1.05);
  }
}

/* iOS Safe Area 대응 */
.pb-safe {
  padding-bottom: max(env(safe-area-inset-bottom), 0.5rem);
}
</style>
