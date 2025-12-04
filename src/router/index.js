import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import NicknameRegistrationView from '@/views/NicknameRegistrationView.vue';
import {getAccessToken, removeAccessToken} from '@/utils/storage';

const routes = [
    {
        path: '/',
        redirect: '/map', // 🗺️ 메인 페이지를 지도로 변경
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
 * @returns {Promise<{success: boolean, redirect?: string}>}
 */
const tryAuthWithToken = async (authStore, targetPath) => {
    let accessToken = null;

    console.group('[라우터] tryAuthWithToken 실행')
    console.log('🔹 타겟 경로:', targetPath)

    try {
        accessToken = getAccessToken();
        console.log('🔹 액세스 토큰:', accessToken ? accessToken.substring(0, 20) + '...' : 'null')
    } catch {
        // storage 접근 불가 시 로그인 페이지로
        console.log('❌ 스토리지 접근 불가')
        console.groupEnd()
        return {success: false, redirect: '/login'};
    }

    if (!accessToken) {
        console.log('❌ 액세스 토큰 없음 → 로그인 페이지로')
        console.groupEnd()
        return {success: false, redirect: '/login'};
    }

    try {
        console.log('🔹 fetchUser() 호출 중...')
        await authStore.fetchUser();
        console.log('✅ fetchUser() 성공')
        console.log('🔹 인증 상태:', authStore.isAuthenticated)
        console.log('🔹 사용자:', authStore.user)

        // 닉네임이 없으면 닉네임 등록 페이지로
        if (!authStore.user?.nickName && targetPath !== '/nickname') {
            console.log('⚠️ 닉네임 없음 → 닉네임 등록 페이지로')
            console.groupEnd()
            return {success: true, redirect: '/nickname'};
        }
        console.log('✅ 인증 성공, 리다이렉트 없음')
        console.groupEnd()
        return {success: true};
    } catch (error) {
        console.error('❌ fetchUser() 실패:', error)
        try {
            removeAccessToken();
            console.log('🔹 토큰 제거됨')
        } catch {
            // storage 접근 불가 무시
        }
        console.groupEnd()
        return {success: false, redirect: '/login'};
    }
};

/**
 * 닉네임 등록이 필요한지 확인
 */
const needsNicknameRegistration = (authStore, targetPath) => {
    return authStore.isAuthenticated &&
        !authStore.user?.nickName &&
        targetPath !== '/nickname';
};

/**
 * 인증이 필요 없는 공개 페이지인지 확인
 */
const isPublicPage = (path) => PUBLIC_PAGES.has(path);

/**
 * 비인증 사용자의 라우팅 처리
 * @returns {string|null} 리다이렉트 경로 또는 null (통과)
 */
const handleUnauthenticatedUser = async (authStore, targetPath) => {
    const result = await tryAuthWithToken(authStore, targetPath);
    return result.redirect ?? null;
};

/**
 * 인증된 사용자의 라우팅 처리
 * @returns {string|null} 리다이렉트 경로 또는 null (통과)
 */
const handleAuthenticatedUser = (authStore, targetPath) => {
    // 인증되지 않은 경우 처리하지 않음
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
 * 사용자 정보 로깅 (디버깅용)
 */
const logUserInfo = (authStore, routePath) => {
    console.group('[라우터] 페이지 이동 - User 정보')
    console.log('🔹 이동 경로:', routePath)
    console.log('🔹 인증 상태:', authStore.isAuthenticated)
    console.log('🔹 로딩 중:', authStore.isLoading)
    if (authStore.isAuthenticated && authStore.user) {
        console.log('🔹 사용자 정보:')
        console.log('   - ID:', authStore.userId)
        console.log('   - 이름:', authStore.userName)
        console.log('   - 닉네임:', authStore.userNickname)
        console.log('   - 이메일:', authStore.userEmail)
        console.log('   - 프로필 이미지:', authStore.userProfileImage)
        console.log('   - 역할:', authStore.userRole)
        console.log('   - 점주 여부:', authStore.isOwner)
        console.log('   - 닉네임 등록 여부:', authStore.hasNickname)
    } else {
        console.log('🔹 사용자 정보: 비로그인 상태 (Guest)')
    }
    console.groupEnd()
}

// 네비게이션 가드 - 인증 체크
router.beforeEach(async (to, from, next) => {
    console.group('[라우터 가드] 네비게이션')
    console.log('🔹 From:', from.path)
    console.log('🔹 To:', to.path)

    try {
        const {useAuthStore} = await import('@/store/auth');
        const authStore = useAuthStore();

        // 사용자 정보 로깅
        logUserInfo(authStore, to.path)

        const isPublic = isPublicPage(to.path)
        console.log('🔹 공개 페이지 여부:', isPublic)
        console.log('🔹 현재 인증 상태:', authStore.isAuthenticated)

        // 비인증 상태에서 보호된 페이지 접근 시
        if (!isPublic && !authStore.isAuthenticated) {
            console.log('⚠️ 비인증 상태로 보호된 페이지 접근 → 토큰으로 인증 시도')
            const redirect = await handleUnauthenticatedUser(authStore, to.path);
            console.log('🔹 handleUnauthenticatedUser 결과:', redirect)
            console.groupEnd()
            return redirect ? next(redirect) : next();
        }

        // 인증 상태에서의 라우팅 처리
        const redirect = handleAuthenticatedUser(authStore, to.path);
        console.log('🔹 handleAuthenticatedUser 결과:', redirect)
        console.groupEnd()
        return redirect ? next(redirect) : next();
    } catch (error) {
        console.error('[라우터] 네비게이션 가드 오류:', error);
        console.groupEnd()
        // 오류 발생 시 로그인 페이지로 이동
        if (to.path !== '/login') {
            return next('/login');
        }
        return next();
    }
});

export default router;
