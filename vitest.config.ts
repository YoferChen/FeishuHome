/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    // 测试环境配置
    environment: 'jsdom',
    
    // 全局 API（describe, it, expect 等）
    globals: true,
    
    // 测试文件匹配模式
    include: ['src/**/*.{test,spec}.{js,ts,vue}', 'scripts/**/*.{test,spec}.{js,ts}'],
    
    // 排除目录
    exclude: ['node_modules', 'dist'],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,vue}',
        'src/main.ts',
        'src/types/**'
      ]
    },
    
    // 属性测试配置（fast-check 默认运行 100 次）
    testTimeout: 30000,
    
    // 设置文件（可选，用于全局配置）
    setupFiles: ['./src/test/setup.ts']
  }
})
