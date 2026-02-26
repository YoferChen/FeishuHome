/**
 * 主题切换组合式函数
 * 实现明暗主题切换功能，支持系统偏好检测和 localStorage 持久化
 * 
 * @module composables/useTheme
 * @description 提供主题状态管理和切换方法
 * 验证需求: 8.1-8.5
 */

import { ref, watch, type Ref } from 'vue'
import type { Theme } from '@/types'

/** localStorage 存储主题的键名 */
const THEME_STORAGE_KEY = 'feishu-blog-theme'

/**
 * useTheme 返回值接口
 */
export interface UseThemeReturn {
  /** 当前主题状态 */
  theme: Ref<Theme>
  /** 切换主题（明暗互换） */
  toggleTheme: () => void
  /** 设置指定主题 */
  setTheme: (newTheme: Theme) => void
}

/**
 * 检测系统主题偏好
 * 通过 prefers-color-scheme 媒体查询检测用户系统的主题设置
 * 
 * @returns 系统偏好的主题，如果无法检测则返回 'light'
 */
export function getSystemThemePreference(): Theme {
  // 检查 window 和 matchMedia 是否可用（SSR 兼容）
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light'
  }
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

/**
 * 从 localStorage 获取保存的主题
 * 
 * @returns 保存的主题，如果没有保存则返回 null
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return null
}

/**
 * 保存主题到 localStorage
 * 
 * @param theme - 要保存的主题
 */
export function saveThemeToStorage(theme: Theme): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }
  
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

/**
 * 更新 document.documentElement 的 class
 * 添加或移除 'dark' 类以应用对应的主题样式
 * 
 * @param theme - 要应用的主题
 */
export function applyThemeToDocument(theme: Theme): void {
  if (typeof document === 'undefined') {
    return
  }
  
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * 获取初始主题
 * 优先级：localStorage 保存的用户选择 > 系统主题偏好
 * 
 * @returns 初始主题
 */
export function getInitialTheme(): Theme {
  // 1. 首先检查 localStorage 中是否有用户之前的选择
  const storedTheme = getStoredTheme()
  if (storedTheme) {
    return storedTheme
  }
  
  // 2. 如果没有保存的选择，则使用系统主题偏好
  return getSystemThemePreference()
}

/**
 * 主题切换组合式函数
 * 
 * 功能：
 * 1. 初始化时检测系统主题偏好（prefers-color-scheme）
 * 2. 检查 localStorage 中是否有用户之前的选择
 * 3. 用户选择优先于系统偏好
 * 4. 切换主题时更新 document.documentElement 的 class
 * 5. 切换主题时保存到 localStorage
 * 
 * @returns UseThemeReturn 包含主题状态和操作方法
 * 
 * @example
 * ```typescript
 * const { theme, toggleTheme, setTheme } = useTheme()
 * 
 * // 切换主题
 * toggleTheme()
 * 
 * // 设置指定主题
 * setTheme('dark')
 * 
 * // 读取当前主题
 * console.log(theme.value) // 'light' 或 'dark'
 * ```
 */
export function useTheme(): UseThemeReturn {
  // 初始化主题状态
  const theme = ref<Theme>(getInitialTheme())
  
  // 应用初始主题到 document
  applyThemeToDocument(theme.value)
  
  // 监听主题变化，自动更新 document 和 localStorage
  watch(theme, (newTheme) => {
    applyThemeToDocument(newTheme)
    saveThemeToStorage(newTheme)
  })
  
  /**
   * 切换主题（明暗互换）
   */
  const toggleTheme = (): void => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  
  /**
   * 设置指定主题
   * @param newTheme - 要设置的主题
   */
  const setTheme = (newTheme: Theme): void => {
    theme.value = newTheme
  }
  
  return {
    theme,
    toggleTheme,
    setTheme
  }
}

export default useTheme
