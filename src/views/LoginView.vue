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
        <button class="login-btn kakao" @click="handleKakaoLogin">
          <img src="@/assets/kakao_logo.svg" alt="Kakao" class="btn-icon" />
          <span>카카오로 시작하기</span>
        </button>

        <button class="login-btn naver" @click="handleNaverLogin">
          <img src="@/assets/naver_logo.svg" alt="Naver" class="btn-icon" />
          <span>네이버로 시작하기</span>
        </button>

        <button class="login-btn google" @click="handleGoogleLogin">
          <img src="@/assets/google_logo.svg" alt="Google" class="btn-icon" />
          <span>Google로 시작하기</span>
        </button>
      </div>

      <!-- Browse without login -->
      <button class="browse-without-login" @click="handleBrowseWithoutLogin">
        로그인 없이 둘러보기
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import config from '@/config';

const router = useRouter();

const handleKakaoLogin = () => {
  // OAuth2 카카오 로그인 - 백엔드로 리다이렉트
  window.location.href = `${config.api.baseURL}/oauth2/authorization/kakao`;
};

const handleNaverLogin = () => {
  // OAuth2 네이버 로그인 - 백엔드로 리다이렉트
  window.location.href = `${config.api.baseURL}/oauth2/authorization/naver`;
};

const handleGoogleLogin = () => {
  // OAuth2 구글 로그인 - 백엔드로 리다이렉트
  window.location.href = `${config.api.baseURL}/oauth2/authorization/google`;
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
  background-color: #f6f8fb;
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
  color: #1a1a1a;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.icon.wine {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.icon.cake {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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
  transition: all 0.2s ease;
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

.login-btn.kakao {
  background-color: #fee500;
  color: #000000;
}

.login-btn.naver {
  background-color: #03c75a;
  color: #ffffff;
}

.login-btn.google {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #dadce0;
}

.browse-without-login {
  background: none;
  border: none;
  color: #8b95a1;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-top: 1rem;
  text-align: center;
  width: 100%;
}

.browse-without-login:hover {
  color: #6b7684;
}
</style>
