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
  },
  {
    path: '/menu/:storeId',
    name: 'menu',
    component: () => import('@/views/MenuView.vue')
  },
  {
    path: '/review/select',
    name: 'review-select',
    component: () => import('@/views/ReviewSelectView.vue')
  },
  {
    path: '/review/write',
    name: 'review-write',
    component: () => import('@/views/ReviewWriteView.vue')
  },
  {
    path: '/my-reviews',
    name: 'my-reviews',
    component: () => import('@/views/MyReviewsView.vue')
  },
  {
    path: '/store/:storeId',
    name: 'store-detail',
    component: () => import('@/views/StoreDetailView.vue')
  },
  // 커피여권 라우트
  {
    path: '/passport',
    name: 'passport',
    component: () => import('@/views/PassportView.vue')
  },
  {
    path: '/passport/:passportId',
    name: 'passport-detail',
    component: () => import('@/views/PassportDetailView.vue')
  },
  // 점주 전용 라우트
  {
    path: '/owner/stores',
    name: 'owner-stores',
    component: () => import('@/views/owner/OwnerStoreListView.vue'),
    meta: { requiresOwner: true }
  },
  {
    path: '/owner/stores/new',
    name: 'owner-store-new',
    component: () => import('@/views/owner/OwnerStoreFormView.vue'),
    meta: { requiresOwner: true }
  },
  {
    path: '/owner/stores/:storeId/edit',
    name: 'owner-store-edit',
    component: () => import('@/views/owner/OwnerStoreFormView.vue'),
    meta: { requiresOwner: true }
  },
  {
    path: '/owner/stores/:storeId/menus',
    name: 'owner-menus',
    component: () => import('@/views/owner/OwnerMenuManageView.vue'),
    meta: { requiresOwner: true }
  },
  {
    path: '/owner/stores/:storeId/menus/new',
    name: 'owner-menu-new',
    component: () => import('@/views/owner/OwnerMenuFormView.vue'),
    meta: { requiresOwner: true }
  },
  {
    path: '/owner/menus/:menuId/edit',
    name: 'owner-menu-edit',
    component: () => import('@/views/owner/OwnerMenuFormView.vue'),
    meta: { requiresOwner: true }
  },
  {
    path: '/owner/stores/:storeId/beans/new',
    name: 'owner-bean-new',
    component: () => import('@/views/owner/OwnerBeanFormView.vue'),
    meta: { requiresOwner: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

/** 공개 페이지 목록 (인증 불필요) */
const PUBLIC_PAGES = new Set(['/login', '/oauth/callback', '/test-components', '/map', '/saved', '/passport']);

/** 동적 경로 패턴 체크 함수 */
const PUBLIC_PATH_PATTERNS = [
  /^\/store\/\d+$/,  // /store/:storeId
  /^\/menu\/\d+$/    // /menu/:storeId
];

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
const isPublicPage = (path) => {
  if (PUBLIC_PAGES.has(path)) return true;
  return PUBLIC_PATH_PATTERNS.some(pattern => pattern.test(path));
};

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

  // ============================================================
  // 1단계: 공개 페이지 처리 (/map, /saved, /notifications 등)
  // - 비로그인 사용자: 접근 허용 (페이지 내부에서 로그인 유도)
  // - GUEST 사용자: 닉네임 설정 페이지로 강제 이동
  // - 정상 로그인 사용자: 접근 허용
  // ============================================================
  if (isPublicPage(to.path)) {
    // 인증된 사용자는 추가 검증 (로그인 페이지 리다이렉트, GUEST 체크)
    if (authStore.isAuthenticated) {
      const redirect = handleAuthenticatedUser(authStore, to.path);
      if (redirect) {
        logger.info(`인증된 사용자 공개 페이지 리다이렉트 → ${redirect}`);
        next(redirect);
        return;
      }
    }

    // 비인증 사용자는 접근 허용
    next();
    return;
  }

  // ============================================================
  // 2단계: 비공개 페이지 처리 (/home, /profile 등)
  // - 비로그인 사용자: 토큰으로 재인증 시도 → 실패 시 로그인 페이지로
  // - GUEST 사용자: 닉네임 설정 페이지로 강제 이동
  // - 정상 로그인 사용자: 접근 허용
  // ============================================================

  // 비인증 상태: 토큰으로 재인증 시도 (페이지 새로고침 등의 경우)
  if (!authStore.isAuthenticated) {
    const redirect = await handleUnauthenticatedUser(authStore, to.path);
    if (redirect) {
      logger.info(`비인증 사용자 비공개 페이지 접근 → ${redirect}로 리다이렉트`);
      next(redirect);
      return;
    }
  }

  // 인증 완료 후 추가 검증 (GUEST 체크 등)
  const redirect = handleAuthenticatedUser(authStore, to.path);
  if (redirect) {
    logger.info(`인증된 사용자 추가 검증 → ${redirect}로 리다이렉트`);
    next(redirect);
    return;
  }

  // ============================================================
  // 3단계: 점주 전용 페이지 권한 체크
  // ============================================================
  if (to.meta?.requiresOwner && !authStore.isOwner) {
    logger.warn('점주 권한 없음 - 접근 거부', { path: to.path })
    next('/')
    return
  }

  // 모든 검증 통과: 접근 허용
  next();
});

export default router;