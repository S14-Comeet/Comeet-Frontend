# Comeet Frontend 구조 안내

Vue 3 + Vite 기반의 기본 프로젝트 틀만 구성해 둔 상태입니다. 아래 구조를 참고해 화면과 로직을 확장하면 됩니다.

```
comeet_frontend
├── public
│   ├── favicon.svg
│   └── index.html
├── src
│   ├── assets
│   │   └── main.css
│   ├── components
│   │   └── BaseHeader.vue
│   ├── router
│   │   └── index.js
│   ├── store
│   │   └── index.js
│   ├── views
│   │   └── HomeView.vue
│   ├── App.vue
│   └── main.js
├── jsconfig.json
├── package.json
└── vite.config.js
```

## 사용 방법

1. 의존성 설치  
   ```bash
   npm install
   ```
2. 개발 서버 실행  
   ```bash
   npm run dev
   ```

## 디렉터리 설명

- `src/components` 재사용 가능한 컴포넌트 모음
- `src/views` 라우터에 연결되는 페이지 컴포넌트
- `src/router` 라우트 정의 및 페이지 전환 설정
- `src/store` Pinia 기반 전역 상태
- `src/assets` 전역 스타일 및 정적 자원
- `public` 정적 파일 (빌드 시 그대로 복사)

새 페이지는 `views`에 추가하고 동일한 경로를 `router/index.js`에 등록하면 됩니다. 전역 상태가 필요하면 `store`에 모듈을 추가해 `useXxxStore` 형태로 불러와 사용하세요.
