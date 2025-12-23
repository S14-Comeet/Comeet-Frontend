/**
 * 북마크(저장) 관련 API 호출 함수
 */
import api from '@/api/axios'

const BOOKMARK_BASE = '/bookmarks'

/**
 * 내 폴더 목록 조회
 * GET /bookmarks/folders
 * @returns {Promise<Array>} 폴더 목록
 */
export const getFolders = async () => {
  const response = await api.get(`${BOOKMARK_BASE}/folders`)
  return response.data.data
}

/**
 * 폴더 생성
 * POST /bookmarks/folders
 * @param {Object} data - 폴더 데이터
 * @param {string} data.name - 폴더 이름 (필수, 1-50자)
 * @param {string} [data.icon='bookmark-fill'] - 아이콘
 * @param {string} [data.description] - 설명 (최대 255자)
 * @returns {Promise<Object>} 생성된 폴더
 */
export const createFolder = async (data) => {
  const response = await api.post(`${BOOKMARK_BASE}/folders`, data)
  return response.data.data
}

/**
 * 폴더 수정
 * PUT /bookmarks/folders/{folderId}
 * @param {number} folderId - 폴더 ID
 * @param {Object} data - 수정할 폴더 데이터
 * @param {string} [data.name] - 폴더 이름
 * @param {string} [data.icon] - 아이콘
 * @param {string} [data.description] - 설명
 * @returns {Promise<Object>} 수정된 폴더
 */
export const updateFolder = async (folderId, data) => {
  const response = await api.put(`${BOOKMARK_BASE}/folders/${folderId}`, data)
  return response.data.data
}

/**
 * 폴더 삭제
 * DELETE /bookmarks/folders/{folderId}
 * @param {number} folderId - 폴더 ID
 * @returns {Promise<void>}
 */
export const deleteFolder = async (folderId) => {
  await api.delete(`${BOOKMARK_BASE}/folders/${folderId}`)
}

/**
 * 폴더 내 카페 목록 조회
 * GET /bookmarks/folders/{folderId}/stores
 * @param {number} folderId - 폴더 ID
 * @returns {Promise<Object>} { folder, stores }
 */
export const getStoresByFolder = async (folderId) => {
  const response = await api.get(`${BOOKMARK_BASE}/folders/${folderId}/stores`)
  return response.data.data
}

/**
 * 카페를 폴더에 추가
 * POST /bookmarks/folders/{folderId}/stores/{storeId}
 * @param {number} folderId - 폴더 ID
 * @param {number} storeId - 카페 ID
 * @returns {Promise<Object>} { folderId, storeId, addedAt }
 */
export const addStoreToFolder = async (folderId, storeId) => {
  const response = await api.post(`${BOOKMARK_BASE}/folders/${folderId}/stores/${storeId}`)
  return response.data.data
}

/**
 * 카페를 폴더에서 제거
 * DELETE /bookmarks/folders/{folderId}/stores/{storeId}
 * @param {number} folderId - 폴더 ID
 * @param {number} storeId - 카페 ID
 * @returns {Promise<void>}
 */
export const removeStoreFromFolder = async (folderId, storeId) => {
  await api.delete(`${BOOKMARK_BASE}/folders/${folderId}/stores/${storeId}`)
}

/**
 * 카페 북마크 상태 조회
 * GET /bookmarks/stores/{storeId}/status
 * @param {number} storeId - 카페 ID
 * @returns {Promise<Object>} { isBookmarked, folders }
 */
export const getStoreBookmarkStatus = async (storeId) => {
  const response = await api.get(`${BOOKMARK_BASE}/stores/${storeId}/status`)
  return response.data.data
}
