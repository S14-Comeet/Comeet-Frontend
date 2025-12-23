<template>
  <div class="my-reviews-view h-full flex flex-col bg-background">
    <div class="flex-1 overflow-y-auto px-4 py-6">
      <!-- Loading State -->
      <div v-if="isLoading && reviews.length === 0" class="flex justify-center items-center py-20">
        <div class="text-center">
          <BaseIcon name="spinner" :size="40" class="animate-spin text-primary mx-auto mb-2" />
          <p class="text-textSecondary">리뷰를 불러오는 중...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && reviews.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <BaseIcon name="edit" :size="40" class="text-neutral-400" />
        </div>
        <h3 class="text-xl font-bold text-neutral-900 mb-2">작성한 리뷰가 없습니다</h3>
        <p class="text-textSecondary mb-6 text-center">
          방문한 카페에 대한 리뷰를 작성해보세요!
        </p>
        <BaseButton
          label="리뷰 작성하러 가기"
          variant="primary"
          @click="goToMap"
        />
      </div>

      <!-- Review List -->
      <div v-else class="space-y-4">
        <ReviewCard
          v-for="review in reviews"
          :key="review.reviewId"
          :review="review"
          :store-name="storeNames[review.storeId] || ''"
          :menu-name="menuNames[review.menuId] || ''"
          :has-cupping-note="cuppingNoteStatus[review.reviewId] || false"
          @click="goToReviewDetail(review)"
        />

        <!-- Load More Button -->
        <div v-if="hasMore" class="flex justify-center pt-4 pb-2">
          <BaseButton
            label="더 보기"
            variant="secondary"
            size="medium"
            :loading="isLoading"
            @click="loadMore"
          />
        </div>

        <!-- End of List -->
        <div v-else-if="reviews.length > 0" class="text-center py-4 text-textSecondary text-sm">
          모든 리뷰를 확인했습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import ReviewCard from '@/components/review/ReviewCard.vue'
import { getMyReviews, checkCuppingNoteExists } from '@/api/review'
import { getStoreById } from '@/api/cafe'
import { getMenuById } from '@/api/menu'
import { showError } from '@/utils/toast'
import { createLogger } from '@/utils/logger'

const logger = createLogger('MyReviewsView')
const router = useRouter()

const reviews = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const cuppingNoteStatus = ref({})
const storeNames = ref({})  // storeId -> name 캐시
const menuNames = ref({})   // menuId -> name 캐시

/**
 * 커핑 노트 존재 여부 확인 (병렬 처리)
 */
const checkCuppingNoteStatusForReviews = async (reviewList) => {
  const checks = reviewList.map(async (review) => {
    // 이미 확인한 리뷰는 스킵
    if (cuppingNoteStatus.value[review.reviewId] !== undefined) {
      return
    }
    try {
      const exists = await checkCuppingNoteExists(review.reviewId)
      cuppingNoteStatus.value[review.reviewId] = exists
    } catch {
      // 커핑노트 확인 실패는 무시 (없는 경우도 포함)
      cuppingNoteStatus.value[review.reviewId] = false
    }
  })

  await Promise.all(checks)
}

/**
 * 가맹점명/메뉴명 조회 (병렬 처리, 캐싱)
 */
const fetchStoreAndMenuNames = async (reviewList) => {
  const fetchPromises = []

  // 고유한 storeId, menuId 추출
  const uniqueStoreIds = [...new Set(reviewList.map(r => r.storeId).filter(Boolean))]
  const uniqueMenuIds = [...new Set(reviewList.map(r => r.menuId).filter(Boolean))]

  // 가맹점명 조회 (캐시에 없는 것만)
  for (const storeId of uniqueStoreIds) {
    if (storeNames.value[storeId] === undefined) {
      fetchPromises.push(
        getStoreById(storeId)
          .then(response => {
            // API 응답이 { data: { name: ... } } 형태로 래핑됨
            const storeData = response?.data || response
            storeNames.value[storeId] = storeData?.name || ''
          })
          .catch(() => {
            storeNames.value[storeId] = ''
          })
      )
    }
  }

  // 메뉴명 조회 (캐시에 없는 것만)
  for (const menuId of uniqueMenuIds) {
    if (menuNames.value[menuId] === undefined) {
      fetchPromises.push(
        getMenuById(menuId)
          .then(response => {
            // API 응답이 { data: { name: ... } } 형태로 래핑됨
            const menuData = response?.data || response
            menuNames.value[menuId] = menuData?.name || ''
          })
          .catch(() => {
            menuNames.value[menuId] = ''
          })
      )
    }
  }

  await Promise.all(fetchPromises)
}

/**
 * 리뷰 목록 불러오기
 */
const fetchReviews = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await getMyReviews({ page, size: pageSize.value })

    // API 응답 구조에 따라 조정 필요
    const newReviews = response.data?.content || response.content || []
    const totalPages = response.data?.totalPages || response.totalPages || 1

    if (page === 1) {
      reviews.value = newReviews
    } else {
      reviews.value = [...reviews.value, ...newReviews]
    }

    hasMore.value = currentPage.value < totalPages

    // 커핑 노트 존재 여부, 가맹점명/메뉴명 조회 (병렬)
    await Promise.all([
      checkCuppingNoteStatusForReviews(newReviews),
      fetchStoreAndMenuNames(newReviews)
    ])

  } catch (error) {
    logger.error('Failed to fetch reviews', error)
    showError('리뷰 목록을 불러오지 못했습니다.')
  } finally {
    isLoading.value = false
  }
}

/**
 * 더 보기
 */
const loadMore = () => {
  currentPage.value += 1
  fetchReviews(currentPage.value)
}

/**
 * 리뷰 상세 페이지로 이동
 */
const goToReviewDetail = (review) => {
  logger.debug('Review clicked', review)
  router.push({
    name: 'review-detail',
    params: { reviewId: review.reviewId }
  })
}

/**
 * 지도 페이지로 이동
 */
const goToMap = () => {
  router.push('/map')
}

onMounted(() => {
  fetchReviews(1)
})
</script>

<style scoped>
.my-reviews-view {
  background-color: var(--color-background);
}
</style>
