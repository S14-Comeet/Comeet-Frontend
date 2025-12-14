import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAllFlavors } from '@/api/flavor';
import { createLogger } from '@/utils/logger';

const logger = createLogger('Store:Flavor');

export const useFlavorStore = defineStore('flavor', () => {
  const flavors = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  /**
   * Flat List를 계층형 트리 구조로 변환
   */
  const buildFlavorTree = (flatList) => {
    const tree = [];
    const map = new Map();

    // 1. 모든 아이템을 Map에 등록하고 children 배열 초기화
    flatList.forEach(item => {
      // API 응답 필드와 프론트엔드 컴포넌트 기대 필드 매핑
      // 프론트엔드 컴포넌트(FlavorSelector)는 L1, L2에서 'subCategories'를, L2에서 'flavors'를 기대함
      // 하지만 통일성을 위해 'subCategories'로 사용하거나, 컴포넌트를 수정해야 함.
      // 여기서는 컴포넌트 로직(L1->subCategories, L2->flavors)에 맞춰 변환
      
      map.set(item.id, { 
        ...item, 
        subCategories: [], // For Level 1 -> 2
        flavors: []        // For Level 2 -> 3
      });
    });

    // 2. 부모-자식 관계 연결
    flatList.forEach(item => {
      const node = map.get(item.id);
      if (item.parentId) {
        const parent = map.get(item.parentId);
        if (parent) {
          if (parent.level === 1) {
             parent.subCategories.push(node);
          } else if (parent.level === 2) {
             parent.flavors.push(node);
          }
        }
      } else {
        // 부모가 없으면 최상위(Level 1)
        if (item.level === 1) {
          tree.push(node);
        }
      }
    });

    return tree;
  };

  /**
   * Flavor 데이터 가져오기 (이미 있으면 스킵)
   */
  const fetchFlavors = async (force = false) => {
    if (!force && flavors.value.length > 0) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await getAllFlavors();
      // API 응답이 { success: true, data: [...] } 형태라고 가정
      const flatList = response.data || [];
      flavors.value = buildFlavorTree(flatList);
      logger.info(`Flavor loaded: ${flavors.value.length} root categories`);
    } catch (err) {
      logger.error('Failed to load flavors', err);
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * ID로 Flavor 찾기 (재귀 탐색)
   */
  const getFlavorById = (id) => {
    const findRecursively = (items) => {
      for (const item of items) {
        if (item.id === id) return item;
        
        // 하위 검색
        if (item.subCategories?.length) {
          const found = findRecursively(item.subCategories);
          if (found) return found;
        }
        if (item.flavors?.length) {
          const found = findRecursively(item.flavors);
          if (found) return found;
        }
      }
      return null;
    };
    return findRecursively(flavors.value);
  };

  return {
    flavors,
    isLoading,
    error,
    fetchFlavors,
    getFlavorById,
  };
});
