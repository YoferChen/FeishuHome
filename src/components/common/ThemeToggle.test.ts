/**
 * ThemeToggle 组件单元测试
 * 
 * 测试主题切换按钮的渲染、交互和无障碍功能
 * 验证需求: 8.3, 8.6
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeToggle from './ThemeToggle.vue'

// Mock useTheme composable
const mockToggleTheme = vi.fn()
const mockTheme = { value: 'light' as 'light' | 'dark' }

vi.mock('@/composables/useTheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
    toggleTheme: mockToggleTheme,
    setTheme: vi.fn()
  })
}))

describe('ThemeToggle 组件', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTheme.value = 'light'
  })

  describe('基础渲染', () => {
    it('应该正确渲染主题切换按钮', () => {
      const wrapper = mount(ThemeToggle)
      
      // 验证按钮元素存在
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.attributes('type')).toBe('button')
    })

    it('应该渲染图标容器', () => {
      const wrapper = mount(ThemeToggle)
      
      const iconContainer = wrapper.find('.icon-container')
      expect(iconContainer.exists()).toBe(true)
    })

    it('应该同时渲染太阳和月亮图标', () => {
      const wrapper = mount(ThemeToggle)
      
      const sunIcon = wrapper.find('.sun-icon')
      const moonIcon = wrapper.find('.moon-icon')
      
      expect(sunIcon.exists()).toBe(true)
      expect(moonIcon.exists()).toBe(true)
    })
  })

  describe('无障碍属性', () => {
    it('明亮主题时应该显示正确的 aria-label', () => {
      mockTheme.value = 'light'
      const wrapper = mount(ThemeToggle)
      
      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBe('切换到暗黑主题')
      expect(button.attributes('title')).toBe('切换到暗黑主题')
    })

    it('暗黑主题时应该显示正确的 aria-label', () => {
      mockTheme.value = 'dark'
      const wrapper = mount(ThemeToggle)
      
      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBe('切换到明亮主题')
      expect(button.attributes('title')).toBe('切换到明亮主题')
    })

    it('图标容器应该有 aria-hidden 属性', () => {
      const wrapper = mount(ThemeToggle)
      
      const iconContainer = wrapper.find('.icon-container')
      expect(iconContainer.attributes('aria-hidden')).toBe('true')
    })
  })

  describe('图标显示状态', () => {
    it('明亮主题时太阳图标应该激活，月亮图标应该隐藏', () => {
      mockTheme.value = 'light'
      const wrapper = mount(ThemeToggle)
      
      const sunIcon = wrapper.find('.sun-icon')
      const moonIcon = wrapper.find('.moon-icon')
      
      expect(sunIcon.classes()).toContain('icon-active')
      expect(sunIcon.classes()).not.toContain('icon-hidden')
      
      expect(moonIcon.classes()).toContain('icon-hidden')
      expect(moonIcon.classes()).not.toContain('icon-active')
    })

    it('暗黑主题时月亮图标应该激活，太阳图标应该隐藏', () => {
      mockTheme.value = 'dark'
      const wrapper = mount(ThemeToggle)
      
      const sunIcon = wrapper.find('.sun-icon')
      const moonIcon = wrapper.find('.moon-icon')
      
      expect(moonIcon.classes()).toContain('icon-active')
      expect(moonIcon.classes()).not.toContain('icon-hidden')
      
      expect(sunIcon.classes()).toContain('icon-hidden')
      expect(sunIcon.classes()).not.toContain('icon-active')
    })
  })

  describe('点击交互', () => {
    it('点击按钮应该调用 toggleTheme 方法', async () => {
      const wrapper = mount(ThemeToggle)
      
      const button = wrapper.find('button')
      await button.trigger('click')
      
      expect(mockToggleTheme).toHaveBeenCalledTimes(1)
    })

    it('多次点击应该多次调用 toggleTheme', async () => {
      const wrapper = mount(ThemeToggle)
      
      const button = wrapper.find('button')
      await button.trigger('click')
      await button.trigger('click')
      await button.trigger('click')
      
      expect(mockToggleTheme).toHaveBeenCalledTimes(3)
    })
  })

  describe('showLabel 属性', () => {
    it('默认不应该显示文字标签', () => {
      const wrapper = mount(ThemeToggle)
      
      const label = wrapper.find('.label-text')
      expect(label.exists()).toBe(false)
    })

    it('showLabel 为 true 时应该显示文字标签', () => {
      const wrapper = mount(ThemeToggle, {
        props: { showLabel: true }
      })
      
      const label = wrapper.find('.label-text')
      expect(label.exists()).toBe(true)
    })

    it('明亮主题时标签应该显示"明亮模式"', () => {
      mockTheme.value = 'light'
      const wrapper = mount(ThemeToggle, {
        props: { showLabel: true }
      })
      
      const label = wrapper.find('.label-text')
      expect(label.text()).toBe('明亮模式')
    })

    it('暗黑主题时标签应该显示"暗黑模式"', () => {
      mockTheme.value = 'dark'
      const wrapper = mount(ThemeToggle, {
        props: { showLabel: true }
      })
      
      const label = wrapper.find('.label-text')
      expect(label.text()).toBe('暗黑模式')
    })

    it('showLabel 为 true 时按钮应该有 with-label 类', () => {
      const wrapper = mount(ThemeToggle, {
        props: { showLabel: true }
      })
      
      const button = wrapper.find('button')
      expect(button.classes()).toContain('with-label')
    })

    it('showLabel 为 false 时按钮不应该有 with-label 类', () => {
      const wrapper = mount(ThemeToggle, {
        props: { showLabel: false }
      })
      
      const button = wrapper.find('button')
      expect(button.classes()).not.toContain('with-label')
    })
  })

  describe('样式类', () => {
    it('按钮应该有 theme-toggle 类', () => {
      const wrapper = mount(ThemeToggle)
      
      const button = wrapper.find('button')
      expect(button.classes()).toContain('theme-toggle')
    })

    it('图标应该有正确的基础类', () => {
      const wrapper = mount(ThemeToggle)
      
      const sunIcon = wrapper.find('.sun-icon')
      const moonIcon = wrapper.find('.moon-icon')
      
      expect(sunIcon.classes()).toContain('icon')
      expect(moonIcon.classes()).toContain('icon')
    })
  })
})
