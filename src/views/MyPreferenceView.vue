<template>
  <div class="flex flex-col min-h-full bg-background">
    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <BaseIcon name="spinner" class="animate-spin text-primary" :size="32" />
      </div>

      <!-- Error / No Preference -->
      <div v-else-if="error || !hasPreference" class="flex flex-col items-center justify-center py-20 px-4">
        <div class="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-4">
          <BaseIcon name="coffee" :size="40" class="text-primary" />
        </div>
        <h2 class="text-lg font-bold text-textPrimary mb-2">취향을 설정해주세요</h2>
        <p class="text-sm text-textSecondary text-center mb-6">
          커피 취향을 설정하면<br />더 정확한 추천을 받을 수 있어요
        </p>
        <BaseButton variant="primary" size="medium" @click="goToOnboarding">
          취향 설정하기
        </BaseButton>
      </div>

      <!-- Preference Data -->
      <div v-else class="p-4 space-y-4">
        <!-- Taste Profile Card -->
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <h3 class="font-bold text-textPrimary mb-4">맛 선호도</h3>

          <!-- Radar Chart -->
          <div class="flex justify-center mb-4">
            <div class="radar-chart">
              <svg viewBox="0 0 200 200">
                <!-- Background Polygons -->
                <polygon
                  v-for="level in [10, 7.5, 5, 2.5]"
                  :key="level"
                  :points="getPolygonPoints(level)"
                  fill="none"
                  stroke="#e5e7eb"
                  stroke-width="1"
                />

                <!-- Axis Lines -->
                <line
                  v-for="(_, idx) in tasteFields"
                  :key="'line-' + idx"
                  x1="100"
                  y1="100"
                  :x2="getAxisEndpoint(idx).x"
                  :y2="getAxisEndpoint(idx).y"
                  stroke="#e5e7eb"
                  stroke-width="1"
                />

                <!-- Score Polygon -->
                <polygon
                  :points="getScorePolygonPoints()"
                  fill="rgba(132, 97, 72, 0.25)"
                  stroke="var(--color-primary)"
                  stroke-width="2"
                />

                <!-- Score Points -->
                <circle
                  v-for="(field, idx) in tasteFields"
                  :key="'point-' + idx"
                  :cx="getScorePoint(idx).x"
                  :cy="getScorePoint(idx).y"
                  r="5"
                  fill="var(--color-primary)"
                  stroke="white"
                  stroke-width="2"
                />

                <!-- Labels -->
                <text
                  v-for="(field, idx) in tasteFields"
                  :key="'label-' + idx"
                  :x="getLabelPosition(idx).x"
                  :y="getLabelPosition(idx).y"
                  text-anchor="middle"
                  class="chart-label"
                >
                  {{ field.label }}
                </text>
              </svg>
            </div>
          </div>

          <!-- Score List -->
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="field in tasteFields"
              :key="field.key"
              class="flex items-center justify-between p-3 bg-primary-50 rounded-lg"
            >
              <span class="text-sm text-textPrimary">{{ field.label }}</span>
              <span class="text-lg font-bold text-primary">{{ preference[field.key] }}</span>
            </div>
          </div>
        </div>

        <!-- Roasting Preference -->
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <h3 class="font-bold text-textPrimary mb-3">선호 로스팅</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="roast in preference.preferredRoastLevels"
              :key="roast"
              class="px-3 py-1.5 rounded-full text-sm font-medium"
              :class="getRoastingClass(roast)"
            >
              {{ getRoastingLabel(roast) }}
            </span>
            <span v-if="!preference.preferredRoastLevels?.length" class="text-sm text-textSecondary">
              설정된 로스팅 선호가 없습니다
            </span>
          </div>
        </div>

        <!-- Liked Flavors -->
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <h3 class="font-bold text-textPrimary mb-3">좋아하는 향미</h3>
          <div v-if="preference.likedTags?.length" class="flex flex-wrap gap-2">
            <FlavorChip
              v-for="tag in preference.likedTags"
              :key="tag"
              :flavor="{ code: tag }"
            />
          </div>
          <p v-else class="text-sm text-textSecondary">설정된 선호 향미가 없습니다</p>
        </div>

        <!-- Disliked Flavors -->
        <div class="bg-white rounded-xl p-4 shadow-sm">
          <h3 class="font-bold text-textPrimary mb-3">피하고 싶은 향미</h3>
          <div v-if="preference.dislikedTags?.length" class="flex flex-wrap gap-2">
            <span
              v-for="tag in preference.dislikedTags"
              :key="tag"
              class="px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-200 text-neutral-700"
            >
              {{ getFlavorName(tag) }}
            </span>
          </div>
          <p v-else class="text-sm text-textSecondary">설정된 비선호 향미가 없습니다</p>
        </div>

        <!-- Reset Button -->
        <div class="pt-2 pb-4">
          <BaseButton
            variant="secondary"
            size="large"
            class="w-full"
            :loading="isResetting"
            @click="confirmReset"
          >
            취향 다시 설정하기
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Reset Confirmation Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showResetModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          @click.self="cancelReset"
        >
          <div class="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl">
            <h3 class="text-lg font-bold text-neutral-900 mb-2">취향 초기화</h3>
            <p class="text-textSecondary mb-6">
              기존 취향 설정을 삭제하고<br />처음부터 다시 설정하시겠습니까?
            </p>
            <div class="flex gap-3">
              <BaseButton
                variant="secondary"
                size="medium"
                class="flex-1"
                @click="cancelReset"
              >
                취소
              </BaseButton>
              <BaseButton
                variant="primary"
                size="medium"
                class="flex-1"
                :loading="isResetting"
                @click="handleReset"
              >
                초기화
              </BaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPreference, deletePreference } from '@/api/preference'
import { useRecommendationStore } from '@/store/recommendation'
import { findFlavorInWheel, ROASTING_LEVELS } from '@/constants'
import { showSuccess, showError } from '@/utils/toast'
import { createLogger } from '@/utils/logger'

import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import FlavorChip from '@/components/common/FlavorChip.vue'

const logger = createLogger('MyPreferenceView')
const router = useRouter()
const recommendationStore = useRecommendationStore()

// State
const isLoading = ref(true)
const error = ref(null)
const hasPreference = ref(false)
const preference = ref({
  prefAcidity: 5,
  prefBody: 5,
  prefSweetness: 5,
  prefBitterness: 5,
  preferredRoastLevels: [],
  likedTags: [],
  dislikedTags: []
})

const showResetModal = ref(false)
const isResetting = ref(false)

// Taste fields for radar chart
const tasteFields = [
  { key: 'prefAcidity', label: '산미' },
  { key: 'prefBody', label: '바디감' },
  { key: 'prefSweetness', label: '단맛' },
  { key: 'prefBitterness', label: '쓴맛' }
]

// Fetch preference on mount
onMounted(async () => {
  await fetchPreference()
})

const fetchPreference = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await getPreference()
    if (response.data) {
      preference.value = response.data
      hasPreference.value = true
    } else {
      hasPreference.value = false
    }
  } catch (e) {
    if (e.response?.status === 404) {
      hasPreference.value = false
    } else {
      logger.error('Failed to fetch preference', e)
      error.value = e
    }
  } finally {
    isLoading.value = false
  }
}

// Radar Chart Calculations
const getPolygonPoints = (maxValue) => {
  const center = 100
  const points = []
  const count = tasteFields.length

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    const radius = (maxValue / 10) * 65
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    points.push(`${x},${y}`)
  }

  return points.join(' ')
}

const getAxisEndpoint = (index) => {
  const center = 100
  const count = tasteFields.length
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2
  const radius = 65

  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle)
  }
}

const getScorePolygonPoints = () => {
  const center = 100
  const points = []
  const count = tasteFields.length

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    const value = preference.value[tasteFields[i].key] || 0
    const radius = (value / 10) * 65
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    points.push(`${x},${y}`)
  }

  return points.join(' ')
}

const getScorePoint = (index) => {
  const center = 100
  const count = tasteFields.length
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2
  const value = preference.value[tasteFields[index].key] || 0
  const radius = (value / 10) * 65

  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle)
  }
}

const getLabelPosition = (index) => {
  const center = 100
  const count = tasteFields.length
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2
  const radius = 85

  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle) + 4
  }
}

// Roasting helpers
const getRoastingLabel = (value) => {
  const found = ROASTING_LEVELS.find(r => r.value === value)
  return found?.label || value
}

const getRoastingClass = (value) => {
  const classes = {
    'LIGHT': 'bg-amber-100 text-amber-800',
    'MEDIUM': 'bg-amber-300 text-amber-900',
    'HEAVY': 'bg-amber-700 text-white'
  }
  return classes[value] || 'bg-gray-200 text-gray-700'
}

// Flavor helpers
const getFlavorName = (code) => {
  const found = findFlavorInWheel(code)
  return found?.name || code
}

// Actions
const goToOnboarding = () => {
  router.push('/preference-onboarding')
}

const confirmReset = () => {
  showResetModal.value = true
}

const cancelReset = () => {
  showResetModal.value = false
}

const handleReset = async () => {
  isResetting.value = true

  try {
    await deletePreference()
    recommendationStore.clearCache()
    showSuccess('취향이 초기화되었습니다')
    showResetModal.value = false
    router.push('/preference-onboarding')
  } catch (e) {
    logger.error('Failed to reset preference', e)
    showError('초기화에 실패했습니다')
  } finally {
    isResetting.value = false
  }
}
</script>

<style scoped>
.radar-chart {
  width: 200px;
  height: 200px;
}

.radar-chart svg {
  width: 100%;
  height: 100%;
}

.chart-label {
  font-size: 11px;
  font-weight: 600;
  fill: var(--color-textPrimary);
}

/* Modal transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
