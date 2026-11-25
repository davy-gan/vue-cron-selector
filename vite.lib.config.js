import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 组件库构建配置：产物输出到 dist，vue 作为 peerDependency 外置，可直接发布 npm
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/lib/index.js',
      name: 'VueCronPicker',
      cssFileName: 'vue-cron-picker'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
