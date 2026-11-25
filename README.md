# Vue Cron Picker

Vue3 Cron 表达式可视化选择组件（Quartz 格式），交互参考 xxl-job 的 Cron 生成器，**零第三方依赖**。

- 秒 / 分钟 / 小时 / 日 / 月 / 周 / 年 7 个字段 Tab
- 支持 每X / 周期 / 从x开始每y / 指定 / 不指定 / 最近工作日(`W`) / 本月最后一天(`L`) / 第n周星期m(`#`) 等全部常用规则
- 表达式解析回填 UI + UI 实时生成表达式，`v-model` 双向绑定
- 日与周字段自动互斥修正（Quartz 要求不能同时为 `*` 或 `?`）
- 支持弹出面板（`CronPicker`）与内嵌面板（`CronPanel`）两种用法

## 在线演示

推送到 GitHub 后由 [deploy.yml](.github/workflows/deploy.yml) 自动部署演示页到 GitHub Pages：
`https://<你的用户名>.github.io/vue-cron-picker/`

## 安装使用

```bash
npm install vue-cron-picker
```

### 方式一：弹出面板 CronPicker（输入框 + 编辑按钮）

```vue
<script setup>
import { ref } from 'vue'
import { CronPicker } from 'vue-cron-picker'
import 'vue-cron-picker/style.css'

const cron = ref('0 0 0/1 * * ?')
</script>

<template>
  <CronPicker v-model="cron" style="width: 360px" />
</template>
```

### 方式二：内嵌面板 CronPanel（不带输入框，可嵌入任意容器）

```vue
<script setup>
import { CronPanel } from 'vue-cron-picker'
import 'vue-cron-picker/style.css'
</script>

<template>
  <CronPanel v-model="cron" />
</template>
```

## API

### CronPicker Props

| 参数 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| v-model / modelValue | `String` | `''` | cron 表达式 |
| placeholder | `String` | `请输入 cron 表达式` | 输入框占位文案 |
| disabled | `Boolean` | `false` | 禁用 |

### CronPanel Props

| 参数 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| v-model / modelValue | `String` | `''` | cron 表达式 |

### Events

两个组件均支持 `update:modelValue`（表达式变化时触发）。

### 表达式规则说明

| Tab | 生成片段 | 说明 |
| ---- | ---- | ---- |
| 秒/分/时/月 | `*`、`a-b`、`a/b`、`1,2,3` | 月选"不指定"时输出 `*`（Quartz 月字段不允许 `?`） |
| 日 | `*`、`?`、`a-b`、`a/b`、`nW`、`L`、列表 | `nW`=每月 n 号最近的工作日，`L`=本月最后一天 |
| 周 | `*`、`?`、`a-b`、`m#n`、`mL`、列表 | `m#n`=第 n 周的星期 m，`mL`=本月最后一个星期 m |
| 年 | 省略、`*`、`a-b` | "不指定"时输出 6 段表达式 |

无法解析的表达式回填时会回退到默认状态；解析支持 6 或 7 段 Quartz 格式。

## 本地开发

```bash
npm install
npm run dev          # 启动演示页 http://localhost:5173
npm run build:lib    # 构建组件库到 dist/（用于 npm 发布）
npm run build:demo   # 构建演示页到 dist-demo/（用于 GitHub Pages）
```

## 发布到 GitHub

```bash
git init
git add .
git commit -m "feat: vue cron picker"
git remote add origin https://github.com/<你的用户名>/vue-cron-picker.git
git push -u origin main
```

推送后 GitHub Actions 会自动构建演示页并部署到 Pages（仓库 Settings → Pages → Source 选择 **GitHub Actions**）。

## 发布到 npm（可选）

```bash
# 1. 修改 package.json 中的 name/author/repository
# 2. 构建并发布
npm run build:lib
npm publish
```

## License

[MIT](LICENSE)
