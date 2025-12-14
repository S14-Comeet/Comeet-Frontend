<template>
  <div class="menu-view">
    <div class="header-section">
      <h1 class="page-title">메뉴</h1>
    </div>

    <MenuList :menus="menuData" />

    <!-- Review Button Section -->
    <div class="review-button-section">
      <ReviewButton @click="goToReview" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MenuList from '@/components/MenuList.vue'
import ReviewButton from '@/components/review/ReviewButton.vue'

const router = useRouter()

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

const goToReview = () => {
  // Use store_id from first item or default to 1
  const storeId = menuData.value.length > 0 ? menuData.value[0].store_id : 1

  router.push({
    name: 'review-select',
    query: {
      storeId: storeId,
      name: '커핏 강남점' // Mock name, ideally fetched or passed
    }
  })
}
</script>

<style scoped>
.menu-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-bottom: 100px;
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

.review-button-section {
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  padding: 0 1.5rem;
  max-width: 448px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .menu-view {
    padding: 1rem 0.5rem;
    padding-bottom: 140px;
  }

  .header-section {
    padding: 0 0.5rem;
    margin-bottom: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .review-button-section {
    bottom: calc(64px + env(safe-area-inset-bottom) + 16px);
    padding: 0 1rem;
  }
}
</style>
