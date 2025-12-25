<template>
  <div class="cupping-note-display">
    
    <div v-if="cuppingNote.roastingLevel" class="roast-level-section mb-4">
      <span class="section-label">로스팅 레벨</span>
      <div class="roast-badge" :style="{ backgroundColor: roastLevelInfo.color }">
        <span class="roast-dot" :style="{ backgroundColor: 'white' }"></span>
        {{ roastLevelInfo.label }}
      </div>
    </div>

    
    <div class="scores-section mb-4">
      <span class="section-label">향미 점수</span>
      <div class="scores-container">
        
        <div class="radar-chart">
          <svg viewBox="0 0 200 200">
            
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

            
            <polygon
              :points="getScorePolygonPoints()"
              fill="rgba(132, 97, 72, 0.2)"
              stroke="var(--color-primary)"
              stroke-width="2"
            />

            
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

          
          <div class="total-score">
            <span class="total-value">{{ totalScore.toFixed(2) }}</span>
            <span class="total-max">/105</span>
          </div>
        </div>

        
        <div class="score-list">
          <div
            v-for="score in scoreFields"
            :key="score.key"
            class="score-item"
          >
            <span class="score-label">{{ score.label }}</span>
            <span class="score-value" :style="{ color: getScoreColor(cuppingNote[score.key]) }">
              {{ formatScore(cuppingNote[score.key]) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    
    <div v-if="hasDetailedNotes" class="notes-section">
      <span class="section-label">상세 노트</span>
      <div class="notes-list">
        <div v-if="cuppingNote.fragranceAromaDetail" class="note-item">
          <span class="note-label">향기/아로마</span>
          <p class="note-content">{{ cuppingNote.fragranceAromaDetail }}</p>
        </div>

        <div v-if="cuppingNote.flavorAftertasteDetail" class="note-item">
          <span class="note-label">맛/여운</span>
          <p class="note-content">{{ cuppingNote.flavorAftertasteDetail }}</p>
        </div>

        <div v-if="cuppingNote.acidityNotes" class="note-item">
          <span class="note-label">산미</span>
          <p class="note-content">{{ cuppingNote.acidityNotes }}</p>
        </div>

        <div v-if="cuppingNote.sweetnessNotes" class="note-item">
          <span class="note-label">단맛</span>
          <p class="note-content">{{ cuppingNote.sweetnessNotes }}</p>
        </div>

        <div v-if="cuppingNote.mouthfeelNotes" class="note-item">
          <span class="note-label">바디감</span>
          <p class="note-content">{{ cuppingNote.mouthfeelNotes }}</p>
        </div>

        <div v-if="cuppingNote.overallNotes" class="note-item">
          <span class="note-label">종합 평가</span>
          <p class="note-content">{{ cuppingNote.overallNotes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cuppingNote: {
    type: Object,
    required: true
  }
})

const roastLevels = {
  LIGHT: { label: '라이트', color: '#d4a574' },
  MEDIUM_LIGHT: { label: '미디엄 라이트', color: '#b8865c' },
  MEDIUM: { label: '미디엄', color: '#8b5a3c' },
  MEDIUM_DARK: { label: '미디엄 다크', color: '#5d3a1a' },
  DARK: { label: '다크', color: '#3d2516' }
}

const scoreFields = [
  { key: 'fragranceScore', label: '향기', shortLabel: '향기' },
  { key: 'aromaScore', label: '아로마', shortLabel: '아로마' },
  { key: 'flavorScore', label: '풍미', shortLabel: '풍미' },
  { key: 'aftertasteScore', label: '여운', shortLabel: '여운' },
  { key: 'acidityScore', label: '산미', shortLabel: '산미' },
  { key: 'sweetnessScore', label: '단맛', shortLabel: '단맛' },
  { key: 'mouthfeelScore', label: '바디', shortLabel: '바디' }
]

const roastLevelInfo = computed(() => {
  const level = props.cuppingNote.roastingLevel || props.cuppingNote.roastLevel
  return roastLevels[level] || { label: level, color: '#8b5a3c' }
})

const totalScore = computed(() => {
  return scoreFields.reduce((sum, field) => sum + (props.cuppingNote[field.key] || 0), 0)
})

const hasDetailedNotes = computed(() => {
  return props.cuppingNote.fragranceAromaDetail ||
         props.cuppingNote.flavorAftertasteDetail ||
         props.cuppingNote.acidityNotes ||
         props.cuppingNote.sweetnessNotes ||
         props.cuppingNote.mouthfeelNotes ||
         props.cuppingNote.overallNotes
})

const formatScore = (score) => {
  if (score == null) return '0.00'
  return Number(score).toFixed(2)
}

const getScoreColor = (score) => {
  if (!score) return '#999'
  if (score >= 12) return '#4caf50'
  if (score >= 9) return '#ff9800'
  if (score >= 6) return '#ff5722'
  return '#f44336'
}

const getPolygonPoints = (maxValue) => {
  const center = 100
  const points = []
  const count = scoreFields.length

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2
    const radius = (maxValue / 15) * 70
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
    const value = props.cuppingNote[scoreFields[i].key] || 0
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
.cupping-note-display {
  background: var(--color-neutral-50);
  border-radius: 0.75rem;
  padding: 1rem;
}

.section-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-textSecondary);
  margin-bottom: 0.5rem;
}

/* Roast Level */
.roast-level-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.roast-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: white;
}

.roast-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* Scores Container */
.scores-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.radar-chart {
  position: relative;
  width: 220px;
  flex-shrink: 0;
}

.radar-chart svg {
  width: 100%;
  height: auto;
}

.chart-label {
  font-size: 9px;
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
  font-size: 0.6875rem;
  color: var(--color-textSecondary);
}

.score-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1rem;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  min-width: 2.5rem;
}

.score-label {
  font-size: 0.6875rem;
  color: var(--color-textSecondary);
}

.score-value {
  font-size: 0.75rem;
  font-weight: 700;
}

/* Notes Section */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.note-item {
  background: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.note-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-textSecondary);
  margin-bottom: 0.25rem;
}

.note-content {
  font-size: 0.8125rem;
  color: var(--color-textPrimary);
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 360px) {
  .radar-chart {
    width: 180px;
  }
}
</style>
