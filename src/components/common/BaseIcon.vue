<template>
  <svg
    :class="iconClasses"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Home Line -->
    <template v-if="name === 'home-line'">
      <path
        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 22V12H15V22"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Home Fill -->
    <template v-else-if="name === 'home-fill'">
      <path
        d="M12 2L3 9V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H9V12H15V22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V9L12 2Z"
        :fill="color"
      />
    </template>

    <!-- Map Line -->
    <template v-else-if="name === 'map-line'">
      <path
        d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 2V18M16 6V22"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Bookmark Line -->
    <template v-else-if="name === 'bookmark-line'">
      <path
        d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Bookmark Fill -->
    <template v-else-if="name === 'bookmark-fill'">
      <path
        d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
        :fill="color"
      />
    </template>

    <!-- Chevron Up -->
    <template v-else-if="name === 'chevron-up'">
      <path
        d="M18 15L12 9L6 15"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Chevron Down -->
    <template v-else-if="name === 'chevron-down'">
      <path
        d="M6 9L12 15L18 9"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Chevron Left -->
    <template v-else-if="name === 'chevron-left'">
      <path
        d="M15 18L9 12L15 6"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Chevron Right -->
    <template v-else-if="name === 'chevron-right'">
      <path
        d="M9 18L15 12L9 6"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Search -->
    <template v-else-if="name === 'search'">
      <circle
        cx="11"
        cy="11"
        r="8"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M21 21L16.65 16.65"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Plus -->
    <template v-else-if="name === 'plus'">
      <path
        d="M12 5V19M5 12H19"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Check -->
    <template v-else-if="name === 'check'">
      <path
        d="M20 6L9 17L4 12"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- X (Close) -->
    <template v-else-if="name === 'x'">
      <path
        d="M18 6L6 18M6 6L18 18"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Filter -->
    <template v-else-if="name === 'filter'">
      <path
        d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- More (3 dots) -->
    <template v-else-if="name === 'more'">
      <circle cx="12" cy="5" r="1.5" :fill="color" />
      <circle cx="12" cy="12" r="1.5" :fill="color" />
      <circle cx="12" cy="19" r="1.5" :fill="color" />
    </template>

    <!-- Fallback: Unknown icon -->
    <template v-else>
      <circle cx="12" cy="12" r="2" :fill="color" />
    </template>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Icon name
   */
  name: {
    type: String,
    required: true
  },
  /**
   * Icon size (width and height in pixels)
   */
  size: {
    type: [String, Number],
    default: 24
  },
  /**
   * Icon color (uses currentColor by default)
   */
  color: {
    type: String,
    default: 'currentColor'
  }
})

const iconClasses = computed(() => {
  return 'inline-block shrink-0'
})
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: middle;
}
</style>
