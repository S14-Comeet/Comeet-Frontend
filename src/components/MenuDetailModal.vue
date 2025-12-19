<template>
  <transition name="fade">
    <dialog
      v-if="menu"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="alertdialog"
      aria-modal="true"
      @click="$emit('close')"
    >
      <div
        class="modal-content relative bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        @click.stop
      >
        <!-- Close Button -->
        <button
          class="absolute top-4 right-4 z-10 text-white bg-black/30 hover:bg-black/50 rounded-full p-1.5 transition-all"
          aria-label="닫기"
          @click="$emit('close')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Menu Image -->
        <div class="menu-image-container">
          <img
            v-if="menu.imageUrl || menu.image_url"
            :src="menu.imageUrl || menu.image_url"
            :alt="menu.name"
            class="menu-image"
          />
          <div v-else class="menu-image-placeholder">
            <BaseIcon name="coffee" :size="64" class="text-primary-300" />
          </div>
        </div>

        <!-- Content -->
        <div class="p-5">
          <!-- Category Badges -->
          <div v-if="menu.category && menu.category.length > 0" class="badge-container mb-2">
            <span v-for="cat in menu.category" :key="cat" class="badge">{{ cat }}</span>
          </div>

          <!-- Menu Name & Price -->
          <h2 class="text-xl font-bold text-textPrimary mb-1">{{ menu.name }}</h2>
          <p class="text-lg font-semibold text-primary mb-3">{{ formatPrice(menu.price) }}원</p>

          <!-- Description -->
          <p v-if="menu.description" class="text-textSecondary text-sm leading-relaxed mb-4 whitespace-pre-line">
            {{ menu.description }}
          </p>

          <!-- Loading State for Detail -->
          <div v-if="isLoading" class="flex items-center justify-center py-4">
            <BaseIcon name="spinner" :size="24" class="text-primary animate-spin" />
          </div>

          <!-- Bean Info Section -->
          <div v-else-if="beans && beans.length > 0" class="bean-section">
            <h3 class="section-title">
              <BaseIcon name="coffee" :size="18" class="text-primary" />
              <span>사용 원두</span>
              <span class="bean-count">{{ beans.length }}종</span>
            </h3>

            <div class="bean-tags">
              <div
                v-for="bean in beans"
                :key="bean.id"
                class="bean-tag"
              >
                <span class="bean-name">{{ bean.name }}</span>
                <span v-if="bean.roasteryName" class="bean-roastery">{{ bean.roasteryName }}</span>
                <div v-if="bean.origin" class="bean-origin">{{ bean.origin }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'

const props = defineProps({
  menu: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const beans = computed(() => {
  return props.menu.beans || props.menu.beanList || []
})

const formatPrice = (price) => {
  return price?.toLocaleString('ko-KR') || '0'
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-content {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-image-container {
  width: 100%;
  height: 220px;
  background-color: var(--color-primary-100);
  overflow: hidden;
  border-radius: 1rem 1rem 0 0;
}

.menu-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.menu-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-50);
}

.badge-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background-color: var(--color-primary-100);
  color: var(--color-primary-700);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--color-primary-200);
}

.bean-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-textPrimary);
  margin-bottom: 0.75rem;
}

.bean-count {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary);
  background-color: var(--color-primary-50);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.bean-tags {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bean-tag {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--color-neutral-50);
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
}

.bean-name {
  font-weight: 600;
  color: var(--color-textPrimary);
  font-size: 0.9375rem;
}

.bean-roastery {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
}

.bean-origin {
  width: 100%;
  font-size: 0.75rem;
  color: var(--color-primary);
  margin-top: 0.25rem;
}
</style>
