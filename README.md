# Comeet Frontend

카페 발견과 커피 경험을 공유하는 소셜 플랫폼의 프론트엔드 애플리케이션입니다.

## 주요 기능

- **지도 기반 카페 탐색**: 네이버 지도 API를 활용한 주변 카페 검색 및 상세 정보 조회
- **AI 추천 시스템**: 사용자 취향 기반 원두/메뉴 개인화 추천
- **커피 패스포트**: 월별 커피 소비 기록 및 통계 (로스터리, 원산지별)
- **리뷰 시스템**: 카페/메뉴 리뷰 작성 및 별점 평가
- **저장 기능**: 관심 카페 폴더별 저장 및 관리
- **가게 관리**: 점주용 매장/메뉴/원두 관리 기능
- **OAuth 인증**: 네이버, 카카오, 구글 소셜 로그인

## 기술 스택

| 분류             | 기술                                       |
| ---------------- | ------------------------------------------ |
| Framework        | Vue 3 (Composition API, `<script setup>`) |
| Build Tool       | Vite 5.x                                   |
| Styling          | Tailwind CSS 4.x                           |
| State Management | Pinia (with persistedstate)                |
| Routing          | Vue Router 4                               |
| HTTP Client      | Axios                                      |
| Maps             | Naver Maps API                             |
| Notifications    | Vue Toastification                         |

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm 9+

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 변수를 설정합니다:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_NAVER_MAP_CLIENT_ID=your_naver_map_client_id
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key
VITE_APP_TITLE=Comeet
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG=false
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 코드 린트 및 자동 수정
npm run lint
```

## 프로젝트 구조

```text
src/
├── api/              # API 클라이언트 (axios, auth, cafe, menu, review 등)
├── assets/           # 전역 스타일 (Tailwind CSS), 아이콘
├── components/       # 재사용 가능한 UI 컴포넌트
│   ├── common/       # 기본 컴포넌트 (BaseButton, BaseHeader 등)
│   ├── map/          # 지도 관련 컴포넌트
│   ├── saved/        # 저장 기능 컴포넌트
│   ├── review/       # 리뷰 기능 컴포넌트
│   └── owner/        # 점주 관리 컴포넌트
├── composables/      # Vue Composables (useGeolocation, useNaverMap 등)
├── constants/        # 상수 정의 (카테고리, 국가, 플레이버 휠 등)
├── router/           # Vue Router 설정 및 인증 가드
├── store/            # Pinia 스토어 (auth, saved, passport 등)
├── utils/            # 유틸리티 함수 (storage, logger, toast 등)
├── views/            # 페이지 컴포넌트
│   └── owner/        # 점주용 페이지
├── App.vue           # 루트 컴포넌트
├── config.js         # 앱 설정
└── main.js           # 앱 진입점
```

## 주요 페이지

| 경로               | 페이지                   | 설명                       |
| ------------------ | ------------------------ | -------------------------- |
| `/map`             | MapView                  | 지도 기반 카페 탐색 (메인) |
| `/recommendation`  | RecommendationView       | AI 추천 원두/메뉴          |
| `/passport`        | PassportView             | 커피 패스포트              |
| `/saved`           | SavedView                | 저장한 카페 목록           |
| `/profile`         | ProfileView              | 내 프로필                  |
| `/store/:storeId`  | StoreDetailView          | 카페 상세                  |
| `/menus/:menuId`   | MenuDetailView           | 메뉴 상세                  |
| `/preference`      | PreferenceOnboardingView | 취향 설정                  |

## 개발 가이드

### 컴포넌트 규칙

- Vue 3 Composition API와 `<script setup>` 문법 사용
- 기본 컴포넌트는 `Base*` 접두사 사용 (예: `BaseButton`, `BaseHeader`)
- 기능별 컴포넌트는 해당 디렉터리에 배치 (예: `map/`, `saved/`)

### 상태 관리

```javascript
// 스토어 사용 예시
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isAuthenticated)
```

### API 호출

```javascript
// API 클라이언트 사용 예시
import { getCafeList, getCafeDetail } from '@/api/cafe'

const cafes = await getCafeList({ lat, lng, radius })
const detail = await getCafeDetail(cafeId)
```

### 안전한 스토리지 사용

```javascript
// localStorage 대신 safe storage 사용 (iframe, private 브라우징 대응)
import { getItem, setItem, removeItem } from '@/utils/storage'

setItem('key', value)
const value = getItem('key')
```

## 디자인 시스템

- **Primary Color**: `#846148` (브라운)
- **Accent Color**: `#ff9800` (오렌지)
- **Font**: Pretendard
- **모바일 우선**: 최대 너비 448px, 데스크톱에서 중앙 정렬

색상 및 스타일은 `src/assets/main.css`의 `@theme` 지시어에서 정의됩니다.

## 라이선스

SSAFY Final Project - Comeet Team
