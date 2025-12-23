<template>
  <div class="flex flex-col min-h-full bg-background">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <BaseIcon name="spinner" :size="32" class="text-primary animate-spin" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <BaseIcon name="x" :size="48" class="text-error mb-4" />
      <p class="text-textPrimary font-medium mb-2">정보를 불러올 수 없습니다</p>
      <p class="text-textSecondary text-sm mb-4">{{ error }}</p>
      <BaseButton label="다시 시도" variant="primary" @click="fetchStoreDetail" />
    </div>

    <!-- Content -->
    <div v-else-if="store" class="flex-1 overflow-y-auto pb-20">
      <!-- Hero Section -->
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

      <!-- Store Info -->
      <div class="store-info-section">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <BaseChip
                v-for="(cat, idx) in displayCategories"
                :key="idx"
                :label="cat"
                variant="primary"
              />
              <span v-if="store.isClosed" class="closed-badge">영업종료</span>
            </div>
            <h1 class="text-2xl font-bold text-textPrimary">{{ store.name }}</h1>
          </div>
          <button
            class="bookmark-btn"
            :class="{ 'is-bookmarked': isBookmarked }"
            @click="toggleBookmark"
          >
            <BaseIcon :name="isBookmarked ? 'bookmark-fill' : 'bookmark-line'" :size="24" />
          </button>
        </div>

        <p v-if="store.description" class="text-textSecondary text-sm mt-2 leading-relaxed">
          {{ store.description }}
        </p>

        <!-- Rating & Stats -->
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-main">
              <BaseIcon name="star-fill" :size="20" class="text-accent" />
              <span class="stat-value">{{ formatRating(store.averageRating) }}</span>
            </div>
            <span class="stat-label">평점</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ store.reviewCount || 0 }}</span>
            <span class="stat-label">리뷰</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ store.visitCount || 0 }}</span>
            <span class="stat-label">방문</span>
          </div>
        </div>
      </div>

      <!-- Detail Info -->
      <div class="detail-section">
        <h2 class="section-title">상세 정보</h2>

        <div class="detail-list">
          <!-- Address -->
          <div class="detail-item" @click="copyAddress">
            <BaseIcon name="map-marker" :size="20" class="text-primary" />
            <div class="detail-content">
              <span class="detail-label">주소</span>
              <span class="detail-value">{{ store.address || '정보 없음' }}</span>
            </div>
            <BaseIcon name="file-copy" :size="16" class="text-textSecondary" />
          </div>

          <!-- Map Button -->
          <button class="detail-item map-button" @click="showOnMap">
            <BaseIcon name="map-marker" :size="20" class="text-primary" />
            <div class="detail-content">
              <span class="detail-label">위치</span>
              <span class="detail-value">지도에서 보기</span>
            </div>
            <BaseIcon name="chevron-right" :size="16" class="text-textSecondary" />
          </button>

          <!-- Phone -->
          <a
            v-if="store.phoneNumber"
            :href="`tel:${store.phoneNumber}`"
            class="detail-item"
          >
            <BaseIcon name="call" :size="20" class="text-primary" />
            <div class="detail-content">
              <span class="detail-label">전화번호</span>
              <span class="detail-value">{{ store.phoneNumber }}</span>
            </div>
            <BaseIcon name="chevron-right" :size="16" class="text-textSecondary" />
          </a>

          <!-- Business Hours -->
          <div class="detail-item">
            <BaseIcon name="time" :size="20" class="text-primary" />
            <div class="detail-content">
              <span class="detail-label">영업시간</span>
              <span class="detail-value">
                {{ formatBusinessHours(store.openTime, store.closeTime) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu Section -->
      <div class="menu-section">
        <div class="section-header">
          <h2 class="section-title">메뉴 {{ menus.length }}개</h2>
          <div class="flex items-center gap-2">
            <button
              v-if="menus.length > 3"
              class="text-primary text-sm font-medium"
              @click="showAllMenus = !showAllMenus"
            >
              {{ showAllMenus ? '접기' : '전체 보기' }}
            </button>
            <button class="menu-more-btn" @click="goToMenu">
              <span>메뉴 보기</span>
              <BaseIcon name="chevron-right" :size="14" />
            </button>
          </div>
        </div>

        <div v-if="isLoadingMenus" class="py-8 text-center">
          <BaseIcon name="spinner" :size="24" class="text-primary animate-spin" />
        </div>

        <div v-else-if="menus.length === 0" class="empty-menus">
          <p class="text-textSecondary text-sm">등록된 메뉴가 없습니다</p>
        </div>

        <div v-else class="menu-list">
          <div
            v-for="menu in displayedMenus"
            :key="menu.id"
            class="menu-card"
            @click="goToMenu"
          >
            <div class="menu-image-wrapper">
              <img
                v-if="menu.imageUrl || menu.image_url"
                :src="menu.imageUrl || menu.image_url"
                :alt="menu.name"
                class="menu-image"
              />
              <div v-else class="menu-image-placeholder">
                <BaseIcon name="coffee" :size="24" class="text-primary-300" />
              </div>
            </div>
            <div class="menu-info">
              <h4 class="menu-name">{{ menu.name }}</h4>
              <p class="menu-price">{{ formatPrice(menu.price) }}원</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
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
            <button class="review-write-btn" @click="goToReview">
              <BaseIcon name="pencil" :size="14" />
              <span>작성하기</span>
            </button>
          </div>
        </div>

        <div v-if="isLoadingReviews" class="py-8 text-center">
          <BaseIcon name="spinner" :size="24" class="text-primary animate-spin" />
        </div>

        <!-- 리뷰가 없을 때는 빈 공백 표시 -->

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

            <!-- Rating -->
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
              v-if="review.imageUrl"
              :src="review.imageUrl"
              :alt="`${review.nickname}의 리뷰 이미지`"
              class="review-image"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 북마크 폴더 선택 모달 -->
    <BookmarkFolderSelectModal
      :is-open="showBookmarkModal"
      :store-id="storeId"
      :store-name="store?.name || ''"
      :bookmarked-folder-ids="bookmarkedFolderIds"
      @close="showBookmarkModal = false"
      @update="handleBookmarkUpdate"
    />
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
import BookmarkFolderSelectModal from '@/components/saved/BookmarkFolderSelectModal.vue'
import { getStoreById, getStoreReviews } from '@/api/cafe'
import { getMenusByStoreId } from '@/api/menu'
import { getStoreBookmarkStatus } from '@/api/bookmark'
import { showSuccess, showError } from '@/utils/toast'
import { useAuthStore } from '@/store/auth'

const logger = createLogger('StoreDetailView')

// enum 값을 한글 라벨로 변환하는 맵
const categoryLabelMap = Object.fromEntries(
  MENU_CATEGORIES.map(cat => [cat.value, cat.label])
)

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

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

const hasValidThumbnail = computed(() => {
  return store.value?.thumbnailUrl &&
         !store.value.thumbnailUrl.includes('example.com') &&
         !imageError.value
})

// 카테고리를 한글로 변환
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
  return menus.value.slice(0, 3)
})

const formatRating = (rating) => {
  if (!rating && rating !== 0) return 'N/A'
  return Number(rating).toFixed(1)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

const formatBusinessHours = (open, close) => {
  if (!open && !close) return '정보 없음'
  const formatTime = (time) => {
    if (!time) return ''
    // Handle both "HH:mm:ss" and "HH:mm" formats
    const parts = time.split(':')
    return `${parts[0]}:${parts[1]}`
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

    // API가 mock 데이터를 반환한 경우, query params로 보완
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

    // Fetch reviews, menus, and bookmark status
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
    // API 응답 구조에 따라 유연하게 처리
    const data = response?.data ?? response
    reviews.value = Array.isArray(data) ? data : []
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
    // 페이지네이션 응답 처리: content 필드 또는 배열 직접 반환
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

// 북마크 상태 조회
const fetchBookmarkStatus = async () => {
  // 비로그인 사용자는 북마크 상태 조회하지 않음
  if (!isAuthenticated.value || !storeId.value) return

  try {
    const status = await getStoreBookmarkStatus(storeId.value)
    isBookmarked.value = status.isBookmarked
    bookmarkedFolderIds.value = status.folders?.map(f => f.folderId) || []
  } catch (error) {
    logger.error('북마크 상태 조회 실패', error)
    // 실패해도 UI에 영향 없이 기본값 유지
  }
}

// 북마크 버튼 클릭
const toggleBookmark = () => {
  if (!isAuthenticated.value) {
    showError('로그인이 필요합니다')
    router.push('/login')
    return
  }

  // 폴더 선택 모달 열기
  showBookmarkModal.value = true
}

// 북마크 상태 업데이트 핸들러
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

const goToReview = () => {
  router.push({
    name: 'review-select',
    query: {
      storeId: storeId.value,
      name: store.value?.name,
      lat: store.value?.latitude,
      lng: store.value?.longitude
    }
  })
}

const goToMenu = () => {
  router.push({
    name: 'menu',
    params: { storeId: storeId.value },
    query: { name: store.value?.name }
  })
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

const formatPrice = (price) => {
  return price?.toLocaleString('ko-KR') || '0'
}

onMounted(() => {
  fetchStoreDetail()
})
</script>

<style scoped>
/* Hero Section */
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

/* Store Info Section */
.store-info-section {
  padding: 1.25rem;
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
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--color-textSecondary);
  transition: all 0.2s;
}

.bookmark-btn:hover {
  background-color: var(--color-primary-50);
}

.bookmark-btn.is-bookmarked {
  color: var(--color-primary);
}

/* Stats Row */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.25rem;
  padding: 1rem;
  background-color: var(--color-neutral-50);
  border-radius: 0.75rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-main {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-textPrimary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-textSecondary);
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background-color: var(--color-border);
}

/* Detail Section */
.detail-section {
  padding: 1.25rem;
  background: white;
  border-bottom: 1px solid var(--color-border);
}

/* Menu Section */
.menu-section {
  padding: 1.25rem;
  background: white;
  border-bottom: 8px solid var(--color-neutral-100);
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

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.menu-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: var(--color-neutral-50);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-card:hover {
  background-color: var(--color-primary-50);
}

.menu-image-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--color-primary-100);
}

.menu-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-50);
}

.menu-info {
  flex: 1;
  min-width: 0;
}

.menu-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-textPrimary);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-price {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
  margin: 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin-bottom: 1rem;
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
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background-color: var(--color-neutral-50);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.detail-item:hover {
  background-color: var(--color-primary-50);
}

.detail-content {
  flex: 1;
  min-width: 0;
}

.detail-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-textSecondary);
  margin-bottom: 0.125rem;
}

.detail-value {
  display: block;
  font-size: 0.9375rem;
  color: var(--color-textPrimary);
  font-weight: 500;
}

/* Reviews Section */
.reviews-section {
  padding: 1.25rem;
  background: white;
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

/* Review Write Button */
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

/* Map Button */
.map-button {
  border: none;
  width: 100%;
  text-align: left;
}
</style>
