# Comeet API Reference for Frontend

이 문서는 프론트엔드 개발을 위한 상세 API 명세서입니다.

## 1. 기본 설정 (Configuration)

### Base URL
- Local: `http://localhost:8080`
- Production: (TBD)

### Authentication
- **Access Token**: 모든 인증이 필요한 요청의 Header에 포함해야 합니다.
  - `Authorization: Bearer {Access_Token}`
- **Refresh Token**: `HttpOnly Cookie`로 관리되므로 클라이언트에서 별도로 핸들링할 필요가 없습니다 (`/auth/reissue` 등에서 자동 전송).

### 공통 응답 포맷 (Common Response Format)
모든 API는 아래와 같은 JSON 구조로 응답합니다.

```json
{
  "success": true, // 요청 성공 여부
  "data": { ... }, // 실제 데이터 (성공 시), 실패 시 null
  "error": null,   // 에러 정보 (실패 시), 성공 시 null
  "timestamp": "2025-12-19T10:00:00" // 응답 시간
}
```

---

## 2. 도메인별 API (Domain APIs)

### 🔐 Auth (인증)

| Method | Endpoint | 설명 | 권한 |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/logout` | 로그아웃 (Access/Refresh Token 무효화) | User |
| `POST` | `/auth/reissue` | Access Token 재발급 (Cookie의 Refresh Token 사용) | User |

---

### 👤 User (사용자)

| Method | Endpoint | 설명 | 권한 |
| :--- | :--- | :--- | :--- |
| `POST` | `/user/register` | 소셜 로그인 후 최종 회원가입 (닉네임 설정) | Guest |
| `GET` | `/user` | 내 정보 조회 | User |
| `GET` | `/user/nickname/check` | 닉네임 중복 확인 | All |

**Request Body (Register):**
```json
{
  "nickname": "커피러버", // 필수, 1~12자
  "role": "USER"       // 필수, USER or MANAGER (가맹점주)
}
```

**Query Param (Nickname Check):**
- `nickname`: 확인할 닉네임

---

### 🏪 Store (가맹점)

#### 조회 (Query)

| Method | Endpoint | 설명 |
| :--- | :--- | :--- |
| `GET` | `/stores` | 가맹점 검색 및 목록 조회 (위치 기반) |
| `GET` | `/stores/{storeId}` | 가맹점 상세 조회 |
| `GET` | `/stores/{storeId}/reviews` | 가맹점 리뷰 목록 조회 (Paging) |
| `GET` | `/stores/{storeId}/menus` | 가맹점 메뉴 목록 조회 (Paging) |
| `GET` | `/stores/my` | 내 가맹점 목록 조회 (Manager 전용) |

**Query Params (Search Stores):**
*   `latitude` (Required): 중심 위도 (-90 ~ 90)
*   `longitude` (Required): 중심 경도 (-180 ~ 180)
*   `radius`: 검색 반경 (m 단위, Default: 1000)
*   `categories`: 카테고리 필터 (콤마 구분, 예: "라떼,드립")
*   `keyword`: 매장명/주소 검색 키워드

#### 관리 (Command - Manager 전용)

| Method | Endpoint | 설명 |
| :--- | :--- | :--- |
| `POST` | `/stores` | 신규 가맹점 등록 |
| `PUT` | `/stores/{storeId}` | 가맹점 정보 수정 |
| `DELETE` | `/stores/{storeId}` | 가맹점 삭제 |
| `POST` | `/stores/{storeId}/menus` | 가맹점에 메뉴 추가 |

---

### ☕ Menu (메뉴)

| Method | Endpoint | 설명 | 권한 |
| :--- | :--- | :--- | :--- |
| `GET` | `/menus/{menuId}` | 메뉴 상세 조회 (원두 정보 포함) | All |
| `PUT` | `/menus/{menuId}` | 메뉴 수정 | Manager |
| `DELETE` | `/menus/{menuId}` | 메뉴 삭제 | Manager |
| `POST` | `/menus/{menuId}/beans` | 메뉴에 원두 연결 | Manager |
| `DELETE` | `/menus/{menuId}/beans/{beanId}` | 메뉴-원두 연결 해제 | Manager |

---

### 📝 Review (리뷰) & Cupping Note

| Method | Endpoint | 설명 |
| :--- | :--- | :--- |
| `GET` | `/reviews` | 내 리뷰 목록 조회 (Paging) |
| `GET` | `/reviews/{reviewId}` | 리뷰 상세 조회 |
| `POST` | `/reviews` | 리뷰 작성 |
| `PATCH` | `/reviews/{reviewId}` | 리뷰 수정 |
| `DELETE` | `/reviews/{reviewId}` | 리뷰 삭제 |
| `POST` | `/reviews/{reviewId}/report` | 리뷰 신고 (미구현) |
| `GET` | `/reviews/{reviewId}/cupping-note` | 커핑 노트 상세 조회 |
| `POST` | `/reviews/{reviewId}/cupping-note` | 커핑 노트 작성 |
| `PATCH` | `/reviews/{reviewId}/cupping-note` | 커핑 노트 수정 |

**Request Body (Create Review):**
*   `visitId`, `menuId`, `storeId` 필수 포함
*   `content`, `imageUrl`, `flavorIdList` 등 포함

---

### 📍 Visit (방문 인증)

| Method | Endpoint | 설명 |
| :--- | :--- | :--- |
| `POST` | `/visit/verify` | GPS 기반 방문 인증 시도 |
| `GET` | `/visit/history` | 내 방문 인증 내역 조회 (Paging) |
| `GET` | `/visit/{visitId}` | 방문 인증 상세 조회 |

**Request Body (Verify):**
```json
{
  "menuId": 1,
  "storeLocationDto": {
    "latitude": 37.1234,
    "longitude": 127.1234
  },
  "userLocationDto": {
    "latitude": 37.1235,
    "longitude": 127.1235
  }
}
```

---

### 🫘 Bean (원두) & Roastery (로스터리)

#### 조회 (Query)

| Method | Endpoint | 설명 |
| :--- | :--- | :--- |
| `GET` | `/beans` | 모든 원두 목록 조회 (Paging) |
| `GET` | `/beans/{beanId}` | 원두 상세 조회 |
| `GET` | `/beans/search` | 원두 검색 (생산 국가) |
| `GET` | `/beans/roastery/{roasteryId}` | 특정 로스터리의 원두 목록 |
| `GET` | `/roasteries` | 모든 로스터리 목록 조회 (Paging) |
| `GET` | `/roasteries/{roasteryId}` | 로스터리 상세 조회 |
| `GET` | `/roasteries/search` | 로스터리 검색 (이름) |

#### 관리 (Command - Manager 전용)

| Method | Endpoint | 설명 |
| :--- | :--- | :--- |
| `POST` | `/beans` | 원두 등록 |
| `PATCH` | `/beans/{beanId}` | 원두 수정 |
| `DELETE` | `/beans/{beanId}` | 원두 삭제 |
| `POST` | `/roasteries` | 로스터리 등록 |
| `PATCH` | `/roasteries/{roasteryId}` | 로스터리 수정 |

---

### 🎨 Flavor (플레이버) & 🖼️ Image (이미지)

| Method | Endpoint | 설명 |
| :--- | :--- | :--- |
| `GET` | `/flavors` | Flavor Wheel 전체 데이터 조회 |
| `POST` | `/images` | 이미지 업로드 (Multipart/form-data) |

**Image Upload:**
- Key: `image` (File)
