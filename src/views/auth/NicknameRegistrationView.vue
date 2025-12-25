<template>
  <div class="min-h-screen bg-white p-4 relative">
    <button
      class="absolute top-4 left-4 w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity z-10"
      aria-label="뒤로 가기"
      @click="handleBack"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="max-w-[360px] mx-auto pt-16 flex flex-col min-h-[calc(100vh-2rem)]">
      <Transition name="nickname-collapse" mode="out-in">
        <div v-if="currentStep === 1" key="step1-input" class="flex-1 flex flex-col">
          <div class="mb-10">
            <h1 class="text-2xl font-bold leading-relaxed text-neutral-900">
              Comeet에서 사용할<br>닉네임을 등록해 주세요
            </h1>
          </div>

          <div class="mb-auto">
            <BaseInput
              v-model="nickname"
              type="text"
              variant="border"
              :status="inputStatus"
              placeholder="닉네임을 입력해 주세요 (12자 이내)"
              :clearable="true"
              @update:model-value="validateNickname"
              @clear="handleClear"
            />
            <div class="flex justify-between items-center mt-2 px-1">
              <span :class="helperTextClass">{{ helperMessage || '\u00A0' }}</span>
              <span class="text-sm text-textSecondary">{{ nickname.length }}/{{ VALIDATION.NICKNAME.MAX_LENGTH }}</span>
            </div>
          </div>

          <div class="pb-8">
            <BaseButton
              variant="primary"
              size="large"
              :disabled="!isNicknameValid"
              class="w-full"
              @click="goToNextStep"
            >
              다음
            </BaseButton>
          </div>
        </div>

        <div v-else key="step2-role" class="flex-1 flex flex-col">
          <div class="mb-6">
            <h1 class="text-2xl font-bold leading-relaxed text-neutral-900">
              어떤 서비스를<br>이용하시겠어요?
            </h1>
            <p class="mt-2 text-sm text-textSecondary">
              나중에 설정에서 변경할 수 있어요
            </p>
          </div>

          <div class="flex flex-col gap-3">
            <button
              type="button"
              :class="[
                'w-full p-5 rounded-2xl border-2 text-left transition-all duration-200',
                selectedRole === 'USER'
                  ? 'border-primary bg-primary-50 shadow-md'
                  : 'border-border bg-white hover:border-neutral-400 hover:bg-primary-50'
              ]"
              @click="selectedRole = 'USER'"
            >
              <span class="flex items-start gap-4">
                <span
:class="[
                  'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
                  selectedRole === 'USER' ? 'bg-primary-100' : 'bg-surface-light'
                ]">
                  🙋
                </span>
                <span class="flex-1 flex flex-col text-left">
                  <span
:class="[
                    'text-lg font-bold mb-1',
                    selectedRole === 'USER' ? 'text-primary-700' : 'text-neutral-900'
                  ]">
                    일반 사용자
                  </span>
                  <span class="text-sm text-textSecondary">
                    맛집을 찾고, 저장하고, 리뷰를 남겨요
                  </span>
                </span>
                <span v-if="selectedRole === 'USER'" class="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </span>
            </button>

            <button
              type="button"
              :class="[
                'w-full p-5 rounded-2xl border-2 text-left transition-all duration-200',
                selectedRole === 'MANAGER'
                  ? 'border-primary bg-primary-50 shadow-md'
                  : 'border-border bg-white hover:border-neutral-400 hover:bg-primary-50'
              ]"
              @click="selectedRole = 'MANAGER'"
            >
              <span class="flex items-start gap-4">
                <span
:class="[
                  'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
                  selectedRole === 'MANAGER' ? 'bg-primary-100' : 'bg-surface-light'
                ]">
                  🏠
                </span>
                <span class="flex-1 flex flex-col text-left">
                  <span
:class="[
                    'text-lg font-bold mb-1',
                    selectedRole === 'MANAGER' ? 'text-primary-700' : 'text-neutral-900'
                  ]">
                    가맹점주
                  </span>
                  <span class="text-sm text-textSecondary">
                    내 가게를 등록하고 관리해요
                  </span>
                </span>
                <span v-if="selectedRole === 'MANAGER'" class="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </span>
            </button>

            <div class="flex items-center justify-between p-4 bg-surface-light rounded-xl mt-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-sm">✓</span>
                </div>
                <div>
                  <p class="text-xs text-textSecondary">닉네임</p>
                  <p class="font-bold text-neutral-900">{{ nickname }}</p>
                </div>
              </div>
              <button
                type="button"
                class="text-sm text-primary font-medium hover:underline"
                @click="goToPrevStep"
              >
                수정
              </button>
            </div>
          </div>

          <div class="flex-1"></div>

          <div class="pb-8">
            <BaseButton
              variant="primary"
              size="large"
              :disabled="!selectedRole || isSubmitting"
              :loading="isSubmitting"
              class="w-full"
              @click="handleSubmit"
            >
              시작하기
            </BaseButton>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { checkNickname, registerUser } from '@/api/auth';
import { useAuthStore } from '@/store/auth';
import { DEFAULTS, VALIDATION } from '@/constants';
import { showSuccess } from '@/utils/toast';
import { createLogger } from '@/utils/logger';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const logger = createLogger('NicknameRegistrationView');
const router = useRouter();
const authStore = useAuthStore();

const currentStep = ref(1);
const nickname = ref('');
const selectedRole = ref('');
const validationState = ref('idle');
const helperMessage = ref('');
const isSubmitting = ref(false);
let debounceTimer = null;

/** BaseInput status prop에 맞는 상태 변환 */
const inputStatus = computed(() => {
  if (validationState.value === 'success') return 'success';
  if (validationState.value === 'error' || validationState.value === 'duplicate') return 'error';
  return '';
});

/** Helper text 색상 클래스 */
const helperTextClass = computed(() => {
  if (validationState.value === 'success') return 'text-sm text-success';
  if (validationState.value === 'error' || validationState.value === 'duplicate') return 'text-sm text-error';
  return 'text-sm text-textSecondary';
});

/** 닉네임 유효성 (다음 단계 진행 가능 여부) */
const isNicknameValid = computed(() => {
  return nickname.value.trim().length > 0 && validationState.value === 'success';
});

/** 닉네임 유효성 검사 */
const validateNickname = async () => {
  if (nickname.value.length === 0) {
    validationState.value = 'idle';
    helperMessage.value = '';
    clearTimeout(debounceTimer);
    return;
  }

  if (/\s/.test(nickname.value)) {
    validationState.value = 'error';
    helperMessage.value = '공백은 사용할 수 없습니다';
    clearTimeout(debounceTimer);
    return;
  }

  if (!VALIDATION.NICKNAME.PATTERN.test(nickname.value)) {
    validationState.value = 'error';
    helperMessage.value = '한글과 영문만 사용할 수 있습니다';
    clearTimeout(debounceTimer);
    return;
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    try {
      validationState.value = 'checking';
      helperMessage.value = '확인 중...';

      const trimmedNickname = nickname.value.trim();
      const isAvailable = await checkNickname(trimmedNickname);

      if (isAvailable) {
        validationState.value = 'success';
        helperMessage.value = '사용할 수 있는 닉네임이에요';
      } else {
        validationState.value = 'duplicate';
        helperMessage.value = '이미 사용 중인 닉네임입니다';
      }
    } catch (error) {
      logger.error('닉네임 중복 확인 실패', error);
      validationState.value = 'error';
      helperMessage.value = '중복 확인에 실패했습니다. 다시 시도해 주세요.';
    }
  }, DEFAULTS.DEBOUNCE_DELAY);
};

/** 입력 초기화 핸들러 */
const handleClear = () => {
  nickname.value = '';
  validationState.value = 'idle';
  helperMessage.value = '';
  clearTimeout(debounceTimer);
};

/** 다음 단계로 이동 */
const goToNextStep = () => {
  if (isNicknameValid.value) {
    currentStep.value = 2;
  }
};

/** 이전 단계로 이동 */
const goToPrevStep = () => {
  currentStep.value = 1;
  selectedRole.value = '';
};

/** 뒤로 가기 */
const handleBack = () => {
  if (currentStep.value === 2) {
    goToPrevStep();
  } else {
    router.back();
  }
};

/** 사용자 등록 완료 */
const handleSubmit = async () => {
  if (!isNicknameValid.value || !selectedRole.value || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    await registerUser({
      nickname: nickname.value.trim(),
      role: selectedRole.value
    });

    await authStore.fetchUser();
    showSuccess(`환영합니다, ${nickname.value.trim()}님!`);
    router.push('/preference-onboarding');
  } catch (error) {

    const errorCode = error.response?.data?.error?.code;
    const errorMessage = error.response?.data?.error?.message;

    if (errorCode === 'U-002') {
      helperMessage.value = '닉네임을 입력해 주세요';
    } else if (errorCode === 'U-003') {
      helperMessage.value = '닉네임 형식이 올바르지 않습니다';
    } else {
      helperMessage.value = errorMessage || '등록에 실패했습니다. 다시 시도해 주세요.';
    }

    currentStep.value = 1;
    validationState.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.nickname-collapse-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.nickname-collapse-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nickname-collapse-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.nickname-collapse-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
