<template>
  <div class="flex flex-col min-h-full bg-background">
    <header class="relative w-full h-14 bg-white flex items-center justify-center px-5 border-b border-border flex-shrink-0">
      <div class="absolute left-5 flex items-center">
        <button
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-50 transition-colors"
          aria-label="뒤로가기"
          @click="goBack"
        >
          <BaseIcon name="chevron-left" :size="24" class="text-neutral-900" />
        </button>
      </div>
      <h1 class="text-lg font-bold text-textPrimary">새 원두 등록</h1>
    </header>

    <form class="form-content" @submit.prevent="handleSubmit">
      <div class="bg-white rounded-xl p-4 space-y-4">
        <div class="flex items-center justify-between py-2 px-1">
          <div>
            <span class="text-sm font-medium text-textPrimary">블렌드 원두</span>
            <p class="text-xs text-textSecondary mt-0.5">여러 원산지의 원두를 혼합한 경우</p>
          </div>
          <button
            type="button"
            class="relative w-12 h-6 rounded-full transition-colors"
            :class="isBlend ? 'bg-primary' : 'bg-gray-300'"
            @click="toggleBlend"
          >
            <span
              class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
              :class="isBlend ? 'translate-x-6' : 'translate-x-0.5'"
            />
          </button>
        </div>

        <template v-if="!isBlend">
          <div>
            <label class="block text-sm font-medium text-textPrimary mb-2">
              생산 국가 <span class="text-error">*</span>
            </label>
            <select
              v-model="form.country"
              class="w-full px-4 py-3 rounded-xl border bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
              :class="errors.country ? 'border-error' : 'border-border'"
            >
              <option value="" disabled>국가를 선택하세요</option>
              <optgroup v-for="region in groupedCountries" :key="region.name" :label="region.name">
                <option v-for="country in region.countries" :key="country.name" :value="country.name">
                  {{ country.name }}
                </option>
              </optgroup>
            </select>
            <p v-if="errors.country" class="text-xs text-error mt-1">{{ errors.country }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-textPrimary mb-2">농장명</label>
            <BaseInput
              v-model="form.farm"
              placeholder="예: 예가체프"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-textPrimary mb-2">품종</label>
            <select
              v-model="selectedVariety"
              class="w-full px-4 py-3 rounded-xl border border-border bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
              @change="handleVarietySelect"
            >
              <option value="">선택하세요</option>
              <optgroup v-for="group in BEAN_VARIETY_GROUPS" :key="group.group" :label="group.group">
                <option v-for="variety in group.varieties" :key="variety" :value="variety">
                  {{ variety }}
                </option>
              </optgroup>
              <option value="__custom__">직접 입력</option>
            </select>
            <BaseInput
              v-if="isCustomVariety"
              v-model="form.variety"
              placeholder="품종을 직접 입력하세요"
              class="mt-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-textPrimary mb-2">가공 방식</label>
            <select
              v-model="selectedProcessingMethod"
              class="w-full px-4 py-3 rounded-xl border border-border bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
              @change="handleProcessingMethodSelect"
            >
              <option value="">선택하세요</option>
              <optgroup v-for="group in BEAN_PROCESSING_METHOD_GROUPS" :key="group.group" :label="group.group">
                <option v-for="method in group.methods" :key="method.value" :value="method.value">
                  {{ method.label }} ({{ method.value }})
                </option>
              </optgroup>
              <option value="__custom__">직접 입력</option>
            </select>
            <BaseInput
              v-if="isCustomProcessingMethod"
              v-model="form.processingMethod"
              placeholder="가공 방식을 직접 입력하세요"
              class="mt-2"
            />
          </div>
        </template>

        <template v-else>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-textPrimary">
                원산지 정보 <span class="text-error">*</span>
              </label>
              <button
                type="button"
                class="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                @click="addBlendOrigin"
              >
                <BaseIcon name="plus" :size="16" />
                원산지 추가
              </button>
            </div>

            <p v-if="errors.country" class="text-xs text-error">{{ errors.country }}</p>

            <div
              v-for="(origin, index) in blendOrigins"
              :key="index"
              class="blend-origin-card"
            >
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-textSecondary">원산지 {{ index + 1 }}</span>
                <button
                  v-if="blendOrigins.length > 1"
                  type="button"
                  class="text-error hover:bg-error/10 p-1 rounded"
                  @click="removeBlendOrigin(index)"
                >
                  <BaseIcon name="close" :size="16" />
                </button>
              </div>

              <div class="mb-3">
                <label class="block text-xs text-textSecondary mb-1">국가</label>
                <select
                  v-model="origin.country"
                  class="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">선택하세요</option>
                  <optgroup v-for="region in groupedCountries" :key="region.name" :label="region.name">
                    <option v-for="country in region.countries" :key="country.name" :value="country.name">
                      {{ country.name }}
                    </option>
                  </optgroup>
                </select>
              </div>

              <div class="mb-3">
                <label class="block text-xs text-textSecondary mb-1">농장</label>
                <input
                  v-model="origin.farm"
                  placeholder="농장명 (선택)"
                  class="blend-input"
                />
              </div>

              <div class="mb-3">
                <label class="block text-xs text-textSecondary mb-1">품종</label>
                <select
                  v-model="origin.varietySelection"
                  class="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  @change="handleBlendVarietySelect(index)"
                >
                  <option value="">선택하세요</option>
                  <optgroup v-for="group in BEAN_VARIETY_GROUPS" :key="group.group" :label="group.group">
                    <option v-for="variety in group.varieties" :key="variety" :value="variety">
                      {{ variety }}
                    </option>
                  </optgroup>
                  <option value="__custom__">직접 입력</option>
                </select>
                <input
                  v-if="origin.isCustomVariety"
                  v-model="origin.variety"
                  placeholder="품종 직접 입력"
                  class="blend-input mt-2"
                />
              </div>

              <div>
                <label class="block text-xs text-textSecondary mb-1">가공 방식</label>
                <select
                  v-model="origin.processingMethodSelection"
                  class="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  @change="handleBlendProcessingMethodSelect(index)"
                >
                  <option value="">선택하세요</option>
                  <optgroup v-for="group in BEAN_PROCESSING_METHOD_GROUPS" :key="group.group" :label="group.group">
                    <option v-for="method in group.methods" :key="method.value" :value="method.value">
                      {{ method.label }} ({{ method.value }})
                    </option>
                  </optgroup>
                  <option value="__custom__">직접 입력</option>
                </select>
                <input
                  v-if="origin.isCustomProcessingMethod"
                  v-model="origin.processingMethod"
                  placeholder="가공 방식 직접 입력"
                  class="blend-input mt-2"
                />
              </div>
            </div>
          </div>
        </template>

        <div>
          <label class="block text-sm font-medium text-textPrimary mb-2">로스팅</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="level in ROASTING_LEVELS"
              :key="level.value"
              type="button"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors',
                form.roastingLevel === level.value
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-border bg-white text-textSecondary hover:border-primary-300'
              ]"
              @click="form.roastingLevel = level.value"
            >
              {{ level.label }}
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-textPrimary">향미 노트</label>
            <button
              type="button"
              class="text-sm text-primary font-medium hover:underline"
              @click="showFlavorSelector = !showFlavorSelector"
            >
              {{ showFlavorSelector ? '접기' : '선택하기' }}
            </button>
          </div>

          <div v-if="selectedFlavorCodes.length > 0 && !showFlavorSelector" class="flex flex-wrap gap-1.5">
            <span
              v-for="code in selectedFlavorCodes"
              :key="code"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
            >
              {{ getFlavorDisplayName(code) }}
            </span>
          </div>
          <p v-else-if="!showFlavorSelector" class="text-sm text-textSecondary">
            이 원두의 향미 특성을 선택하세요 (선택사항)
          </p>

          <Transition name="slide-down">
            <div v-if="showFlavorSelector" class="mt-3 -mx-4">
              <HierarchicalFlavorSelector
                v-model="selectedFlavorCodes"
                :max-selection="10"
              />
            </div>
          </Transition>
        </div>

        <div>
          <label class="block text-sm font-medium text-textPrimary mb-2">
            원두 이름 <span class="text-error">*</span>
          </label>
          <div class="relative">
            <BaseInput
              v-model="form.name"
              placeholder="국가 농장 형태로 자동 생성됩니다"
              @input="isNameManuallyEdited = true"
            />
            <button
              v-if="isNameManuallyEdited && form.name !== autoGeneratedName"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline"
              @click="resetToAutoName"
            >
              자동 생성
            </button>
          </div>
          <p class="text-xs text-textSecondary mt-1">
            자동 생성: {{ autoGeneratedName || '국가를 선택하세요' }}
          </p>
        </div>
      </div>
    </form>

    <div class="bottom-button-area">
      <BaseButton
        variant="primary"
        size="large"
        class="w-full"
        :loading="isSubmitting"
        :disabled="!isFormValid"
        @click="handleSubmit"
      >
        원두 등록
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BEAN_COUNTRIES, BEAN_VARIETY_GROUPS, BEAN_PROCESSING_METHOD_GROUPS, ROASTING_LEVELS, findFlavorInWheel } from '@/constants'
import { getStoreById } from '@/api/cafe'
import { createBean } from '@/api/owner'
import { updateBeanFlavors } from '@/api/bean'
import { createLogger } from '@/utils/logger'
import { showSuccess, showError } from '@/utils/toast'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import HierarchicalFlavorSelector from '@/components/common/HierarchicalFlavorSelector.vue'

const logger = createLogger('OwnerBeanForm')
const route = useRoute()
const router = useRouter()

const groupedCountries = computed(() => {
  const regions = {}
  BEAN_COUNTRIES.forEach(country => {
    if (!regions[country.region]) {
      regions[country.region] = []
    }
    regions[country.region].push(country)
  })

  const regionOrder = ['아프리카', '남미', '중미', '카리브', '아시아', '북미', '중동', '블렌드']

  return regionOrder
    .filter(r => regions[r])
    .map(r => ({
      name: r,
      countries: regions[r]
    }))
})

const storeId = computed(() => route.params.storeId)
const storeInfo = ref(null)

const isBlend = ref(false)

const form = ref({
  country: '',
  farm: '',
  variety: '',
  processingMethod: '',
  roastingLevel: '',
  name: ''
})

const createEmptyOrigin = () => ({
  country: '',
  farm: '',
  variety: '',
  processingMethod: '',
  varietySelection: '',
  processingMethodSelection: '',
  isCustomVariety: false,
  isCustomProcessingMethod: false
})

const blendOrigins = ref([createEmptyOrigin(), createEmptyOrigin()])

const errors = ref({
  country: ''
})

const isSubmitting = ref(false)
const isNameManuallyEdited = ref(false)

const selectedFlavorCodes = ref([])
const showFlavorSelector = ref(false)

const selectedVariety = ref('')
const isCustomVariety = ref(false)

const selectedProcessingMethod = ref('')
const isCustomProcessingMethod = ref(false)

/**
 * 자동 생성된 이름
 */
const autoGeneratedName = computed(() => {
  if (isBlend.value) {
    const countries = blendOrigins.value
      .map(o => o.country)
      .filter(c => c.trim())
    if (countries.length === 0) return ''
    return `${countries.join(' & ')} 블렌드`
  }
  if (!form.value.country) return ''
  return form.value.farm
    ? `${form.value.country} ${form.value.farm}`
    : form.value.country
})

/**
 * 폼 유효성
 */
const isFormValid = computed(() => {
  if (isBlend.value) {
    const validOrigins = blendOrigins.value.filter(o => o.country.trim())
    return validOrigins.length >= 2 && form.value.name.trim()
  }
  return form.value.country.trim() && form.value.name.trim()
})

/**
 * 국가/농장 변경시 이름 자동 업데이트
 */
watch(
  [
    () => form.value.country,
    () => form.value.farm,
    () => blendOrigins.value.map(o => o.country).join(','),
    isBlend
  ],
  () => {
    if (!isNameManuallyEdited.value) {
      form.value.name = autoGeneratedName.value
    }
  }
)

/**
 * 자동 생성 이름으로 리셋
 */
const resetToAutoName = () => {
  form.value.name = autoGeneratedName.value
  isNameManuallyEdited.value = false
}

/**
 * 블렌드 모드 토글
 */
const toggleBlend = () => {
  isBlend.value = !isBlend.value
  isNameManuallyEdited.value = false
  form.value.name = autoGeneratedName.value
}

/**
 * 블렌드 원산지 추가
 */
const addBlendOrigin = () => {
  blendOrigins.value.push(createEmptyOrigin())
}

/**
 * 블렌드 원산지 제거
 */
const removeBlendOrigin = (index) => {
  if (blendOrigins.value.length > 1) {
    blendOrigins.value.splice(index, 1)
  }
}

/**
 * 블렌드 품종 선택 핸들러
 */
const handleBlendVarietySelect = (index) => {
  const origin = blendOrigins.value[index]
  if (origin.varietySelection === '__custom__') {
    origin.isCustomVariety = true
    origin.variety = ''
  } else {
    origin.isCustomVariety = false
    origin.variety = origin.varietySelection
  }
}

/**
 * 블렌드 가공 방식 선택 핸들러
 */
const handleBlendProcessingMethodSelect = (index) => {
  const origin = blendOrigins.value[index]
  if (origin.processingMethodSelection === '__custom__') {
    origin.isCustomProcessingMethod = true
    origin.processingMethod = ''
  } else {
    origin.isCustomProcessingMethod = false
    origin.processingMethod = origin.processingMethodSelection
  }
}

/**
 * 가게 정보 로드
 */
const fetchStoreInfo = async () => {
  try {
    const response = await getStoreById(storeId.value)
    storeInfo.value = response.data || response
  } catch (err) {
    logger.error('가게 정보 로드 실패', err)
  }
}

/**
 * 품종 선택 핸들러
 */
const handleVarietySelect = () => {
  if (selectedVariety.value === '__custom__') {
    isCustomVariety.value = true
    form.value.variety = ''
  } else {
    isCustomVariety.value = false
    form.value.variety = selectedVariety.value
  }
}

/**
 * 가공 방식 선택 핸들러
 */
const handleProcessingMethodSelect = () => {
  if (selectedProcessingMethod.value === '__custom__') {
    isCustomProcessingMethod.value = true
    form.value.processingMethod = ''
  } else {
    isCustomProcessingMethod.value = false
    form.value.processingMethod = selectedProcessingMethod.value
  }
}

/**
 * 뒤로 가기
 */
const goBack = () => {
  router.back()
}

/**
 * 배열을 쉼표로 구분된 문자열로 변환 (모두 비어있으면 null)
 */
const arrayToString = (arr) => {
  const filtered = arr.filter(v => v && v.trim())
  return filtered.length > 0 ? filtered.join(', ') : null
}

/**
 * 플레이버 코드를 ID로 변환
 */
const convertFlavorCodesToIds = (codes) => {
  return codes
    .map(code => {
      const flavor = findFlavorInWheel(code)
      return flavor?.id
    })
    .filter(id => id != null)
}

/**
 * 플레이버 코드로 한글 이름 조회
 */
const getFlavorDisplayName = (code) => {
  const flavor = findFlavorInWheel(code)
  return flavor?.name || code
}

/**
 * 폼 제출
 */
const handleSubmit = async () => {
  errors.value = { country: '' }
  if (isBlend.value) {
    const validOrigins = blendOrigins.value.filter(o => o.country.trim())
    if (validOrigins.length < 2) {
      errors.value.country = '블렌드 원두는 최소 2개의 원산지가 필요합니다'
      return
    }
  } else {
    if (!form.value.country.trim()) {
      errors.value.country = '생산 국가를 선택하세요'
      return
    }
  }

  if (!storeInfo.value?.roasteryId) {
    showError('로스터리 정보를 찾을 수 없습니다')
    return
  }

  isSubmitting.value = true
  try {
    let beanData

    if (isBlend.value) {
      const validOrigins = blendOrigins.value.filter(o => o.country.trim())
      const countries = validOrigins.map(o => o.country.trim())
      const farms = validOrigins.map(o => o.farm?.trim() || '')
      const varieties = validOrigins.map(o => o.variety?.trim() || '')
      const processingMethods = validOrigins.map(o => o.processingMethod || '')

      beanData = {
        roasteryId: storeInfo.value.roasteryId,
        name: form.value.name.trim(),
        country: countries.join(', '),
        farm: arrayToString(farms),
        variety: arrayToString(varieties),
        processingMethod: arrayToString(processingMethods),
        roastingLevel: form.value.roastingLevel || null
      }
    } else {
      beanData = {
        roasteryId: storeInfo.value.roasteryId,
        name: form.value.name.trim(),
        country: form.value.country.trim(),
        farm: form.value.farm.trim() || null,
        variety: form.value.variety.trim() || null,
        processingMethod: form.value.processingMethod || null,
        roastingLevel: form.value.roastingLevel || null
      }
    }

    const createdBean = await createBean(beanData)
    const newBeanId = createdBean?.beanId || createdBean?.id
    logger.info('원두 생성 성공', { isBlend: isBlend.value, beanId: newBeanId })

    if (selectedFlavorCodes.value.length > 0 && newBeanId) {
      try {
        const flavorIds = convertFlavorCodesToIds(selectedFlavorCodes.value)
        if (flavorIds.length > 0) {
          await updateBeanFlavors(newBeanId, flavorIds)
          logger.info('플레이버 매핑 성공', { beanId: newBeanId, flavorIds })
        }
      } catch (flavorErr) {
        logger.warn('플레이버 매핑 실패 (원두는 등록됨)', flavorErr)
      }
    }

    showSuccess('원두가 등록되었습니다')

    router.replace({
      name: 'owner-menus',
      params: { storeId: storeId.value },
      query: { tab: 'bean' }
    })
  } catch (err) {
    logger.error('원두 생성 실패', err)
    showError('원두 등록에 실패했습니다')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchStoreInfo()
})
</script>

<style scoped>
.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  padding-bottom: 1rem;
}

.bottom-button-area {
  flex-shrink: 0;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid var(--color-border);
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}

.blend-origin-card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1rem;
}

.blend-origin-card:hover {
  border-color: var(--color-primary-300);
}

.blend-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background-color: white;
  font-size: 0.875rem;
  color: var(--color-textPrimary);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.blend-input::placeholder {
  color: var(--color-textSecondary);
}

.blend-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-100);
}

.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.2s ease-in;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
