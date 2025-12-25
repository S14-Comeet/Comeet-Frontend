<template>
    <transition name="slide-up">
        <div v-if="record" class="timeline-record-card" @click.stop>
            
            <div class="w-12 h-1 bg-primary-200 rounded-full mx-auto mb-4"></div>

            
            <div class="card-header">
                <span class="visit-date">{{ formatDate(record.visitDate) }}</span>
                <span class="cafe-tag">카페</span>
            </div>

            
            <h3 class="store-name">{{ record.storeName }}</h3>
            <p class="store-address">{{ record.storeAddress }}</p>

            
            <div class="coffee-info">
                <div class="info-item origin">
                    <BaseIcon name="globe" :size="16" color="var(--color-primary-600)" />
                    <div class="info-text">
                        <span class="info-label">원두 원산지</span>
                        <span class="info-value">{{ record.beanOrigin }}</span>
                    </div>
                </div>
                <div class="info-item menu">
                    <BaseIcon name="coffee" :size="16" color="var(--color-primary-600)" />
                    <div class="info-text">
                        <span class="info-label">주문 메뉴</span>
                        <span class="info-value">{{ record.menuName }}</span>
                    </div>
                </div>
            </div>

            
            <div class="action-buttons">
                <button class="btn-primary" @click="$emit('detail')">
                    상세보기
                </button>
                <button class="btn-secondary" @click="$emit('close')">
                    닫기
                </button>
            </div>
        </div>
    </transition>
</template>

<script setup>
import BaseIcon from '@/components/common/BaseIcon.vue'
import { formatDateWithWeekday as formatDate } from '@/utils/date'

defineProps({
    record: {
        type: Object,
        default: null
    }
})

defineEmits(['close', 'detail'])
</script>

<style scoped>
.timeline-record-card {
    background: white;
    border-radius: 1rem 1rem 0 0;
    padding: 1rem 1.25rem;
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}

.visit-date {
    font-size: 0.75rem;
    color: var(--color-textSecondary);
}

.cafe-tag {
    padding: 0.25rem 0.5rem;
    background: rgba(255, 152, 0, 0.1);
    color: #ff9800;
    border-radius: 6px;
    font-size: 0.6875rem;
    font-weight: 600;
}

.store-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary-800);
    margin: 0 0 0.25rem 0;
}

.store-address {
    font-size: 0.8125rem;
    color: var(--color-textSecondary);
    margin: 0 0 1rem 0;
}

.coffee-info {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.info-item {
    flex: 1;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--color-primary-50);
    border: 1px solid var(--color-primary-100);
    border-radius: 10px;
}

.info-text {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.info-label {
    font-size: 0.625rem;
    color: var(--color-textSecondary);
}

.info-value {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-primary-700);
}

.action-buttons {
    display: flex;
    gap: 0.5rem;
}

.btn-primary {
    flex: 1;
    padding: 0.75rem;
    background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(132, 97, 72, 0.3);
}

.btn-secondary {
    padding: 0.75rem 1rem;
    background: white;
    color: var(--color-textSecondary);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    font-weight: 500;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary:hover {
    background: var(--color-primary-50);
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}
</style>
