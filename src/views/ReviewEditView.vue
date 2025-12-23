<template>
  <div class="flex flex-col h-full bg-white relative">
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

    <!-- Edit Form -->
    <div v-else class="flex-1 overflow-y-auto pb-40">
      <div class="px-5 py-6">
        <!-- Review Mode Toggle -->
        <div class="mode-toggle mb-6">
          <button
            class="mode-btn"
            :class="{ 'active': reviewMode === 'simple' }"
            type="button"
            @click="reviewMode = 'simple'"
          >
            <BaseIcon name="coffee" :size="18" />
            간편 리뷰
          </button>
          <button
            class="mode-btn"
            :class="{ 'active': reviewMode === 'professional' }"
            type="button"
            @click="reviewMode = 'professional'"
          >
            <BaseIcon name="edit" :size="18" />
            전문 커핑
          </button>
        </div>

        <!-- Rating -->
        <section class="mb-6">
          <h2 class="text-lg font-bold mb-3">별점</h2>
          <div class="flex items-center gap-3">
            <StarRating v-model="rating" :size="36" />
            <span v-if="rating > 0" class="text-lg font-semibold text-primary">{{ rating }}점</span>
            <span v-else class="text-sm text-textSecondary">(선택)</span>
          </div>
        </section>

        <!-- Simple Review Mode -->
        <template v-if="reviewMode === 'simple'">
          <section class="mb-6">
            <h2 class="text-lg font-bold mb-4">어떤 향미가 느껴졌나요?</h2>
            <p class="text-sm text-textSecondary mb-3">
              선택된 향미: {{ selectedFlavors.length }}개
            </p>
            <HierarchicalFlavorSelector v-model="selectedFlavors" :max-selection="10" />
          </section>
        </template>

        <!-- Professional Review Mode -->
        <template v-else>
          <section class="mb-6">
            <CuppingNoteForm v-model="cuppingNote" />
          </section>

          <section class="mb-6">
            <details class="flavor-accordion">
              <summary class="accordion-header">
                <span class="accordion-title">
                  <BaseIcon name="plus" :size="16" />
                  테이스팅 노트 추가
                  <span v-if="selectedFlavors.length > 0" class="flavor-badge">
                    {{ selectedFlavors.length }}
                  </span>
                </span>
                <BaseIcon name="chevron-down" :size="20" class="accordion-icon" />
              </summary>
              <div class="accordion-content">
                <HierarchicalFlavorSelector v-model="selectedFlavors" :max-selection="10" />
              </div>
            </details>
          </section>
        </template>

        <!-- Content -->
        <section class="mb-4">
          <h2 class="text-lg font-bold mb-4">리뷰 내용</h2>
          <textarea
            v-model="content"
            class="w-full h-32 p-4 rounded-xl border border-border resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-base"
            placeholder="커피의 맛, 분위기 등 자세한 후기를 남겨주세요."
          ></textarea>
        </section>

        <!-- Public Toggle -->
        <section class="mb-4">
          <label class="flex items-center justify-between p-4 bg-neutral-50 rounded-xl cursor-pointer">
            <div>
              <p class="font-medium text-neutral-900">리뷰 공개</p>
              <p class="text-sm text-textSecondary">다른 사용자에게 리뷰를 공개합니다</p>
            </div>
            <input
              v-model="isPublic"
              type="checkbox"
              class="toggle-checkbox"
            />
          </label>
        </section>
      </div>
    </div>

    <!-- Bottom Action -->
    <div
      v-if="!isLoading && !error"
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 max-w-[448px] mx-auto z-10 safe-bottom"
    >
      <BaseButton
        label="수정 완료"
        size="large"
        class="w-full"
        :disabled="!isValid"
        :loading="isSubmitting"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createLogger } from '@/utils/logger'
import BaseHeader from '@/components/common/BaseHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import StarRating from '@/components/common/StarRating.vue'
import HierarchicalFlavorSelector from '@/components/common/HierarchicalFlavorSelector.vue'
import CuppingNoteForm from '@/components/review/CuppingNoteForm.vue'
import { getReviewDetail, getCuppingNote, updateReview, updateCuppingNote, createCuppingNote } from '@/api/review'
import { findFlavorInWheel } from '@/constants'
import { showSuccess, showError } from '@/utils/toast'

const logger = createLogger('ReviewEditView')
const route = useRoute()
const router = useRouter()

const reviewId = computed(() => route.params.reviewId)

// State
const isLoading = ref(true)
const error = ref(null)
const isSubmitting = ref(false)
const originalReview = ref(null)
const hasCuppingNote = ref(false)

// Form state
const reviewMode = ref('simple')
const content = ref('')
const selectedFlavors = ref([])
const isPublic = ref(true)
const rating = ref(0)

// Cupping note state
const DEFAULT_CUPPING_SCORE = 6.5
const cuppingNote = ref({
  roastLevel: null,
  fragranceScore: DEFAULT_CUPPING_SCORE,
  aromaScore: DEFAULT_CUPPING_SCORE,
  flavorScore: DEFAULT_CUPPING_SCORE,
  aftertasteScore: DEFAULT_CUPPING_SCORE,
  acidityScore: DEFAULT_CUPPING_SCORE,
  sweetnessScore: DEFAULT_CUPPING_SCORE,
  mouthfeelScore: DEFAULT_CUPPING_SCORE,
  fragranceAromaDetail: '',
  flavorAftertasteDetail: '',
  acidityNotes: '',
  sweetnessNotes: '',
  mouthfeelNotes: '',
  overallNotes: ''
})

// Validation
const isValid = computed(() => {
  if (reviewMode.value === 'simple') {
    return content.value.trim().length > 0 && selectedFlavors.value.length > 0
  } else {
    const hasScores = cuppingNote.value.fragranceScore > 0 ||
                      cuppingNote.value.flavorScore > 0 ||
                      cuppingNote.value.acidityScore > 0
    return hasScores
  }
})

// flavor ID를 code로 변환
const flavorIdToCode = (id) => {
  const found = findFlavorInWheel(id)
  return found?.code || null
}

// flavor code를 ID로 변환
const flavorCodesToIds = (codes) => {
  return codes
    .map(code => findFlavorInWheel(code)?.id)
    .filter(id => id != null)
}

// Load existing review data
const loadReviewData = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Fetch review detail
    const response = await getReviewDetail(reviewId.value)
    const review = response.data || response
    originalReview.value = review

    // Populate form with existing data
    const reviewInfo = review.reviewInfo || review
    content.value = reviewInfo.content || ''
    isPublic.value = reviewInfo.isPublic ?? true
    rating.value = reviewInfo.rating || 0

    // Flavor badges to flavor codes (HierarchicalFlavorSelector는 code 사용)
    if (review.flavorBadges && review.flavorBadges.length > 0) {
      selectedFlavors.value = review.flavorBadges
        .map(f => flavorIdToCode(f.flavorId))
        .filter(code => code != null)
    }

    // Try to fetch cupping note
    try {
      const cuppingResponse = await getCuppingNote(reviewId.value)
      const cuppingData = cuppingResponse.data || cuppingResponse
      hasCuppingNote.value = true
      reviewMode.value = 'professional'

      // Populate cupping note data
      cuppingNote.value = {
        roastLevel: cuppingData.roastingLevel || cuppingData.roastLevel || null,
        fragranceScore: cuppingData.fragranceScore ?? DEFAULT_CUPPING_SCORE,
        aromaScore: cuppingData.aromaScore ?? DEFAULT_CUPPING_SCORE,
        flavorScore: cuppingData.flavorScore ?? DEFAULT_CUPPING_SCORE,
        aftertasteScore: cuppingData.aftertasteScore ?? DEFAULT_CUPPING_SCORE,
        acidityScore: cuppingData.acidityScore ?? DEFAULT_CUPPING_SCORE,
        sweetnessScore: cuppingData.sweetnessScore ?? DEFAULT_CUPPING_SCORE,
        mouthfeelScore: cuppingData.mouthfeelScore ?? DEFAULT_CUPPING_SCORE,
        fragranceAromaDetail: cuppingData.fragranceAromaDetail || '',
        flavorAftertasteDetail: cuppingData.flavorAftertasteDetail || '',
        acidityNotes: cuppingData.acidityNotes || '',
        sweetnessNotes: cuppingData.sweetnessNotes || '',
        mouthfeelNotes: cuppingData.mouthfeelNotes || '',
        overallNotes: cuppingData.overallNotes || ''
      }
    } catch {
      // 커핑노트 없음 - 정상 케이스
      hasCuppingNote.value = false
      reviewMode.value = 'simple'
    }

  } catch (e) {
    logger.error('Failed to load review data', e)
    error.value = '리뷰 정보를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!isValid.value) return

  isSubmitting.value = true
  try {
    // 1. Update review (flavor code를 ID로 변환)
    await updateReview(reviewId.value, {
      content: content.value,
      flavorIds: flavorCodesToIds(selectedFlavors.value),
      isPublic: isPublic.value,
      rating: rating.value > 0 ? rating.value : null
    })

    // 2. Handle cupping note
    if (reviewMode.value === 'professional') {
      try {
        if (hasCuppingNote.value) {
          await updateCuppingNote(reviewId.value, cuppingNote.value)
        } else {
          await createCuppingNote(reviewId.value, cuppingNote.value)
        }
      } catch (cuppingError) {
        logger.warn('Failed to save cupping note', cuppingError)
        showError('커핑노트 저장에 실패했습니다.')
      }
    }

    showSuccess('리뷰가 수정되었습니다.')
    router.replace({
      name: 'review-detail',
      params: { reviewId: reviewId.value }
    })
  } catch (e) {
    showError('리뷰 수정에 실패했습니다.')
    logger.error('리뷰 수정 실패', e)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadReviewData()
})
</script>

<style scoped>
/* Mode Toggle */
.mode-toggle {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: var(--color-neutral-100);
  border-radius: 0.75rem;
}

.mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-textSecondary);
  transition: all 0.2s;
}

.mode-btn.active {
  background: white;
  color: var(--color-primary);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Flavor Accordion */
.flavor-accordion {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--color-neutral-50);
  cursor: pointer;
  list-style: none;
}

.accordion-header::-webkit-details-marker {
  display: none;
}

.accordion-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--color-textPrimary);
}

.flavor-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  background: var(--color-primary);
  color: white;
  font-size: 0.6875rem;
  font-weight: 700;
  border-radius: 0.625rem;
}

.accordion-icon {
  color: var(--color-textSecondary);
  transition: transform 0.2s;
}

details[open] .accordion-icon {
  transform: rotate(180deg);
}

.accordion-content {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

/* Toggle Checkbox */
.toggle-checkbox {
  position: relative;
  width: 2.75rem;
  height: 1.5rem;
  appearance: none;
  background: var(--color-neutral-300);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-checkbox:checked {
  background: var(--color-primary);
}

.toggle-checkbox::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle-checkbox:checked::before {
  transform: translateX(1.25rem);
}

/* Safe Area */
.safe-bottom {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
}
</style>
