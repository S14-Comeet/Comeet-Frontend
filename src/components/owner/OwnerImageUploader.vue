<template>
  <div class="space-y-3">
    
    <div v-if="previewUrl" class="relative inline-block">
      <img
        :src="previewUrl"
        :alt="alt"
        class="w-24 h-24 rounded-lg object-cover border border-border"
        @error="handleImageError"
      />
      <button
        type="button"
        class="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center shadow-md hover:bg-error/90"
        @click="clearImage"
      >
        <span class="text-xs">✕</span>
      </button>
    </div>

    
    <div class="flex gap-2">
      <label
        class="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary-50 transition-colors"
        :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          :disabled="isUploading"
          @change="handleFileSelect"
        />
        <span v-if="isUploading" class="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></span>
        <span v-else class="text-xl">📷</span>
        <span class="text-sm text-textSecondary">
          {{ isUploading ? '업로드 중...' : '이미지 업로드' }}
        </span>
      </label>
    </div>

    
    <div v-if="allowUrlInput" class="flex gap-2">
      <BaseInput
        v-model="urlInput"
        placeholder="또는 이미지 URL 직접 입력"
        class="flex-1"
        @blur="handleUrlInput"
        @keyup.enter="handleUrlInput"
      />
    </div>

    
    <p class="text-xs text-textSecondary">
      {{ helperText || 'JPG, PNG 파일을 업로드하세요 (최대 5MB)' }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { uploadImage } from '@/api/owner'
import { createLogger } from '@/utils/logger'
import { showError } from '@/utils/toast'
import BaseInput from '@/components/common/BaseInput.vue'

const logger = createLogger('OwnerImageUploader')

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: '이미지 미리보기'
  },
  helperText: {
    type: String,
    default: ''
  },
  allowUrlInput: {
    type: Boolean,
    default: true
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024
  }
})

const emit = defineEmits(['update:modelValue', 'uploaded'])

const fileInput = ref(null)
const isUploading = ref(false)
const urlInput = ref('')
const previewError = ref(false)

const previewUrl = computed(() => {
  if (previewError.value) return ''
  return props.modelValue || ''
})

/**
 * 파일 선택 처리
 */
const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showError('이미지 파일만 업로드할 수 있습니다')
    return
  }

  if (file.size > props.maxSize) {
    showError(`파일 크기가 ${props.maxSize / 1024 / 1024}MB를 초과합니다`)
    return
  }

  isUploading.value = true
  previewError.value = false

  try {
    const url = await uploadImage(file)
    emit('update:modelValue', url)
    emit('uploaded', url)
    logger.debug('이미지 업로드 성공', { url })
  } catch (err) {
    logger.error('이미지 업로드 실패', err)
    showError('이미지 업로드에 실패했습니다')
  } finally {
    isUploading.value = false

    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

/**
 * URL 직접 입력 처리
 */
const handleUrlInput = () => {
  if (urlInput.value.trim()) {
    previewError.value = false
    emit('update:modelValue', urlInput.value.trim())
    urlInput.value = ''
  }
}

/**
 * 이미지 삭제
 */
const clearImage = () => {
  previewError.value = false
  emit('update:modelValue', '')
}

/**
 * 이미지 로드 에러 처리
 */
const handleImageError = () => {
  previewError.value = true
}

watch(() => props.modelValue, () => {
  urlInput.value = ''
  previewError.value = false
})
</script>
