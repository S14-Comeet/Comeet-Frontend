<template>
  <div class="flex flex-col h-full bg-white">
    <BaseHeader show-back-button />

    <div class="flex-1 overflow-y-auto">
      <div class="px-5 py-6">
        <h1 class="text-2xl font-bold mb-2 text-neutral-900">리뷰 작성</h1>
        <p class="text-textSecondary mb-6">방문 인증 후 메뉴를 선택해주세요</p>

        <!-- Store Info & Visit Verification -->
        <div class="mb-6 p-4 bg-neutral-50 rounded-xl border border-border">
          <p class="text-sm text-textSecondary mb-1">방문한 카페</p>
          <div class="flex justify-between items-center mb-4">
            <p class="text-lg font-bold text-neutral-900">{{ cafeName }}</p>
            <div
              v-if="isVerified"
              class="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <BaseIcon name="check" :size="12" />
              인증됨
            </div>
          </div>

          <div v-if="!isVerified">
            <BaseButton
              label="방문 인증하기"
              size="medium"
              variant="primary"
              class="w-full"
              :loading="isVerifying"
              @click="handleVerifyVisit"
            />
            <p
              class="text-xs mt-2 text-center"
              :class="verificationStatus === 'error' ? 'text-error font-bold' : verificationStatus === 'success' ? 'text-primary font-bold' : 'text-textSecondary'"
            >
              {{ verificationMessage }}
            </p>
          </div>

          <div v-else class="text-sm text-primary-700 text-center font-medium">
            아래 메뉴를 선택하여 리뷰를 작성해주세요
          </div>
        </div>

        <!-- Menu List Section -->
        <section class="mb-6">
          <h2 class="text-lg font-bold mb-4 px-1">어떤 메뉴를 드셨나요?</h2>

          <div v-if="isLoadingMenus" class="p-8 text-center">
            <BaseIcon name="spinner" class="animate-spin text-primary mx-auto" :size="24" />
            <p class="text-sm text-textSecondary mt-2">메뉴를 불러오는 중...</p>
          </div>

          <div v-else-if="menus.length === 0" class="p-8 text-center text-textSecondary bg-neutral-50 rounded-xl">
            등록된 메뉴가 없습니다.
          </div>

          <div
            v-else
            class="menu-list-wrapper"
            :class="{ 'disabled-state': !isVerified }"
          >
            <div v-if="!isVerified" class="overlay-message">
              <BaseIcon name="lock" :size="24" class="mb-2 text-primary-400" />
              <p class="text-sm font-medium text-primary-600">방문 인증 후 메뉴를 선택할 수 있습니다</p>
            </div>
            <MenuList
              :menus="menus"
              @select-menu="handleMenuSelect"
            />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createLogger } from '@/utils/logger'
import BaseHeader from '@/components/common/BaseHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import MenuList from '@/components/MenuList.vue'
import { verifyVisit } from '@/api/visit'
import { getMenusByStoreId } from '@/api/menu'
import { showSuccess, showError, showWarning } from '@/utils/toast'
import { useGeolocation } from '@/composables/useGeolocation'

const logger = createLogger('ReviewSelectView')

const route = useRoute()
const router = useRouter()
const { location: geoLocation, error: geoError, requestLocation } = useGeolocation()

const storeId = route.query.storeId
const cafeName = ref(route.query.name || '카페')
const storeLat = parseFloat(route.query.lat) || null
const storeLng = parseFloat(route.query.lng) || null

// Visit Verification
const isVerified = ref(false)
const isVerifying = ref(false)
const visitId = ref(null)
const verificationMessage = ref('* 매장 근처(100m 이내)에서 인증이 가능합니다.')
const verificationStatus = ref('default') // 'default' | 'success' | 'error'

// Menu
const isLoadingMenus = ref(false)
const menus = ref([])

// Load menus on mount
onMounted(async () => {
  if (storeId) {
    await fetchMenus()
  }
})

const fetchMenus = async () => {
  isLoadingMenus.value = true
  try {
    const response = await getMenusByStoreId(storeId, { page: 1, size: 50 })
    const data = response?.data ?? response
    // 페이지네이션 응답 처리: content 필드 또는 배열 직접 반환
    menus.value = data?.content ?? (Array.isArray(data) ? data : [])
    logger.info(`메뉴 ${menus.value.length}개 로드 완료`)
  } catch {
    showError('메뉴 목록을 불러오지 못했습니다.')
  } finally {
    isLoadingMenus.value = false
  }
}

const handleVerifyVisit = async () => {
  if (!storeId) return

  isVerifying.value = true
  verificationStatus.value = 'default'
  verificationMessage.value = '위치 확인 중...'

  try {
    // 1. Check if store coordinates are available (passed via query params)
    if (!storeLat || !storeLng) {
      verificationMessage.value = '가게 위치 정보가 없습니다. 지도에서 다시 선택해주세요.'
      verificationStatus.value = 'error'
      isVerifying.value = false
      return
    }

    // 2. Request user's current location
    await requestLocation()

    if (geoError.value || !geoLocation.value) {
      verificationMessage.value = '위치 정보를 가져올 수 없습니다. GPS 설정을 확인해주세요.'
      verificationStatus.value = 'error'
      isVerifying.value = false
      return
    }

    const storeLoc = { latitude: storeLat, longitude: storeLng }
    const userLoc = { latitude: geoLocation.value.lat, longitude: geoLocation.value.lng }

    // Debug: 좌표 확인 로그
    logger.debug('방문 인증 시도', {
      store: { storeId, name: cafeName.value },
      storeLoc,
      userLoc
    })

    // 3. Call Verify API
    const result = await verifyVisit({
      menuId: 0, // menu not selected yet
      storeLocationDto: storeLoc,
      userLocationDto: userLoc
    })

    // 4. Handle response
    if (result && result.data) {
      const { visitId: newVisitId, isVerified: verified } = result.data
      visitId.value = newVisitId

      if (verified) {
        isVerified.value = true
        verificationMessage.value = '방문 인증 성공!'
        verificationStatus.value = 'success'
        showSuccess('방문이 인증되었습니다! 메뉴를 선택해주세요.')
      } else {
        verificationMessage.value = '인증 실패: 가게로부터 100m 이내에 있어야 합니다.'
        verificationStatus.value = 'error'
        showWarning('가게 근처(100m 이내)에서 다시 시도해주세요.')
      }
    } else {
      throw new Error('인증 응답을 받지 못했습니다.')
    }
  } catch (e) {
    verificationMessage.value = '방문 인증 요청 중 오류가 발생했습니다.'
    verificationStatus.value = 'error'
    showError(e.response?.data?.message || '방문 인증에 실패했습니다.')
    logger.error('방문 인증 실패', e)
  } finally {
    isVerifying.value = false
  }
}

const handleMenuSelect = (menu) => {
  if (!isVerified.value) {
    showWarning('먼저 방문 인증을 완료해주세요.')
    return
  }

  router.push({
    name: 'review-write',
    query: {
      storeId,
      name: cafeName.value,
      menuId: menu.id,
      menuName: menu.name,
      menuPrice: menu.price,
      visitId: visitId.value
    }
  })
}
</script>

<style scoped>
.menu-list-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.menu-list-wrapper.disabled-state {
  pointer-events: none;
}

.menu-list-wrapper.disabled-state :deep(.menu-list) {
  opacity: 0.4;
  filter: grayscale(30%);
}

.overlay-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  z-index: 10;
  border-radius: 12px;
}
</style>
