<script setup>
// 周字段 Tab：含"第 n 周星期 m / 本月最后一个星期 n"等周字段专属选项，就地修改传入的状态对象
import { useId } from 'vue'

const props = defineProps({
  // 周字段状态对象（CronPanel 传入，组件内直接修改）
  piece: { type: Object, required: true }
})

const groupName = useId()

// 勾选/取消一个“指定”星期值，同时把单选切到“指定”
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
      每周 允许的通配符[, - * / L #]
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'none'" @change="piece.type = 'none'" />
      不指定
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'cycle'" @change="piece.type = 'cycle'" />
      周期 从 星期
      <input type="number" class="num" v-model.number="piece.cycleStart" min="1" max="7" @focus="piece.type = 'cycle'" />
      -
      <input type="number" class="num" v-model.number="piece.cycleEnd" min="1" max="7" @focus="piece.type = 'cycle'" />
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'nth'" @change="piece.type = 'nth'" />
      第
      <input type="number" class="num" v-model.number="piece.nthWeek" min="1" max="5" @focus="piece.type = 'nth'" />
      周的星期
      <input type="number" class="num" v-model.number="piece.nthWeekDay" min="1" max="7" @focus="piece.type = 'nth'" />
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'lastWeek'" @change="piece.type = 'lastWeek'" />
      本月最后一个星期
      <input type="number" class="num" v-model.number="piece.lastWeekDay" min="1" max="7" @focus="piece.type = 'lastWeek'" />
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'assign'" @change="piece.type = 'assign'" />
      指定
    </label>
    <div class="grid">
      <label v-for="n in 7" :key="n" class="cell">
        <input type="checkbox" :checked="piece.checked.includes(n)" @change="toggle(n)" />
        {{ n }}
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
/* 星期 1-7 单行排布 */
.grid {
  display: grid;
  grid-template-columns: repeat(7, auto);
  gap: 6px 14px;
  margin: 8px 0 4px 20px;
}
.cell {
  cursor: pointer;
  color: #333;
  white-space: nowrap;
}
</style>
