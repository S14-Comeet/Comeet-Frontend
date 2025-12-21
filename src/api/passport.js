import api from "./axios";
import { createLogger } from "@/utils/logger";

const logger = createLogger("PassportAPI");

/**
 * 연도별 여권 목록 조회
 * @param {number} year - 조회할 연도
 * @returns {Promise<Object>} 여권 목록 응답
 *
 * API: GET /passport?year={year}
 * Response: { year: number, passports: PassportSummaryDto[] }
 */
export const getPassportList = async (year) => {
  logger.info("여권 목록 조회", { year });
  const response = await api.get("/passport", { params: { year } });
  return response.data;
};

/**
 * 여권 상세 조회
 * @param {number} passportId - 여권 ID
 * @returns {Promise<Object>} 여권 상세 응답
 *
 * API: GET /passport/{passportId}
 * Response: { passportId, year, month, coverImageUrl, info, records }
 */
export const getPassportDetail = async (passportId) => {
  logger.info("여권 상세 조회", { passportId });
  const response = await api.get(`/passport/${passportId}`);
  return response.data;
};

/**
 * 로스터리별 통계 조회
 * @returns {Promise<Object>} 로스터리 통계
 *
 * API: GET /passport/statistics/roastery
 */
export const getRoasteryStatistics = async () => {
  logger.info("로스터리 통계 조회");
  const response = await api.get("/passport/statistics/roastery");
  return response.data;
};

/**
 * 국가별 통계 조회
 * @returns {Promise<Object>} 국가별 통계
 *
 * API: GET /passport/statistics/country
 */
export const getCountryStatistics = async () => {
  logger.info("국가별 통계 조회");
  const response = await api.get("/passport/statistics/country");
  return response.data;
};
