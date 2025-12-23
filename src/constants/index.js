/**
 * 애플리케이션 전역 상수
 * 변하지 않는 정적인 값들을 관리합니다.
 */

// 애플리케이션 상수
export const APP_CONSTANTS = {
  NAME: 'Comeet',
  DESCRIPTION: 'Comeet 프로젝트',
  DEFAULT_LOCALE: 'ko',
  SUPPORTED_LOCALES: ['ko', 'en']
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_INFO: 'comeet_user_info',
  THEME: 'comeet_theme',
  LANGUAGE: 'comeet_language'
};

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  NICKNAME: '/nickname',
  OAUTH_CALLBACK: '/oauth/callback',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings'
};

// API 엔드포인트
export const API_ENDPOINTS = {
  // OAuth2 인증
  OAUTH2: {
    NAVER: '/oauth2/authorization/naver',
    KAKAO: '/oauth2/authorization/kakao',
    GOOGLE: '/oauth2/authorization/google'
  },
  // 인증 관련
  AUTH: {
    LOGOUT: '/auth/logout',
    REISSUE: '/auth/reissue',
  },
  // 사용자 정보
  USER: {
    INFO: '/user',
    NICKNAME_CHECK: '/user/nickname/check',
    REGISTER: '/user/register'
  },
  // 알림
  NOTIFICATION: {
    LIST: '/api/notifications',
    READ: '/api/notifications/:id/read',
    READ_ALL: '/api/notifications/read-all',
    DELETE: '/api/notifications/:id',
    DELETE_ALL: '/api/notifications/delete-all'
  }
};

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// 메시지 타입
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// 유효성 검사 규칙
export const VALIDATION = {
  NICKNAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 12,
    // 한글(가-힣), 영문(a-z, A-Z)만 허용, 공백 불가
    PATTERN: /^[가-힣a-zA-Z]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 20,
    PATTERN: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

// 카테고리 (백엔드 enum과 동일) - 메뉴/가게 공통 사용
export const MENU_CATEGORIES = [
  { value: 'HAND_DRIP', label: '핸드드립' },
  { value: 'ESPRESSO', label: '에스프레소' },
  { value: 'AMERICANO', label: '아메리카노' },
  { value: 'LATTE', label: '라떼' },
  { value: 'CAPPUCCINO', label: '카푸치노' },
  { value: 'FLAT_WHITE', label: '플랫화이트' },
  { value: 'COLD_BREW', label: '콜드브루' }
]

// 원두 생산 국가 목록 (좌표 포함, 지역별 가나다순)
export const BEAN_COUNTRIES = [
  // 아프리카 (가나다순)
  { name: '르완다', lat: -1.9403, lng: 29.8739, region: '아프리카' },
  { name: '부룬디', lat: -3.3731, lng: 29.9189, region: '아프리카' },
  { name: '세인트헬레나', lat: -15.9650, lng: -5.7089, region: '아프리카' },
  { name: '아프리카/아라비아', lat: 9.1450, lng: 40.4897, region: '아프리카' },
  { name: '에티오피아', lat: 9.1450, lng: 40.4897, region: '아프리카' },
  { name: '에티오피아; 수마트라', lat: 9.1450, lng: 40.4897, region: '아프리카' },
  { name: '아이티; 에티오피아', lat: 18.9712, lng: -72.2852, region: '아프리카' },
  { name: '우간다', lat: 1.3733, lng: 32.2903, region: '아프리카' },
  { name: '잠비아', lat: -13.1339, lng: 27.8493, region: '아프리카' },
  { name: '케냐', lat: -0.0236, lng: 37.9062, region: '아프리카' },
  { name: '콩고 민주 공화국', lat: -4.0383, lng: 21.7587, region: '아프리카' },
  { name: '탄자니아', lat: -6.3690, lng: 34.8888, region: '아프리카' },
  // 남미 (가나다순)
  { name: '남아메리카', lat: -14.2350, lng: -51.9253, region: '남미' },
  { name: '베네수엘라', lat: 6.4238, lng: -66.5897, region: '남미' },
  { name: '볼리비아', lat: -16.2902, lng: -63.5887, region: '남미' },
  { name: '브라질', lat: -14.2350, lng: -51.9253, region: '남미' },
  { name: '에콰도르', lat: -1.8312, lng: -78.1834, region: '남미' },
  { name: '콜롬비아', lat: 4.5709, lng: -74.2973, region: '남미' },
  { name: '페루', lat: -9.1900, lng: -75.0152, region: '남미' },
  // 중미 (가나다순)
  { name: '과테말라', lat: 15.7835, lng: -90.2308, region: '중미' },
  { name: '니카라과', lat: 12.8654, lng: -85.2072, region: '중미' },
  { name: '멕시코', lat: 23.6345, lng: -102.5528, region: '중미' },
  { name: '엘살바도르', lat: 13.7942, lng: -88.8965, region: '중미' },
  { name: '온두라스', lat: 15.1990, lng: -86.2419, region: '중미' },
  { name: '코스타리카', lat: 9.7489, lng: -83.7534, region: '중미' },
  { name: '파나마', lat: 8.5380, lng: -80.7821, region: '중미' },
  // 카리브 (가나다순)
  { name: '아이티', lat: 18.9712, lng: -72.2852, region: '카리브' },
  { name: '자메이카', lat: 18.1096, lng: -77.2975, region: '카리브' },
  { name: '푸에르토리코', lat: 18.2208, lng: -66.5901, region: '카리브' },
  // 아시아 (가나다순)
  { name: '네팔', lat: 28.3949, lng: 84.1240, region: '아시아' },
  { name: '대만', lat: 23.6978, lng: 120.9605, region: '아시아' },
  { name: '동티모르', lat: -8.8742, lng: 125.7275, region: '아시아' },
  { name: '말레이시아', lat: 4.2105, lng: 101.9758, region: '아시아' },
  { name: '베트남', lat: 14.0583, lng: 108.2772, region: '아시아' },
  { name: '인도네시아', lat: -0.7893, lng: 113.9213, region: '아시아' },
  { name: '중국', lat: 25.0000, lng: 102.0000, region: '아시아' },
  { name: '태국', lat: 15.8700, lng: 100.9925, region: '아시아' },
  { name: '파푸아뉴기니', lat: -6.3149, lng: 143.9555, region: '아시아' },
  { name: '필리핀', lat: 12.8797, lng: 121.7740, region: '아시아' },
  // 북미 (가나다순)
  { name: '미국', lat: 36.7783, lng: -119.4179, region: '북미' },
  { name: '하와이', lat: 19.8968, lng: -155.5828, region: '북미' },
  // 중동
  { name: '예멘', lat: 15.5527, lng: 48.5164, region: '중동' }
]

// 원두 품종 목록 (그룹별 분류, 그룹 내 알파벳순)
export const BEAN_VARIETY_GROUPS = [
  {
    group: '주요 품종',
    varieties: ['Arabica', 'Liberica', 'Robusta']
  },
  {
    group: 'Bourbon 계열',
    varieties: ['Bourbon', 'Bourbon Pointu', 'Bourbon Sidra', 'Pink Bourbon', 'Red Bourbon']
  },
  {
    group: 'Caturra 계열',
    varieties: ['Caturra', 'Yellow Caturra']
  },
  {
    group: 'Catuai 계열',
    varieties: ['Catuai', 'Red Catuaí', 'Yellow Catuai']
  },
  {
    group: 'Typica 계열',
    varieties: ['Kona Typica', 'Typica']
  },
  {
    group: 'Gesha/Geisha',
    varieties: ['Geisha', 'Gesha']
  },
  {
    group: 'SL 계열',
    varieties: ['SL28', 'SL34']
  },
  {
    group: '에티오피아 품종',
    varieties: ['74110', '74112', '74158', 'Ethiopian Heirloom', 'Sudan Rume', 'Wush Wush']
  },
  {
    group: '기타',
    varieties: ['Castillo', 'Java', 'Maracaturra', 'Maragogype', 'Mocca', 'Pacamara', 'Pache', 'Parainema', 'Peaberry', 'Pointu Laurina', 'Sidra', 'Tabi', 'Villa Sarchi']
  }
]

// 품종 평탄화 목록 (하위 호환성)
export const BEAN_VARIETIES = BEAN_VARIETY_GROUPS.flatMap(g => g.varieties)

// 원두 가공 방식 목록 (그룹별 분류, 그룹 내 알파벳순)
export const BEAN_PROCESSING_METHOD_GROUPS = [
  {
    group: '기본',
    methods: [
      { value: 'Honey', label: '허니' },
      { value: 'Natural', label: '내추럴' },
      { value: 'Washed', label: '워시드' }
    ]
  },
  {
    group: '허니 변형',
    methods: [
      { value: 'Black Honey', label: '블랙 허니' },
      { value: 'Red Honey', label: '레드 허니' },
      { value: 'White Honey', label: '화이트 허니' }
    ]
  },
  {
    group: '혐기성 발효',
    methods: [
      { value: 'Anaerobic', label: '혐기성' },
      { value: 'Anaerobic Natural', label: '혐기성 내추럴' },
      { value: 'Anaerobic Washed', label: '혐기성 워시드' },
      { value: 'Double Anaerobic', label: '더블 혐기성' }
    ]
  },
  {
    group: '특수 가공',
    methods: [
      { value: 'Carbonic Maceration', label: '탄산 침용' },
      { value: 'Fermented', label: '발효' },
      { value: 'Lactic Natural', label: '젖산 내추럴' },
      { value: 'Wet-Hulled', label: '웻헐드' },
      { value: 'Wine Process', label: '와인 프로세스' },
      { value: 'Yeast Process', label: '이스트 프로세스' }
    ]
  }
]

// 가공 방식 평탄화 목록 (하위 호환성)
export const BEAN_PROCESSING_METHODS = BEAN_PROCESSING_METHOD_GROUPS.flatMap(g => g.methods)

// 로스팅 레벨
export const ROASTING_LEVELS = [
  { value: 'LIGHT', label: '라이트' },
  { value: 'MEDIUM', label: '미디엄' },
  { value: 'DARK', label: '다크' }
]

// 기본 설정값
export const DEFAULTS = {
  PAGE_SIZE: 20,
  TIMEOUT: 10000, // 10초
  DEBOUNCE_DELAY: 300, // 300ms
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif']
};
