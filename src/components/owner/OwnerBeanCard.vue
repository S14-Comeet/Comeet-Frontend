<template>
  <div class="bg-white rounded-xl p-4 shadow-sm border border-border">
    
    <div class="flex gap-4">
      
      <div class="w-12 h-12 rounded-lg bg-accent/10 flex-shrink-0 flex items-center justify-center">
        <BaseIcon name="coffee" :size="24" class="text-accent" />
      </div>

      
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-bold text-textPrimary">
            {{ bean.country }}
            <span v-if="bean.farm" class="font-normal text-textSecondary">{{ bean.farm }}</span>
          </h3>
        </div>

        <p class="text-sm text-textSecondary mt-1">
          {{ formatBeanInfo }}
        </p>

        <div class="flex items-center gap-2 mt-2">
          
          <span
            v-if="bean.roastingLevel"
            class="px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary rounded"
          >
            {{ roastingLabel }}
          </span>

          
          <span
            v-if="linkedMenuCount > 0"
            class="px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded"
          >
            메뉴
          </span>
        </div>
      </div>
    </div>

    
    <div class="flex gap-2 mt-4 pt-4 border-t border-border">
      <BaseButton
        variant="secondary"
        size="small"
        class="flex-1"
        @click="$emit('link-menus', bean)"
      >
        <BaseIcon name="link" :size="16" class="mr-1" />
        메뉴 연결
      </BaseButton>
      <BaseButton
        variant="ghost"
        size="small"
        class="!text-error"
        @click="$emit('delete', bean)"
      >
        <BaseIcon name="close" :size="16" />
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const ROASTING_LABELS = {
  LIGHT: '라이트',
  MEDIUM: '미디엄',
  DARK: '다크'
}

const props = defineProps({
  bean: {
    type: Object,
    required: true
  },
  linkedMenuCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['link-menus', 'delete'])

/**
 * 원두 정보 포맷팅 (품종 · 가공방식)
 */
const formatBeanInfo = computed(() => {
  const parts = []
  if (props.bean.variety) parts.push(props.bean.variety)
  if (props.bean.processingMethod) parts.push(props.bean.processingMethod)
  return parts.length > 0 ? parts.join(' · ') : '-'
})

/**
 * 로스팅 레벨 한글 라벨
 */
const roastingLabel = computed(() => {
  return ROASTING_LABELS[props.bean.roastingLevel] || props.bean.roastingLevel
})
</script>
