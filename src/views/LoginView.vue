<template>
  <div class="login-container">
    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="header-section">
        <h1 class="title">Commeet<br>커피테스트</h1>

        <!-- Icon Group -->
        <div class="icon-group">
          <div class="icon-item">
            <div class="icon coffee">☕</div>
          </div>
          <div class="icon-item">
            <div class="icon wine">🍷</div>
          </div>
          <div class="icon-item">
            <div class="icon cake">🎂</div>
          </div>
        </div>
      </div>

      <!-- Login Buttons Section -->
      <div class="login-buttons">

        <button class="login-btn naver" @click="handleNaverLogin">
          <img :src="naverLogo" alt="Naver" class="btn-icon" />
          <span>네이버로 시작하기</span>
        </button>

      </div>

      <!-- Browse without login -->
      <BaseButton
        variant="ghost"
        size="medium"
        class="mt-4"
        @click="handleBrowseWithoutLogin"
      >
        로그인 없이 둘러보기
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import config from '@/config';
import BaseButton from '@/components/common/BaseButton.vue';
import naverLogo from '@/assets/naver_logo.svg?url';

const router = useRouter();

const handleNaverLogin = () => {
  // OAuth2 네이버 로그인 - 백엔드로 리다이렉트
  globalThis.location.href = `${config.api.baseURL}/oauth2/authorization/naver`;
};

const handleBrowseWithoutLogin = () => {
  // 로그인 없이 홈으로 이동
  router.push('/');
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  padding: 2rem 1rem;
}

.content-wrapper {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.header-section {
  text-align: center;
}

.title {
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.6;
  color: var(--color-textPrimary);
  margin-bottom: 2.5rem;
}

.icon-group {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.icon-item {
  position: relative;
}

.icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.icon.coffee {
  background-color: var(--color-primary-500);
}

.icon.wine {
  background-color: var(--color-primary-600);
}

.icon.cake {
  background-color: var(--color-primary-400);
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.login-btn {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-btn:active {
  transform: translateY(0);
}

.btn-icon {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 1.25rem;
}

.login-btn.naver {
  background-color: #03c75a;
  color: #ffffff;
}
</style>
