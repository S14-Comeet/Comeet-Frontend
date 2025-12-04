import {createApp} from 'vue'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/main.css'

const app = createApp(App)

// Pinia with Persist Plugin
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// Toast Plugin
app.use(Toast, {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
    maxToasts: 3,
    newestOnTop: true,
})

// 앱 초기화 시 사용자 정보 복원
;(async () => {
    try {
        const {useAuthStore} = await import('@/store/auth')
        const {getAccessToken, removeAccessToken} = await import('@/utils/storage')
        const authStore = useAuthStore()

        // 안전한 스토리지 접근으로 액세스 토큰 확인
        const accessToken = getAccessToken()
        if (accessToken && authStore.isAuthenticated) {
            try {
                await authStore.fetchUser()
            } catch (error) {
                // 토큰이 유효하지 않으면 정리
                console.warn('[앱 초기화] 사용자 세션 복원 실패:', error)
                removeAccessToken()
                authStore.clearUser()
            }
        }
    } catch (error) {
        console.warn('[앱 초기화] 초기화 중 오류 발생:', error)
    }
})()

app.mount('#app')
