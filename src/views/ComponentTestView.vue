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

      <!-- BaseHeader Component -->
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">BaseHeader Component</h2>

        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Header with Notification Badge</h3>
            <BaseHeader
              :hasNotifications="hasNotifications"
              @event-click="handleEventClick"
              @notice-click="handleNoticeClick"
              @user-click="handleUserClick"
            />
          </div>

          <div class="flex items-center gap-4">
            <button
              @click="hasNotifications = !hasNotifications"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700"
            >
              Toggle Notification Badge ({{ hasNotifications ? 'On' : 'Off' }})
            </button>
          </div>

          <div class="text-sm text-textSecondary">
            <p>Click the header buttons to see console logs. The notification badge can be toggled.</p>
          </div>
        </div>
      </section>

      <!-- BaseInput Component -->
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">BaseInput Component</h2>

        <div class="space-y-4 max-w-md">
          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Default Input</h3>
            <BaseInput
              v-model="inputValue1"
              placeholder="Enter text here"
            />
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Search Input (with icon)</h3>
            <BaseInput
              v-model="inputValue2"
              placeholder="Search..."
              icon="search"
            />
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Input with Clear Button</h3>
            <BaseInput
              v-model="inputValue3"
              placeholder="Type to see clear button"
              clearable
            />
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Focused State (focus on input to see)</h3>
            <BaseInput
              v-model="inputValue4"
              placeholder="Click to focus"
              helperText="This input shows a border when focused"
            />
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Disabled Input</h3>
            <BaseInput
              v-model="inputValue5"
              placeholder="Disabled input"
              disabled
            />
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Success State</h3>
            <BaseInput
              v-model="inputValue6"
              placeholder="Success input"
              status="success"
              helperText="This is a success message"
            />
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Error State</h3>
            <BaseInput
              v-model="inputValue7"
              placeholder="Error input"
              status="error"
              helperText="This is an error message"
              clearable
            />
          </div>
        </div>
      </section>

      <!-- BaseButton Component -->
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">BaseButton Component</h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-3">Primary Variant</h3>
            <div class="flex gap-4 flex-wrap items-center">
              <BaseButton variant="primary" size="large">Large Button</BaseButton>
              <BaseButton variant="primary" size="medium">Medium Button</BaseButton>
              <BaseButton variant="primary" size="small">Small Button</BaseButton>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-3">Secondary Variant</h3>
            <div class="flex gap-4 flex-wrap items-center">
              <BaseButton variant="secondary" size="large">Large Button</BaseButton>
              <BaseButton variant="secondary" size="medium">Medium Button</BaseButton>
              <BaseButton variant="secondary" size="small">Small Button</BaseButton>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-3">Ghost Variant</h3>
            <div class="flex gap-4 flex-wrap items-center">
              <BaseButton variant="ghost" size="large">Large Button</BaseButton>
              <BaseButton variant="ghost" size="medium">Medium Button</BaseButton>
              <BaseButton variant="ghost" size="small">Small Button</BaseButton>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-3">Tertiary Variant</h3>
            <div class="flex gap-4 flex-wrap items-center">
              <BaseButton variant="tertiary" size="large">Large Button</BaseButton>
              <BaseButton variant="tertiary" size="medium">Medium Button</BaseButton>
              <BaseButton variant="tertiary" size="small">Small Button</BaseButton>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-3">Disabled State</h3>
            <div class="flex gap-4 flex-wrap items-center">
              <BaseButton variant="primary" size="medium" disabled>Disabled Primary</BaseButton>
              <BaseButton variant="secondary" size="medium" disabled>Disabled Secondary</BaseButton>
              <BaseButton variant="ghost" size="medium" disabled>Disabled Ghost</BaseButton>
              <BaseButton variant="tertiary" size="medium" disabled>Disabled Tertiary</BaseButton>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-3">Full Width Button</h3>
            <BaseButton variant="primary" size="large" fullWidth>Full Width Button</BaseButton>
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
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseHeader from '@/components/common/BaseHeader.vue'

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

// Input states
const inputValue1 = ref('')
const inputValue2 = ref('검색어 입력')
const inputValue3 = ref('Sample text with X')
const inputValue4 = ref('')
const inputValue5 = ref('Disabled input')
const inputValue6 = ref('Success input')
const inputValue7 = ref('Error input')

// Header notification state
const hasNotifications = ref(true)

const handleEventClick = () => {
  console.log('Event button clicked')
}

const handleNoticeClick = () => {
  console.log('Notice button clicked')
  hasNotifications.value = !hasNotifications.value
}

const handleUserClick = () => {
  console.log('User button clicked')
}
</script>
