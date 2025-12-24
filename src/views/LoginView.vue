<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4 py-8">
    <div class="w-full max-w-[360px] flex flex-col items-center">
      <!-- Logo Section -->
      <div class="mb-16">
        <img :src="logoUrl" alt="Comeet" class="w-48 h-48" />
      </div>

      <!-- Login Buttons Section -->
      <div class="w-full flex flex-col gap-3">
        <button
          class="w-full h-[52px] border-none rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 bg-[#03c75a] text-white"
          @click="handleNaverLogin"
        >
          <img :src="naverLogo" alt="Naver" class="w-5 h-5 absolute left-5" />
          <span>네이버로 시작하기</span>
        </button>
      </div>

      <!-- Browse without login -->
      <BaseButton
        variant="ghost"
        size="medium"
        class="mt-8"
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
import logoUrl from '@/assets/logo.svg?url';

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
