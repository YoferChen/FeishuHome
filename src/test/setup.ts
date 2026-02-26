/**
 * Vitest 全局设置文件
 * 用于配置测试环境和全局 mock
 */

// 配置 Vue Test Utils 的全局选项
import { config } from '@vue/test-utils'

// 设置全局组件存根（如果需要）
config.global.stubs = {
  // 可以在这里添加全局组件存根
}

// 设置全局 mock（如果需要）
config.global.mocks = {
  // 可以在这里添加全局 mock
}

// 模拟 localStorage（jsdom 环境下可能需要）
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// 模拟 matchMedia（用于主题检测）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})
