<template>
  <div class="cupping-note-form">
    <!-- Header -->
    <div class="form-header">
      <div class="header-badge">
        <BaseIcon name="coffee" :size="16" />
        <span>전문 커핑 노트</span>
      </div>
      <p class="header-desc">SCA 기준에 따라 상세한 평가를 남겨보세요</p>
    </div>

    <!-- Roast Level -->
    <section class="form-section">
      <h3 class="section-title">로스팅 레벨</h3>
      <div class="roast-levels">
        <button
          v-for="level in roastLevels"
          :key="level.value"
          @click="form.roastLevel = level.value"
          class="roast-btn"
          :class="{ 'active': form.roastLevel === level.value }"
          :style="{
            '--roast-color': level.color,
            backgroundColor: form.roastLevel === level.value ? level.color : 'transparent'
          }"
        >
          <span class="roast-dot" :style="{ backgroundColor: level.color }"></span>
          {{ level.label }}
        </button>
      </div>
    </section>

    <!-- Score Radar Chart -->
    <section class="form-section">
      <h3 class="section-title">향미 점수</h3>
      <div class="scores-container">
        <!-- Visual Chart -->
        <div class="radar-chart">
          <svg viewBox="0 0 200 200">
            <!-- Background Polygon -->
            <polygon
              :points="getPolygonPoints(15)"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="1"
            />
            <polygon
              :points="getPolygonPoints(10)"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="1"
            />
            <polygon
              :points="getPolygonPoints(5)"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="1"
            />

            <!-- Score Polygon -->
            <polygon
              :points="getScorePolygonPoints()"
              fill="rgba(132, 97, 72, 0.2)"
              stroke="var(--color-primary)"
              stroke-width="2"
            />

            <!-- Labels -->
            <text
              v-for="(score, idx) in scoreFields"
              :key="score.key"
              :x="getLabelPosition(idx, 7).x"
              :y="getLabelPosition(idx, 7).y"
              text-anchor="middle"
              class="chart-label"
            >
              {{ score.shortLabel }}
            </text>
          </svg>

          <!-- Total Score -->
          <div class="total-score">
            <span class="total-value">{{ totalScore.toFixed(1) }}</span>
            <span class="total-max">/105</span>
          </div>
        </div>

        <!-- Score Sliders -->
        <div class="score-sliders">
          <div
            v-for="score in scoreFields"
            :key="score.key"
            class="score-item"
          >
            <div class="score-header">
              <span class="score-label">{{ score.label }}</span>
              <span class="score-value" :style="{ color: getScoreColor(form[score.key]) }">
                {{ form[score.key]?.toFixed(1) || '0.0' }}
              </span>
            </div>
            <input
              type="range"
              :value="form[score.key] || 0"
              @input="form[score.key] = parseFloat($event.target.value)"
              min="0"
              max="15"
              step="0.25"
              class="score-slider"
              :style="{ '--fill-percent': `${((form[score.key] || 0) / 15) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Notes -->
    <section class="form-section">
      <h3 class="section-title">상세 노트 <span class="optional">(선택)</span></h3>

      <div class="notes-grid">
        <div class="note-item">
          <label class="note-label">향기/아로마</label>
          <textarea
            v-model="form.fragranceAromaDetail"
            class="note-textarea"
            placeholder="드라이 향, 웻 아로마의 특징..."
            rows="2"
          ></textarea>
        </div>

        <div class="note-item">
          <label class="note-label">맛/여운</label>
          <textarea
            v-model="form.flavorAftertasteDetail"
            class="note-textarea"
            placeholder="풍미와 여운의 특징..."
            rows="2"
          ></textarea>
        </div>

        <div class="note-item">
          <label class="note-label">산미</label>
          <textarea
            v-model="form.acidityNotes"
            class="note-textarea"
            placeholder="산미의 밝기, 복합성..."
            rows="2"
          ></textarea>
        </div>

        <div class="note-item">
          <label class="note-label">단맛</label>
          <textarea
            v-model="form.sweetnessNotes"
            class="note-textarea"
            placeholder="단맛의 종류, 강도..."
            rows="2"
          ></textarea>
        </div>

        <div class="note-item">
          <label class="note-label">바디감</label>
          <textarea
            v-model="form.mouthfeelNotes"
            class="note-textarea"
            placeholder="질감, 무게감..."
            rows="2"
          ></textarea>
        </div>

        <div class="note-item">
          <label class="note-label">종합 평가</label>
          <textarea
            v-model="form.overallNotes"
            class="note-textarea"
            placeholder="전체적인 평가와 특이사항..."
            rows="3"
          ></textarea>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import BaseIcon from '@/components/common/BaseIcon.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const form = reactive({
  roastLevel: props.modelValue.roastLevel || null,
  fragranceScore: props.modelValue.fragranceScore || 0,
  aromaScore: props.modelValue.aromaScore || 0,
  flavorScore: props.modelValue.flavorScore || 0,
  aftertasteScore: props.modelValue.aftertasteScore || 0,
  acidityScore: props.modelValue.acidityScore || 0,
  sweetnessScore: props.modelValue.sweetnessScore || 0,
  mouthfeelScore: props.modelValue.mouthfeelScore || 0,
  fragranceAromaDetail: props.modelValue.fragranceAromaDetail || '',
  flavorAftertasteDetail: props.modelValue.flavorAftertasteDetail || '',
  acidityNotes: props.modelValue.acidityNotes || '',
  sweetnessNotes: props.modelValue.sweetnessNotes || '',
  mouthfeelNotes: props.modelValue.mouthfeelNotes || '',
  overallNotes: props.modelValue.overallNotes || ''
})

// Emit changes
watch(form, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

const roastLevels = [
  { value: 'LIGHT', label: '라이트', color: '#d4a574' },
  { value: 'MEDIUM_LIGHT', label: '미디엄 라이트', color: '#b8865c' },
  { value: 'MEDIUM', label: '미디엄', color: '#8b5a3c' },
  { value: 'MEDIUM_DARK', label: '미디엄 다크', color: '#5d3a1a' },
  { value: 'DARK', label: '다크', color: '#3d2516' }
]

const scoreFields = [
  { key: 'fragranceScore', label: '향기 (Fragrance)', shortLabel: '향기' },
  { key: 'aromaScore', label: '아로마 (Aroma)', shortLabel: '아로마' },
  { key: 'flavorScore', label: '풍미 (Flavor)', shortLabel: '풍미' },
  { key: 'aftertasteScore', label: '여운 (Aftertaste)', shortLabel: '여운' },
  { key: 'acidityScore', label: '산미 (Acidity)', shortLabel: '산미' },
  { key: 'sweetnessScore', label: '단맛 (Sweetness)', shortLabel: '단맛' },
  { key: 'mouthfeelScore', label: '바디 (Mouthfeel)', shortLabel: '바디' }
]

const totalScore = computed(() => {
  return scoreFields.reduce((sum, field) => sum + (form[field.key] || 0), 0)
})

const getScoreColor = (score) => {
  if (!score) return '#999'
  if (score >= 12) return '#4caf50'
  if (score >= 9) return '#ff9800'
  if (score >= 6) return '#ff5722'
  return '#f44336'
}

// Radar Chart Calculations
const getPolygonPoints = (maxValue) => {
  const center = 100
  const points = []
  const count = scoreFields.length

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    const radius = (maxValue / 15) * 70 // 70 is max radius
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    points.push(`${x},${y}`)
  }

  return points.join(' ')
}

const getScorePolygonPoints = () => {
  const center = 100
  const points = []
  const count = scoreFields.length

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    const value = form[scoreFields[i].key] || 0
    const radius = (value / 15) * 70
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    points.push(`${x},${y}`)
  }

  return points.join(' ')
}

const getLabelPosition = (index, offset) => {
  const center = 100
  const count = scoreFields.length
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2
  const radius = 70 + offset + 15

  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle) + 4
  }
}
</script>

<style scoped>
.cupping-note-form {
  padding: 1rem;
}

.form-header {
  margin-bottom: 1.5rem;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-700));
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
}

.header-desc {
  font-size: 0.8125rem;
  color: var(--color-textSecondary);
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-textPrimary);
  margin-bottom: 1rem;
}

.optional {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--color-textSecondary);
}

/* Roast Levels */
.roast-levels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.roast-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: 2px solid var(--roast-color);
  border-radius: 1.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--roast-color);
  transition: all 0.2s;
}

.roast-btn.active {
  color: white;
}

.roast-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.roast-btn.active .roast-dot {
  background-color: white !important;
}

/* Scores Container */
.scores-container {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.radar-chart {
  position: relative;
  width: 180px;
  flex-shrink: 0;
}

.radar-chart svg {
  width: 100%;
  height: auto;
}

.chart-label {
  font-size: 8px;
  font-weight: 600;
  fill: var(--color-textSecondary);
}

.total-score {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.total-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
}

.total-max {
  font-size: 0.625rem;
  color: var(--color-textSecondary);
}

.score-sliders {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.score-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-textPrimary);
}

.score-value {
  font-size: 0.875rem;
  font-weight: 700;
}

.score-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    var(--color-primary) 0%,
    var(--color-primary) var(--fill-percent),
    #e5e7eb var(--fill-percent),
    #e5e7eb 100%
  );
  outline: none;
}

.score-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.score-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Notes Grid */
.notes-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}


.note-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-textPrimary);
}

.note-textarea {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  resize: none;
  transition: border-color 0.2s;
}

.note-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.note-textarea::placeholder {
  color: var(--color-textSecondary);
}

@media (max-width: 480px) {
  .scores-container {
    flex-direction: column;
    align-items: center;
  }

  .radar-chart {
    width: 160px;
  }
}
</style>
