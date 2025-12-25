/**
 * 주소 검색 관련 유틸리티
 * - 다음 우편번호 서비스: 주소 검색 팝업
 * - 카카오 로컬 API: 주소 → 좌표 변환
 */

import { kakao } from '@/config'
import { createLogger } from '@/utils/logger'

const logger = createLogger('Address')

/**
 * 다음 우편번호 서비스 팝업 열기
 * @returns {Promise<Object>} 선택한 주소 정보
 */
export const openAddressSearch = () => {
  return new Promise((resolve, reject) => {
    if (!window.daum?.Postcode) {
      reject(new Error('다음 우편번호 서비스를 불러오지 못했습니다'))
      return
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        const address = data.roadAddress || data.jibunAddress

        resolve({
          address,
          roadAddress: data.roadAddress,
          jibunAddress: data.jibunAddress,
          zonecode: data.zonecode,
          buildingName: data.buildingName,
          sido: data.sido,
          sigungu: data.sigungu,
          bname: data.bname
        })
      },
      onclose: (state) => {
        if (state === 'FORCE_CLOSE') {
          reject(new Error('주소 검색이 취소되었습니다'))
        }
      }
    }).open()
  })
}

/**
 * 카카오 로컬 API로 주소를 좌표로 변환 (Geocoding)
 * @param {string} address - 변환할 주소
 * @returns {Promise<Object>} 좌표 정보 { latitude, longitude }
 */
export const getCoordinatesFromAddress = async (address) => {
  if (!kakao.restApiKey) {
    throw new Error('카카오 REST API 키가 설정되지 않았습니다. VITE_KAKAO_REST_API_KEY를 확인하세요.')
  }

  const isDev = import.meta.env.DEV
  const baseUrl = isDev ? '/kakao-api' : 'https://dapi.kakao.com'
  const url = `${baseUrl}/v2/local/search/address.json?query=${encodeURIComponent(address)}`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${kakao.restApiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`카카오 API 오류: ${response.status}`)
    }

    const data = await response.json()

    if (!data.documents || data.documents.length === 0) {
      throw new Error('해당 주소의 좌표를 찾을 수 없습니다')
    }

    const { x, y } = data.documents[0]

    logger.debug('주소 → 좌표 변환 성공', { address, latitude: y, longitude: x })

    return {
      latitude: parseFloat(y),
      longitude: parseFloat(x)
    }
  } catch (err) {
    logger.error('좌표 변환 실패', err)
    throw err
  }
}

/**
 * 주소 검색 + 좌표 변환을 한 번에 처리
 * @returns {Promise<Object>} { address, latitude, longitude, ... }
 */
export const searchAddressWithCoordinates = async () => {
  const addressData = await openAddressSearch()

  const coordinates = await getCoordinatesFromAddress(addressData.address)

  return {
    ...addressData,
    ...coordinates
  }
}
