<template>
  <div class="min-h-screen bg-background p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-primary-800 mb-8">
        Common Components Test - Warm Brown Theme
      </h1>

      
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

      
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">BaseIcon Component - 모든 아이콘</h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-3">Navigation Icons</h3>
            <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="home-line" :size="32" />
                <span class="text-xs text-textSecondary text-center">home-line</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="home-fill" :size="32" />
                <span class="text-xs text-textSecondary text-center">home-fill</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="map-line" :size="32" />
                <span class="text-xs text-textSecondary text-center">map-line</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="bookmark-line" :size="32" />
                <span class="text-xs text-textSecondary text-center">bookmark-line</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="bookmark-fill" :size="32" />
                <span class="text-xs text-textSecondary text-center">bookmark-fill</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-3">Chevron Icons</h3>
            <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="chevron-up" :size="32" />
                <span class="text-xs text-textSecondary text-center">chevron-up</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="chevron-down" :size="32" />
                <span class="text-xs text-textSecondary text-center">chevron-down</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="chevron-left" :size="32" />
                <span class="text-xs text-textSecondary text-center">chevron-left</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="chevron-right" :size="32" />
                <span class="text-xs text-textSecondary text-center">chevron-right</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-3">Action Icons</h3>
            <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="search" :size="32" />
                <span class="text-xs text-textSecondary text-center">search</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="plus" :size="32" />
                <span class="text-xs text-textSecondary text-center">plus</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="check" :size="32" />
                <span class="text-xs text-textSecondary text-center">check</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="x" :size="32" />
                <span class="text-xs text-textSecondary text-center">x</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="filter" :size="32" />
                <span class="text-xs text-textSecondary text-center">filter</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="sort" :size="32" />
                <span class="text-xs text-textSecondary text-center">sort</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-3">UI Icons</h3>
            <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="more" :size="32" />
                <span class="text-xs text-textSecondary text-center">more</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="event" :size="32" />
                <span class="text-xs text-textSecondary text-center">event</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="notice" :size="32" />
                <span class="text-xs text-textSecondary text-center">notice</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="user-line" :size="32" />
                <span class="text-xs text-textSecondary text-center">user-line</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="spinner" :size="32" />
                <span class="text-xs text-textSecondary text-center">spinner</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-3">Primary Color Examples</h3>
            <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="home-fill" :size="32" color="var(--color-primary)" />
                <span class="text-xs text-primary text-center">home-fill</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="bookmark-fill" :size="32" color="var(--color-primary)" />
                <span class="text-xs text-primary text-center">bookmark-fill</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="notice" :size="32" color="var(--color-primary)" />
                <span class="text-xs text-primary text-center">notice</span>
              </div>
              <div class="flex flex-col items-center gap-2 p-3 rounded hover:bg-primary-50 transition">
                <BaseIcon name="user-line" :size="32" color="var(--color-primary)" />
                <span class="text-xs text-primary text-center">user-line</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">BaseHeader Component</h2>

        <div class="space-y-6">
          
          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">로그인 상태 (알림 있음)</h3>
            <BaseHeader
              :has-notifications="true"
              :force-auth-state="true"
              @notice-click="handleNoticeClick"
              @login="handleLogin"
            />
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">로그인 상태 (알림 없음)</h3>
            <BaseHeader
              :has-notifications="false"
              :force-auth-state="true"
              @notice-click="handleNoticeClick"
              @login="handleLogin"
            />
          </div>

          
          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">비로그인 상태 (로그인 버튼 표시)</h3>
            <BaseHeader
              :has-notifications="false"
              :force-auth-state="false"
              @notice-click="handleNoticeClick"
              @login="handleLogin"
            />
          </div>

          
          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">로그인 상태 + 뒤로가기 버튼 (알림 페이지용)</h3>
            <BaseHeader
              :has-notifications="true"
              :show-back-button="true"
              :force-auth-state="true"
              @notice-click="handleNoticeClick"
              @login="handleLogin"
            />
          </div>

          <div class="text-sm text-textSecondary">
            <p>헤더 버튼을 클릭하면 콘솔에 로그가 출력됩니다.</p>
            <p class="mt-1">forceAuthState prop을 사용하여 테스트 목적으로 인증 상태를 시뮬레이션합니다.</p>
          </div>
        </div>
      </section>

      
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
              type="search"
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
              helper-text="This is a success message"
            />
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Error State</h3>
            <BaseInput
              v-model="inputValue7"
              placeholder="Error input"
              status="error"
              helper-text="This is an error message"
              clearable
            />
          </div>
        </div>
      </section>

      
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
            <BaseButton variant="primary" size="large" full-width>Full Width Button</BaseButton>
          </div>
        </div>
      </section>

      
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

      
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">StarRating Component</h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Interactive Rating (Large)</h3>
            <StarRating v-model="starRating1" :size="40" />
            <p class="text-sm text-textSecondary mt-2">선택된 별점: {{ starRating1 }}점</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Interactive Rating (Medium)</h3>
            <StarRating v-model="starRating2" :size="32" />
            <p class="text-sm text-textSecondary mt-2">선택된 별점: {{ starRating2 }}점</p>
          </div>

          <div>
            <h3 class="text-sm font-medium text-textSecondary mb-2">Readonly Rating (Small)</h3>
            <StarRating :model-value="4" :size="24" :readonly="true" />
            <p class="text-sm text-textSecondary mt-2">읽기 전용 모드</p>
          </div>
        </div>
      </section>

      
      <section class="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold text-textPrimary mb-4">ReviewCard Component</h2>

        <div class="space-y-4">
          <ReviewCard
            v-for="review in mockReviews"
            :key="review.reviewId"
            :review="review"
            :store-name="review.storeName"
            :menu-name="review.menuName"
          />
        </div>

        <div class="mt-4 text-sm text-textSecondary">
          <p>리뷰 카드는 작성일자, 카페명, 메뉴명, 공개/비공개 상태, 이미지, 내용, 맛 배지를 표시합니다.</p>
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
import StarRating from '@/components/common/StarRating.vue'
import ReviewCard from '@/components/review/ReviewCard.vue'

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

const inputValue1 = ref('')
const inputValue2 = ref('검색어 입력')
const inputValue3 = ref('Sample text with X')
const _inputValue4 = ref('')
const inputValue5 = ref('Disabled input')
const inputValue6 = ref('Success input')
const inputValue7 = ref('Error input')

const handleNoticeClick = () => {
  console.log('Notice button clicked')
}

const handleLogin = () => {
  console.log('Login button clicked')
}

const starRating1 = ref(3)
const starRating2 = ref(0)

const mockReviews = ref([
  {
    reviewId: 1,
    storeId: 101,
    menuId: 201,
    storeName: '카페 모닝글로리',
    menuName: '아메리카노',
    content: '정말 맛있는 아메리카노였어요! 분위기도 좋고 커피 향이 일품이에요. 재방문 의사 100%입니다.',
    isPublic: true,
    createdAt: '2025-01-15T10:30:00',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
    flavorBadges: [
      { flavorId: 1, name: '고소한', colorHex: '#8B4513' },
      { flavorId: 2, name: '부드러운', colorHex: '#D2691E' },
      { flavorId: 3, name: '달콤한', colorHex: '#FF6B6B' }
    ]
  },
  {
    reviewId: 2,
    storeId: 102,
    menuId: 202,
    storeName: '스타벅스 강남점',
    menuName: '카페 라떼',
    content: '우유 거품이 부드럽고 좋았어요. 다만 가격이 조금 비싼 감이 있습니다.',
    isPublic: false,
    createdAt: '2025-01-10T14:20:00',
    imageUrl: null,
    flavorBadges: [
      { flavorId: 4, name: '크리미한', colorHex: '#FFE4B5' }
    ]
  },
  {
    reviewId: 3,
    storeId: 103,
    menuId: 203,
    storeName: '블루보틀 성수점',
    menuName: '콜드브루',
    content: '산미가 강한 편이지만 깔끔한 맛이었어요. 여름에 마시기 딱 좋을 것 같아요!',
    isPublic: true,
    createdAt: '2024-12-25T16:45:00',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    flavorBadges: [
      { flavorId: 5, name: '상큼한', colorHex: '#4ECDC4' },
      { flavorId: 6, name: '깔끔한', colorHex: '#95E1D3' }
    ]
  }
])
</script>
