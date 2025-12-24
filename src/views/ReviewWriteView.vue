<template>
  <div class="flex flex-col h-full bg-white relative">
    <BaseHeader show-back-button />

    <div class="flex-1 overflow-y-auto pb-24">
      <div class="px-5 py-6">
        <h1 class="text-2xl font-bold mb-2 text-neutral-900">리뷰 작성</h1>

        <!-- Review Mode Toggle -->
        <div class="mode-toggle mb-6">
          <button
            class="mode-btn"
            :class="{ 'active': reviewMode === 'simple' }"
            @click="reviewMode = 'simple'"
          >
            <BaseIcon name="coffee" :size="18" />
            간편 리뷰
          </button>
          <button
            class="mode-btn"
            :class="{ 'active': reviewMode === 'professional' }"
            @click="reviewMode = 'professional'"
          >
            <BaseIcon name="edit" :size="18" />
            전문 커핑
          </button>
        </div>

        <!-- Store & Menu Info -->
        <div class="mb-6 p-4 bg-neutral-50 rounded-xl border border-border">
          <div class="flex items-start gap-3">
            <div class="flex-1">
              <p class="text-sm text-textSecondary mb-1">방문한 카페</p>
              <p class="text-lg font-bold text-neutral-900 mb-3">{{ cafeName }}</p>

              <div class="pt-3 border-t border-border">
                <p class="text-sm text-textSecondary mb-1">선택한 메뉴</p>
                <div class="flex items-center justify-between">
                  <p class="font-bold text-neutral-900">{{ menuName }}</p>
                  <p class="text-sm text-primary-700 font-medium">{{ formatPrice(menuPrice) }}원</p>
                </div>
              </div>
            </div>
            <div class="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-lg flex items-center gap-1 flex-shrink-0">
              <BaseIcon name="check" :size="12" />
              인증됨
            </div>
          </div>
        </div>

        <!-- Simple Review Mode -->
        <template v-if="reviewMode === 'simple'">
          <!-- Flavor Selection -->
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
          <!-- Cupping Note Form -->
          <section class="mb-6">
            <CuppingNoteForm v-model="cuppingNote" />
          </section>

          <!-- Flavor Selection (collapsed in pro mode) -->
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

        <!-- Rating (both modes) -->
        <section class="mb-6">
          <h2 class="text-lg font-bold mb-3">별점</h2>
          <div class="flex items-center gap-3">
            <StarRating v-model="rating" :size="36" allow-half />
            <span v-if="rating > 0" class="text-lg font-semibold text-primary">{{ rating }}점</span>
            <span v-else class="text-sm text-textSecondary">(선택)</span>
          </div>
        </section>

        <!-- Content (both modes) -->
        <section class="mb-4">
          <h2 class="text-lg font-bold mb-4">리뷰 내용</h2>
          <textarea
            v-model="content"
            class="w-full h-32 p-4 rounded-xl border border-border resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-base"
            placeholder="커피의 맛, 분위기 등 자세한 후기를 남겨주세요."
          ></textarea>
        </section>

        <!-- Image Upload -->
        <section class="mb-4">
          <h2 class="text-lg font-bold mb-3">사진 첨부</h2>
          <OwnerImageUploader
            v-model="imageUrl"
            alt="리뷰 이미지"
            helper-text="JPG, PNG 파일을 업로드하세요 (최대 5MB)"
            :allow-url-input="false"
          />
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
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 max-w-[448px] mx-auto z-10 safe-bottom">
      <BaseButton
        label="등록하기"
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
import OwnerImageUploader from '@/components/owner/OwnerImageUploader.vue'
import { createReview, createCuppingNote } from '@/api/review'
import { findFlavorInWheel } from '@/constants'
import { showSuccess, showError } from '@/utils/toast'

const logger = createLogger('ReviewWriteView')

const route = useRoute()
const router = useRouter()

// Route params
const storeId = route.query.storeId
const cafeName = route.query.name || '카페'
const menuId = route.query.menuId
const menuName = route.query.menuName || '메뉴'
const menuPrice = Number(route.query.menuPrice) || 0
const visitId = route.query.visitId

// Review mode
const reviewMode = ref('simple') // 'simple' | 'professional'

// Form state
const content = ref('')
const selectedFlavors = ref([])
const isPublic = ref(true)
const isSubmitting = ref(false)
const rating = ref(0) // 별점 (0-5, 선택)
const imageUrl = ref('') // 이미지 URL

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
    // Simple: need content and at least one flavor
    return content.value.trim().length > 0 && selectedFlavors.value.length > 0
  } else {
    // Professional: need at least some scores
    const hasScores = cuppingNote.value.fragranceScore > 0 ||
                      cuppingNote.value.flavorScore > 0 ||
                      cuppingNote.value.acidityScore > 0
    return hasScores
  }
})

const formatPrice = (price) => {
  return price?.toLocaleString('ko-KR') || '0'
}

// flavor code를 ID로 변환
const flavorCodesToIds = (codes) => {
  return codes
    .map(code => findFlavorInWheel(code)?.id)
    .filter(id => id != null)
}

// Redirect if no menu selected
onMounted(() => {
  if (!menuId || !visitId) {
    showError('메뉴 선택 정보가 없습니다.')
    if (storeId) {
      router.replace({
        name: 'store-detail',
        params: { storeId }
      })
    } else {
      router.replace({ name: 'map' })
    }
  }
})

const handleSubmit = async () => {
  if (!isValid.value) return

  isSubmitting.value = true
  try {
    // 1. Create base review (flavor code를 ID로 변환)
    const reviewResponse = await createReview({
      storeId,
      content: content.value,
      flavorIds: flavorCodesToIds(selectedFlavors.value),
      visitId,
      menuId,
      isPublic: isPublic.value,
      rating: rating.value > 0 ? rating.value : null, // 별점 (선택)
      imageUrl: imageUrl.value || null // 이미지 URL
    })

    // 2. If professional mode, create cupping note
    if (reviewMode.value === 'professional' && reviewResponse?.data?.reviewInfo?.reviewId) {
      try {
        await createCuppingNote(reviewResponse.data.reviewInfo.reviewId, cuppingNote.value)
      } catch (cuppingError) {
        logger.warn('Failed to save cupping note', cuppingError)
        // Don't fail the whole review if cupping note fails
      }
    }

    showSuccess('리뷰가 등록되었습니다.')
    router.push({ name: 'map' })
  } catch (error) {
    showError('리뷰 등록에 실패했습니다.')
    logger.error('리뷰 등록 실패', error)
  } finally {
    isSubmitting.value = false
  }
}
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

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
