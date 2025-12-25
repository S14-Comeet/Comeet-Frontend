import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getPassportList, getPassportDetail } from "@/api/passport";
import { safeStorage } from "@/utils/storage";
import { createLogger } from "@/utils/logger";

const logger = createLogger("PassportStore");

/**
 * 커피여권 상태 관리 Store
 * 여권 목록 및 상세 정보를 관리하고 LocalStorage에 자동 persist
 */
export const usePassportStore = defineStore(
  "passport",
  () => {
    // ============ State ============
    /** 선택된 연도 */
    const selectedYear = ref(new Date().getFullYear());

    /** 여권 목록 (12개월) */
    const passports = ref([]);

    /** 현재 조회 중인 여권 상세 */
    const currentPassport = ref(null);

    /** 로딩 상태 */
    const isLoading = ref(false);

    /** 에러 상태 */
    const error = ref(null);

    // ============ Getters ============
    /** 사용 가능한 여권 (방문 기록 있는 월) */
    const availablePassports = computed(() =>
      passports.value.filter((p) => p.isAvailable)
    );

    /** 사용 불가능한 여권 (방문 기록 없는 월) */
    const unavailablePassports = computed(() =>
      passports.value.filter((p) => !p.isAvailable)
    );

    /**
     * visitDate를 Date 객체로 변환
     * @param {Array|Date|string} visitDate
     * @returns {Date}
     */
    const toDate = (visitDate) => {
      if (!visitDate) return new Date(0);
      if (Array.isArray(visitDate)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = visitDate;
        return new Date(year, month - 1, day, hour, minute, second);
      }
      return new Date(visitDate);
    };

    /** 현재 여권의 방문 기록 (날짜 역순) */
    const sortedRecords = computed(() => {
      if (!currentPassport.value?.records) return [];
      return [...currentPassport.value.records].sort(
        (a, b) => toDate(b.visitDate) - toDate(a.visitDate)
      );
    });

    /**
     * visitDate를 "YYYY-MM-DD" 문자열로 변환
     * @param {Array|Date|string} visitDate - [year, month, day, ...] 배열, Date 객체, 또는 문자열
     * @returns {string} "YYYY-MM-DD" 형식 문자열
     */
    const formatVisitDateToString = (visitDate) => {
      if (!visitDate) return "";
      // 배열 형식: [2025, 12, 1, 10, 30] -> "2025-12-01"
      if (Array.isArray(visitDate) && visitDate.length >= 3) {
        const [year, month, day] = visitDate;
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      }
      // Date 객체
      if (visitDate instanceof Date) {
        return visitDate.toISOString().split("T")[0];
      }
      // 문자열 (ISO 형식)
      return String(visitDate).split("T")[0];
    };

    /** 현재 여권의 날짜별 그룹화된 기록 */
    const groupedRecords = computed(() => {
      const groups = {};
      sortedRecords.value.forEach((record) => {
        const date = formatVisitDateToString(record.visitDate);
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(record);
      });
      return groups;
    });

    // ============ Actions ============
    /**
     * 연도별 여권 목록 조회
     * @param {number} year - 조회할 연도
     */
    const fetchPassportList = async (year = selectedYear.value) => {
      isLoading.value = true;
      error.value = null;

      try {
        const response = await getPassportList(year);
        passports.value = response.data.passports;
        selectedYear.value = year;
        logger.info("여권 목록 조회 성공", {
          year,
          count: passports.value.length,
        });
      } catch (err) {
        error.value = err.message || "여권 목록을 불러오는데 실패했습니다.";
        logger.error("여권 목록 조회 실패", err);
        throw err;
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * 여권 상세 조회
     * @param {number} passportId - 여권 ID
     */
    const fetchPassportDetail = async (passportId) => {
      isLoading.value = true;
      error.value = null;

      try {
        const response = await getPassportDetail(passportId);
        currentPassport.value = response.data;
        logger.info("여권 상세 조회 성공", { passportId });
      } catch (err) {
        error.value = err.message || "여권 상세를 불러오는데 실패했습니다.";
        logger.error("여권 상세 조회 실패", err);
        throw err;
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * 연도 변경
     * @param {number} year - 새 연도
     */
    const setYear = async (year) => {
      selectedYear.value = year;
      await fetchPassportList(year);
    };

    /**
     * 상태 초기화
     */
    const reset = () => {
      passports.value = [];
      currentPassport.value = null;
      error.value = null;
      selectedYear.value = new Date().getFullYear();
    };

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
      reset,
    };
  },
  {
    persist: {
      key: "comeet-passport",
      storage: safeStorage,
      paths: ["selectedYear"],
    },
  }
);
