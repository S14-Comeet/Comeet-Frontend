<template>
  <div class="page-container">
    <div class="bg-white px-4 py-5 border-b border-border flex-shrink-0">
      <h1 class="text-xl font-bold text-textPrimary">
        {{ isEditMode ? '메뉴 수정' : '메뉴 추가' }}
      </h1>
      <p class="text-sm text-textSecondary mt-1">
        {{ isEditMode ? '메뉴 정보를 수정하세요' : '새로운 메뉴를 추가하세요' }}
      </p>
    </div>

    <div v-if="isLoadingMenu || isLoadingStore" class="flex-1 flex justify-center items-center">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
    </div>

    <form v-else class="form-content" @submit.prevent="handleSubmit">
      <div class="bg-white rounded-xl p-4 mb-4">
        <h2 class="text-base font-bold text-textPrimary mb-4">기본 정보</h2>

        <div class="mb-4">
          <label class="block text-sm font-medium text-textPrimary mb-2">
            메뉴명 <span class="text-error">*</span>
          </label>
          <BaseInput
            v-model="form.name"
            placeholder="메뉴 이름을 입력하세요"
            :status="errors.name ? 'error' : ''"
            :helper-text="errors.name"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-textPrimary mb-2">설명</label>
          <textarea
            v-model="form.description"
            placeholder="메뉴에 대한 설명을 입력하세요"
            class="w-full px-4 py-3 rounded-xl border border-border bg-white text-textPrimary placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows="3"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-textPrimary mb-2">
            가격 <span class="text-error">*</span>
          </label>
          <BaseInput
            v-model="form.price"
            type="number"
            placeholder="0"
            :status="errors.price ? 'error' : ''"
            :helper-text="errors.price"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-textPrimary mb-2">
            카테고리 <span class="text-error">*</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="cat in MENU_CATEGORIES"
              :key="cat.value"
              type="button"
              :class="[
                'px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors',
                form.category === cat.value
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-border bg-white text-textSecondary hover:border-primary-300'
              ]"
              @click="form.category = cat.value"
            >
              {{ cat.label }}
            </button>
          </div>
          <p v-if="errors.category" class="text-xs text-error mt-1">{{ errors.category }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl p-4 mb-4">
        <h2 class="text-base font-bold text-textPrimary mb-4">이미지</h2>
        <label class="block text-sm font-medium text-textPrimary mb-2">메뉴 이미지</label>
        <OwnerImageUploader
          v-model="form.imageUrl"
          alt="메뉴 이미지"
        />
      </div>

      <div class="bg-white rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-textPrimary">원두 연결</h2>
          <button
            type="button"
            class="text-sm text-primary font-medium"
            @click="showBeanSelector = true"
          >
            + 원두 추가
          </button>
        </div>

        <div v-if="selectedBeans.length === 0" class="text-center py-6 bg-neutral-50 rounded-lg">
          <p class="text-sm text-textSecondary mb-2">연결된 원두가 없습니다</p>
          <button
            type="button"
            class="text-sm text-primary font-medium"
            @click="showBeanSelector = true"
          >
            원두 검색하기
          </button>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="bean in selectedBeans"
            :key="bean.id"
            class="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-200"
          >
            <div class="flex-1 min-w-0">
              <p class="font-medium text-textPrimary truncate">
                {{ bean.country }}
                <span v-if="bean.farm" class="text-textSecondary font-normal">/ {{ bean.farm }}</span>
              </p>
              <p class="text-xs text-textSecondary">
                {{ bean.roasteryName || storeInfo?.roasteryName || '로스터리' }}
                <span v-if="bean.isBlended" class="ml-1 text-primary">(블렌드)</span>
              </p>
            </div>
            <button
              type="button"
              class="ml-2 p-1.5 text-error hover:bg-error/10 rounded-full transition-colors"
              @click="removeBean(bean.id)"
            >
              <BaseIcon name="close" :size="16" />
            </button>
          </div>
        </div>
      </div>
    </form>

    <OwnerBeanSelectorEnhanced
      v-if="showBeanSelector"
      :store-info="storeInfo"
      :selected-bean-ids="selectedBeanIds"
      @close="showBeanSelector = false"
      @select="handleBeanSelect"
    />

    <div class="bottom-button-area">
      <BaseButton
        variant="primary"
        size="large"
        class="w-full"
        :loading="isSubmitting"
        :disabled="!isFormValid"
        @click="handleSubmit"
      >
        {{ isEditMode ? '수정 완료' : '추가하기' }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMenuById } from '@/api/menu'
import { getStoreById } from '@/api/cafe'
import { createMenu, updateMenu, linkBeanToMenu, createBean } from '@/api/owner'
import { createLogger } from '@/utils/logger'
import { showSuccess, showError } from '@/utils/toast'
import { MENU_CATEGORIES } from '@/constants'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import OwnerImageUploader from '@/components/owner/OwnerImageUploader.vue'
import OwnerBeanSelectorEnhanced from '@/components/owner/OwnerBeanSelectorEnhanced.vue'

const logger = createLogger('OwnerMenuForm')
const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => !!route.params.menuId)
const storeId = computed(() => route.params.storeId)
const isLoadingMenu = ref(false)
const isLoadingStore = ref(false)
const isSubmitting = ref(false)
const showBeanSelector = ref(false)
const storeInfo = ref(null)

const form = ref({
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: ''
})

const selectedBeans = ref([])

const selectedBeanIds = computed(() => selectedBeans.value.map(b => b.id))

const errors = ref({
  name: '',
  price: '',
  category: ''
})

/**
 * 폼 유효성 검사
 */
const isFormValid = computed(() => {
  const hasName = form.value.name.trim().length > 0
  const hasPrice = form.value.price !== '' && Number(form.value.price) > 0
  const hasCategory = form.value.category !== ''

  return hasName && hasPrice && hasCategory
})

/**
 * 폼 유효성 검사 (상세)
 */
const validateForm = () => {
  let isValid = true
  errors.value = { name: '', price: '', category: '' }

  if (!form.value.name.trim()) {
    errors.value.name = '메뉴명을 입력하세요'
    isValid = false
  }

  const price = Number(form.value.price)
  if (isNaN(price) || price <= 0) {
    errors.value.price = '유효한 가격을 입력하세요'
    isValid = false
  }

  if (!form.value.category) {
    errors.value.category = '카테고리를 선택하세요'
    isValid = false
  }

  return isValid
}

/**
 * 가게 정보 로드 (로스터리 ID 획득)
 */
const loadStoreInfo = async () => {
  if (!storeId.value) return

  isLoadingStore.value = true
  try {
    const response = await getStoreById(storeId.value)
    storeInfo.value = response.data || response
    logger.debug('가게 정보 로드', storeInfo.value)
  } catch (err) {
    logger.error('가게 정보 로드 실패', err)
  } finally {
    isLoadingStore.value = false
  }
}

/**
 * 기존 메뉴 데이터 로드 (수정 모드)
 */
const loadMenuData = async () => {
  if (!isEditMode.value) return

  isLoadingMenu.value = true
  try {
    const response = await getMenuById(route.params.menuId)
    const menu = response.data || response

    form.value = {
      name: menu.name || '',
      description: menu.description || '',
      price: menu.price?.toString() || '',
      category: menu.category || '',
      imageUrl: menu.imageUrl || ''
    }

    if (menu.beanBadges && menu.beanBadges.length > 0) {
      selectedBeans.value = menu.beanBadges.map(b => ({
        ...b,
        isExisting: true
      }))
    }
  } catch (err) {
    logger.error('메뉴 데이터 로드 실패', err)
    showError('메뉴 정보를 불러오지 못했습니다')
    router.back()
  } finally {
    isLoadingMenu.value = false
  }
}

/**
 * 원두 선택 핸들러
 */
const handleBeanSelect = (bean) => {
  if (selectedBeans.value.some(b => b.id === bean.id)) {
    return
  }

  selectedBeans.value.push({
    ...bean,
    isBlended: bean.isBlended || false,
    isNew: false
  })
  showBeanSelector.value = false
}

/**
 * 원두 제거
 */
const removeBean = (beanId) => {
  selectedBeans.value = selectedBeans.value.filter(b => b.id !== beanId)
}

/**
 * 폼 제출
 */
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    const formData = {
      name: form.value.name.trim(),
      description: form.value.description.trim() || null,
      price: Number(form.value.price),
      category: form.value.category,
      imageUrl: form.value.imageUrl.trim() || null
    }

    let menuId

    if (isEditMode.value) {
      await updateMenu(route.params.menuId, formData)
      menuId = route.params.menuId
      showSuccess('메뉴가 수정되었습니다')
    } else {
      const response = await createMenu(storeId.value, formData)
      const createdMenu = response.data || response
      menuId = createdMenu.id
      showSuccess('메뉴가 추가되었습니다')
    }

    const newBeans = selectedBeans.value.filter(b => !b.isExisting)

    for (const bean of newBeans) {
      try {
        let beanId = bean.id

        if (bean.isPending) {
          const createdBean = await createBean({
            roasteryId: bean.roasteryId,
            country: bean.country,
            farm: bean.farm,
            variety: bean.variety,
            processingMethod: bean.processingMethod,
            roastingLevel: bean.roastingLevel,
            description: bean.description
          })
          beanId = createdBean.id || createdBean.data?.id
          logger.debug('원두 생성 완료', createdBean)
        }

        await linkBeanToMenu(menuId, {
          beanId: beanId,
          isBlended: bean.isBlended || false
        })
        logger.debug('원두 연결 완료', { menuId, beanId })
      } catch (err) {
        logger.error('원두 연결 실패', err)
      }
    }

    router.back()
  } catch (err) {
    logger.error('메뉴 저장 실패', err)
    showError(isEditMode.value ? '메뉴 수정에 실패했습니다' : '메뉴 추가에 실패했습니다')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadStoreInfo()
  loadMenuData()
})
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background-color: var(--color-background);
}

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
</style>
