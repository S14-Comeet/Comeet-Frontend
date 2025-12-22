/**
 * Naver Geolocation API 클라이언트
 */
import { createLogger } from '@/utils/logger'

const logger = createLogger('GeolocationAPI')

// Naver Geolocation API 설정
const NAVER_GEOLOCATION_URL = 'https://geolocation.apigw.ntruss.com/geolocation/v2/geoLocation'
const NAVER_ACCESS_KEY = import.meta.env.VITE_NAVER_ACCESS_KEY
const NAVER_SECRET_KEY = import.meta.env.VITE_NAVER_SECRET_KEY

/**
 * HMAC-SHA256 서명 생성 (Web Crypto API 사용)
 * @param {string} secretKey - Naver Secret Key
 * @param {string} message - 서명할 메시지
 * @returns {Promise<string>} Base64 인코딩된 서명
 */
const generateSignature = async (secretKey, message) => {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secretKey)
    const messageData = encoder.encode(message)

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)

    // ArrayBuffer to Base64
    const signatureArray = new Uint8Array(signature)
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray))

    return signatureBase64
}

/**
 * Naver API 요청 헤더 생성
 * @param {string} method - HTTP 메서드
 * @param {string} uri - 요청 URI (쿼리 파라미터 포함)
 * @returns {Promise<Object>} 요청 헤더 객체
 */
const createNaverHeaders = async (method, uri) => {
    const timestamp = Date.now().toString()

    // StringToSign: {method} {uri}\n{timestamp}\n{accessKey}
    const message = `${method} ${uri}\n${timestamp}\n${NAVER_ACCESS_KEY}`

    const signature = await generateSignature(NAVER_SECRET_KEY, message)

    return {
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': NAVER_ACCESS_KEY,
        'x-ncp-apigw-signature-v2': signature
    }
}

/**
 * 공인 IP 주소 조회 (외부 서비스 사용)
 * @returns {Promise<string>} 공인 IP 주소
 */
const getPublicIP = async () => {
    try {
        // ipify API를 사용하여 공인 IP 조회
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        logger.info('Public IP retrieved', { ip: data.ip })
        return data.ip
    } catch (error) {
        logger.error('Failed to get public IP', error)
        throw new Error('공인 IP 주소를 가져올 수 없습니다')
    }
}

/**
 * IP 기반 위치 정보 조회 (Naver Geolocation API 직접 호출)
 * @param {string} [ip] - 조회할 IP 주소 (미지정 시 현재 공인 IP 사용)
 * @returns {Promise<{lat: number, lng: number, country: string, r1: string, r2: string, r3: string}>}
 */
export const getLocationByIP = async (ip = null) => {
    // API 키 확인
    if (!NAVER_ACCESS_KEY || !NAVER_SECRET_KEY) {
        throw new Error('Naver API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.')
    }

    // IP 주소가 없으면 현재 공인 IP 조회
    const targetIP = ip || await getPublicIP()

    logger.info('Requesting IP-based location from Naver Geolocation', { ip: targetIP })

    // URI 생성 (쿼리 파라미터 포함)
    const uri = `/geolocation/v2/geoLocation?ip=${targetIP}&ext=t&enc=utf8&responseFormatType=json`

    // 헤더 생성
    const headers = await createNaverHeaders('GET', uri)

    try {
        const response = await fetch(`${NAVER_GEOLOCATION_URL}?ip=${targetIP}&ext=t&enc=utf8&responseFormatType=json`, {
            method: 'GET',
            headers: headers
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            logger.error('Naver Geolocation API error', { status: response.status, error: errorData })
            throw new Error(getNaverErrorMessage(errorData.returnCode || response.status))
        }

        const data = await response.json()

        if (data.returnCode !== 0) {
            throw new Error(getNaverErrorMessage(data.returnCode))
        }

        const { geoLocation } = data

        if (!geoLocation) {
            throw new Error('Invalid response: geoLocation not found')
        }

        const result = {
            lat: parseFloat(geoLocation.lat),
            lng: parseFloat(geoLocation.long),
            country: geoLocation.country,
            r1: geoLocation.r1, // 시/도
            r2: geoLocation.r2, // 시/군/구
            r3: geoLocation.r3 || '', // 동
            net: geoLocation.net || '', // 통신사
            source: 'naver-ip'
        }

        logger.info('IP-based location retrieved', {
            lat: result.lat,
            lng: result.lng,
            region: `${result.r1} ${result.r2} ${result.r3}`
        })

        return result
    } catch (error) {
        logger.error('Failed to get IP-based location', error)
        throw error
    }
}

/**
 * Naver Geolocation API 에러 코드별 메시지
 * @param {number|string} code - 에러 코드
 * @returns {string} 에러 메시지
 */
const getNaverErrorMessage = (code) => {
    const errorMessages = {
        131000: 'IP 주소에 대한 지역 정보를 찾을 수 없습니다',
        131001: '유효하지 않은 IP 주소입니다',
        131002: 'Geolocation 서버 오류입니다. 잠시 후 다시 시도해주세요',
        131003: 'API 호출 한도를 초과했습니다',
        131004: 'Geolocation 서비스 이용 신청이 필요합니다'
    }
    return errorMessages[code] || `위치 정보 조회 실패 (코드: ${code})`
}

export default {
    getLocationByIP,
    getPublicIP
}
