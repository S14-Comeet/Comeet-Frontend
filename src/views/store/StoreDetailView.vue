<template>
  <div class="flex flex-col min-h-full bg-background">
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <BaseIcon name="spinner" :size="32" class="text-primary animate-spin" />
    </div>

    <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <BaseIcon name="x" :size="48" class="text-error mb-4" />
      <p class="text-textPrimary font-medium mb-2">정보를 불러올 수 없습니다</p>
      <p class="text-textSecondary text-sm mb-4">{{ error }}</p>
      <BaseButton label="다시 시도" variant="primary" @click="fetchStoreDetail" />
    </div>

    <div v-else-if="store" class="flex-1 overflow-y-auto" :class="selectedMenu ? 'pb-48' : 'pb-24'">
      <div class="store-hero">
        <div class="hero-image">
          <img
            v-if="hasValidThumbnail"
            :src="store.thumbnailUrl"
            :alt="store.name"
            class="w-full h-full object-cover"
            @error="imageError = true"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-primary-100">
            <BaseIcon name="bookmark-fill" :size="64" class="text-primary-300" />
          </div>
          <div v-if="store.isClosed" class="closed-banner">영업 종료</div>
        </div>
      </div>

      <div class="store-info-section">
        <RatingBadge :rating="store.averageRating" class="mb-2" />

        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <h1 class="text-xl font-bold text-textPrimary truncate">{{ store.name }}</h1>
            <div class="flex items-center gap-1 shrink-0">
              <BaseIcon name="star-fill" :size="16" class="text-accent" />
              <span class="text-sm font-semibold text-textPrimary">{{ formatRating(store.averageRating) }}</span>
            </div>
          </div>
          <button
            class="bookmark-btn"
            :class="{ 'is-bookmarked': isBookmarked }"
            @click="toggleBookmark"
          >
            <BaseIcon :name="isBookmarked ? 'bookmark-fill' : 'bookmark-line'" :size="20" />
          </button>
        </div>

        <div class="flex items-center gap-3 mt-2 flex-wrap">
          <span class="text-sm text-textSecondary">
            리뷰 <span class="font-semibold text-textPrimary">{{ store.reviewCount || 0 }}</span>
            <span class="mx-1">·</span>
            방문 <span class="font-semibold text-textPrimary">{{ store.visitCount || 0 }}</span>
          </span>
          <div class="flex items-center gap-1.5 flex-wrap">
            <BaseChip
              v-for="(cat, idx) in displayCategories"
              :key="idx"
              :label="cat"
              variant="primary"
              size="sm"
            />
            <span v-if="store.isClosed" class="closed-badge">영업종료</span>
          </div>
        </div>

        <div v-if="store.description" class="mt-3">
          <p
            class="text-textSecondary text-sm leading-relaxed"
            :class="{ 'line-clamp-3': !isDescriptionExpanded }"
          >
            {{ store.description }}
          </p>
          <button
            v-if="store.description.length > 100"
            class="text-primary text-sm font-medium mt-1"
            @click="isDescriptionExpanded = !isDescriptionExpanded"
          >
            {{ isDescriptionExpanded ? '접기' : '더보기' }}
          </button>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-list">
          <div class="detail-item" @click="copyAddress">
            <BaseIcon name="map-marker" :size="16" class="text-primary shrink-0" />
            <span class="detail-value">{{ store.address || '정보 없음' }}</span>
            <BaseIcon name="file-copy" :size="14" class="text-textSecondary shrink-0" />
          </div>

          
          <a
            v-if="store.phoneNumber"
            :href="`tel:${store.phoneNumber}`"
            class="detail-item"
          >
            <BaseIcon name="call" :size="16" class="text-primary shrink-0" />
            <span class="detail-value">{{ store.phoneNumber }}</span>
            <BaseIcon name="chevron-right" :size="14" class="text-textSecondary shrink-0" />
          </a>

          
          <div class="detail-item no-action">
            <BaseIcon name="time" :size="16" class="text-primary shrink-0" />
            <span class="detail-value">{{ formatBusinessHours(store.openTime, store.closeTime) }}</span>
          </div>
        </div>

        <button class="map-link" @click="showOnMap">
          <BaseIcon name="map-fill" :size="14" class="shrink-0" />
          <span>지도에서 보기</span>
        </button>
      </div>

      <div class="menu-section">
        <div class="section-header">
          <h2 class="section-title">메뉴 {{ menus.length }}개</h2>
          <button
            v-if="menus.length > 5"
            class="text-primary text-sm font-medium"
            @click="showAllMenus = !showAllMenus"
          >
            {{ showAllMenus ? '접기' : '전체 보기' }}
          </button>
        </div>

        <div v-if="isLoadingMenus" class="py-8 text-center">
          <BaseIcon name="spinner" :size="24" class="text-primary animate-spin" />
        </div>

        <div v-else-if="menus.length === 0" class="empty-menus">
          <p class="text-textSecondary text-sm">등록된 메뉴가 없습니다</p>
        </div>

        <MenuList
          v-else
          :menus="displayedMenus"
          :selected-menu-id="selectedMenu?.id"
          :disabled="isVerified"
          @select-menu="handleMenuSelect"
        />
      </div>

      <div class="reviews-section">
        <div class="section-header">
          <h2 class="section-title">리뷰 {{ reviews.length }}개</h2>
          <div class="flex items-center gap-2">
            <button
              v-if="reviews.length > 3"
              class="text-primary text-sm font-medium"
              @click="showAllReviews = !showAllReviews"
            >
              {{ showAllReviews ? '접기' : '전체 보기' }}
            </button>
          </div>
        </div>

        <div v-if="isLoadingReviews" class="py-8 text-center">
          <BaseIcon name="spinner" :size="24" class="text-primary animate-spin" />
        </div>

        <div v-else class="reviews-list">
          <div
            v-for="review in displayedReviews"
            :key="review.id || review.reviewId"
            class="review-card"
            @click="goToReviewDetail(review)"
          >
            <div class="review-header">
              <div class="reviewer-info">
                <div class="reviewer-avatar">
                  <BaseIcon name="user-line" :size="16" class="text-primary" />
                </div>
                <span class="reviewer-name">{{ review.nickname || '익명' }}</span>
              </div>
              <span class="review-date">{{ formatDate(review.createdAt) }}</span>
            </div>

            <div v-if="review.rating > 0" class="review-rating">
              <StarRating :model-value="review.rating" :size="16" readonly />
              <span class="rating-value">{{ review.rating }}점</span>
            </div>

            <div v-if="review.flavorList && review.flavorList.length > 0" class="review-flavors">
              <BaseChip
                v-for="flavor in review.flavorList.slice(0, 3)"
                :key="flavor.id"
                :label="flavor.name"
                variant="secondary"
                size="small"
              />
              <span v-if="review.flavorList.length > 3" class="text-textSecondary text-xs">
                +{{ review.flavorList.length - 3 }}
              </span>
            </div>

            <p class="review-content">{{ review.content }}</p>

            <img
              v-if="review.imageUrl && review.imageUrl !== 'undefined' && review.imageUrl !== 'null'"
              :src="review.imageUrl"
              :alt="`${review.nickname || '사용자'}의 리뷰 이미지`"
              class="review-image"
              @error="$event.target.style.display = 'none'"
            />
          </div>
        </div>
      </div>
    </div>

    <BookmarkFolderSelectModal
      :is-open="showBookmarkModal"
      :store-id="storeId"
      :store-name="store?.name || ''"
      :bookmarked-folder-ids="bookmarkedFolderIds"
      @close="showBookmarkModal = false"
      @update="handleBookmarkUpdate"
    />

    <div v-if="selectedMenu && !isVerified" class="fixed-bottom-bar">
      <div class="selected-menu-info">
        <span class="selected-label">선택한 메뉴</span>
        <span class="selected-name">{{ selectedMenu.name }}</span>
      </div>
      <BaseButton
        :label="isVerifying ? '인증 중...' : '방문 인증'"
        size="large"
        class="w-full"
        :loading="isVerifying"
        @click="handleVerifyVisit"
      />
      <p v-if="verificationMessage" class="verification-message" :class="verificationStatus">
        {{ verificationMessage }}
      </p>
    </div>

    <div v-if="isVerified" class="fixed-bottom-bar verified">
      <div class="verified-info">
        <BaseIcon name="check" :size="20" class="text-primary" />
        <div>
          <p class="verified-text">방문 인증 완료!</p>
          <p class="verified-menu">{{ selectedMenu?.name }}</p>
        </div>
      </div>
      <div class="verified-actions">
        <BaseButton
          label="리뷰 작성하기"
          size="medium"
          @click="goToReviewWrite"
        />
        <button class="reset-btn" @click="resetVerification">다른 메뉴 인증</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createLogger } from '@/utils/logger'
import { MENU_CATEGORIES } from '@/constants'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseChip from '@/components/common/BaseChip.vue'
import StarRating from '@/components/common/StarRating.vue'
import RatingBadge from '@/components/common/RatingBadge.vue'
import BookmarkFolderSelectModal from '@/components/saved/BookmarkFolderSelectModal.vue'
import MenuList from '@/components/menu/MenuList.vue'
import { getStoreById, getStoreReviews } from '@/api/cafe'
import { getMenusByStoreId } from '@/api/menu'
import { getStoreBookmarkStatus } from '@/api/bookmark'
import { verifyVisit } from '@/api/visit'
import { showSuccess, showError, showWarning } from '@/utils/toast'
import { useAuthStore } from '@/store/auth'
import { useGeolocation } from '@/composables/useGeolocation'
import { formatDate } from '@/utils/date'

const logger = createLogger('StoreDetailView')

const categoryLabelMap = Object.fromEntries(
  MENU_CATEGORIES.map(cat => [cat.value, cat.label])
)

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { location: geoLocation, error: geoError, requestLocation } = useGeolocation()

const storeId = computed(() => route.params.storeId)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const store = ref(null)
const reviews = ref([])
const menus = ref([])
const isLoading = ref(true)
const isLoadingReviews = ref(false)
const isLoadingMenus = ref(false)
const error = ref(null)
const imageError = ref(false)
const isBookmarked = ref(false)
const bookmarkedFolderIds = ref([])
const showBookmarkModal = ref(false)
const showAllReviews = ref(false)
const showAllMenus = ref(false)
const isDescriptionExpanded = ref(false)

const selectedMenu = ref(null)
const isVerifying = ref(false)
const isVerified = ref(false)
const visitId = ref(null)
const verificationMessage = ref('')
const verificationStatus = ref('default')

const hasValidThumbnail = computed(() => {
  return store.value?.thumbnailUrl &&
         !store.value.thumbnailUrl.includes('example.com') &&
         !imageError.value
})

const displayCategories = computed(() => {
  if (!store.value?.category) return []
  return store.value.category
    .split(',')
    .map(c => c.trim())
    .filter(c => c)
    .map(c => categoryLabelMap[c] || c)
})

const displayedReviews = computed(() => {
  if (showAllReviews.value) {
    return reviews.value
  }
  return reviews.value.slice(0, 3)
})

const displayedMenus = computed(() => {
  if (showAllMenus.value) {
    return menus.value
  }
  return menus.value.slice(0, 5)
})

const formatRating = (rating) => {
  if (!rating && rating !== 0) return 'N/A'
  return Number(rating).toFixed(1)
}

const formatBusinessHours = (open, close) => {
  if (!open && !close) return '정보 없음'
  const formatTime = (time) => {
    if (!time) return ''
    if (typeof time === 'string') {
      const parts = time.split(':')
      if (parts.length < 2) return time
      return `${parts[0]}:${parts[1]}`
    }
    if (Array.isArray(time)) {
      return `${String(time[0]).padStart(2, '0')}:${String(time[1] || 0).padStart(2, '0')}`
    }
    if (typeof time === 'object' && time.hour !== undefined) {
      return `${String(time.hour).padStart(2, '0')}:${String(time.minute || 0).padStart(2, '0')}`
    }
    return ''
  }
  return `${formatTime(open)} - ${formatTime(close)}`
}

const fetchStoreDetail = async () => {
  if (!storeId.value) {
    error.value = '가게 ID가 없습니다'
    isLoading.value = false
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const response = await getStoreById(storeId.value)
    let storeData = response.data || response

    if (storeData.name === 'Unknown Cafe' && route.query.name) {
      storeData = {
        ...storeData,
        name: route.query.name,
        latitude: parseFloat(route.query.lat) || storeData.latitude,
        longitude: parseFloat(route.query.lng) || storeData.longitude,
        address: route.query.address || storeData.address,
        category: route.query.category || storeData.category
      }
    }

    store.value = storeData

    fetchReviews()
    fetchMenus()
    fetchBookmarkStatus()
  } catch (e) {
    logger.error('Failed to fetch store detail', e)
    error.value = e.response?.data?.message || '가게 정보를 불러오는데 실패했습니다'
  } finally {
    isLoading.value = false
  }
}

const fetchReviews = async () => {
  if (!storeId.value) return

  isLoadingReviews.value = true
  try {
    const response = await getStoreReviews(storeId.value)
    const data = response?.data ?? response
    if (Array.isArray(data)) {
      reviews.value = data
    } else if (data?.reviews && Array.isArray(data.reviews)) {
      reviews.value = data.reviews
    } else if (data?.content && Array.isArray(data.content)) {
      reviews.value = data.content
    } else {
      reviews.value = []
    }
    logger.info(`Loaded ${reviews.value.length} reviews`)
  } catch (e) {
    logger.error('Failed to fetch reviews', e)
    reviews.value = []
  } finally {
    isLoadingReviews.value = false
  }
}

const fetchMenus = async () => {
  if (!storeId.value) return

  isLoadingMenus.value = true
  try {
    const response = await getMenusByStoreId(storeId.value, { page: 1, size: 10 })
    const data = response?.data ?? response
    menus.value = data?.content ?? (Array.isArray(data) ? data : [])
  } catch (e) {
    logger.error('Failed to fetch menus', e)
    menus.value = []
  } finally {
    isLoadingMenus.value = false
  }
}

const copyAddress = async () => {
  if (!store.value?.address) return

  try {
    await navigator.clipboard.writeText(store.value.address)
    showSuccess('주소가 복사되었습니다')
  } catch {
    showError('주소 복사에 실패했습니다')
  }
}

const fetchBookmarkStatus = async () => {
  if (!isAuthenticated.value || !storeId.value) return

  try {
    const status = await getStoreBookmarkStatus(storeId.value)
    isBookmarked.value = status.isBookmarked
    bookmarkedFolderIds.value = status.folders?.map(f => f.folderId) || []
  } catch (error) {
    logger.error('북마크 상태 조회 실패', error)
  }
}

const toggleBookmark = () => {
  if (!isAuthenticated.value) {
    showError('로그인이 필요합니다')
    router.push('/login')
    return
  }

  showBookmarkModal.value = true
}

const handleBookmarkUpdate = ({ folderIds, isBookmarked: newBookmarked }) => {
  bookmarkedFolderIds.value = folderIds
  isBookmarked.value = newBookmarked
}

const showOnMap = () => {
  if (!store.value) return

  router.push({
    name: 'map',
    query: {
      lat: store.value.latitude,
      lng: store.value.longitude,
      storeId: storeId.value
    }
  })
}

const handleMenuSelect = (menu) => {
  if (isVerified.value) return

  if (selectedMenu.value?.id === menu.id) {
    selectedMenu.value = null
    verificationMessage.value = ''
  } else {
    selectedMenu.value = menu
    verificationMessage.value = ''
  }
}

const handleVerifyVisit = async () => {
  if (!selectedMenu.value || !store.value) return

  if (!isAuthenticated.value) {
    showError('로그인이 필요합니다')
    router.push('/login')
    return
  }

  isVerifying.value = true
  verificationStatus.value = 'default'
  verificationMessage.value = '위치 확인 중...'

  try {
    const storeLat = store.value.latitude
    const storeLng = store.value.longitude

    if (!storeLat || !storeLng) {
      verificationMessage.value = '가게 위치 정보가 없습니다.'
      verificationStatus.value = 'error'
      isVerifying.value = false
      return
    }

    await requestLocation()

    if (geoError.value || !geoLocation.value) {
      verificationMessage.value = '위치 정보를 가져올 수 없습니다. GPS를 확인해주세요.'
      verificationStatus.value = 'error'
      isVerifying.value = false
      return
    }

    const storeLoc = { latitude: storeLat, longitude: storeLng }
    const userLoc = { latitude: geoLocation.value.lat, longitude: geoLocation.value.lng }

    logger.debug('방문 인증 시도', {
      store: { id: storeId.value, name: store.value.name },
      menu: { id: selectedMenu.value.id, name: selectedMenu.value.name },
      storeLoc,
      userLoc
    })

    const result = await verifyVisit({
      menuId: selectedMenu.value.id,
      storeLocationDto: storeLoc,
      userLocationDto: userLoc
    })

    const responseData = result?.data ?? result
    if (responseData) {
      const { visitId: newVisitId, isVerified: verified } = responseData
      visitId.value = newVisitId

      if (verified) {
        isVerified.value = true
        verificationMessage.value = ''
        verificationStatus.value = 'success'
        showSuccess('방문이 인증되었습니다!')
      } else {
        verificationMessage.value = '가게 근처(100m 이내)에서 인증해주세요.'
        verificationStatus.value = 'error'
        showWarning('가게 근처에서 다시 시도해주세요.')
      }
    } else {
      throw new Error('인증 응답을 받지 못했습니다.')
    }
  } catch (e) {
    verificationMessage.value = '인증 요청 중 오류가 발생했습니다.'
    verificationStatus.value = 'error'
    showError(e.response?.data?.message || '방문 인증에 실패했습니다.')
    logger.error('방문 인증 실패', e)
  } finally {
    isVerifying.value = false
  }
}

const goToReviewWrite = () => {
  if (!isVerified.value || !selectedMenu.value) return

  router.push({
    name: 'review-write',
    query: {
      storeId: storeId.value,
      name: store.value?.name,
      menuId: selectedMenu.value.id,
      menuName: selectedMenu.value.name,
      menuPrice: selectedMenu.value.price,
      visitId: visitId.value
    }
  })
}

const resetVerification = () => {
  selectedMenu.value = null
  isVerified.value = false
  visitId.value = null
  verificationMessage.value = ''
  verificationStatus.value = 'default'
}

const goToReviewDetail = (review) => {
  const reviewId = review.reviewId || review.id
  if (!reviewId) {
    logger.warn('Review ID not found', review)
    return
  }
  router.push({
    name: 'review-detail',
    params: { reviewId }
  })
}

onMounted(() => {
  fetchStoreDetail()
})
</script>

<style scoped>
.store-hero {
  position: relative;
}

.hero-image {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: var(--color-primary-100);
  overflow: hidden;
}

.closed-banner {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  font-weight: 600;
}

.store-info-section {
  padding: 1.25rem 1.5rem;
  background: white;
  border-bottom: 1px solid var(--color-border);
}

.closed-badge {
  padding: 0.125rem 0.5rem;
  background-color: var(--color-neutral-400);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
}

.bookmark-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: var(--color-textSecondary);
  transition: all 0.2s;
  flex-shrink: 0;
}

.bookmark-btn:hover {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-200);
}

.bookmark-btn.is-bookmarked {
  color: var(--color-primary);
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-200);
}

.detail-section {
  padding: 0.75rem 1.5rem;
  background: white;
  border-bottom: 1px solid var(--color-border);
}

.menu-section {
  padding: 1rem 1.5rem;
  padding-top: 1.5rem;
  background: white;
  border-top: 6px solid var(--color-neutral-100);
}

.menu-more-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background-color: var(--color-primary-50);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 1rem;
  transition: background-color 0.2s;
}

.menu-more-btn:hover {
  background-color: var(--color-primary-100);
}

.empty-menus {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-textPrimary);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item:hover {
  opacity: 0.7;
}

.detail-value {
  flex: 1;
  font-size: 0.8125rem;
  color: var(--color-textPrimary);
}

.detail-item.no-action {
  cursor: default;
}

.detail-item.no-action:hover {
  opacity: 1;
}

.map-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  padding: 0;
  font-size: 0.8125rem;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
}

.map-link:hover {
  text-decoration: underline;
}

.reviews-section {
  padding: 1rem 1.5rem;
  padding-top: 1.5rem;
  background: white;
  border-top: 6px solid var(--color-neutral-100);
}

.empty-reviews {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  padding: 1rem;
  background-color: var(--color-neutral-50);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.review-card:hover {
  background-color: var(--color-primary-50);
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  line-height: 1;
  overflow: visible;
}

.rating-value {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-textPrimary);
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reviewer-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--color-primary-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.reviewer-name {
  font-weight: 600;
  color: var(--color-textPrimary);
}

.review-date {
  font-size: 0.75rem;
  color: var(--color-textSecondary);
}

.review-flavors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.review-content {
  font-size: 0.9375rem;
  color: var(--color-textPrimary);
  line-height: 1.5;
}

.review-image {
  margin-top: 0.75rem;
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.review-write-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background-color: var(--color-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 1rem;
  transition: background-color 0.2s;
}

.review-write-btn:hover {
  background-color: var(--color-primary-600);
}

.map-button {
  border: none;
  width: 100%;
  text-align: left;
}

.fixed-bottom-bar {
  position: fixed;
  bottom: 64px;
  left: 0;
  right: 0;
  max-width: 448px;
  margin: 0 auto;
  padding: 1rem;
  background: white;
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  z-index: 50;
}

@media (max-width: 640px) {
  .fixed-bottom-bar {
    bottom: calc(64px + env(safe-area-inset-bottom, 0px));
  }
}

.selected-menu-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-primary-50);
  border-radius: 0.5rem;
}

.selected-label {
  font-size: 0.75rem;
  color: var(--color-textSecondary);
}

.selected-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
}

.verification-message {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
}

.verification-message.error {
  color: var(--color-error);
}

.verification-message.success {
  color: var(--color-primary);
}

.verification-message.default {
  color: var(--color-textSecondary);
}

.fixed-bottom-bar.verified {
  background-color: var(--color-primary-50);
}

.verified-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.verified-text {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
}

.verified-menu {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-textSecondary);
}

.verified-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.reset-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--color-textSecondary);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.reset-btn:hover {
  color: var(--color-primary);
}
</style>
