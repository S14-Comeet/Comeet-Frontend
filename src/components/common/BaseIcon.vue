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
      <circle cx="12" cy="5" r="2" :fill="color" />
      <circle cx="12" cy="12" r="2" :fill="color" />
      <circle cx="12" cy="19" r="2" :fill="color" />
    </template>

    <!-- Event (Calendar) -->
    <template v-else-if="name === 'event'">
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        ry="2"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 2V6M8 2V6M3 10H21"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Notice (Bell) -->
    <template v-else-if="name === 'notice'">
      <path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- User Line -->
    <template v-else-if="name === 'user-line'">
      <path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Sort (Up/Down Arrows) -->
    <template v-else-if="name === 'sort'">
      <path
        d="M8 15L12 19L16 15"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 9L12 5L16 9"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Spinner (Loading) -->
    <template v-else-if="name === 'spinner'">
      <circle
        cx="12"
        cy="12"
        r="10"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        fill="none"
        opacity="0.25"
      />
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        fill="none"
      />
    </template>

    <!-- Coffee Cup -->
    <template v-else-if="name === 'coffee'">
      <path
        d="M18 8H19C20.0609 8 21.0783 8.42143 21.8284 9.17157C22.5786 9.92172 23 10.9391 23 12C23 13.0609 22.5786 14.0783 21.8284 14.8284C21.0783 15.5786 20.0609 16 19 16H18"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2 8H18V17C18 17.7956 17.6839 18.5587 17.1213 19.1213C16.5587 19.6839 15.7956 20 15 20H5C4.20435 20 3.44129 19.6839 2.87868 19.1213C2.31607 18.5587 2 17.7956 2 17V8Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6 1V4M10 1V4M14 1V4"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Coffee To-Go -->
    <template v-else-if="name === 'coffee-to-go'">
      <path
        d="M6 3L5 21H19L18 3H6Z"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4 9H20"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8 3V1M12 3V1M16 3V1"
        :stroke="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
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


@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

svg:has(> [d="M12 2C6.47715 2 2 6.47715 2 12"]) {
  animation: spin 1s linear infinite;
}
</style>
