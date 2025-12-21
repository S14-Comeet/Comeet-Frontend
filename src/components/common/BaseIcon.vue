<template>
  <svg :class="iconClasses" :width="size" :height="size" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <!-- Home Line -->
    <template v-if="name === 'home-line'">
      <path
        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M9 22V12H15V22" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Home Fill -->
    <template v-else-if="name === 'home-fill'">
      <path
        d="M12 2L3 9V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H9V12H15V22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V9L12 2Z"
        :fill="color" />
    </template>

    <!-- Map Line -->
    <template v-else-if="name === 'map-line'">
      <path d="M1 6V22L8 18L16 22L23 18V2L16 6L8 2L1 6Z" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
      <path d="M8 2V18M16 6V22" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Bookmark Line -->
    <template v-else-if="name === 'bookmark-line'">
      <path
        d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Bookmark Fill -->
    <template v-else-if="name === 'bookmark-fill'">
      <path
        d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
        :fill="color" />
    </template>

    <!-- Chevron Up -->
    <template v-else-if="name === 'chevron-up'">
      <path d="M18 15L12 9L6 15" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Chevron Down -->
    <template v-else-if="name === 'chevron-down'">
      <path d="M6 9L12 15L18 9" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Chevron Left -->
    <template v-else-if="name === 'chevron-left'">
      <path d="M15 18L9 12L15 6" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Chevron Right -->
    <template v-else-if="name === 'chevron-right'">
      <path d="M9 18L15 12L9 6" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Search -->
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="8" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M21 21L16.65 16.65" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Plus -->
    <template v-else-if="name === 'plus'">
      <path d="M12 5V19M5 12H19" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Check -->
    <template v-else-if="name === 'check'">
      <path d="M20 6L9 17L4 12" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- X (Close) -->
    <template v-else-if="name === 'x'">
      <path d="M18 6L6 18M6 6L18 18" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
    </template>

    <!-- Filter -->
    <template v-else-if="name === 'filter'">
      <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
    </template>

    <!-- More (3 dots) -->
    <template v-else-if="name === 'more'">
      <circle cx="12" cy="5" r="2" :fill="color" />
      <circle cx="12" cy="12" r="2" :fill="color" />
      <circle cx="12" cy="19" r="2" :fill="color" />
    </template>

    <!-- Event (Calendar) -->
    <template v-else-if="name === 'event'">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
      <path d="M16 2V6M8 2V6M3 10H21" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
    </template>

    <!-- Notice (Bell) -->
    <template v-else-if="name === 'notice'">
      <path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- User Line -->
    <template v-else-if="name === 'user-line'">
      <path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Sort (Up/Down Arrows) -->
    <template v-else-if="name === 'sort'">
      <path d="M8 15L12 19L16 15" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 9L12 5L16 9" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Spinner (Loading) -->
    <template v-else-if="name === 'spinner'">
      <circle cx="12" cy="12" r="10" :stroke="color" stroke-width="2" stroke-linecap="round" fill="none"
        opacity="0.25" />
      <path d="M12 2C6.47715 2 2 6.47715 2 12" :stroke="color" stroke-width="2" stroke-linecap="round" fill="none" />
    </template>

    <!-- Coffee Cup -->
    <template v-else-if="name === 'coffee'">
      <path
        d="M18 8H19C20.0609 8 21.0783 8.42143 21.8284 9.17157C22.5786 9.92172 23 10.9391 23 12C23 13.0609 22.5786 14.0783 21.8284 14.8284C21.0783 15.5786 20.0609 16 19 16H18"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M2 8H18V17C18 17.7956 17.6839 18.5587 17.1213 19.1213C16.5587 19.6839 15.7956 20 15 20H5C4.20435 20 3.44129 19.6839 2.87868 19.1213C2.31607 18.5587 2 17.7956 2 17V8Z"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6 1V4M10 1V4M14 1V4" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
    </template>

    <!-- Coffee To-Go -->
    <template v-else-if="name === 'coffee-to-go'">
      <path d="M6 3L5 21H19L18 3H6Z" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
      <path d="M4 9H20" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8 3V1M12 3V1M16 3V1" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
    </template>

    <!-- Star Fill -->
    <template v-else-if="name === 'star-fill'">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        :fill="color" />
    </template>

    <!-- Lock -->
    <template v-else-if="name === 'lock'">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
      <path
        d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Edit (Pencil) -->
    <template v-else-if="name === 'edit'">
      <path
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Close (Same as X) -->
    <template v-else-if="name === 'close'">
      <path d="M18 6L6 18M6 6L18 18" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
    </template>

    <!-- Map Marker (Location Pin) -->
    <template v-else-if="name === 'map-marker'">
      <path
        d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Call (Phone) -->
    <template v-else-if="name === 'call'">
      <path
        d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27097 2.11999 4.17999C2.09501 3.90344 2.12787 3.62474 2.21649 3.3616C2.30512 3.09846 2.44756 2.85666 2.63476 2.6516C2.82196 2.44653 3.0498 2.28268 3.30379 2.17052C3.55777 2.05836 3.83233 2.00024 4.10999 1.99999H7.10999C7.5953 1.9952 8.06579 2.16705 8.43376 2.48353C8.80173 2.80001 9.04207 3.23942 9.10999 3.71999C9.23662 4.68005 9.47144 5.6227 9.80999 6.52999C9.94454 6.88791 9.97366 7.27689 9.89389 7.65086C9.81411 8.02482 9.62886 8.36809 9.35999 8.63999L8.08999 9.90999C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5285 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Time (Clock) -->
    <template v-else-if="name === 'time'">
      <circle cx="12" cy="12" r="10" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
      <path d="M12 6V12L16 14" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- File Copy (Copy) -->
    <template v-else-if="name === 'file-copy'">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
      <path
        d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Globe (World) -->
    <template v-else-if="name === 'globe'">
      <circle cx="12" cy="12" r="10" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
      <path d="M2 12H22" :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
        :stroke="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Map Pin -->
    <template v-else-if="name === 'mapPin'">
      <path
        d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
        :fill="color" />
    </template>

    <!-- List (햄버거 메뉴 스타일 목록) -->
    <template v-else-if="name === 'list'">
      <path d="M3 6H21M3 12H21M3 18H21" :stroke="color" stroke-width="1.5" stroke-linecap="round"
        stroke-linejoin="round" />
    </template>

    <!-- Minus (줌 축소) -->
    <template v-else-if="name === 'minus'">
      <path d="M5 12H19" :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </template>

    <!-- Target (내 위치) -->
    <template v-else-if="name === 'target'">
      <circle cx="12" cy="12" r="3" :stroke="color" stroke-width="2" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" :stroke="color" stroke-width="2" stroke-linecap="round" />
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
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

svg:has(> [d="M12 2C6.47715 2 2 6.47715 2 12"]) {
  animation: spin 1s linear infinite;
}
</style>
