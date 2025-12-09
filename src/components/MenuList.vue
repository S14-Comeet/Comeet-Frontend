<template>
  <div class="menu-list">
    <div
      v-for="menu in menus"
      :key="menu.id"
      class="menu-item"
    >
      <div class="menu-image-wrapper">
        <img
          v-if="menu.image_url"
          :src="menu.image_url"
          :alt="menu.name"
          class="menu-image"
        />
        <div v-else class="menu-image-placeholder">
          <span>이미지 없음</span>
        </div>
      </div>
      <div class="menu-info">
        <div v-if="menu.category && menu.category.length > 0" class="badge-container">
          <span v-for="cat in menu.category" :key="cat" class="badge">{{ cat }}</span>
        </div>
        <h3 class="menu-name">{{ menu.name }}</h3>
        <p class="menu-description">{{ menu.description }}</p>
        <div class="menu-footer">
          <p class="menu-price">{{ formatPrice(menu.price) }}원</p>
          <button class="auth-button" @click="handleAuth(menu)">
            인증
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  menus: {
    type: Array,
    required: true,
    default: () => []
  }
})

const formatPrice = (price) => {
  return price?.toLocaleString('ko-KR') || '0'
}

// 인증 버튼 핸들러 - 추후 기능 구현 예정
const handleAuth = (menu) => {
  console.log('메뉴 인증:', menu.name)
}
</script>

<style scoped>
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.menu-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.menu-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.menu-image-wrapper {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
}

.menu-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.menu-image-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f3f4f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.75rem;
}

.menu-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

.badge-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.35rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.badge-container::-webkit-scrollbar {
  display: none;
}

.badge {
  display: inline-block;
  flex-shrink: 0;
  padding: 0.15rem 0.5rem;
  background-color: #f3f4f6;
  color: #374151;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 500;
  border: 1px solid #e5e7eb;
  white-space: nowrap;
}

.menu-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

.menu-description {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.4;
  margin: 0;
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.2rem;
}

.menu-price {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.auth-button {
  padding: 0.4rem 0.9rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.auth-button:hover {
  background-color: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.auth-button:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .menu-item {
    flex-direction: row;
    gap: 0.75rem;
    padding: 0.875rem;
  }

  .menu-image-wrapper {
    width: 90px;
    height: 90px;
  }

  .menu-name {
    font-size: 1rem;
  }

  .menu-description {
    font-size: 0.75rem;
  }

  .menu-price {
    font-size: 0.95rem;
  }

  .auth-button {
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>
