<template>
  <div class="passport-timeline">
    <div v-for="(records, date) in groupedRecords" :key="date" class="date-group">
      <!-- 날짜 헤더 -->
      <div class="date-header">
        <div class="date-marker">
          <span class="date-dot"></span>
          <span class="date-line"></span>
        </div>
        <div class="date-badge">
          <span class="date-day">{{ formatDay(date) }}</span>
          <span class="date-weekday">{{ formatWeekday(date) }}</span>
        </div>
      </div>

      <!-- 방문 기록 카드들 -->
      <div class="records-container">
        <div v-for="record in records" :key="record.visitId" class="timeline-card" @click="handleItemClick(record)">
          <div class="card-content">
            <div class="store-info">
              <h3 class="store-name">{{ record.storeName }}</h3>
              <p class="store-address">{{ record.storeAddress }}</p>
            </div>

            <div class="coffee-info">
              <div class="origin-chip">
                <span class="origin-flag">🌍</span>
                <span class="origin-name">{{ record.beanOrigin }}</span>
              </div>
              <div class="menu-chip">
                <span class="menu-icon">☕</span>
                <span class="menu-name">{{ record.menuName }}</span>
              </div>
            </div>
          </div>

          <div class="card-arrow">
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  groupedRecords: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['item-click'])

const formatDay = (dateString) => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}`
}

const formatWeekday = (dateString) => {
  const date = new Date(dateString)
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  return weekdays[date.getDay()]
}

const handleItemClick = (record) => {
  emit('item-click', record)
}
</script>

<style scoped>
.passport-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.date-group {
  position: relative;
}

/* 날짜 헤더 */
.date-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.date-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
}

.date-dot {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(132, 97, 72, 0.3);
}

.date-line {
  width: 2px;
  flex: 1;
  min-height: 100px;
  background: linear-gradient(to bottom, var(--color-primary-300), var(--color-primary-100));
  position: absolute;
  top: 16px;
  left: 5px;
  height: calc(100% - 8px);
}

.date-group:last-child .date-line {
  display: none;
}

.date-badge {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem 0.25rem 0;
}

.date-day {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary-700);
}

.date-weekday {
  font-size: 0.75rem;
  color: var(--color-textSecondary);
  padding: 0.125rem 0.375rem;
  background-color: var(--color-primary-50);
  border-radius: 4px;
}

/* 기록 카드 컨테이너 */
.records-container {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-left: 24px;
  margin-bottom: 1.5rem;
}

/* 타임라인 카드 */
.timeline-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(99, 73, 54, 0.06);
  border: 1px solid transparent;
}

.timeline-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(99, 73, 54, 0.1);
  border-color: var(--color-primary-200);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.store-info {
  margin-bottom: 0.625rem;
}

.store-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary-700);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.store-address {
  font-size: 0.75rem;
  color: var(--color-textSecondary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coffee-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.origin-chip,
.menu-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
}

.origin-chip {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1565c0;
}

.menu-chip {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #e65100;
}

.origin-flag,
.menu-icon {
  font-size: 0.875rem;
}

.origin-name,
.menu-name {
  font-weight: 500;
}

.card-arrow {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-50);
  border-radius: 10px;
  color: var(--color-primary-600);
  font-size: 1rem;
  margin-left: 0.75rem;
  transition: all 0.2s;
  flex-shrink: 0;
}

.timeline-card:hover .card-arrow {
  background: var(--color-primary-100);
  transform: translateX(2px);
}
</style>
