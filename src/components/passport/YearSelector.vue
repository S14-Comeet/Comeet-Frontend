<template>
  <div class="year-selector">
    <button class="selector-button" @click="toggleDropdown">
      <span class="year-text">{{ selectedYear }}년</span>
      <span class="dropdown-icon" :class="{ 'open': isOpen }">▼</span>
    </button>
    
    <div v-if="isOpen" class="dropdown-menu">
      <button
        v-for="year in years"
        :key="year"
        class="dropdown-item"
        :class="{ 'active': year === selectedYear }"
        @click="selectYear(year)"
      >
        {{ year }}년
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  selectedYear: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['change'])

const isOpen = ref(false)

// 2020년부터 현재 연도까지
const currentYear = new Date().getFullYear()
const years = computed(() => {
  const result = []
  for (let year = currentYear; year >= 2020; year--) {
    result.push(year)
  }
  return result
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectYear = (year) => {
  emit('change', year)
  isOpen.value = false
}
</script>

<style scoped>
.year-selector {
  position: relative;
}

.selector-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.selector-button:hover {
  border-color: var(--color-primary-400);
}

.year-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary-700);
}

.dropdown-icon {
  font-size: 0.625rem;
  color: var(--color-textSecondary);
  transition: transform 0.2s;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 120px;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--color-primary-700);
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: var(--color-primary-50);
}

.dropdown-item.active {
  background-color: var(--color-primary-100);
  font-weight: 600;
}
</style>
