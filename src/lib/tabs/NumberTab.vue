<script setup>
// 通用数字字段 Tab：秒 / 分钟 / 小时 / 月 共用同一套选项结构，就地修改传入的状态对象
import { computed, useId } from 'vue'

const props = defineProps({
  // 字段状态对象（CronPanel 传入，组件内直接修改）
  piece: { type: Object, required: true },
  // 单位文案：秒 / 分钟 / 小时 / 月
  unit: { type: String, required: true },
  // “从 x 开始每 y 执行”里的第一个单位词；月字段特殊，文案为“从 x 日开始”
  stepUnit: { type: String, default: '' },
  // 可选数字最小值（秒分时为 0，月为 1）
  start: { type: Number, default: 0 },
  // 可选数字最大值
  max: { type: Number, required: true },
  // “指定”网格每行列数
  cols: { type: Number, default: 10 },
  // 是否提供“不指定”选项（仅月需要）
  allowNone: { type: Boolean, default: false },
  // 数字是否补零展示（00、01...）
  pad: { type: Boolean, default: true }
})

// 同一面板的单选项需要独立的 radio 分组名，避免相互干扰
const groupName = useId()

// 网格中的候选数字序列
const numbers = computed(() => {
  const list = []
  for (let n = props.start; n <= props.max; n++) list.push(n)
  return list
})

// 勾选/取消一个“指定”值，同时把单选切到“指定”
function toggle(n) {
  const i = props.piece.checked.indexOf(n)
  if (i >= 0) props.piece.checked.splice(i, 1)
  else props.piece.checked.push(n)
  props.piece.type = 'assign'
}
</script>

<template>
  <div class="pane">
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'every'" @change="piece.type = 'every'" />
      每{{ unit }} 允许的通配符[, - * /]
    </label>
    <label class="opt" v-if="allowNone">
      <input type="radio" :name="groupName" :checked="piece.type === 'none'" @change="piece.type = 'none'" />
      不指定
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'cycle'" @change="piece.type = 'cycle'" />
      周期 从
      <input type="number" class="num" v-model.number="piece.cycleStart" :min="start" :max="max" @focus="piece.type = 'cycle'" />
      -
      <input type="number" class="num" v-model.number="piece.cycleEnd" :min="start" :max="max" @focus="piece.type = 'cycle'" />
      {{ unit }}
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'step'" @change="piece.type = 'step'" />
      从
      <input type="number" class="num" v-model.number="piece.stepStart" :min="start" :max="max" @focus="piece.type = 'step'" />
      {{ stepUnit || unit }}开始, 每
      <input type="number" class="num" v-model.number="piece.stepValue" :min="1" :max="max" @focus="piece.type = 'step'" />
      {{ unit }}执行一次
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'assign'" @change="piece.type = 'assign'" />
      指定
    </label>
    <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, auto)` }">
      <label v-for="n in numbers" :key="n" class="cell">
        <input type="checkbox" :checked="piece.checked.includes(n)" @change="toggle(n)" />
        {{ pad ? String(n).padStart(2, '0') : n }}
      </label>
    </div>
  </div>
</template>

<style scoped>
.opt {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 8px 0;
  cursor: pointer;
  color: #333;
}
.opt input[type='radio'],
.cell input {
  accent-color: #409eff;
}
.num {
  width: 48px;
  height: 26px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  padding: 0 6px;
  outline: none;
  text-align: center;
}
.num:focus {
  border-color: #409eff;
}
.grid {
  display: grid;
  gap: 6px 12px;
  margin: 8px 0 4px 20px;
}
.cell {
  cursor: pointer;
  color: #333;
  white-space: nowrap;
}
</style>
