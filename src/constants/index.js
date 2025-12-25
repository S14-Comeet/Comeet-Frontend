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
    UPDATE: '/user',
    NICKNAME_CHECK: '/user/nickname/check',
    REGISTER: '/user/register',
    ROLE: '/user/role'
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

// 로스팅 레벨 (백엔드 enum: LIGHT, MEDIUM, HEAVY)
export const ROASTING_LEVELS = [
  { value: 'LIGHT', label: '라이트' },
  { value: 'MEDIUM', label: '미디엄' },
  { value: 'HEAVY', label: '다크' }
]

// 기본 설정값
export const DEFAULTS = {
  PAGE_SIZE: 20,
  TIMEOUT: 10000, // 10초
  DEBOUNCE_DELAY: 300, // 300ms
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif']
};

// Flavor Wheel 데이터 (커피 향미 휠)
// Level 1: 대분류, Level 2: 중분류, Level 3: 세부 향미
export const FLAVOR_WHEEL = [
  {
    id: 1,
    code: 'FRUITY',
    name: '과일향',
    colorHex: '#ED1C24',
    children: [
      {
        id: 101, code: 'BERRY', name: '베리류', colorHex: '#B81141',
        children: [
          { id: 10101, code: 'BLACKBERRY', name: '블랙베리', colorHex: '#4A0E29' },
          { id: 10102, code: 'RASPBERRY', name: '라즈베리', colorHex: '#8B1538' },
          { id: 10103, code: 'BLUEBERRY', name: '블루베리', colorHex: '#6B1F42' },
          { id: 10104, code: 'STRAWBERRY', name: '딸기', colorHex: '#B81141' }
        ]
      },
      {
        id: 102, code: 'DRIED_FRUIT', name: '건과일', colorHex: '#D23828',
        children: [
          { id: 10201, code: 'RAISIN', name: '건포도', colorHex: '#A93226' },
          { id: 10202, code: 'PRUNE', name: '자두', colorHex: '#943126' }
        ]
      },
      {
        id: 103, code: 'OTHER_FRUIT', name: '기타 과일', colorHex: '#F16D79',
        children: [
          { id: 10301, code: 'COCONUT', name: '코코넛', colorHex: '#E85D75' },
          { id: 10302, code: 'CHERRY', name: '체리', colorHex: '#D23539' },
          { id: 10303, code: 'POMEGRANATE', name: '석류', colorHex: '#C44B4F' },
          { id: 10304, code: 'PINEAPPLE', name: '파인애플', colorHex: '#F7856D' },
          { id: 10305, code: 'GRAPE', name: '포도', colorHex: '#D45D79' },
          { id: 10306, code: 'APPLE', name: '사과', colorHex: '#F08080' },
          { id: 10307, code: 'PEACH', name: '복숭아', colorHex: '#F7A191' },
          { id: 10308, code: 'PEAR', name: '배', colorHex: '#F9B59F' }
        ]
      },
      {
        id: 104, code: 'CITRUS_FRUIT', name: '감귤류', colorHex: '#F89E4F',
        children: [
          { id: 10401, code: 'GRAPEFRUIT', name: '자몽', colorHex: '#FCAF58' },
          { id: 10402, code: 'ORANGE', name: '오렌지', colorHex: '#FCB045' },
          { id: 10403, code: 'LEMON', name: '레몬', colorHex: '#F9C74F' },
          { id: 10404, code: 'LIME', name: '라임', colorHex: '#F4D56D' }
        ]
      }
    ]
  },
  {
    id: 2,
    code: 'SOUR_FERMENTED',
    name: '발효/신맛',
    colorHex: '#F16521',
    children: [
      {
        id: 201, code: 'SOUR', name: '신맛', colorHex: '#F7A44C',
        children: [
          { id: 20101, code: 'SOUR_AROMATICS', name: '신 향', colorHex: '#F9C74F' },
          { id: 20102, code: 'ACETIC_ACID', name: '아세트산', colorHex: '#F7B32B' },
          { id: 20103, code: 'BUTYRIC_ACID', name: '부티르산', colorHex: '#F39C12' },
          { id: 20104, code: 'ISOVALERIC_ACID', name: '이소발레르산', colorHex: '#E67E22' },
          { id: 20105, code: 'CITRIC_ACID', name: '시트르산', colorHex: '#F8C471' },
          { id: 20106, code: 'MALIC_ACID', name: '말산', colorHex: '#F5B041' }
        ]
      },
      {
        id: 202, code: 'ALCOHOL_FERMENTED', name: '알코올/발효', colorHex: '#F89E4F',
        children: [
          { id: 20201, code: 'WINEY', name: '와인 같은', colorHex: '#F39C12' },
          { id: 20202, code: 'WHISKEY', name: '위스키', colorHex: '#E67E22' },
          { id: 20203, code: 'FERMENTED', name: '발효', colorHex: '#D68910' },
          { id: 20204, code: 'OVERRIPE', name: '과숙', colorHex: '#CA6F1E' }
        ]
      }
    ]
  },
  {
    id: 3,
    code: 'GREEN_VEGETATIVE',
    name: '녹색/채소향',
    colorHex: '#017E3B',
    children: [
      { id: 301, code: 'OLIVE_OIL', name: '올리브 오일', colorHex: '#7AB51D', children: [] },
      {
        id: 302, code: 'RAW', name: '날것', colorHex: '#6FB03F',
        children: [
          { id: 30201, code: 'UNDER_RIPE', name: '덜 익음', colorHex: '#82B74B' },
          { id: 30202, code: 'PEAPOD', name: '완두콩 꼬투리', colorHex: '#7AB51D' }
        ]
      },
      {
        id: 303, code: 'GREEN_VEGETATIVE_SUB', name: '채소향', colorHex: '#5FA84C',
        children: [
          { id: 30301, code: 'FRESH', name: '신선한', colorHex: '#78B159' },
          { id: 30302, code: 'DARK_GREEN', name: '진한 녹색', colorHex: '#6FAE4E' },
          { id: 30303, code: 'VEGETATIVE', name: '채소', colorHex: '#66AB43' },
          { id: 30304, code: 'HAY_LIKE', name: '건초', colorHex: '#5FA43D' },
          { id: 30305, code: 'HERB_LIKE', name: '허브', colorHex: '#579E37' }
        ]
      },
      { id: 304, code: 'BEANY', name: '콩 향', colorHex: '#4F9C52', children: [] }
    ]
  },
  {
    id: 4,
    code: 'OTHER',
    name: '기타',
    colorHex: '#00A5D0',
    children: [
      {
        id: 401, code: 'PAPERY_MUSTY', name: '종이/곰팡이', colorHex: '#5B8FA3',
        children: [
          { id: 40101, code: 'STALE', name: '묵은', colorHex: '#7FA99B' },
          { id: 40102, code: 'CARDBOARD', name: '골판지', colorHex: '#75A594' },
          { id: 40103, code: 'PAPERY', name: '종이', colorHex: '#6BA18D' },
          { id: 40104, code: 'WOODY', name: '나무', colorHex: '#619D86' },
          { id: 40105, code: 'MOLDY_DAMP', name: '곰팡이/습함', colorHex: '#579980' },
          { id: 40106, code: 'MUSTY_DUSTY', name: '곰팡이/먼지', colorHex: '#4D9579' },
          { id: 40107, code: 'MUSTY_EARTHY', name: '곰팡이/흙', colorHex: '#439172' },
          { id: 40108, code: 'ANIMALIC', name: '동물성', colorHex: '#398D6B' }
        ]
      },
      {
        id: 402, code: 'CHEMICAL', name: '화학적', colorHex: '#4682B4',
        children: [
          { id: 40201, code: 'BITTER', name: '쓴맛', colorHex: '#5499C7' },
          { id: 40202, code: 'SALTY', name: '짠맛', colorHex: '#5DADE2' },
          { id: 40203, code: 'MEDICINAL', name: '약품', colorHex: '#85C1E9' },
          { id: 40204, code: 'PETROLEUM', name: '석유', colorHex: '#AED6F1' },
          { id: 40205, code: 'SKUNKY', name: '스컹크', colorHex: '#D6EAF8' },
          { id: 40206, code: 'RUBBER', name: '고무', colorHex: '#EBF5FB' }
        ]
      }
    ]
  },
  {
    id: 5,
    code: 'ROASTED',
    name: '로스팅향',
    colorHex: '#6F4E37',
    children: [
      { id: 501, code: 'PIPE_TOBACCO', name: '파이프 담배', colorHex: '#8B6F47', children: [] },
      { id: 502, code: 'TOBACCO', name: '담배', colorHex: '#7D5A3C', children: [] },
      {
        id: 503, code: 'BURNT', name: '탄', colorHex: '#3E2723',
        children: [
          { id: 50301, code: 'ACRID', name: '매캐한', colorHex: '#5D4037' },
          { id: 50302, code: 'ASHY', name: '재', colorHex: '#6D4C41' },
          { id: 50303, code: 'SMOKY', name: '연기', colorHex: '#795548' },
          { id: 50304, code: 'BROWN_ROAST', name: '갈색 로스트', colorHex: '#8D6E63' }
        ]
      },
      {
        id: 504, code: 'CEREAL', name: '시리얼', colorHex: '#A67C52',
        children: [
          { id: 50401, code: 'GRAIN', name: '곡물', colorHex: '#A1887F' },
          { id: 50402, code: 'MALT', name: '맥아', colorHex: '#BCAAA4' }
        ]
      }
    ]
  },
  {
    id: 6,
    code: 'SPICES',
    name: '향신료',
    colorHex: '#D2691E',
    children: [
      { id: 601, code: 'PUNGENT', name: '자극적', colorHex: '#CD853F', children: [] },
      { id: 602, code: 'PEPPER', name: '후추', colorHex: '#D2691E', children: [] },
      {
        id: 603, code: 'BROWN_SPICE', name: '갈색 향신료', colorHex: '#8B4513',
        children: [
          { id: 60301, code: 'ANISE', name: '아니스', colorHex: '#CD853F' },
          { id: 60302, code: 'NUTMEG', name: '육두구', colorHex: '#D2691E' },
          { id: 60303, code: 'CINNAMON', name: '시나몬', colorHex: '#8B4513' },
          { id: 60304, code: 'CLOVE', name: '정향', colorHex: '#A0522D' }
        ]
      }
    ]
  },
  {
    id: 7,
    code: 'NUTTY_COCOA',
    name: '견과/코코아',
    colorHex: '#8B4513',
    children: [
      {
        id: 701, code: 'NUTTY', name: '견과류', colorHex: '#8B7355',
        children: [
          { id: 70101, code: 'PEANUTS', name: '땅콩', colorHex: '#C19A6B' },
          { id: 70102, code: 'HAZELNUT', name: '헤이즐넛', colorHex: '#8B7355' },
          { id: 70103, code: 'ALMOND', name: '아몬드', colorHex: '#EFDECD' }
        ]
      },
      {
        id: 702, code: 'COCOA', name: '코코아', colorHex: '#3E2723',
        children: [
          { id: 70201, code: 'CHOCOLATE', name: '초콜릿', colorHex: '#4A2511' },
          { id: 70202, code: 'DARK_CHOCOLATE', name: '다크 초콜릿', colorHex: '#1B0A03' }
        ]
      }
    ]
  },
  {
    id: 8,
    code: 'SWEET',
    name: '단맛',
    colorHex: '#F4CD00',
    children: [
      {
        id: 801, code: 'BROWN_SUGAR', name: '흑설탕', colorHex: '#F4D03F',
        children: [
          { id: 80101, code: 'MOLASSES', name: '당밀', colorHex: '#F4D03F' },
          { id: 80102, code: 'MAPLE_SYRUP', name: '메이플 시럽', colorHex: '#F9E79F' },
          { id: 80103, code: 'CARAMELIZED', name: '캐러멜화', colorHex: '#F8E08E' },
          { id: 80104, code: 'HONEY', name: '꿀', colorHex: '#FEF9E7' }
        ]
      },
      { id: 802, code: 'VANILLA', name: '바닐라', colorHex: '#F8E08E', children: [] },
      { id: 803, code: 'VANILLIN', name: '바닐린', colorHex: '#FCF3CF', children: [] },
      { id: 804, code: 'OVERALL_SWEET', name: '전반적 단맛', colorHex: '#FEF9E7', children: [] },
      { id: 805, code: 'SWEET_AROMATICS', name: '달콤한 향', colorHex: '#F9E79F', children: [] }
    ]
  },
  {
    id: 9,
    code: 'FLORAL',
    name: '꽃향',
    colorHex: '#EC008B',
    children: [
      { id: 901, code: 'BLACK_TEA', name: '홍차', colorHex: '#E91E63', children: [] },
      {
        id: 902, code: 'FLORAL_SUB', name: '꽃향', colorHex: '#EC008B',
        children: [
          { id: 90201, code: 'CHAMOMILE', name: '카모마일', colorHex: '#F5B7B1' },
          { id: 90202, code: 'ROSE', name: '장미', colorHex: '#EC7063' },
          { id: 90203, code: 'JASMINE', name: '자스민', colorHex: '#E74C3C' }
        ]
      }
    ]
  }
]

/**
 * Flavor ID 또는 code로 향미 정보 찾기 (휠 내 모든 레벨 검색)
 */
export const findFlavorInWheel = (idOrCode) => {
  const search = (items, parent = null) => {
    for (const item of items) {
      if (item.id === idOrCode || item.code === idOrCode) {
        return { ...item, parent }
      }
      if (item.children?.length) {
        const found = search(item.children, item)
        if (found) return found
      }
    }
    return null
  }
  return search(FLAVOR_WHEEL)
}

/**
 * 특정 flavor가 속한 경로 반환 (대분류 > 중분류 > 세부)
 */
export const getFlavorPath = (idOrCode) => {
  const path = []
  const search = (items) => {
    for (const item of items) {
      path.push(item)
      if (item.id === idOrCode || item.code === idOrCode) {
        return true
      }
      if (item.children?.length && search(item.children)) {
        return true
      }
      path.pop()
    }
    return false
  }
  search(FLAVOR_WHEEL)
  return path
}
