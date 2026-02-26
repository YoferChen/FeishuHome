/**
 * useTheme 组合式函数单元测试
 * 验证主题切换功能的正确性
 * 
 * 验证需求: 8.1-8.5
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  useTheme,
  getSystemThemePreference,
  getStoredTheme,
  saveThemeToStorage,
  applyThemeToDocument,
  getInitialTheme
} from './useTheme'

describe('useTheme', () => {
  // 在每个测试前重置 mock
  beforeEach(() => {
    vi.clearAllMocks()
    // 重置 localStorage mock
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(localStorage.setItem).mockClear()
    // 重置 document.documentElement.classList
    document.documentElement.classList.remove('dark')
    // 重置 matchMedia mock 为默认值（light 主题）
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
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

  describe('getSystemThemePreference', () => {
    it('当系统偏好为 dark 时应返回 dark', () => {
      vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))

      expect(getSystemThemePreference()).toBe('dark')
    })

    it('当系统偏好为 light 时应返回 light', () => {
      vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))

      expect(getSystemThemePreference()).toBe('light')
    })
  })

  describe('getStoredTheme', () => {
    it('当 localStorage 中有 light 时应返回 light', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light')
      expect(getStoredTheme()).toBe('light')
    })

    it('当 localStorage 中有 dark 时应返回 dark', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark')
      expect(getStoredTheme()).toBe('dark')
    })

    it('当 localStorage 中没有值时应返回 null', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      expect(getStoredTheme()).toBeNull()
    })

    it('当 localStorage 中有无效值时应返回 null', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid')
      expect(getStoredTheme()).toBeNull()
    })
  })

  describe('saveThemeToStorage', () => {
    it('应该将主题保存到 localStorage', () => {
      saveThemeToStorage('dark')
      expect(localStorage.setItem).toHaveBeenCalledWith('feishu-blog-theme', 'dark')
    })

    it('应该能保存 light 主题', () => {
      saveThemeToStorage('light')
      expect(localStorage.setItem).toHaveBeenCalledWith('feishu-blog-theme', 'light')
    })
  })

  describe('applyThemeToDocument', () => {
    it('当主题为 dark 时应添加 dark 类', () => {
      applyThemeToDocument('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('当主题为 light 时应移除 dark 类', () => {
      document.documentElement.classList.add('dark')
      applyThemeToDocument('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('当主题为 light 且没有 dark 类时不应报错', () => {
      expect(() => applyThemeToDocument('light')).not.toThrow()
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('getInitialTheme', () => {
    it('当 localStorage 有保存的主题时应优先使用', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark')
      // 即使系统偏好是 light，也应该返回 localStorage 中的 dark
      vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))

      expect(getInitialTheme()).toBe('dark')
    })

    it('当 localStorage 没有保存时应使用系统偏好', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))

      expect(getInitialTheme()).toBe('dark')
    })

    it('当 localStorage 没有保存且系统偏好为 light 时应返回 light', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))

      expect(getInitialTheme()).toBe('light')
    })
  })

  describe('useTheme composable', () => {
    it('应该返回正确的接口', () => {
      const result = useTheme()
      
      expect(result).toHaveProperty('theme')
      expect(result).toHaveProperty('toggleTheme')
      expect(result).toHaveProperty('setTheme')
      expect(typeof result.toggleTheme).toBe('function')
      expect(typeof result.setTheme).toBe('function')
    })

    it('初始化时应应用主题到 document', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark')
      
      useTheme()
      
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('toggleTheme 应该切换主题', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light')
      const { theme, toggleTheme } = useTheme()
      
      expect(theme.value).toBe('light')
      
      toggleTheme()
      expect(theme.value).toBe('dark')
      
      toggleTheme()
      expect(theme.value).toBe('light')
    })

    it('setTheme 应该设置指定主题', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light')
      const { theme, setTheme } = useTheme()
      
      expect(theme.value).toBe('light')
      
      setTheme('dark')
      expect(theme.value).toBe('dark')
      
      setTheme('light')
      expect(theme.value).toBe('light')
    })

    it('切换主题时应更新 document 的 class', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light')
      const { toggleTheme } = useTheme()
      
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      
      toggleTheme()
      // Vue 的 watch 是异步的，需要等待下一个 tick
      await new Promise(resolve => setTimeout(resolve, 0))
      
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('切换主题时应保存到 localStorage', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light')
      const { toggleTheme } = useTheme()
      
      toggleTheme()
      // Vue 的 watch 是异步的，需要等待下一个 tick
      await new Promise(resolve => setTimeout(resolve, 0))
      
      expect(localStorage.setItem).toHaveBeenCalledWith('feishu-blog-theme', 'dark')
    })

    it('setTheme 时应更新 document 和 localStorage', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light')
      const { setTheme } = useTheme()
      
      setTheme('dark')
      // Vue 的 watch 是异步的，需要等待下一个 tick
      await new Promise(resolve => setTimeout(resolve, 0))
      
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(localStorage.setItem).toHaveBeenCalledWith('feishu-blog-theme', 'dark')
    })
  })

  describe('用户选择优先于系统偏好', () => {
    it('当用户之前选择了 dark 但系统偏好是 light 时，应使用 dark', () => {
      // 设置系统偏好为 light
      vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
      // 设置 localStorage 中保存的用户选择为 dark
      vi.mocked(localStorage.getItem).mockReturnValue('dark')
      
      const { theme } = useTheme()
      
      expect(theme.value).toBe('dark')
    })

    it('当用户之前选择了 light 但系统偏好是 dark 时，应使用 light', () => {
      // 设置系统偏好为 dark
      vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
      // 设置 localStorage 中保存的用户选择为 light
      vi.mocked(localStorage.getItem).mockReturnValue('light')
      
      const { theme } = useTheme()
      
      expect(theme.value).toBe('light')
    })
  })
})
