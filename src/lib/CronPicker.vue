<script setup>
// Cron 选择器：表达式输入框 + 编辑按钮 + 弹出面板，点击组件外部自动收起面板
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import CronPanel from './CronPanel.vue'

const props = defineProps({
  // cron 表达式（v-model）
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '请输入 cron 表达式' },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const root = ref(null)

// 输入框允许手工编辑表达式，面板打开时再解析回填
const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

// 点击组件外部时收起面板
function onDocMousedown(e) {
  if (open.value && root.value && !root.value.contains(e.target)) open.value = false
}
onMounted(() => document.addEventListener('mousedown', onDocMousedown))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocMousedown))
</script>

<template>
  <div ref="root" class="vcp-picker">
    <input
      class="vcp-input"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="value = $event.target.value"
    />
    <button class="vcp-btn" type="button" :disabled="disabled" title="编辑 Cron 表达式" @click="open = !open">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        />
      </svg>
    </button>
    <CronPanel v-if="open" v-model="value" class="vcp-pop" />
  </div>
</template>

<style scoped>
.vcp-picker {
  position: relative;
  display: inline-flex;
}
.vcp-input {
  flex: 1;
  width: 180px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px 0 0 4px;
  padding: 0 10px;
  font-size: 14px;
  color: #333;
  outline: none;
}
.vcp-input:focus {
  border-color: #409eff;
}
.vcp-btn {
  width: 40px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-left: none;
  background: #f5f7fa;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  color: #606266;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.vcp-btn:hover:not(:disabled) {
  color: #409eff;
}
.vcp-pop {
  position: absolute;
  top: 38px;
  left: 0;
  z-index: 1000;
}
</style>
