// TODO: 실제 API 구현 시 사용
// import api from './axios'

/**
 * Mock 데이터 - 추후 백엔드 API 구현 시 제거
 * 백엔드 DTO 구조를 참고하여 구성
 */
const MOCK_FOLDERS = [
  {
    id: 1,
    icon: 'bookmark-fill',
    name: '자주 가는 카페',
    description: '평소에 자주 방문하는 단골 카페들',
    cafeCount: 3,
    createdAt: '2024-01-15',
    lastAddedAt: '2024-11-28'
  },
  {
    id: 2,
    icon: 'search',
    name: '조용한 작업 공간',
    description: '집중해서 일하거나 공부하기 좋은 카페',
    cafeCount: 5,
    createdAt: '2024-01-20',
    lastAddedAt: '2024-11-30'
  },
  {
    id: 3,
    icon: 'event',
    name: '분위기 좋은 곳',
    description: '인테리어가 예쁘고 감성적인 카페 모음',
    cafeCount: 4,
    createdAt: '2024-02-01',
    lastAddedAt: '2024-12-01'
  }
]

const MOCK_CAFES = [
  // 폴더 1: 자주 가는 카페
  {
    storeId: 'store-gangnam-001',
    name: '커핏 강남점',
    description: '강남역 5분 거리의 스페셜티 커피 전문점입니다.',
    address: '서울특별시 강남구 강남대로 지하 396',
    latitude: 37.4978,
    longitude: 127.0276,
    category: '핸드드립',
    averageRating: 4.5,
    reviewCount: 127,
    thumbnailUrl: 'https://example.com/stores/gangnam1.jpg',
    markerColor: 'BLUE',
    folderId: 1,
    addedAt: '2024-11-28'
  },
  {
    storeId: 'store-samcheong-001',
    name: '블루보틀 삼청점',
    description: '감성적인 블루보틀 카페',
    address: '서울 종로구 삼청로 74',
    latitude: 37.5814,
    longitude: 126.9835,
    category: '라떼',
    averageRating: 4.7,
    reviewCount: 342,
    thumbnailUrl: 'https://example.com/stores/samcheong1.jpg',
    markerColor: 'BLUE',
    folderId: 1,
    addedAt: '2024-11-15'
  },
  {
    storeId: 'store-hongdae-001',
    name: '폴바셋 홍대점',
    address: '서울 마포구 양화로 160',
    description: '홍대 근처 편안한 카페',
    latitude: 37.5563,
    longitude: 126.9245,
    category: '에스프레소',
    averageRating: 4.3,
    reviewCount: 215,
    thumbnailUrl: 'https://example.com/stores/hongdae1.jpg',
    markerColor: 'BLUE',
    folderId: 1,
    addedAt: '2024-10-20'
  },

  // 폴더 2: 조용한 작업 공간
  {
    storeId: 'store-teheran-001',
    name: '카페 오닉스',
    description: '조용하고 작업하기 좋은 카페',
    address: '서울 강남구 테헤란로 152',
    latitude: 37.5010,
    longitude: 127.0390,
    category: '아메리카노',
    averageRating: 4.6,
    reviewCount: 189,
    thumbnailUrl: 'https://example.com/stores/teheran1.jpg',
    markerColor: 'GREEN',
    folderId: 2,
    addedAt: '2024-11-30'
  },
  {
    storeId: 'store-seocho-001',
    name: '더 커피',
    description: '넓은 공간의 스터디 카페',
    address: '서울 서초구 서초대로 396',
    latitude: 37.4950,
    longitude: 127.0280,
    category: '핸드드립',
    averageRating: 4.4,
    reviewCount: 156,
    thumbnailUrl: 'https://example.com/stores/seocho1.jpg',
    markerColor: 'GREEN',
    folderId: 2,
    addedAt: '2024-11-20'
  },
  {
    storeId: 'store-insadong-001',
    name: '카페 라이브러리',
    description: '책과 함께하는 조용한 카페',
    address: '서울 종로구 인사동길 12',
    latitude: 37.5743,
    longitude: 126.9850,
    category: '라떼',
    averageRating: 4.8,
    reviewCount: 267,
    thumbnailUrl: 'https://example.com/stores/insadong1.jpg',
    markerColor: 'GREEN',
    folderId: 2,
    addedAt: '2024-11-10'
  },
  {
    storeId: 'store-itaewon-001',
    name: '그린 빈즈',
    description: '작업하기 좋은 조용한 공간',
    address: '서울 용산구 이태원로 200',
    latitude: 37.5349,
    longitude: 126.9945,
    category: '아메리카노',
    averageRating: 4.5,
    reviewCount: 178,
    thumbnailUrl: 'https://example.com/stores/itaewon1.jpg',
    markerColor: 'GREEN',
    folderId: 2,
    addedAt: '2024-10-25'
  },
  {
    storeId: 'store-yeonnam-001',
    name: '스튜디오 카페',
    description: '개인 작업 공간이 있는 카페',
    address: '서울 마포구 연남로 86',
    latitude: 37.5655,
    longitude: 126.9200,
    category: '에스프레소',
    averageRating: 4.7,
    reviewCount: 203,
    thumbnailUrl: 'https://example.com/stores/yeonnam1.jpg',
    markerColor: 'GREEN',
    folderId: 2,
    addedAt: '2024-10-15'
  },

  // 폴더 3: 분위기 좋은 곳
  {
    storeId: 'store-seongsu-001',
    name: '앤트러사이트',
    description: '인테리어가 멋진 카페',
    address: '서울 성동구 연무장길 9',
    latitude: 37.5442,
    longitude: 127.0557,
    category: '핸드드립',
    averageRating: 4.6,
    reviewCount: 421,
    thumbnailUrl: 'https://example.com/stores/seongsu1.jpg',
    markerColor: 'RED',
    folderId: 3,
    addedAt: '2024-12-01'
  },
  {
    storeId: 'store-yeonnam-002',
    name: '카페 연남동 239-20',
    description: '감성 넘치는 연남동 카페',
    address: '서울 마포구 동교로 239-20',
    latitude: 37.5665,
    longitude: 126.9220,
    category: '라떼',
    averageRating: 4.8,
    reviewCount: 389,
    thumbnailUrl: 'https://example.com/stores/yeonnam2.jpg',
    markerColor: 'RED',
    folderId: 3,
    addedAt: '2024-11-25'
  },
  {
    storeId: 'store-apgujeong-001',
    name: '테라로사 강남점',
    description: '고급스러운 로스터리 카페',
    address: '서울 강남구 선릉로 428',
    latitude: 37.5040,
    longitude: 127.0490,
    category: '핸드드립',
    averageRating: 4.7,
    reviewCount: 512,
    thumbnailUrl: 'https://example.com/stores/apgujeong1.jpg',
    markerColor: 'RED',
    folderId: 3,
    addedAt: '2024-11-18'
  },
  {
    storeId: 'store-samcheong-002',
    name: '카페 서울의 달',
    description: '한옥을 개조한 전통 카페',
    address: '서울 종로구 삼청로 7길 24',
    latitude: 37.5820,
    longitude: 126.9815,
    category: '전통차',
    averageRating: 4.9,
    reviewCount: 456,
    thumbnailUrl: 'https://example.com/stores/samcheong2.jpg',
    markerColor: 'RED',
    folderId: 3,
    addedAt: '2024-11-05'
  }
]

/**
 * 사용자의 폴더 목록 조회
 *
 * TODO: 백엔드 API 구현 시 아래와 같이 변경
 * return api.get('/api/cafes/folders')
 */
export const getFolders = async () => {
  // Mock 데이터 반환 (실제 API 응답 형식 시뮬레이션)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: MOCK_FOLDERS
      })
    }, 300)
  })
}

/**
 * 특정 폴더의 카페 목록 조회
 *
 * @param {number} folderId - 폴더 ID
 *
 * TODO: 백엔드 API 구현 시 아래와 같이 변경
 * return api.get(`/api/cafes/folders/${folderId}/cafes`)
 */
export const getCafesByFolder = async (folderId) => {
  // Mock 데이터 반환 (실제 API 응답 형식 시뮬레이션)
  return new Promise((resolve) => {
    setTimeout(() => {
      const cafes = MOCK_CAFES.filter(cafe => cafe.folderId === folderId)
      resolve({
        data: cafes
      })
    }, 300)
  })
}

/**
 * 모든 카페 목록 조회 (임시)
 *
 * TODO: 백엔드 API 구현 시 실제 엔드포인트로 변경
 * 백엔드 응답 형식: { success: true, data: { totalCount, stores }, error, timestamp }
 */
export const getAllCafes = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: MOCK_CAFES
      })
    }, 300)
  })
}
