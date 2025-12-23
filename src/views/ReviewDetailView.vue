<template>
  <div class="review-detail-view h-full flex flex-col bg-background">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex justify-center items-center">
      <BaseIcon name="spinner" :size="40" class="animate-spin text-primary" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center px-6">
      <BaseIcon name="alert-circle" :size="48" class="text-error mb-4" />
      <p class="text-neutral-700 text-center mb-4">{{ error }}</p>
      <BaseButton label="뒤로 가기" variant="secondary" @click="router.back()" />
    </div>

    <!-- Review Content -->
    <div v-else-if="review" class="flex-1 overflow-y-auto pb-40">
      <div class="px-5 py-6">
        <!-- Header Section -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-textSecondary">{{ formattedDate }}</p>
            <div class="flex items-center gap-2">
              <BaseChip
                v-if="hasCuppingNote"
                label="커핑노트"
                variant="default"
                size="small"
                class="bg-accent/10 text-accent"
              />
              <BaseChip
                v-if="reviewData?.isPublic"
                label="공개"
                variant="default"
                size="small"
                class="bg-primary-100 text-primary-700"
              />
              <BaseChip
                v-else
                label="비공개"
                variant="default"
                size="small"
                class="bg-neutral-100 text-textSecondary"
              />
            </div>
          </div>
          <h1 class="text-xl font-bold text-neutral-900 mb-1">
            {{ storeName || `가맹점 #${reviewData?.storeId}` }}
          </h1>
          <p class="text-textSecondary">
            {{ menuName || `메뉴 #${reviewData?.menuId}` }}
          </p>
        </div>

        <!-- Rating -->
        <div v-if="displayRating > 0" class="flex items-center gap-3 mb-6 p-4 bg-neutral-50 rounded-xl">
          <StarRating :model-value="displayRating" :size="28" readonly />
          <span class="text-xl font-bold text-neutral-900">{{ displayRating }}점</span>
        </div>

        <!-- Review Image -->
        <div
          v-if="reviewData?.imageUrl && !imageLoadError"
          class="mb-6 rounded-xl overflow-hidden"
        >
          <img
            :src="reviewData.imageUrl"
            alt="리뷰 이미지"
            class="w-full object-cover"
            @error="handleImageError"
          />
        </div>

        <!-- Review Content -->
        <div class="mb-6">
          <h2 class="text-lg font-bold mb-3">리뷰 내용</h2>
          <p class="text-neutral-900 whitespace-pre-wrap leading-relaxed">
            {{ reviewData?.content || '내용 없음' }}
          </p>
        </div>

        <!-- Flavor Badges (FlavorWheel 시각화) -->
        <div v-if="review.flavorBadges && review.flavorBadges.length > 0" class="mb-6">
          <h2 class="text-lg font-bold mb-3">테이스팅 노트</h2>
          <div class="flavor-wheel-wrapper">
            <FlavorWheel
              :size="260"
              :highlighted-flavors="highlightedFlavorIds"
              :show-legend="true"
              center-label="Flavor"
            />
          </div>
        </div>

        <!-- Cupping Note Section -->
        <div v-if="hasCuppingNote && cuppingNote" class="mb-6">
          <h2 class="text-lg font-bold mb-4">커핑 노트</h2>
          <CuppingNoteDisplay :cupping-note="cuppingNote" />
        </div>
      </div>
    </div>

    <!-- Bottom Actions (본인 리뷰인 경우만) -->
    <div
      v-if="review && isOwnReview"
      class="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 max-w-[448px] mx-auto z-10 safe-bottom"
    >
      <div class="flex gap-3">
        <BaseButton
          label="수정하기"
          variant="primary"
          size="large"
          class="flex-1"
          @click="goToEdit"
        />
        <BaseButton
          label="삭제"
          variant="secondary"
          size="large"
          class="flex-1 !text-error !border-error/50 hover:!bg-error/5"
          @click="confirmDelete"
        />
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :is-open="showDeleteDialog"
      title="리뷰 삭제"
      message="이 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다."
      confirm-text="삭제"
      cancel-text="취소"
      confirm-variant="primary"
      @confirm="handleDelete"
      @close="showDeleteDialog = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseChip from '@/components/common/BaseChip.vue'
import StarRating from '@/components/common/StarRating.vue'
import FlavorWheel from '@/components/bean/FlavorWheel.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import CuppingNoteDisplay from '@/components/review/CuppingNoteDisplay.vue'
import { getReviewDetail, getCuppingNote, deleteReview } from '@/api/review'
import { getStoreById } from '@/api/cafe'
import { getMenuById } from '@/api/menu'
import { useAuthStore } from '@/store/auth'
import { showSuccess, showError } from '@/utils/toast'
import { createLogger } from '@/utils/logger'

const logger = createLogger('ReviewDetailView')
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const reviewId = computed(() => route.params.reviewId)

// State
const review = ref(null)
const cuppingNote = ref(null)
const hasCuppingNote = ref(false)
const isLoading = ref(true)
const error = ref(null)
const showDeleteDialog = ref(false)
const isDeleting = ref(false)
const storeName = ref('')
const menuName = ref('')
const imageLoadError = ref(false)

// Computed
// reviewInfo 래핑 여부에 따라 다른 위치에서 조회
const reviewData = computed(() => {
  return review.value?.reviewInfo || review.value || {}
})

const isOwnReview = computed(() => {
  const reviewUserId = reviewData.value?.userId
  const currentUserId = authStore.user?.userId

  if (!reviewUserId || !currentUserId) return false
  return reviewUserId == currentUserId
})

const displayRating = computed(() => {
  return reviewData.value?.rating || 0
})

const formattedDate = computed(() => {
  const createdAt = reviewData.value?.createdAt
  if (!createdAt) return ''

  // Date 객체 생성 시도
  const date = new Date(createdAt)

  // Invalid Date 체크
  if (isNaN(date.getTime())) {
    // Java LocalDateTime 배열 형식 [year, month, day, hour, minute, second] 처리
    if (Array.isArray(createdAt) && createdAt.length >= 3) {
      return `${createdAt[0]}년 ${createdAt[1]}월 ${createdAt[2]}일`
    }
    return ''
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const highlightedFlavorIds = computed(() => {
  if (!review.value?.flavorBadges) return []
  return review.value.flavorBadges.map(f => f.flavorId || f.id || f.code)
})

// 이미지 로드 에러 핸들러
const handleImageError = () => {
  imageLoadError.value = true
}

// Methods
const fetchReviewDetail = async () => {
  isLoading.value = true
  error.value = null
  imageLoadError.value = false

  try {
    const response = await getReviewDetail(reviewId.value)
    review.value = response.data || response

    // 가맹점명, 메뉴명 조회 (병렬 처리)
    // reviewInfo 래핑 여부에 따라 다른 위치에서 조회
    const reviewInfo = review.value?.reviewInfo || review.value
    const storeId = reviewInfo?.storeId
    const menuId = reviewInfo?.menuId

    const fetchPromises = []

    if (storeId) {
      fetchPromises.push(
        getStoreById(storeId)
          .then(response => {
            // API 응답이 { data: { name: ... } } 형태로 래핑됨
            const storeData = response?.data || response
            storeName.value = storeData?.name || ''
          })
          .catch(() => {
            // 조회 실패 시 무시
          })
      )
    }

    if (menuId) {
      fetchPromises.push(
        getMenuById(menuId)
          .then(response => {
            // API 응답이 { data: { name: ... } } 형태로 래핑됨
            const menuData = response?.data || response
            menuName.value = menuData?.name || ''
          })
          .catch(() => {
            // 조회 실패 시 무시
          })
      )
    }

    // 커핑 노트 확인 (404는 정상 - 커핑노트 없음)
    fetchPromises.push(
      getCuppingNote(reviewId.value)
        .then(cuppingResponse => {
          cuppingNote.value = cuppingResponse.data || cuppingResponse
          hasCuppingNote.value = true
        })
        .catch(cuppingError => {
          // 404는 커핑노트 없음 - 정상 케이스이므로 로그 안찍음
          hasCuppingNote.value = false
        })
    )

    await Promise.all(fetchPromises)
  } catch (e) {
    logger.error('Failed to fetch review detail', e)
    error.value = '리뷰를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const goToEdit = () => {
  router.push({
    name: 'review-edit',
    params: { reviewId: reviewId.value }
  })
}

const confirmDelete = () => {
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await deleteReview(reviewId.value)
    showSuccess('리뷰가 삭제되었습니다.')
    router.replace({ name: 'my-reviews' })
  } catch (e) {
    logger.error('Failed to delete review', e)
    showError('리뷰 삭제에 실패했습니다.')
  } finally {
    isDeleting.value = false
    showDeleteDialog.value = false
  }
}

onMounted(() => {
  fetchReviewDetail()
})
</script>

<style scoped>
.review-detail-view {
  background-color: var(--color-background);
}

.flavor-wheel-wrapper {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  background: var(--color-neutral-50);
  border-radius: 0.75rem;
}

.safe-bottom {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
}
</style>
