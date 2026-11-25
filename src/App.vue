<script setup>
// 演示页：仿 xxl-job 任务表单中的 Cron 选择交互，展示 CronPicker 的 v-model 用法
import { ref } from 'vue'
import { CronPicker } from './lib'

const cron = ref('0 0 0/1 * * ?')
</script>

<template>
  <div class="page">
    <div class="card">
      <h1>Vue Cron Picker</h1>
      <p class="desc">Quartz 风格 Cron 表达式可视化选择组件（参考 xxl-job 交互），零第三方依赖</p>
      <div class="form-row">
        <label class="form-label">Cron<span class="required">*</span></label>
        <CronPicker v-model="cron" style="width: 360px" />
      </div>
      <div class="result">当前表达式：<code>{{ cron || '（空）' }}</code></div>
      <p class="tip">点击输入框右侧的编辑按钮打开选择面板，切换各 Tab 选项会实时生成表达式。</p>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  padding: 60px 16px;
}
.card {
  width: 760px;
  background: #fff;
  border-radius: 8px;
  padding: 36px 44px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  height: fit-content;
}
h1 {
  margin: 0 0 6px;
  font-size: 24px;
}
.desc {
  margin: 0 0 28px;
  color: #8a919f;
  font-size: 14px;
}
.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.form-label {
  font-size: 14px;
  color: #333;
}
.required {
  color: #f56c6c;
  margin-left: 2px;
}
.result {
  margin-top: 20px;
  font-size: 14px;
  color: #606266;
}
.result code {
  background: #f5f7fa;
  padding: 3px 8px;
  border-radius: 4px;
  color: #409eff;
}
.tip {
  margin-top: 10px;
  font-size: 13px;
  color: #a8abb2;
}
</style>
