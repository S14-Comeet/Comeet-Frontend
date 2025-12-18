<template>
  <div class="flex flex-col gap-2">
    <!-- 내 위치 버튼 -->
    <button
        class="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition"
        title="내 위치로 이동"
        @click="$emit('request-location')"
    >
      <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
        <path
            fill-rule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineEmits(['request-location'])
</script>
