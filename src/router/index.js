import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import NicknameRegistrationView from '@/views/NicknameRegistrationView.vue';
import { getAccessToken, removeAccessToken } from '@/utils/storage';
import { createLogger } from '@/utils/logger';

const logger = createLogger('Router');

const routes = [
  {
    path: '/',
    redirect: '/map',
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/views/MapView.vue'),
  },
  {
    path: '/saved',
    name: 'saved',
    component: () => import('@/views/SavedView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/views/NotificationView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/nickname',
    name: 'nickname',
    component: NicknameRegistrationView
  },
  {
    path: '/test-components',
    name: 'test-components',
    component: () => import('@/views/ComponentTestView.vue')
  },
  {
    path: '/oauth/callback',
    name: 'oauth-callback',
    component: () => import('@/views/OAuthCallbackView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

/** 공개 페이지 목록 (인증 불필요) */
const PUBLIC_PAGES = new Set(['/login', '/oauth/callback', '/test-components', '/map', '/saved', '/notifications']);

/**
 * 토큰으로 사용자 인증 시도
 */
const tryAuthWithToken = async (authStore, targetPath) => {
  let accessToken = null;

  try {
    accessToken = getAccessToken();
  } catch {
    return { success: false, redirect: '/login' };
  }

  if (!accessToken) {
    return { success: false, redirect: '/login' };
  }

  try {
    await authStore.fetchUser();

    // 닉네임이 없으면 닉네임 등록 페이지로
    if (!authStore.user?.nickName && targetPath !== '/nickname') {
      return { success: true, redirect: '/nickname' };
    }
    return { success: true };
  } catch {
    try {
      removeAccessToken();
    } catch {
      // storage 접근 불가 무시
    }
    return { success: false, redirect: '/login' };
  }
};

/**
 * 닉네임 등록이 필요한지 확인
 */
const needsNicknameRegistration = (authStore, targetPath) => {
  return authStore.isAuthenticated &&
    authStore.user?.role === 'GUEST' &&
    targetPath !== '/nickname';
};

/**
 * 공개 페이지 여부 확인
 */
const isPublicPage = (path) => PUBLIC_PAGES.has(path);

/**
 * 비인증 사용자 라우팅 처리
 */
const handleUnauthenticatedUser = async (authStore, targetPath) => {
  const result = await tryAuthWithToken(authStore, targetPath);
  return result.redirect ?? null;
};

/**
 * 인증된 사용자 라우팅 처리
 */
const handleAuthenticatedUser = (authStore, targetPath) => {
  if (!authStore.isAuthenticated) {
    return null;
  }

  if (targetPath === '/login') {
    return '/';
  }
  if (needsNicknameRegistration(authStore, targetPath)) {
    return '/nickname';
  }
  return null;
};

/**
 * 네비게이션 가드 설정
 */
router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import('@/store/auth');
  const authStore = useAuthStore();

  logger.debug(`네비게이션: ${from.path} → ${to.path}`);

  // 공개 페이지는 바로 통과
  if (isPublicPage(to.path)) {
    // 인증된 사용자가 로그인 페이지 접근 시 메인으로 리다이렉트
    if (to.path === '/login' && authStore.isAuthenticated) {
      logger.info('인증된 사용자 로그인 페이지 접근 → 메인으로 리다이렉트');
      next('/');
      return;
    }
    next();
    return;
  }

  // 인증되지 않은 사용자
  if (!authStore.isAuthenticated) {
    const redirect = await handleUnauthenticatedUser(authStore, to.path);
    if (redirect) {
      logger.info(`인증 필요 → ${redirect}로 리다이렉트`);
      next(redirect);
      return;
    }
  }

  // 인증된 사용자
  const redirect = handleAuthenticatedUser(authStore, to.path);
  if (redirect) {
    logger.info(`추가 등록 필요 → ${redirect}로 리다이렉트`);
    next(redirect);
    return;
  }

  next();
});

export default router;
