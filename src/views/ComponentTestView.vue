<template>
  <div class="min-h-screen bg-background p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-primary-800 mb-8">
        Common Components Test - Warm Brown Theme
      </h1>

      <!-- Color System Preview -->
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">Color System</h2>
        <div class="grid grid-cols-5 gap-4">
          <div v-for="shade in [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]" :key="shade">
            <div
              :class="`bg-primary-${shade} h-16 rounded mb-2`"
              :style="{ backgroundColor: `var(--color-primary-${shade})` }"
            ></div>
            <p class="text-xs text-textSecondary text-center">{{ shade }}</p>
          </div>
        </div>
      </section>

      <!-- BaseChip Component -->
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">BaseChip Component</h2>

        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Default Variant</h3>
            <div class="flex gap-2 flex-wrap">
              <BaseChip label="카페" variant="default" />
              <BaseChip label="음식점" variant="default" />
              <BaseChip label="술집" variant="default" />
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Black (Selected) Variant</h3>
            <div class="flex gap-2 flex-wrap">
              <BaseChip label="선택됨" variant="" />
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Primary Variant (Warm Brown)</h3>
            <div class="flex gap-2 flex-wrap">
              <BaseChip label="Primary" variant="primary" />
              <BaseChip label="With Dropdown" variant="primary" :dropdown="true" />
              <BaseChip label="With Sort" variant="primary" :sort="true" />
              <BaseChip label="Selected" variant="primary" :selected="true" :dropdown="true" />
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Primary Selected Variant</h3>
            <div class="flex gap-2 flex-wrap">
              <BaseChip label="Selected Chip" variant="primary-selected" />
            </div>
          </div>
        </div>
      </section>

      <!-- BaseDropdown Component -->
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">BaseDropdown Component</h2>

        <div class="space-y-4 max-w-md">
          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Default Variant</h3>
            <BaseDropdown
              v-model="dropdownValue1"
              :options="dropdownOptions"
              placeholder="Select an option"
              variant="default"
            />
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Border Variant</h3>
            <BaseDropdown
              v-model="dropdownValue2"
              :options="dropdownOptions"
              placeholder="Select an option"
              variant="border"
            />
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Disabled State</h3>
            <BaseDropdown
              v-model="dropdownValue3"
              :options="dropdownOptions"
              placeholder="Select an option"
              :disabled="true"
            />
          </div>
        </div>
      </section>

      <!-- BaseIcon Component -->
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">BaseIcon Component</h2>

        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Navigation Icons</h3>
            <div class="flex gap-4 flex-wrap items-center">
              <div class="flex flex-col items-center gap-1">
                <BaseIcon name="home-line" :size="24" />
                <span class="text-xs text-textSecondary">home-line</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <BaseIcon name="home-fill" :size="24" />
                <span class="text-xs text-textSecondary">home-fill</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <BaseIcon name="map-line" :size="24" />
                <span class="text-xs text-textSecondary">map-line</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <BaseIcon name="bookmark-line" :size="24" />
                <span class="text-xs text-textSecondary">bookmark-line</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Chevron Icons</h3>
            <div class="flex gap-4 flex-wrap items-center">
              <BaseIcon name="chevron-up" :size="24" />
              <BaseIcon name="chevron-down" :size="24" />
              <BaseIcon name="chevron-left" :size="24" />
              <BaseIcon name="chevron-right" :size="24" />
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Action Icons</h3>
            <div class="flex gap-4 flex-wrap items-center">
              <BaseIcon name="search" :size="24" />
              <BaseIcon name="plus" :size="24" />
              <BaseIcon name="check" :size="24" />
              <BaseIcon name="x" :size="24" />
              <BaseIcon name="filter" :size="24" />
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Icons with Primary Color</h3>
            <div class="flex gap-4 flex-wrap items-center text-primary">
              <BaseIcon name="home-fill" :size="32" color="var(--color-primary)" />
              <BaseIcon name="map-line" :size="32" color="var(--color-primary)" />
              <BaseIcon name="bookmark-fill" :size="32" color="var(--color-primary)" />
              <BaseIcon name="check" :size="32" color="var(--color-primary)" />
            </div>
          </div>
        </div>
      </section>

      <!-- Color Usage Examples -->
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">Warm Brown Color Usage</h2>

        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-primary rounded-lg"></div>
            <div>
              <p class="font-medium text-textPrimary">Primary (#846148)</p>
              <p class="text-sm text-textSecondary">Main warm brown - Buttons, links</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-primary-100 rounded-lg"></div>
            <div>
              <p class="font-medium text-textPrimary">Primary 100 (#ede4de)</p>
              <p class="text-sm text-textSecondary">Light background for selected chips</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-accent rounded-lg"></div>
            <div>
              <p class="font-medium text-textPrimary">Accent (#ff9800)</p>
              <p class="text-sm text-textSecondary">Cafe markers, positive emphasis</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseChip from '@/components/common/BaseChip.vue'
import BaseDropdown from '@/components/common/BaseDropdown.vue'
import BaseIcon from '@/components/common/BaseIcon.vue'

// Dropdown state
const dropdownValue1 = ref('')
const dropdownValue2 = ref('option1')
const dropdownValue3 = ref('')

const dropdownOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
  { label: 'Option 4', value: 'option4' },
  { label: 'Option 5', value: 'option5' }
]
</script>
