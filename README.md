# 커슐랭(Cochelin) Frontend

카페 발견과 커피 경험을 공유하는 소셜 플랫폼의 프론트엔드 애플리케이션입니다.

## 주요 기능

- **지도 기반 카페 탐색**: 네이버 지도 API를 활용한 주변 카페 검색 및 상세 정보 조회
- **AI 추천 시스템**: 사용자 취향 기반 원두/메뉴 개인화 추천
- **커피 패스포트**: 월별 커피 소비 기록 및 통계 (로스터리, 원산지별)
- **리뷰 시스템**: 카페/메뉴 리뷰 작성, 수정, 별점 평가 및 커핑 노트
- **저장 기능**: 관심 카페 폴더별 저장 및 관리 (북마크 시스템)
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
├── api/              # API 클라이언트
│   ├── axios.js      # Axios 인스턴스 (인터셉터, 토큰 갱신)
│   ├── auth.js       # 인증 API
│   ├── bean.js       # 원두 API
│   ├── bookmark.js   # 북마크 폴더/저장 API
│   ├── cafe.js       # 카페 검색 API
│   ├── menu.js       # 메뉴 API
│   ├── owner.js      # 점주 관리 API
│   ├── passport.js   # 커피 패스포트 API
│   ├── preference.js # 취향 설정 API
│   ├── recommendation.js # AI 추천 API
│   ├── review.js     # 리뷰 API
│   └── visit.js      # 방문 기록 API
├── assets/           # 전역 스타일 (Tailwind CSS), 아이콘
├── components/       # 재사용 가능한 UI 컴포넌트
│   ├── common/       # 기본 컴포넌트 (BaseButton, BaseHeader, BeanCard, StoreCard 등)
│   ├── bean/         # 원두 관련 컴포넌트 (BeanFlavorWheel)
│   ├── map/          # 지도 관련 컴포넌트 (MapControls, MarkerPopup, StoreListSheet 등)
│   ├── menu/         # 메뉴 관련 컴포넌트 (MenuList)
│   ├── owner/        # 점주 관리 컴포넌트
│   ├── passport/     # 패스포트 컴포넌트 (PassportCard, PassportTimeline 등)
│   ├── recommendation/ # 추천 컴포넌트 (MenuRecommendationCard 등)
│   ├── review/       # 리뷰 컴포넌트 (ReviewCard, FlavorWheel, CuppingNoteForm 등)
│   └── saved/        # 저장 기능 컴포넌트 (SavedFolderList, BookmarkFolderSelectModal 등)
├── composables/      # Vue Composables
│   ├── useGeolocation.js  # 위치 정보
│   ├── useNaverMap.js     # 네이버 지도 초기화
│   ├── useMapMarkers.js   # 마커 관리
│   ├── useMapPopup.js     # 팝업 위치
│   └── useMapControls.js  # 줌 컨트롤
├── constants/        # 상수 정의 (카테고리, 국가, 품종, 가공방식, 플레이버 휠 등)
├── router/           # Vue Router 설정 및 인증 가드
├── store/            # Pinia 스토어 (auth, saved, flavor, passport, recommendation)
├── utils/            # 유틸리티 함수
│   ├── address.js    # 주소 파싱/지오코딩
│   ├── date.js       # 날짜 포맷팅 (formatDate, formatRelativeTime 등)
│   ├── geo.js        # 거리 계산, 좌표 검증
│   ├── logger.js     # 구조화된 로깅
│   ├── storage.js    # 안전한 localStorage 래퍼
│   └── toast.js      # 토스트 알림 헬퍼
├── views/            # 페이지 컴포넌트 (기능별 디렉토리)
│   ├── auth/         # 인증 페이지 (LoginView, NicknameRegistrationView, OAuthCallbackView)
│   ├── bean/         # 원두 페이지 (BeanDetailView)
│   ├── dev/          # 개발용 페이지 (ComponentTestView)
│   ├── main/         # 메인 페이지 (HomeView, MapView, RecommendationView, SavedView)
│   ├── owner/        # 점주 페이지 (OwnerStoreListView, OwnerMenuManageView 등)
│   ├── passport/     # 패스포트 페이지 (PassportView, PassportDetailView)
│   ├── profile/      # 프로필 페이지 (ProfileView, MyPreferenceView, PreferenceOnboardingView)
│   ├── review/       # 리뷰 페이지 (ReviewWriteView, ReviewDetailView, MyReviewsView 등)
│   └── store/        # 매장 페이지 (StoreDetailView, MenuDetailView, MenuView)
├── App.vue           # 루트 컴포넌트
├── config.js         # 앱 설정
└── main.js           # 앱 진입점
```

## 주요 페이지

### 메인 네비게이션

| 경로               | 페이지                   | 설명                       |
| ------------------ | ------------------------ | -------------------------- |
| `/map`             | MapView                  | 지도 기반 카페 탐색 (메인) |
| `/recommendation`  | RecommendationView       | AI 추천 원두/메뉴          |
| `/passport`        | PassportView             | 커피 패스포트              |
| `/saved`           | SavedView                | 저장한 카페 목록           |
| `/profile`         | ProfileView              | 내 프로필                  |

### 상세 페이지

| 경로                    | 페이지              | 설명           |
| ----------------------- | ------------------- | -------------- |
| `/store/:storeId`       | StoreDetailView     | 카페 상세      |
| `/menus/:menuId`        | MenuDetailView      | 메뉴 상세      |
| `/bean/:beanId`         | BeanDetailView      | 원두 상세      |
| `/passport/:passportId` | PassportDetailView  | 패스포트 상세  |

### 리뷰

| 경로                    | 페이지           | 설명           |
| ----------------------- | ---------------- | -------------- |
| `/review/write`         | ReviewWriteView  | 리뷰 작성      |
| `/reviews/:reviewId`    | ReviewDetailView | 리뷰 상세      |
| `/reviews/:reviewId/edit` | ReviewEditView | 리뷰 수정      |
| `/my-reviews`           | MyReviewsView    | 내 리뷰 목록   |

### 프로필/설정

| 경로                    | 페이지                   | 설명           |
| ----------------------- | ------------------------ | -------------- |
| `/preference-onboarding`| PreferenceOnboardingView | 취향 온보딩    |
| `/my-preference`        | MyPreferenceView         | 내 취향 관리   |
| `/my-profile/edit`      | MyProfileEditView        | 프로필 편집    |

### 점주 전용

| 경로                           | 페이지               | 설명           |
| ------------------------------ | -------------------- | -------------- |
| `/owner/stores`                | OwnerStoreListView   | 내 가게 목록   |
| `/owner/stores/new`            | OwnerStoreFormView   | 가게 등록      |
| `/owner/stores/:storeId/edit`  | OwnerStoreFormView   | 가게 수정      |
| `/owner/stores/:storeId/menus` | OwnerMenuManageView  | 메뉴 관리      |
| `/owner/stores/:storeId/menus/new` | OwnerMenuFormView | 메뉴 등록      |
| `/owner/menus/:menuId/edit`    | OwnerMenuFormView    | 메뉴 수정      |
| `/owner/stores/:storeId/beans/new` | OwnerBeanFormView | 원두 등록      |

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

### 날짜 포맷팅

```javascript
// 날짜 유틸리티 사용 예시
import { formatDate, formatRelativeTime } from '@/utils/date'

formatDate('2024-12-24T10:30:00')        // "2024.12.24"
formatRelativeTime('2024-12-24T10:30:00') // "5분 전", "어제" 등
```

## 디자인 시스템

- **Primary Color**: `#846148` (브라운)
- **Accent Color**: `#ff9800` (오렌지)
- **Success**: `#66bb6a`, **Error**: `#d32f2f`
- **Font**: Pretendard
- **모바일 우선**: 최대 너비 448px, 데스크톱에서 중앙 정렬

색상 및 스타일은 `src/assets/main.css`의 `@theme` 지시어에서 정의됩니다.
