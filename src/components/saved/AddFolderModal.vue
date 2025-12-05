<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="handleBackdropClick"
    >
      <div
        class="bg-white rounded-2xl max-w-md w-full p-6"
        @click.stop
      >
        <!-- 헤더 -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-textPrimary">즐겨찾기 목록 추가</h2>
          <button
            @click="handleClose"
            class="text-textSecondary hover:text-primary hover:bg-primary-50 rounded-full p-1 transition-all"
          >
            <BaseIcon name="x" :size="24" />
          </button>
        </div>

        <!-- 폼 -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 아이콘 선택 -->
          <div>
            <label class="block text-sm font-medium text-textPrimary mb-2">
              아이콘 선택
            </label>
            <div class="grid grid-cols-6 gap-2">
              <button
                v-for="icon in availableIcons"
                :key="icon"
                type="button"
                @click="formData.icon = icon"
                :class="[
                  'p-3 rounded-lg border-2 transition-all flex items-center justify-center',
                  formData.icon === icon
                    ? 'border-primary bg-primary-50'
                    : 'border-border hover:border-primary-300 hover:bg-primary-25'
                ]"
              >
                <BaseIcon
                  :name="icon"
                  :size="24"
                  :color="formData.icon === icon ? 'var(--color-primary-700)' : 'var(--color-primary)'"
                />
              </button>
            </div>
          </div>

          <!-- 목록 이름 -->
          <div>
            <label class="block text-sm font-medium text-textPrimary mb-2">
              목록 이름 <span class="text-error">*</span>
            </label>
            <BaseInput
              v-model="formData.name"
              placeholder="예: 조용한 작업 공간"
              :error="errors.name"
            />
            <p v-if="errors.name" class="text-xs text-error mt-1">{{ errors.name }}</p>
          </div>

          <!-- 목록 설명 -->
          <div>
            <label class="block text-sm font-medium text-textPrimary mb-2">
              목록 설명
            </label>
            <textarea
              v-model="formData.description"
              placeholder="이 목록에 대한 간단한 설명을 입력하세요"
              rows="3"
              class="w-full px-4 py-3 border border-border rounded-lg text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            />
          </div>

          <!-- 버튼 -->
          <div class="flex gap-3 pt-2">
            <BaseButton
              type="button"
              variant="secondary"
              size="medium"
              @click="handleClose"
              class="flex-1"
            >
              취소
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              size="medium"
              :disabled="!formData.name.trim()"
              class="flex-1"
            >
              추가
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

// 폴더 아이콘으로 사용 가능한 아이콘 목록
const availableIcons = [
  'bookmark-fill',
  'coffee',
  'coffee-to-go',
  'home-fill',
  'event',
  'filter',
  'search',
  'user-line',
  'map-line',
  'notice',
  'check',
  'plus'
]

const formData = ref({
  icon: 'bookmark-fill',
  name: '',
  description: ''
})

const errors = ref({
  name: ''
})

// 모달이 열릴 때 폼 초기화
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    formData.value = {
      icon: 'bookmark-fill',
      name: '',
      description: ''
    }
    errors.value = {
      name: ''
    }
  }
})

const handleBackdropClick = () => {
  handleClose()
}

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  // 유효성 검사
  errors.value.name = ''

  if (!formData.value.name.trim()) {
    errors.value.name = '목록 이름을 입력해주세요'
    return
  }

  if (formData.value.name.trim().length > 50) {
    errors.value.name = '목록 이름은 50자 이내로 입력해주세요'
    return
  }

  // 폼 제출
  emit('submit', {
    icon: formData.value.icon,
    name: formData.value.name.trim(),
    description: formData.value.description.trim()
  })
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

/* Textarea 스타일 */
textarea {
  font-family: 'Pretendard', sans-serif;
}

textarea::placeholder {
  color: var(--color-text-secondary);
}
</style>
