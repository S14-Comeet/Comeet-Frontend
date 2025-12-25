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
    const selectedYear = ref(new Date().getFullYear());

    const passports = ref([]);

    const currentPassport = ref(null);

    const isLoading = ref(false);

    const error = ref(null);

    const availablePassports = computed(() =>
      passports.value.filter((p) => p.isAvailable)
    );

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
      if (Array.isArray(visitDate) && visitDate.length >= 3) {
        const [year, month, day] = visitDate;
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      }
      if (visitDate instanceof Date) {
        return visitDate.toISOString().split("T")[0];
      }
      return String(visitDate).split("T")[0];
    };

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
      selectedYear,
      passports,
      currentPassport,
      isLoading,
      error,
      availablePassports,
      unavailablePassports,
      sortedRecords,
      groupedRecords,
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
