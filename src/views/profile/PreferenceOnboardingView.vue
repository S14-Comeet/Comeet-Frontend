<template>
  <div class="min-h-screen bg-white relative flex flex-col">
    
    <div class="flex-none flex items-center justify-between px-4 py-3 border-b border-border">
      <button
        class="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
        aria-label="뒤로 가기"
        @click="handleBack"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="text-lg font-bold text-textPrimary">취향 설정</h1>
      <button
        class="text-sm text-textSecondary hover:text-textPrimary transition-colors"
        @click="handleSkip"
      >
        건너뛰기
      </button>
    </div>

    
    <div class="flex-none px-4 py-3">
      <div class="flex gap-2">
        <div
          v-for="step in totalSteps"
          :key="step"
          class="flex-1 h-1 rounded-full transition-colors duration-300"
          :class="step <= currentStep ? 'bg-primary' : 'bg-primary-100'"
        />
      </div>
      <p class="text-xs text-textSecondary mt-2 text-center">
        {{ currentStep }} / {{ totalSteps }}
      </p>
    </div>

    
    <div class="flex-1 overflow-hidden flex flex-col pb-24">
      <Transition :name="transitionName" mode="out-in">
        
        <div v-if="currentStep === 1" key="step1" class="flex-1 flex flex-col px-4 overflow-y-auto">
          <div class="mb-6">
            <h2 class="text-xl font-bold text-textPrimary">어떤 맛을 좋아하세요?</h2>
            <p class="text-sm text-textSecondary mt-1">커피의 맛 선호도를 알려주세요</p>
          </div>

          <div class="space-y-4">
            <PreferenceSlider
              v-model="preferences.prefAcidity"
              label="산미"
              low-label="부드럽게"
              high-label="화사하게"
            />
            <PreferenceSlider
              v-model="preferences.prefBody"
              label="바디감"
              low-label="가볍게"
              high-label="묵직하게"
            />
            <PreferenceSlider
              v-model="preferences.prefSweetness"
              label="단맛"
              low-label="드라이"
              high-label="달콤하게"
            />
            <PreferenceSlider
              v-model="preferences.prefBitterness"
              label="쓴맛"
              low-label="부드럽게"
              high-label="진하게"
            />
          </div>

          <div class="flex-1" />
        </div>

        
        <div v-else-if="currentStep === 2" key="step2" class="flex-1 flex flex-col px-4 overflow-y-auto">
          <div class="mb-6">
            <h2 class="text-xl font-bold text-textPrimary">로스팅은 어떻게 좋아하세요?</h2>
            <p class="text-sm text-textSecondary mt-1">여러 개 선택할 수 있어요</p>
          </div>

          <div class="flex flex-col gap-3">
            <button
              v-for="roast in roastingLevels"
              :key="roast.value"
              class="w-full p-4 rounded-xl border-2 text-left transition-all duration-200"
              :class="[
                isRoastSelected(roast.value)
                  ? 'border-primary bg-primary-50'
                  : 'border-border bg-white hover:border-neutral-400'
              ]"
              @click="toggleRoast(roast.value)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span
                    class="font-bold text-base"
                    :class="isRoastSelected(roast.value) ? 'text-primary-700' : 'text-textPrimary'"
                  >
                    {{ roast.label }}
                  </span>
                  <p class="text-sm text-textSecondary mt-0.5">{{ roast.description }}</p>
                </div>
                <div
                  v-if="isRoastSelected(roast.value)"
                  class="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>

          <div class="flex-1" />
        </div>

        
        <div v-else-if="currentStep === 3" key="step3" class="flex-1 flex flex-col overflow-y-auto">
          <div class="px-4 mb-4">
            <h2 class="text-xl font-bold text-textPrimary">좋아하는 향미는?</h2>
            <p class="text-sm text-textSecondary mt-1">
              선택된 향미: {{ likedFlavorCodes.length }}개
              <span v-if="likedFlavorCodes.length < 3" class="text-primary"> (3개 이상 권장)</span>
            </p>
          </div>

          <HierarchicalFlavorSelector v-model="likedFlavorCodes" :max-selection="10" />
        </div>

        
        <div v-else-if="currentStep === 4" key="step4" class="flex-1 flex flex-col overflow-y-auto">
          <div class="px-4 mb-4">
            <h2 class="text-xl font-bold text-textPrimary">피하고 싶은 향미는?</h2>
            <p class="text-sm text-textSecondary mt-1">
              선택된 향미: {{ dislikedFlavorCodes.length }}개
              <span class="text-textSecondary"> (없으면 바로 완료)</span>
            </p>
          </div>

          <HierarchicalFlavorSelector
            v-model="dislikedFlavorCodes"
            :max-selection="10"
            :exclude-codes="likedFlavorCodes"
          />
        </div>
      </Transition>
    </div>

    
    <div class="floating-button-container">
      <BaseButton
        variant="primary"
        size="large"
        :disabled="!canProceed || isSubmitting"
        :loading="isSubmitting"
        class="w-full"
        @click="handleNext"
      >
        {{ nextButtonLabel }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useRecommendationStore } from '@/store/recommendation'
import { updatePreference, initPreference } from '@/api/preference'
import { showSuccess, showError } from '@/utils/toast'
import { createLogger } from '@/utils/logger'

import BaseButton from '@/components/common/BaseButton.vue'
import PreferenceSlider from '@/components/common/PreferenceSlider.vue'
import HierarchicalFlavorSelector from '@/components/common/HierarchicalFlavorSelector.vue'

const logger = createLogger('PreferenceOnboardingView')
const router = useRouter()
const recommendationStore = useRecommendationStore()

const totalSteps = 4
const roastingLevels = [
  { value: 'LIGHT', label: '라이트', description: '산미가 강하고 과일향이 풍부해요' },
  { value: 'MEDIUM', label: '미디엄', description: '균형 잡힌 맛과 향을 즐길 수 있어요' },
  { value: 'HEAVY', label: '다크', description: '깊은 쓴맛과 고소한 향이 특징이에요' }
]

const currentStep = ref(1)
const isSubmitting = ref(false)
const transitionDirection = ref('forward')

const preferences = reactive({
  prefAcidity: 5,
  prefBody: 5,
  prefSweetness: 5,
  prefBitterness: 5,
  preferredRoastLevels: []
})

const likedFlavorCodes = ref([])
const dislikedFlavorCodes = ref([])

const transitionName = computed(() => {
  return transitionDirection.value === 'forward' ? 'slide-left' : 'slide-right'
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return true
    case 2:
      return preferences.preferredRoastLevels.length > 0
    case 3:
      return likedFlavorCodes.value.length > 0
    case 4:
      return true
    default:
      return false
  }
})

const nextButtonLabel = computed(() => {
  if (currentStep.value === totalSteps) {
    return '완료'
  }
  if (currentStep.value === 3 && likedFlavorCodes.value.length === 0) {
    return '향미를 선택해주세요'
  }
  return '다음'
})

const isRoastSelected = (value) => {
  return preferences.preferredRoastLevels.includes(value)
}

const toggleRoast = (value) => {
  const index = preferences.preferredRoastLevels.indexOf(value)
  if (index === -1) {
    preferences.preferredRoastLevels.push(value)
  } else {
    preferences.preferredRoastLevels.splice(index, 1)
  }
}

const handleBack = () => {
  if (currentStep.value > 1) {
    transitionDirection.value = 'backward'
    currentStep.value--
  } else {
    router.back()
  }
}

const handleSkip = () => {
  showSuccess('나중에 프로필에서 설정할 수 있어요')
  router.push('/map')
}

const handleNext = async () => {
  if (currentStep.value < totalSteps) {
    transitionDirection.value = 'forward'
    currentStep.value++
    return
  }

  await submitPreferences()
}

const submitPreferences = async () => {
  isSubmitting.value = true

  try {

    try {
      await initPreference()
    } catch (e) {

      if (e.response?.status !== 409) {
        logger.warn('Preference init returned:', e.response?.status)
      }
    }

    const requestData = {
      prefAcidity: preferences.prefAcidity,
      prefBody: preferences.prefBody,
      prefSweetness: preferences.prefSweetness,
      prefBitterness: preferences.prefBitterness,
      preferredRoastLevels: preferences.preferredRoastLevels,
      likedTags: likedFlavorCodes.value,
      dislikedTags: dislikedFlavorCodes.value
    }

    logger.info('Submitting preferences:', requestData)
    await updatePreference(requestData)

    recommendationStore.clearCache()

    showSuccess('취향 설정이 완료되었어요!')
    router.push('/map')
  } catch (error) {
    logger.error('Failed to save preferences:', error)
    showError('취향 저장에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Floating Button */
.floating-button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  background: linear-gradient(to top, white 80%, transparent);
  z-index: 10;
}

/* Desktop centering for floating button */
@media (min-width: 768px) {
  .floating-button-container {
    max-width: 448px;
    left: 50%;
    transform: translateX(-50%);
  }
}

/* Slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
