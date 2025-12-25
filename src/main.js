import {createApp} from 'vue'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/main.css'
import { createLogger } from '@/utils/logger'

const logger = createLogger('App')

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

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

;(async () => {
    try {
        const {useAuthStore} = await import('@/store/auth')
        const {getAccessToken, removeAccessToken} = await import('@/utils/storage')
        const authStore = useAuthStore()

        const accessToken = getAccessToken()
        if (accessToken && authStore.isAuthenticated) {
            try {
                await authStore.fetchUser()
            } catch (error) {
                logger.warn('사용자 세션 복원 실패', error)
                removeAccessToken()
                authStore.clearUser()
            }
        }
    } catch (error) {
        logger.warn('초기화 중 오류 발생', error)
    }
})()

app.mount('#app')
