<template>
  <div class="flex flex-col min-h-full h-full bg-background">
    <div class="flex-1 p-4 overflow-y-auto">
      
      <div class="flex flex-col items-center mb-8">
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            <img
              v-if="profileImageUrl"
              :src="profileImageUrl"
              alt="프로필"
              class="w-full h-full rounded-full object-cover"
            />
            <BaseIcon v-else name="user-line" :size="48" class="text-primary-600" />
          </div>
          
          <label
            class="absolute -bottom-1 -right-1 w-9 h-9 bg-white border-2 border-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary-50 transition-colors"
            :class="{ 'opacity-50 cursor-not-allowed': isUploadingImage }"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              :disabled="isUploadingImage"
              @change="handleImageSelect"
            />
            <span v-if="isUploadingImage" class="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></span>
            <BaseIcon v-else name="edit" :size="18" color="var(--color-primary)" />
          </label>
        </div>
        <p class="text-textSecondary text-sm mt-2">{{ authStore.userEmail }}</p>
        
        <button
          v-if="profileImageUrl && profileImageUrl !== originalProfileImageUrl"
          class="text-xs text-error mt-1 hover:underline"
          @click="resetImage"
        >
          변경 취소
        </button>
      </div>

      
      <div class="bg-white rounded-lg p-4 shadow-sm mb-4">
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-textPrimary mb-2">닉네임</label>
          <BaseInput
            v-model="nickname"
            type="text"
            variant="border"
            :status="nicknameStatus"
            placeholder="닉네임을 입력해 주세요 (12자 이내)"
            :clearable="true"
            @update:model-value="validateNickname"
            @clear="handleNicknameClear"
          />
          <div class="flex justify-between items-center mt-2 px-1">
            <span :class="nicknameHelperClass">{{ nicknameHelperMessage || '\u00A0' }}</span>
            <span class="text-sm text-textSecondary">{{ nickname.length }}/{{ VALIDATION.NICKNAME.MAX_LENGTH }}</span>
          </div>
        </div>

        
        <div class="mb-6">
          <label class="block text-sm font-medium text-textPrimary mb-2">이름</label>
          <div class="h-14 px-5 py-4 bg-surface-light rounded-xl flex items-center">
            <span class="text-textSecondary">{{ authStore.user?.name || '-' }}</span>
          </div>
          <p class="text-xs text-textSecondary mt-1 px-1">소셜 로그인 정보로 수정할 수 없습니다</p>
        </div>

        
        <div>
          <label class="block text-sm font-medium text-textPrimary mb-2">이메일</label>
          <div class="h-14 px-5 py-4 bg-surface-light rounded-xl flex items-center">
            <span class="text-textSecondary">{{ authStore.userEmail }}</span>
          </div>
          <p class="text-xs text-textSecondary mt-1 px-1">소셜 로그인 정보로 수정할 수 없습니다</p>
        </div>
      </div>

      
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <label class="block text-sm font-medium text-textPrimary mb-3">역할</label>
        <div class="flex flex-col gap-3">
          
          <button
            type="button"
            :class="[
              'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
              selectedRole === 'USER'
                ? 'border-primary bg-primary-50'
                : 'border-border bg-white hover:border-neutral-400 hover:bg-primary-50'
            ]"
            @click="selectedRole = 'USER'"
          >
            <span class="flex items-center gap-3">
              <span
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-xl',
                  selectedRole === 'USER' ? 'bg-primary-100' : 'bg-surface-light'
                ]"
              >
                🙋
              </span>
              <span class="flex-1 flex flex-col text-left">
                <span
                  :class="[
                    'font-bold',
                    selectedRole === 'USER' ? 'text-primary-700' : 'text-neutral-900'
                  ]"
                >
                  일반 사용자
                </span>
                <span class="text-xs text-textSecondary">
                  맛집을 찾고, 저장하고, 리뷰를 남겨요
                </span>
              </span>
              
              <span
                v-if="selectedRole === 'USER'"
                class="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </span>
          </button>

          
          <button
            type="button"
            :class="[
              'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
              selectedRole === 'MANAGER'
                ? 'border-primary bg-primary-50'
                : 'border-border bg-white hover:border-neutral-400 hover:bg-primary-50'
            ]"
            @click="selectedRole = 'MANAGER'"
          >
            <span class="flex items-center gap-3">
              <span
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-xl',
                  selectedRole === 'MANAGER' ? 'bg-primary-100' : 'bg-surface-light'
                ]"
              >
                🏠
              </span>
              <span class="flex-1 flex flex-col text-left">
                <span
                  :class="[
                    'font-bold',
                    selectedRole === 'MANAGER' ? 'text-primary-700' : 'text-neutral-900'
                  ]"
                >
                  가맹점주
                </span>
                <span class="text-xs text-textSecondary">
                  내 가게를 등록하고 관리해요
                </span>
              </span>
              
              <span
                v-if="selectedRole === 'MANAGER'"
                class="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>

    
    <div class="p-4 bg-white border-t border-border">
      <BaseButton
        variant="primary"
        size="large"
        :disabled="!hasChanges || !isNicknameValid || isSubmitting"
        :loading="isSubmitting"
        class="w-full"
        @click="handleSave"
      >
        저장하기
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { checkNickname, updateUser, updateUserRole } from '@/api/auth'
import { uploadImage } from '@/api/owner'
import { DEFAULTS, VALIDATION } from '@/constants'
import { showSuccess, showError } from '@/utils/toast'
import { createLogger } from '@/utils/logger'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const logger = createLogger('MyProfileEditView')
const router = useRouter()
const authStore = useAuthStore()

const nickname = ref('')
const profileImageUrl = ref('')
const selectedRole = ref('')
const originalNickname = ref('')
const originalProfileImageUrl = ref('')
const originalRole = ref('')

const fileInput = ref(null)
const isUploadingImage = ref(false)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const nicknameValidationState = ref('idle')
const nicknameHelperMessage = ref('')
const isSubmitting = ref(false)
let debounceTimer = null

onMounted(() => {
  nickname.value = authStore.userNickname || ''
  profileImageUrl.value = authStore.userProfileImage || ''
  selectedRole.value = authStore.user?.role || 'USER'
  originalNickname.value = nickname.value
  originalProfileImageUrl.value = profileImageUrl.value
  originalRole.value = selectedRole.value
  nicknameValidationState.value = 'success'
})

/** 변경사항 유무 */
const hasChanges = computed(() => {
  return nickname.value.trim() !== originalNickname.value ||
    profileImageUrl.value !== originalProfileImageUrl.value ||
    selectedRole.value !== originalRole.value
})

/** 닉네임 유효성 */
const isNicknameValid = computed(() => {
  return nickname.value.trim().length > 0 &&
    (nicknameValidationState.value === 'success' || nickname.value.trim() === originalNickname.value)
})

/** BaseInput status prop */
const nicknameStatus = computed(() => {
  if (nickname.value.trim() === originalNickname.value) return ''
  if (nicknameValidationState.value === 'success') return 'success'
  if (nicknameValidationState.value === 'error' || nicknameValidationState.value === 'duplicate') return 'error'
  return ''
})

/** Helper text 색상 클래스 */
const nicknameHelperClass = computed(() => {
  if (nicknameValidationState.value === 'success') return 'text-sm text-success'
  if (nicknameValidationState.value === 'error' || nicknameValidationState.value === 'duplicate') return 'text-sm text-error'
  return 'text-sm text-textSecondary'
})

/** 닉네임 유효성 검사 */
const validateNickname = async () => {

  if (nickname.value.trim() === originalNickname.value) {
    nicknameValidationState.value = 'success'
    nicknameHelperMessage.value = ''
    clearTimeout(debounceTimer)
    return
  }

  if (nickname.value.length === 0) {
    nicknameValidationState.value = 'idle'
    nicknameHelperMessage.value = ''
    clearTimeout(debounceTimer)
    return
  }

  if (/\s/.test(nickname.value)) {
    nicknameValidationState.value = 'error'
    nicknameHelperMessage.value = '공백은 사용할 수 없습니다'
    clearTimeout(debounceTimer)
    return
  }

  if (!VALIDATION.NICKNAME.PATTERN.test(nickname.value)) {
    nicknameValidationState.value = 'error'
    nicknameHelperMessage.value = '한글과 영문만 사용할 수 있습니다'
    clearTimeout(debounceTimer)
    return
  }

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    try {
      nicknameValidationState.value = 'checking'
      nicknameHelperMessage.value = '확인 중...'

      const trimmedNickname = nickname.value.trim()
      const isAvailable = await checkNickname(trimmedNickname)

      if (isAvailable) {
        nicknameValidationState.value = 'success'
        nicknameHelperMessage.value = '사용할 수 있는 닉네임이에요'
      } else {
        nicknameValidationState.value = 'duplicate'
        nicknameHelperMessage.value = '이미 사용 중인 닉네임입니다'
      }
    } catch (error) {
      logger.error('닉네임 중복 확인 실패', error)
      nicknameValidationState.value = 'error'
      nicknameHelperMessage.value = '중복 확인에 실패했습니다. 다시 시도해 주세요.'
    }
  }, DEFAULTS.DEBOUNCE_DELAY)
}

/** 닉네임 초기화 */
const handleNicknameClear = () => {
  nickname.value = ''
  nicknameValidationState.value = 'idle'
  nicknameHelperMessage.value = ''
  clearTimeout(debounceTimer)
}

/** 이미지 선택 처리 */
const handleImageSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showError('이미지 파일만 업로드할 수 있습니다')
    return
  }

  if (file.size > MAX_IMAGE_SIZE) {
    showError('파일 크기가 5MB를 초과합니다')
    return
  }

  isUploadingImage.value = true

  try {
    const url = await uploadImage(file)
    profileImageUrl.value = url
    logger.debug('프로필 이미지 업로드 성공', { url })
  } catch (err) {
    logger.error('프로필 이미지 업로드 실패', err)
    showError('이미지 업로드에 실패했습니다')
  } finally {
    isUploadingImage.value = false

    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

/** 이미지 변경 취소 */
const resetImage = () => {
  profileImageUrl.value = originalProfileImageUrl.value
}

/** 저장 */
const handleSave = async () => {
  if (!hasChanges.value || !isNicknameValid.value || isSubmitting.value) return

  isSubmitting.value = true

  try {
    const promises = []

    const userUpdateData = {}
    if (nickname.value.trim() !== originalNickname.value) {
      userUpdateData.nickname = nickname.value.trim()
    }
    if (profileImageUrl.value !== originalProfileImageUrl.value) {
      userUpdateData.profileImageUrl = profileImageUrl.value
    }

    if (Object.keys(userUpdateData).length > 0) {
      promises.push(
        updateUser(userUpdateData)
          .then(() => {
            logger.info('사용자 정보 변경 성공', userUpdateData)
          })
      )
    }

    if (selectedRole.value !== originalRole.value) {
      promises.push(
        updateUserRole(selectedRole.value)
          .then(() => {
            logger.info('역할 변경 성공')
          })
      )
    }

    await Promise.all(promises)

    await authStore.fetchUser()

    showSuccess('정보가 수정되었습니다')
    router.back()
  } catch (error) {
    logger.error('정보 수정 실패', error)

    const errorCode = error.response?.data?.error?.code

    if (errorCode === 'NICKNAME_DUPLICATED') {
      nicknameValidationState.value = 'duplicate'
      nicknameHelperMessage.value = '이미 사용 중인 닉네임입니다'
    } else if (errorCode === 'INVALID_NICKNAME_FORMAT') {
      nicknameValidationState.value = 'error'
      nicknameHelperMessage.value = '닉네임 형식이 올바르지 않습니다'
    }

  } finally {
    isSubmitting.value = false
  }
}
</script>
