/**
 * 날짜 포맷팅 유틸리티
 * 백엔드에서 다양한 형식으로 날짜가 올 수 있음:
 * - ISO 문자열: "2024-12-24T10:30:00"
 * - 배열 형식: [2024, 12, 24] 또는 [2024, 12, 24, 10, 30, 0]
 * - Date 객체
 */

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅
 * @param {string|Array|Date} dateInput - 날짜 입력
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return ''

  if (Array.isArray(dateInput)) {
    const [year, month, day] = dateInput
    return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`
  }

  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

/**
 * 날짜를 YYYY년 M월 D일 (요일) 형식으로 포맷팅
 * @param {string|Array|Date} dateInput - 날짜 입력
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDateWithWeekday = (dateInput) => {
  if (!dateInput) return ''

  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  let date

  if (Array.isArray(dateInput)) {
    const [year, month, day] = dateInput
    date = new Date(year, month - 1, day)
    if (isNaN(date.getTime())) return ''
    const weekday = weekdays[date.getDay()]
    return `${year}년 ${month}월 ${day}일 (${weekday})`
  }

  date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = weekdays[date.getDay()]
  return `${year}년 ${month}월 ${day}일 (${weekday})`
}

/**
 * 날짜를 MM.DD 형식으로 포맷팅 (짧은 형식)
 * @param {string|Array|Date} dateInput - 날짜 입력
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDateShort = (dateInput) => {
  if (!dateInput) return ''

  if (Array.isArray(dateInput)) {
    const [, month, day] = dateInput
    return `${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`
  }

  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}.${day}`
}

/**
 * 상대적 시간 표시 (예: "방금 전", "5분 전", "2시간 전", "어제")
 * @param {string|Array|Date} dateInput - 날짜 입력
 * @returns {string} 상대적 시간 문자열
 */
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return ''

  let date

  if (Array.isArray(dateInput)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput
    date = new Date(year, month - 1, day, hour, minute, second)
  } else {
    date = new Date(dateInput)
  }

  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  if (diffDay === 1) return '어제'
  if (diffDay < 7) return `${diffDay}일 전`

  return formatDate(dateInput)
}
