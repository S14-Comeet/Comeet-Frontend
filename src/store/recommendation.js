import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getBeanRecommendations,
  getMenuRecommendations,
  getNearbyMenuRecommendations
} from '@/api/recommendation'
import { createLogger } from '@/utils/logger'

const logger = createLogger('RecommendationStore')

export const useRecommendationStore = defineStore('recommendation', () => {
  // State
  const beanRecommendations = ref([])
  const menuRecommendations = ref([])
  const nearbyMenuRecommendations = ref([])

  const hasFetchedBeans = ref(false)
  const hasFetchedMenus = ref(false)
  const hasFetchedNearbyMenus = ref(false)

  const isLoadingBeans = ref(false)
  const isLoadingMenus = ref(false)

  const beanError = ref(null)
  const menuError = ref(null)

  // 근거리 검색 관련
  const radiusExpanded = ref(false)
  const actualRadiusKm = ref(5)

  // Actions
  const fetchBeanRecommendations = async (forceRefresh = false) => {
    if (hasFetchedBeans.value && !forceRefresh) {
      logger.debug('Using cached bean recommendations')
      return beanRecommendations.value
    }

    isLoadingBeans.value = true
    beanError.value = null

    try {
      const data = await getBeanRecommendations()
      beanRecommendations.value = data || []
      hasFetchedBeans.value = true
      logger.info('Bean recommendations loaded', { count: beanRecommendations.value.length })
      return beanRecommendations.value
    } catch (error) {
      logger.error('Failed to load bean recommendations', error)
      beanError.value = '원두 추천을 불러올 수 없습니다'
      throw error
    } finally {
      isLoadingBeans.value = false
    }
  }

  const fetchMenuRecommendations = async (forceRefresh = false) => {
    if (hasFetchedMenus.value && !forceRefresh) {
      logger.debug('Using cached menu recommendations')
      return menuRecommendations.value
    }

    isLoadingMenus.value = true
    menuError.value = null

    try {
      const data = await getMenuRecommendations()
      menuRecommendations.value = data || []
      hasFetchedMenus.value = true
      logger.info('Menu recommendations loaded', { count: menuRecommendations.value.length })
      return menuRecommendations.value
    } catch (error) {
      logger.error('Failed to load menu recommendations', error)
      menuError.value = '메뉴 추천을 불러올 수 없습니다'
      throw error
    } finally {
      isLoadingMenus.value = false
    }
  }

  const fetchNearbyMenuRecommendations = async (lat, lng, radiusKm = 5, forceRefresh = false) => {
    if (hasFetchedNearbyMenus.value && !forceRefresh) {
      logger.debug('Using cached nearby menu recommendations')
      return {
        recommendations: nearbyMenuRecommendations.value,
        radiusExpanded: radiusExpanded.value,
        actualRadiusKm: actualRadiusKm.value
      }
    }

    isLoadingMenus.value = true
    menuError.value = null

    try {
      const data = await getNearbyMenuRecommendations(lat, lng, radiusKm)
      nearbyMenuRecommendations.value = data?.recommendations || []
      radiusExpanded.value = data?.radiusExpanded || false
      actualRadiusKm.value = data?.actualRadiusKm || 5
      hasFetchedNearbyMenus.value = true

      logger.info('Nearby menu recommendations loaded', {
        count: nearbyMenuRecommendations.value.length,
        radiusExpanded: radiusExpanded.value
      })

      return {
        recommendations: nearbyMenuRecommendations.value,
        radiusExpanded: radiusExpanded.value,
        actualRadiusKm: actualRadiusKm.value
      }
    } catch (error) {
      logger.error('Failed to load nearby menu recommendations', error)
      menuError.value = '메뉴 추천을 불러올 수 없습니다'
      throw error
    } finally {
      isLoadingMenus.value = false
    }
  }

  const fetchAllRecommendations = async (forceRefresh = false) => {
    await Promise.all([
      fetchBeanRecommendations(forceRefresh),
      fetchMenuRecommendations(forceRefresh)
    ])
  }

  const clearCache = () => {
    beanRecommendations.value = []
    menuRecommendations.value = []
    nearbyMenuRecommendations.value = []
    hasFetchedBeans.value = false
    hasFetchedMenus.value = false
    hasFetchedNearbyMenus.value = false
    beanError.value = null
    menuError.value = null
    radiusExpanded.value = false
    actualRadiusKm.value = 5
  }

  return {
    // State
    beanRecommendations,
    menuRecommendations,
    nearbyMenuRecommendations,
    hasFetchedBeans,
    hasFetchedMenus,
    hasFetchedNearbyMenus,
    isLoadingBeans,
    isLoadingMenus,
    beanError,
    menuError,
    radiusExpanded,
    actualRadiusKm,

    // Actions
    fetchBeanRecommendations,
    fetchMenuRecommendations,
    fetchNearbyMenuRecommendations,
    fetchAllRecommendations,
    clearCache
  }
})
