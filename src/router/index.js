import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import NicknameRegistrationView from '../views/NicknameRegistrationView.vue';

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
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/ProfileView.vue'),
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
        path: '/survey',
        name: 'survey',
        component: () => import('@/views/SurveyView.vue'),
    }

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;

