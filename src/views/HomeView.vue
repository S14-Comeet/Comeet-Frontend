<template>
  <section class="min-h-full bg-background p-4">
    <div class="bg-white p-8 rounded-xl shadow-sm">
      <h1 class="text-textPrimary text-2xl font-bold mt-0 mb-4">
        프론트엔드 구조 안내
      </h1>
      <p class="text-textPrimary mb-6 leading-relaxed">
        기본 Vue 3 + Vite 프로젝트 구조를 세팅했습니다. 컴포넌트, 뷰, 라우터,
        전역 상태(Pinia) 디렉터리를 참고하여 화면을 확장하면 됩니다.
      </p>
      <ul class="pl-6 space-y-2 text-textPrimary">
        <li><strong class="font-semibold">components</strong>: 재사용 가능한 UI 컴포넌트</li>
        <li><strong class="font-semibold">views</strong>: 라우터와 연결되는 화면 단위</li>
        <li><strong class="font-semibold">router</strong>: 페이지 라우팅 정의</li>
        <li><strong class="font-semibold">store</strong>: 전역 상태 관리(Pinia)</li>
        <li><strong class="font-semibold">assets</strong>: 전역 스타일, 이미지 등 정적 자원</li>
      </ul>
    </div>
  </section>
</template>

