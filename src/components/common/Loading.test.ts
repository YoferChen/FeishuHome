/**
 * Loading 组件单元测试
 * 
 * 测试加载状态指示器的渲染和属性功能
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Loading from './Loading.vue'

describe('Loading 组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染加载动画', () => {
      const wrapper = mount(Loading)
      
      // 验证加载动画元素存在
      const spinner = wrapper.find('.loading-spinner')
      expect(spinner.exists()).toBe(true)
      
      // 验证有旋转动画类
      expect(spinner.classes()).toContain('animate-spin')
    })

    it('应该显示默认加载文字', () => {
      const wrapper = mount(Loading)
      
      const text = wrapper.find('.loading-text')
      expect(text.exists()).toBe(true)
      expect(text.text()).toBe('加载中...')
    })

    it('应该有正确的无障碍属性', () => {
      const wrapper = mount(Loading)
      
      const spinner = wrapper.find('.loading-spinner')
      expect(spinner.attributes('role')).toBe('status')
      expect(spinner.attributes('aria-label')).toBe('加载中')
    })
  })

  describe('text 属性', () => {
    it('应该显示自定义加载文字', () => {
      const customText = '正在加载博客...'
      const wrapper = mount(Loading, {
        props: { text: customText }
      })
      
      const text = wrapper.find('.loading-text')
      expect(text.text()).toBe(customText)
    })

    it('当 text 为空字符串时不应显示文字元素', () => {
      const wrapper = mount(Loading, {
        props: { text: '' }
      })
      
      const text = wrapper.find('.loading-text')
      expect(text.exists()).toBe(false)
    })
  })

  describe('size 属性', () => {
    it('默认应该使用 md 尺寸', () => {
      const wrapper = mount(Loading)
      
      const spinner = wrapper.find('.loading-spinner')
      expect(spinner.classes()).toContain('w-8')
      expect(spinner.classes()).toContain('h-8')
      
      const text = wrapper.find('.loading-text')
      expect(text.classes()).toContain('text-sm')
    })

    it('应该正确应用 sm 尺寸', () => {
      const wrapper = mount(Loading, {
        props: { size: 'sm' }
      })
      
      const spinner = wrapper.find('.loading-spinner')
      expect(spinner.classes()).toContain('w-4')
      expect(spinner.classes()).toContain('h-4')
      
      const text = wrapper.find('.loading-text')
      expect(text.classes()).toContain('text-xs')
    })

    it('应该正确应用 lg 尺寸', () => {
      const wrapper = mount(Loading, {
        props: { size: 'lg' }
      })
      
      const spinner = wrapper.find('.loading-spinner')
      expect(spinner.classes()).toContain('w-12')
      expect(spinner.classes()).toContain('h-12')
      
      const text = wrapper.find('.loading-text')
      expect(text.classes()).toContain('text-base')
    })
  })

  describe('组合属性', () => {
    it('应该同时支持自定义 text 和 size', () => {
      const wrapper = mount(Loading, {
        props: {
          text: '请稍候',
          size: 'lg'
        }
      })
      
      const spinner = wrapper.find('.loading-spinner')
      expect(spinner.classes()).toContain('w-12')
      
      const text = wrapper.find('.loading-text')
      expect(text.text()).toBe('请稍候')
      expect(text.classes()).toContain('text-base')
    })
  })
})
