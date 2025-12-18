<template>
  <div class="h-full bg-white relative overflow-hidden flex flex-col">
    <div v-if="isLoading" class="flex-1 flex justify-center items-center">
      <BaseIcon name="spinner" class="animate-spin text-primary" :size="32" />
    </div>

    <transition name="slide-fade" mode="out-in">
      
      <!-- Mode A: Root View (Grid) -->
      <div 
        v-if="!viewingLevel1" 
        key="root"
        class="flex-1 overflow-y-auto p-4"
      >
        <div class="grid grid-cols-2 gap-3">
          <div 
            v-for="l1 in flavors" 
            :key="l1.id"
            class="relative rounded-2xl p-4 flex flex-col justify-between h-32 transition-all active:scale-95 shadow-sm cursor-pointer border"
            :class="[
              isSelected(l1.id) ? 'shadow-md' : 'hover:shadow-md'
            ]"
            :style="{ 
              backgroundColor: isSelected(l1.id) ? l1.color : `${l1.color}15`, 
              borderColor: l1.color,
              color: isSelected(l1.id) ? 'white' : l1.color
            }"
            @click="viewLevel1(l1)"
          >
            <!-- Content -->
            <div class="z-10">
              <h3 class="font-bold text-lg leading-tight mb-1">{{ l1.name }}</h3>
              <p 
                class="text-xs leading-snug line-clamp-2 font-medium"
                :class="isSelected(l1.id) ? 'text-white/90' : 'text-neutral-600'"
              >
                {{ l1.description }}
              </p>
            </div>

            <!-- Selection Indicator / Toggle (Top Right) -->
            <button
              class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full transition-colors z-20"
              :class="isSelected(l1.id) ? 'bg-white/25 hover:bg-white/40 text-white' : 'bg-white/60 hover:bg-white/80'"
              :style="{ color: isSelected(l1.id) ? 'white' : l1.color }"
              @click.stop="toggleFlavor(l1)"
            >
              <BaseIcon 
                :name="isSelected(l1.id) ? 'check' : 'plus'" 
                :size="20" 
                fill="currentColor"
              />
            </button>

            <!-- Drill-down Hint (Bottom Right) -->
            <div class="absolute bottom-3 right-3 opacity-70">
               <BaseIcon name="chevron-right" :size="20" fill="currentColor" />
            </div>
          </div>
        </div>
        
        <p class="text-center text-sm text-textSecondary mt-8">
          카드를 눌러 상세 맛을 선택하거나,<br>플러스 버튼으로 카테고리를 바로 담으세요.
        </p>
      </div>

      <!-- Mode B: Detail View (Drill-down) -->
      <div 
        v-else 
        key="detail"
        class="flex-1 flex flex-col h-full bg-white"
      >
        <!-- Header -->
        <div 
          class="flex-none flex items-center justify-between px-4 py-4 border-b border-border sticky top-0 z-10"
          :style="{ backgroundColor: `${viewingLevel1.color}10` }"
        >
          <button 
            class="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors"
            @click="viewingLevel1 = null"
          >
            <BaseIcon name="chevron-left" :size="24" :color="viewingLevel1.color" />
          </button>
          
          <h3 
            class="font-bold text-xl"
            :style="{ color: viewingLevel1.color }"
          >
            {{ viewingLevel1.name }}
          </h3>
          
          <button
            class="px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm"
            :style="{
              backgroundColor: isSelected(viewingLevel1.id) ? viewingLevel1.color : 'white',
              borderColor: viewingLevel1.color,
              color: isSelected(viewingLevel1.id) ? 'white' : viewingLevel1.color
            }"
            @click="toggleFlavor(viewingLevel1)"
          >
            {{ isSelected(viewingLevel1.id) ? '전체 선택됨' : '전체 선택' }}
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-4">
          <!-- L2 Subcategories -->
          <div 
            v-for="l2 in viewingLevel1.subCategories" 
            :key="l2.id"
            class="mb-8 last:mb-0"
          >
            <!-- L2 Header -->
            <div class="flex items-center justify-between mb-3 border-b border-dashed pb-2" :style="{ borderColor: `${viewingLevel1.color}40` }">
              <h4 class="font-bold text-base pl-2 border-l-4" :style="{ borderColor: viewingLevel1.color, color: '#333' }">
                {{ l2.name }}
              </h4>
              <button
                class="text-xs font-bold px-2 py-1 rounded transition-colors hover:bg-black/5"
                :style="{ color: isSelected(l2.id) ? viewingLevel1.color : '#888' }"
                @click="toggleFlavor(l2)"
              >
                {{ isSelected(l2.id) ? '✔ 그룹 선택됨' : '+ 그룹 선택' }}
              </button>
            </div>
            
            <!-- L3 Flavors (Chips) -->
            <div class="flex flex-wrap gap-2.5">
              <button
                v-for="l3 in l2.flavors"
                :key="l3.id"
                class="px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 border shadow-sm active:scale-95"
                :class="[
                  isSelected(l3.id) ? 'text-white' : 'bg-white'
                ]"
                :style="{
                  backgroundColor: isSelected(l3.id) ? l3.color : 'white',
                  borderColor: l3.color,
                  color: isSelected(l3.id) ? 'white' : '#555' // Use generic dark text for unselected for readability, or use l3.color? l3.color might be too light. Let's use dark gray.
                }"
                @click="toggleFlavor(l3)"
              >
                {{ l3.name }}
              </button>
              
              <!-- If no L3, show L2 as a standalone selectable chip-like option? 
                   Actually, if L2 has no children, the 'Group Select' button above handles it.
                   But users might miss it. Let's add a visual cue or a placeholder chip that acts as L2 select. -->
              <div v-if="(!l2.flavors || l2.flavors.length === 0)" class="w-full">
                 <button 
                    class="w-full text-left px-3 py-3 rounded-xl border border-dashed flex items-center gap-2 hover:bg-neutral-50 transition-colors"
                    :style="{ borderColor: viewingLevel1.color }"
                    @click="toggleFlavor(l2)"
                 >
                    <div 
                      class="w-4 h-4 rounded-full border flex items-center justify-center"
                      :style="{ borderColor: viewingLevel1.color, backgroundColor: isSelected(l2.id) ? viewingLevel1.color : 'transparent' }"
                    >
                      <BaseIcon v-if="isSelected(l2.id)" name="check" :size="10" color="white" />
                    </div>
                    <span class="text-sm text-textSecondary">{{ l2.name }} (세부 분류 없음)</span>
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFlavorStore } from '@/store/flavor'
import BaseIcon from '@/components/common/BaseIcon.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxSelection: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:modelValue'])

const flavorStore = useFlavorStore()
const { flavors, isLoading } = storeToRefs(flavorStore)

const viewingLevel1 = ref(null)

onMounted(async () => {
  await flavorStore.fetchFlavors()
})

const viewLevel1 = (l1) => {
  viewingLevel1.value = l1
}

const isSelected = (id) => {
  return props.modelValue.includes(id)
}

const toggleFlavor = (flavor) => {
  const id = flavor.id
  let newSelection = [...props.modelValue]

  if (isSelected(id)) {
    newSelection = newSelection.filter(item => item !== id)
  } else {
    if (props.maxSelection && newSelection.length >= props.maxSelection) {
      // TODO: Toast warning 'Up to N flavors'
      return
    }
    newSelection.push(id)
  }
  emit('update:modelValue', newSelection)
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease-out;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(15px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}
</style>
