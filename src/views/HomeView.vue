<template>
  <section class="home">
    <h1>프론트엔드 구조 안내</h1>
    <p>
      기본 Vue 3 + Vite 프로젝트 구조를 세팅했습니다. 컴포넌트, 뷰, 라우터,
      전역 상태(Pinia) 디렉터리를 참고하여 화면을 확장하면 됩니다.
    </p>
    <ul>
      <li><strong>components</strong>: 재사용 가능한 UI 컴포넌트</li>
      <li><strong>views</strong>: 라우터와 연결되는 화면 단위</li>
      <li><strong>router</strong>: 페이지 라우팅 정의</li>
      <li><strong>store</strong>: 전역 상태 관리(Pinia)</li>
      <li><strong>assets</strong>: 전역 스타일, 이미지 등 정적 자원</li>
    </ul>
  </section>
</template>

<style scoped>
.home {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

h1 {
  margin-top: 0;
}

ul {
  padding-left: 1.5rem;
}

li + li {
  margin-top: 0.5rem;
}
</style>

