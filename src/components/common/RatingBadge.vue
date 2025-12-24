<template>
  <div v-if="badgeLevel > 0" class="rating-badge" :title="badgeTitle">
    <img v-if="badgeLevel === 3" :src="threeIconUrl" alt="3 Star Rating" class="badge-icon" />
    <img v-else-if="badgeLevel === 2" :src="twoIconUrl" alt="2 Star Rating" class="badge-icon" />
    <img v-else-if="badgeLevel === 1" :src="logoIconUrl" alt="1 Star Rating" class="badge-icon badge-icon-single" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import threeIconUrl from '@/assets/three.svg?url'
import twoIconUrl from '@/assets/two.svg?url'
import logoIconUrl from '@/assets/logo.svg?url'

const props = defineProps({
  rating: {
    type: Number,
    default: 0
  }
})

const badgeLevel = computed(() => {
  if (!props.rating || props.rating < 3.5) return 0
  if (props.rating >= 4.5) return 3
  if (props.rating >= 4.0) return 2
  return 1
})

const badgeTitle = computed(() => {
  if (badgeLevel.value === 3) return '최고 평점 (4.5+)'
  if (badgeLevel.value === 2) return '우수 평점 (4.0+)'
  if (badgeLevel.value === 1) return '좋은 평점 (3.5+)'
  return ''
})
</script>

<style scoped>
.rating-badge {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
}

.badge-icon {
  height: 14px;
  width: auto;
  display: block;
}

/* 1스타(logo.svg)는 정사각형이라 높이를 더 크게 설정 */
.badge-icon-single {
  height: 20px;
}
</style>

