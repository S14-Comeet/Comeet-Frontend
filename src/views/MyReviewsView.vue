<template>
  <div class="my-reviews-view h-full flex flex-col bg-background">
    <BaseHeader title="내 리뷰" showBackButton />

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
import BaseHeader from '@/components/common/BaseHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import ReviewCard from '@/components/review/ReviewCard.vue'
import { getMyReviews } from '@/api/review'
import { showError } from '@/utils/toast'
import { createLogger } from '@/utils/logger'

const logger = createLogger('MyReviewsView')
const router = useRouter()

const reviews = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)

/**
 * 리뷰 목록 불러오기
 */
const fetchReviews = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await getMyReviews({ page, size: pageSize.value })

    logger.debug('Reviews fetched', response)

    // API 응답 구조에 따라 조정 필요
    const newReviews = response.data?.content || response.content || []
    const totalPages = response.data?.totalPages || response.totalPages || 1

    if (page === 1) {
      reviews.value = newReviews
    } else {
      reviews.value = [...reviews.value, ...newReviews]
    }

    hasMore.value = currentPage.value < totalPages

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
 * 리뷰 상세 페이지로 이동 (필요시 구현)
 */
const goToReviewDetail = (review) => {
  logger.debug('Review clicked', review)
  // TODO: 리뷰 상세 페이지 구현 시 라우팅
  // router.push(`/reviews/${review.reviewId}`)
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
