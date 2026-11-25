<script setup>
// Cron 面板：秒/分/时/日/月/周/年 7 个 Tab，外部表达式解析回填 UI，UI 变化实时生成表达式后经 v-model 同步
import { ref, watch, nextTick } from 'vue'
import { createDefaultState, parseCronToState, generateCronFromState } from './cronParser'
import NumberTab from './tabs/NumberTab.vue'
import DayTab from './tabs/DayTab.vue'
import WeekTab from './tabs/WeekTab.vue'
import YearTab from './tabs/YearTab.vue'

const props = defineProps({
  // cron 表达式（v-model）
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const state = ref(createDefaultState())
const activeTab = ref('second')

const tabs = [
  { key: 'second', label: '秒' },
  { key: 'minute', label: '分钟' },
  { key: 'hour', label: '小时' },
  { key: 'day', label: '日' },
  { key: 'month', label: '月' },
  { key: 'week', label: '周' },
  { key: 'year', label: '年' }
]

// 解析外部表达式回填 UI 时置 true，防止 deep watch 把解析结果再 emit 出去造成回环
let syncing = false
function applyParse(expr) {
  const parsed = parseCronToState(expr)
  syncing = true
  state.value = parsed || createDefaultState() // 无法解析时回退默认状态
  nextTick(() => {
    syncing = false
  })
}

watch(
  () => props.modelValue,
  // 外部值与当前状态生成结果不一致才重新解析，避免自身 emit 触发重复解析
  (v) => {
    if (v !== generateCronFromState(state.value)) applyParse(v)
  },
  { immediate: true }
)

watch(
  state,
  () => {
    if (!syncing) emit('update:modelValue', generateCronFromState(state.value))
  },
  { deep: true }
)
</script>

<template>
  <div class="vcp-panel">
    <div class="vcp-tabs">
      <span
        v-for="t in tabs"
        :key="t.key"
        class="vcp-tab"
        :class="{ active: activeTab === t.key }"
        @click="activeTab = t.key"
      >{{ t.label }}</span>
    </div>
    <div class="vcp-body">
      <NumberTab v-if="activeTab === 'second'" :piece="state.second" unit="秒" :max="59" :cols="10" />
      <NumberTab v-else-if="activeTab === 'minute'" :piece="state.minute" unit="分钟" :max="59" :cols="10" />
      <NumberTab v-else-if="activeTab === 'hour'" :piece="state.hour" unit="小时" :max="23" :cols="6" />
      <DayTab v-else-if="activeTab === 'day'" :piece="state.day" />
      <NumberTab v-else-if="activeTab === 'month'" :piece="state.month" unit="月" step-unit="日" :start="1" :max="12" :cols="6" allow-none />
      <WeekTab v-else-if="activeTab === 'week'" :piece="state.week" />
      <YearTab v-else :piece="state.year" />
    </div>
  </div>
</template>

<style scoped>
.vcp-panel {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px 16px 14px;
  min-width: 520px;
  font-size: 14px;
  text-align: left;
}
.vcp-tabs {
  display: flex;
  gap: 6px;
  border-bottom: 1px solid #e4e7ed;
}
.vcp-tab {
  padding: 10px 14px;
  cursor: pointer;
  color: #409eff;
  user-select: none;
}
.vcp-tab.active {
  color: #0a58ce;
  font-weight: 600;
  border-bottom: 2px solid #409eff;
  margin-bottom: -1px;
}
.vcp-body {
  padding-top: 4px;
}
</style>
