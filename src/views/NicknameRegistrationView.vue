<template>
  <div class="nickname-container">
    <!-- Back Button -->
    <button class="back-button" @click="handleBack">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="content-wrapper">
      <!-- Title Section -->
      <div class="title-section">
        <h1 class="title">Commeet에서 사용할<br>닉네임을 등록해 주세요</h1>
      </div>

      <!-- Input Section -->
      <div class="input-section">
        <input
          v-model="nickname"
          type="text"
          class="nickname-input"
          :class="{
            'input-success': validationState === 'success',
            'input-error': validationState === 'error' || validationState === 'duplicate'
          }"
          placeholder="닉네임을 입력해 주세요 (12자 이내)"
          maxlength="12"
          @input="validateNickname"
        />
        <div v-if="validationState === 'error' || validationState === 'duplicate'" class="helper-text error">
          {{ helperMessage }}
        </div>
        <div v-if="validationState === 'success'" class="helper-text success">
          {{ helperMessage }}
        </div>
        <div class="character-count">{{ nickname.length }}/12</div>
      </div>

      <!-- Bottom Section -->
      <div class="bottom-section">
        <button
          class="start-button"
          :disabled="!isValid"
          @click="handleStart"
        >
          시작하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const nickname = ref('');
const validationState = ref('idle'); // 'idle', 'success', 'error', 'duplicate'
const helperMessage = ref('');

// TODO: 실제 환경에서는 API로 중복 체크를 해야 합니다
const duplicateNicknames = ['test', '테스트', 'admin', '관리자'];

const isValid = computed(() => {
  return nickname.value.trim().length > 0 && validationState.value === 'success';
});

const validateNickname = () => {
  const trimmedNickname = nickname.value.trim();

  // 입력이 없으면 초기 상태로
  if (nickname.value.length === 0) {
    validationState.value = 'idle';
    helperMessage.value = '';
    return;
  }

  // 공백만 입력된 경우
  if (trimmedNickname.length === 0) {
    validationState.value = 'error';
    helperMessage.value = '공백만 입력할 수 없습니다';
    return;
  }

  // 특수문자 검증
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/g;
  if (specialCharPattern.test(nickname.value)) {
    validationState.value = 'error';
    helperMessage.value = '특수문자는 사용할 수 없습니다';
    return;
  }

  // TODO: 실제로는 API 호출로 중복 체크를 해야 합니다
  // 중복 닉네임 검사 (임시 로직)
  if (duplicateNicknames.includes(trimmedNickname)) {
    validationState.value = 'duplicate';
    helperMessage.value = '중복된 닉네임입니다.';
    return;
  }

  // 모든 검증 통과
  validationState.value = 'success';
  helperMessage.value = '사용할 수 있는 닉네임이에요';
};

const handleBack = () => {
  router.back();
};

const handleStart = () => {
  if (!isValid.value) return;

  // TODO: Implement nickname registration logic
  console.log('Register nickname:', nickname.value);
  // router.push('/');
};
</script>

<style scoped>
.nickname-container {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 1rem;
  position: relative;
}

.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.back-button:hover {
  opacity: 0.7;
}

.content-wrapper {
  max-width: 360px;
  margin: 0 auto;
  padding-top: 4rem;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 2rem);
}

.title-section {
  margin-bottom: 2.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.5;
  color: #1a1a1a;
}

.input-section {
  position: relative;
  margin-bottom: auto;
}

.nickname-input {
  width: 100%;
  height: 56px;
  padding: 0 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  color: #1a1a1a;
  transition: border-color 0.2s ease;
}

.nickname-input:focus {
  outline: none;
  border-color: #667eea;
}

.nickname-input.input-success {
  border-color: #667eea;
}

.nickname-input.input-success:focus {
  border-color: #667eea;
}

.nickname-input.input-error {
  border-color: #ff9800;
}

.nickname-input.input-error:focus {
  border-color: #ff9800;
}

.nickname-input::placeholder {
  color: #b0b0b0;
}

.helper-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.helper-text.error {
  color: #ff9800;
}

.helper-text.success {
  color: #667eea;
}

.character-count {
  position: absolute;
  right: 1rem;
  top: 70px;
  font-size: 0.875rem;
  color: #8b95a1;
}

.bottom-section {
  padding-bottom: 2rem;
}

.start-button {
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 8px;
  background-color: #d0d0d0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-button:not(:disabled) {
  background-color: #667eea;
}

.start-button:not(:disabled):hover {
  background-color: #5568d3;
}

.start-button:disabled {
  cursor: not-allowed;
}
</style>
