<script setup>
// 年字段 Tab：只有"不指定/每年/周期"三个选项，就地修改传入的状态对象
import { useId } from 'vue'

const props = defineProps({
  // 年字段状态对象（CronPanel 传入，组件内直接修改）
  piece: { type: Object, required: true }
})

const groupName = useId()
</script>

<template>
  <div class="pane">
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'none'" @change="piece.type = 'none'" />
      不指定 允许的通配符[, - * /] 非必填
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'every'" @change="piece.type = 'every'" />
      每年
    </label>
    <label class="opt">
      <input type="radio" :name="groupName" :checked="piece.type === 'cycle'" @change="piece.type = 'cycle'" />
      周期从
      <input type="number" class="num" v-model.number="piece.cycleStart" min="1970" max="2099" @focus="piece.type = 'cycle'" />
      -
      <input type="number" class="num" v-model.number="piece.cycleEnd" min="1970" max="2099" @focus="piece.type = 'cycle'" />
      年
    </label>
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
.opt input[type='radio'] {
  accent-color: #409eff;
}
.num {
  width: 64px;
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
</style>
