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

    flatList.forEach(item => {
      map.set(item.id, {
        ...item,
        subCategories: [],
        flavors: []
      });
    });

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
