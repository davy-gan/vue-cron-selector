import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 演示站点构建配置（GitHub Pages 部署用，base 使用相对路径）
export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    outDir: 'dist-demo',
    emptyOutDir: true
  }
})
