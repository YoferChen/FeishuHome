import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 基础路径配置，支持部署到子目录
  base: process.env.BASE_PATH || '/',
  
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  // 构建配置
  build: {
    // 输出目录
    outDir: 'dist',
    // 静态资源目录
    assetsDir: 'assets',
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 构建后是否生成 source map
    sourcemap: false,
    // chunk 大小警告限制（KB）
    chunkSizeWarningLimit: 1000,
    // Rollup 配置
    rollupOptions: {
      output: {
        // 手动分包配置
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
        }
      }
    }
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true
  }
})
