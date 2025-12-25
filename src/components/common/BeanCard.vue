<template>
  <div
    class="bean-card"
    :class="{ clickable: clickable }"
    @click="handleClick"
  >
    
    <div class="card-header">
      
      <span v-if="rank" class="rank-badge">#{{ rank }}</span>

      
      <div class="bean-info">
        <h3 class="bean-name">{{ displayName }}</h3>
        <p class="bean-meta">
          <span class="origin">{{ displayOrigin }}</span>
          <template v-if="roastingLabel">
            <span class="separator">·</span>
            <span class="roast-level">{{ roastingLabel }}</span>
          </template>
        </p>
      </div>
    </div>

    <!-- Flavor Chips -->
    <div v-if="flavors?.length" class="flavor-list">
      <FlavorChip
        v-for="flavor in displayFlavors"
        :key="flavor.flavorId || flavor.code || flavor.id"
        :flavor="flavor"
      />
      <span v-if="flavors.length > maxFlavors" class="more-flavors">
        +{{ flavors.length - maxFlavors }}
      </span>
    </div>

    <!-- AI Recommendation Reason -->
    <RecommendationReason v-if="reason" :reason="reason" />

    <!-- Action Buttons (for owner management) -->
    <div v-if="showActions" class="action-buttons">
      <slot name="actions">
        <BaseButton
          variant="secondary"
          size="small"
          class="flex-1"
          @click.stop="$emit('link-menus', bean)"
        >
          <BaseIcon name="link" :size="16" class="mr-1" />
          메뉴 연결
        </BaseButton>
        <BaseButton
          variant="ghost"
          size="small"
          class="delete-btn"
          @click.stop="$emit('delete', bean)"
        >
          <BaseIcon name="close" :size="16" />
        </BaseButton>
      </slot>
    </div>

    <!-- Menu Count Badge (for owner view, when not showing actions) -->
    <div v-if="linkedMenuCount > 0 && !showActions" class="menu-count">
      <BaseIcon name="link" :size="14" />
      <span>메뉴 {{ linkedMenuCount }}개 연결</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import FlavorChip from '@/components/common/FlavorChip.vue'
import RecommendationReason from '@/components/recommendation/RecommendationReason.vue'

const ROASTING_LABELS = {
  LIGHT: '라이트',
  MEDIUM: '미디엄',
  DARK: '다크',
  HEAVY: '다크'
}

const props = defineProps({
  /** Bean data object */
  bean: {
    type: Object,
    required: true
  },
  /** Rank number for recommendations (e.g., 1, 2, 3) */
  rank: {
    type: Number,
    default: null
  },
  /** AI recommendation reason */
  reason: {
    type: String,
    default: null
  },
  /** Whether to show action buttons (for owner management) */
  showActions: {
    type: Boolean,
    default: false
  },
  /** Number of linked menus (for owner view) */
  linkedMenuCount: {
    type: Number,
    default: 0
  },
  /** Whether card is clickable (navigates to detail) */
  clickable: {
    type: Boolean,
    default: true
  },
  /** Max number of flavors to display */
  maxFlavors: {
    type: Number,
    default: 5
  },
  /** Whether to navigate on click (vs emit event only) */
  autoNavigate: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'link-menus', 'delete'])
const router = useRouter()

/** Bean flavors from various possible field names */
const flavors = computed(() => {
  return props.bean.flavors || props.bean.flavorNotes || []
})

/** Display only maxFlavors */
const displayFlavors = computed(() => {
  return flavors.value.slice(0, props.maxFlavors)
})

/** Display name - prefer beanName, then name, then country+farm */
const displayName = computed(() => {
  if (props.bean.beanName) return props.bean.beanName
  if (props.bean.name) return props.bean.name
  if (props.bean.farm) return `${props.bean.country} ${props.bean.farm}`
  return props.bean.country || '원두'
})

/** Display origin - show origin field, or country */
const displayOrigin = computed(() => {
  if (props.bean.origin) return props.bean.origin
  if (props.bean.country) return props.bean.country
  return ''
})

/** Roasting level label in Korean */
const roastingLabel = computed(() => {
  const level = props.bean.roastLevel || props.bean.roastingLevel
  if (!level) return null
  return ROASTING_LABELS[level] || level
})

/** Handle card click */
const handleClick = () => {
  if (!props.clickable) return

  emit('click', props.bean)

  if (props.autoNavigate) {
    const beanId = props.bean.beanId || props.bean.id
    if (beanId) {
      router.push(`/bean/${beanId}`)
    }
  }
}
</script>

<style scoped>
.bean-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.bean-card.clickable {
  cursor: pointer;
}

.bean-card.clickable:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.bean-card.clickable:active {
  transform: scale(0.99);
}

/* Header */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.rank-badge {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.375rem;
  background-color: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.25rem;
}

.bean-info {
  flex: 1;
  min-width: 0;
}

.bean-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bean-meta {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
  margin: 0;
}

.separator {
  margin: 0 0.25rem;
}

.roast-level {
  color: var(--color-primary-500);
}

/* Flavor List */
.flavor-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
}

.more-flavors {
  font-size: 0.6875rem;
  color: var(--color-textTertiary);
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.delete-btn {
  color: var(--color-error) !important;
}

/* Menu Count */
.menu-count {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.75rem;
  padding: 0.375rem 0.625rem;
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.375rem;
}
</style>
