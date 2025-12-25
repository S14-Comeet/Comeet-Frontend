<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="handleBackdropClick"
    >
      <div
        class="bg-white rounded-2xl max-w-sm w-full p-6"
        @click.stop
      >
        
        <div v-if="icon" class="flex justify-center mb-4">
          <div class="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
            <BaseIcon :name="icon" :size="24" color="var(--color-error)" />
          </div>
        </div>

        
        <h2 class="text-xl font-bold text-textPrimary text-center mb-2">
          {{ title }}
        </h2>

        
        <p class="text-sm text-textSecondary text-center mb-6">
          {{ message }}
        </p>

        
        <div class="flex gap-3">
          <BaseButton
            variant="secondary"
            size="medium"
            class="flex-1"
            @click="handleCancel"
          >
            {{ cancelText }}
          </BaseButton>
          <BaseButton
            :variant="confirmVariant"
            size="medium"
            class="flex-1"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </BaseButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '확인'
  },
  message: {
    type: String,
    default: '계속하시겠습니까?'
  },
  icon: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: '확인'
  },
  cancelText: {
    type: String,
    default: '취소'
  },
  confirmVariant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost', 'tertiary'].includes(value)
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const handleBackdropClick = () => {
  handleCancel()
}

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
