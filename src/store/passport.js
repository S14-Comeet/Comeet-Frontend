import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getPassportList, getPassportDetail } from '@/api/passport'
import { safeStorage } from '@/utils/storage'
import { createLogger } from '@/utils/logger'

const logger = createLogger('PassportStore')

/**
 * 커피여권 상태 관리 Store
 * 여권 목록 및 상세 정보를 관리하고 LocalStorage에 자동 persist
 */
export const usePassportStore = defineStore('passport', () => {
  // ============ State ============
  /** 선택된 연도 */
  const selectedYear = ref(new Date().getFullYear())

  /** 여권 목록 (12개월) */
  const passports = ref([])

  /** 현재 조회 중인 여권 상세 */
  const currentPassport = ref(null)

  /** 로딩 상태 */
  const isLoading = ref(false)

  /** 에러 상태 */
  const error = ref(null)

  // ============ Getters ============
  /** 사용 가능한 여권 (방문 기록 있는 월) */
  const availablePassports = computed(() =>
    passports.value.filter(p => p.isAvailable)
  )

  /** 사용 불가능한 여권 (방문 기록 없는 월) */
  const unavailablePassports = computed(() =>
    passports.value.filter(p => !p.isAvailable)
  )

  /** 현재 여권의 방문 기록 (날짜 역순) */
  const sortedRecords = computed(() => {
    if (!currentPassport.value?.records) return []
    return [...currentPassport.value.records].sort(
      (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
    )
  })

  /** 현재 여권의 날짜별 그룹화된 기록 */
  const groupedRecords = computed(() => {
    const groups = {}
    sortedRecords.value.forEach(record => {
      const date = record.visitDate.split('T')[0]
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(record)
    })
    return groups
  })

  // ============ Actions ============
  /**
   * 연도별 여권 목록 조회
   * @param {number} year - 조회할 연도
   */
  const fetchPassportList = async (year = selectedYear.value) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getPassportList(year)
      passports.value = response.data.passports
      selectedYear.value = year
      logger.info('여권 목록 조회 성공', { year, count: passports.value.length })
    } catch (err) {
      error.value = err.message || '여권 목록을 불러오는데 실패했습니다.'
      logger.error('여권 목록 조회 실패', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 여권 상세 조회
   * @param {number} passportId - 여권 ID
   */
  const fetchPassportDetail = async (passportId) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await getPassportDetail(passportId)
      currentPassport.value = response.data
      logger.info('여권 상세 조회 성공', { passportId })
    } catch (err) {
      error.value = err.message || '여권 상세를 불러오는데 실패했습니다.'
      logger.error('여권 상세 조회 실패', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 연도 변경
   * @param {number} year - 새 연도
   */
  const setYear = async (year) => {
    selectedYear.value = year
    await fetchPassportList(year)
  }

  /**
   * 상태 초기화
   */
  const reset = () => {
    passports.value = []
    currentPassport.value = null
    error.value = null
    selectedYear.value = new Date().getFullYear()
  }

  return {
    // State
    selectedYear,
    passports,
    currentPassport,
    isLoading,
    error,
    // Getters
    availablePassports,
    unavailablePassports,
    sortedRecords,
    groupedRecords,
    // Actions
    fetchPassportList,
    fetchPassportDetail,
    setYear,
    reset
  }
}, {
  persist: {
    key: 'comeet-passport',
    storage: safeStorage,
    paths: ['selectedYear']
  }
})
