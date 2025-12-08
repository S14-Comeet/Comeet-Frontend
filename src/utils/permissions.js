/**
 * 사용자 ROLE 타입 정의
 * 백엔드의 Role enum과 동기화
 */
export const USER_ROLES = {
  /** 일반 사용자 */
  USER: 'USER',
  /** 점주 */
  OWNER: 'OWNER',
  /** 게스트 (닉네임 미등록) */
  GUEST: 'GUEST',
  /** 탈퇴한 사용자 */
  WITHDRAWN: 'WITHDRAWN',
}

/**
 * 활성 사용자 여부 확인
 * 백엔드의 isNotActiveUser 로직 반영
 * @param {string} role - 사용자의 ROLE
 * @returns {boolean} 활성 사용자 여부
 */
export const isActiveUser = (role) => {
  return role !== USER_ROLES.GUEST && role !== USER_ROLES.WITHDRAWN
}

/**
 * 페이지/기능별 접근 가능한 ROLE 목록
 */
export const PERMISSIONS = {
  /** 저장 목록 접근 권한 - USER만 허용 */
  SAVED_ACCESS: [USER_ROLES.USER],

  /** 프로필 접근 권한 - USER, OWNER 허용 */
  PROFILE_ACCESS: [USER_ROLES.USER, USER_ROLES.OWNER],

  /** 알림 접근 권한 - USER, OWNER 허용 */
  NOTIFICATION_ACCESS: [USER_ROLES.USER, USER_ROLES.OWNER],
}

/**
 * 특정 권한에 대해 사용자 ROLE이 허용되는지 확인
 * @param {string} userRole - 사용자의 ROLE
 * @param {string[]} allowedRoles - 허용되는 ROLE 목록
 * @returns {boolean} 권한 여부
 */
export const hasPermission = (userRole, allowedRoles) => {
  if (!userRole) return false
  return allowedRoles.includes(userRole)
}

/**
 * 저장 목록 접근 권한 확인
 * @param {string} userRole - 사용자의 ROLE
 * @returns {boolean} 접근 가능 여부
 */
export const canAccessSaved = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.SAVED_ACCESS)
}

/**
 * 프로필 접근 권한 확인
 * @param {string} userRole - 사용자의 ROLE
 * @returns {boolean} 접근 가능 여부
 */
export const canAccessProfile = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.PROFILE_ACCESS)
}

/**
 * 알림 접근 권한 확인
 * @param {string} userRole - 사용자의 ROLE
 * @returns {boolean} 접근 가능 여부
 */
export const canAccessNotification = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.NOTIFICATION_ACCESS)
}
