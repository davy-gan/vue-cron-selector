<script setup>
// 日字段 Tab：含"不指定/最近工作日/本月最后一天"等日字段专属选项，就地修改传入的状态对象
import { computed, useId } from 'vue'

const props = defineProps({
  // 日字段状态对象（CronPanel 传入，组件内直接修改）
  piece: { type: Object, required: true }
})

const groupName = useId()

// 候选日 1-31
const days = computed(() => {
  const list = []
  for (let n = 1; n <= 31; n++) list.push(n)
  return list
})

// 勾选/取消一个“指定”日，同时把单选切到“指定”
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
      每天 允许的通配符[, - * / L W]
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'none'" @change="piece.type = 'none'" />
      不指定
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'cycle'" @change="piece.type = 'cycle'" />
      周期 从
      <input type="number" class="num" v-model.number="piece.cycleStart" min="1" max="31" @focus="piece.type = 'cycle'" />
      -
      <input type="number" class="num" v-model.number="piece.cycleEnd" min="1" max="31" @focus="piece.type = 'cycle'" />
      日
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'step'" @change="piece.type = 'step'" />
      从
      <input type="number" class="num" v-model.number="piece.stepStart" min="1" max="31" @focus="piece.type = 'step'" />
      日开始, 每
      <input type="number" class="num" v-model.number="piece.stepValue" min="1" max="31" @focus="piece.type = 'step'" />
      日执行一次
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'nearWork'" @change="piece.type = 'nearWork'" />
      每月
      <input type="number" class="num" v-model.number="piece.nearWorkDay" min="1" max="31" @focus="piece.type = 'nearWork'" />
      号最近的那个工作日
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'lastDay'" @change="piece.type = 'lastDay'" />
      本月最后一天
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'assign'" @change="piece.type = 'assign'" />
      指定
    </label>
    <div class="grid">
      <label v-for="n in days" :key="n" class="cell">
        <input type="checkbox" :checked="piece.checked.includes(n)" @change="toggle(n)" />
        {{ String(n).padStart(2, '0') }}
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
/* 31 个日值按 10 列排布 */
.grid {
  display: grid;
  grid-template-columns: repeat(10, auto);
  gap: 6px 12px;
  margin: 8px 0 4px 20px;
}
.cell {
  cursor: pointer;
  color: #333;
  white-space: nowrap;
}
</style>
