<template>
  <div class="menu-view">
    <div class="header-section">
      <h1 class="page-title">메뉴</h1>
    </div>

    <MenuList :menus="menuData" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MenuList from '@/components/MenuList.vue'

// Mock 데이터 - 추후 API 연결 시 제거 예정
const menuData = ref([
  {
    id: 1,
    store_id: 1,
    name: '바리스타 set',
    price: 12000,
    description: '에스프레소, 스몰사이즈 라떼, 필터커피\n총 세 잔의 커피가 제공됩니다.',
    category: ['대표', '세트메뉴'],
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    store_id: 1,
    name: '녹 아이스 커피 (ICED)',
    price: 7000,
    description: '바닐라아이스크림이\n 들어가는 \n아이스크림 \n라떼',
    category: ['대표', '아이스'],
    image_url: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    store_id: 1,
    name: '몽블랑 MONT BLANC',
    price: 6000,
    description: '오렌지 제스트와 넛맥향이 은은한 크림을 드브뤼',
    category: ['대표', '디저트'],
    image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop'
  },
  {
    id: 4,
    store_id: 1,
    name: '녹밀크 NOOK Milk',
    price: 6000,
    description: '논카페인 캐모마일 밀크티',
    category: ['대표', '논카페인'],
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop'
  }
])

// API 연결 예시 (추후 사용)
// import axios from 'axios'
// import { onMounted } from 'vue'
//
// const fetchMenus = async () => {
//   try {
//     const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/menus`)
//     menuData.value = response.data
//   } catch (error) {
//     console.error('메뉴 데이터 로딩 실패:', error)
//   }
// }
//
// onMounted(() => {
//   fetchMenus()
// })
</script>

<style scoped>
.menu-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header-section {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary-950);
  margin: 0;
}

@media (max-width: 640px) {
  .menu-view {
    padding: 1rem 0.5rem;
  }

  .header-section {
    padding: 0 0.5rem;
    margin-bottom: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>
