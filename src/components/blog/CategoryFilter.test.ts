/**
 * CategoryFilter 组件单元测试
 * 
 * 测试分类筛选器组件的渲染和交互功能
 * 验证需求: 7.3, 7.4, 7.5
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryFilter from './CategoryFilter.vue'
import type { Category } from '@/types'

// 测试用的分类数据
const mockCategories: Category[] = [
  { name: '技术分享', count: 5 },
  { name: '生活随笔', count: 3 },
  { name: '学习笔记', count: 8 }
]

describe('CategoryFilter 组件', () => {
  describe('渲染测试', () => {
    it('应该渲染"全部"选项', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      const allButton = wrapper.findAll('.category-filter__item')[0]
      expect(allButton.find('.category-filter__name').text()).toBe('全部')
    })

    it('应该显示所有文章的总数量', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      const allButton = wrapper.findAll('.category-filter__item')[0]
      // 总数量应该是 5 + 3 + 8 = 16
      expect(allButton.find('.category-filter__count').text()).toBe('16')
    })

    it('应该渲染所有分类', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      // 包括"全部"选项，总共应该有 4 个按钮
      const items = wrapper.findAll('.category-filter__item')
      expect(items.length).toBe(4)
    })

    it('应该正确显示每个分类的名称', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      const items = wrapper.findAll('.category-filter__item')
      expect(items[1].find('.category-filter__name').text()).toBe('技术分享')
      expect(items[2].find('.category-filter__name').text()).toBe('生活随笔')
      expect(items[3].find('.category-filter__name').text()).toBe('学习笔记')
    })

    it('应该正确显示每个分类的文章数量', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      const items = wrapper.findAll('.category-filter__item')
      expect(items[1].find('.category-filter__count').text()).toBe('5')
      expect(items[2].find('.category-filter__count').text()).toBe('3')
      expect(items[3].find('.category-filter__count').text()).toBe('8')
    })

    it('空分类列表时只显示"全部"选项', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: [],
          selectedCategory: null
        }
      })
      
      const items = wrapper.findAll('.category-filter__item')
      expect(items.length).toBe(1)
      expect(items[0].find('.category-filter__name').text()).toBe('全部')
      expect(items[0].find('.category-filter__count').text()).toBe('0')
    })
  })

  describe('选中状态测试', () => {
    it('selectedCategory 为 null 时，"全部"应该高亮', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      const allButton = wrapper.findAll('.category-filter__item')[0]
      expect(allButton.classes()).toContain('category-filter__item--active')
    })

    it('选中特定分类时，该分类应该高亮', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: '技术分享'
        }
      })
      
      const items = wrapper.findAll('.category-filter__item')
      // "全部"不应该高亮
      expect(items[0].classes()).not.toContain('category-filter__item--active')
      // "技术分享"应该高亮
      expect(items[1].classes()).toContain('category-filter__item--active')
      // 其他分类不应该高亮
      expect(items[2].classes()).not.toContain('category-filter__item--active')
      expect(items[3].classes()).not.toContain('category-filter__item--active')
    })

    it('应该正确设置 aria-pressed 属性', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: '生活随笔'
        }
      })
      
      const items = wrapper.findAll('.category-filter__item')
      expect(items[0].attributes('aria-pressed')).toBe('false')
      expect(items[1].attributes('aria-pressed')).toBe('false')
      expect(items[2].attributes('aria-pressed')).toBe('true')
      expect(items[3].attributes('aria-pressed')).toBe('false')
    })
  })

  describe('交互测试', () => {
    it('点击"全部"应该触发 select 事件并传递 null', async () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: '技术分享'
        }
      })
      
      await wrapper.findAll('.category-filter__item')[0].trigger('click')
      
      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')![0]).toEqual([null])
    })

    it('点击分类应该触发 select 事件并传递分类名称', async () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      await wrapper.findAll('.category-filter__item')[1].trigger('click')
      
      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')![0]).toEqual(['技术分享'])
    })

    it('按 Enter 键应该触发 select 事件', async () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      await wrapper.findAll('.category-filter__item')[2].trigger('keydown', { key: 'Enter' })
      
      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')![0]).toEqual(['生活随笔'])
    })

    it('按空格键应该触发 select 事件', async () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      await wrapper.findAll('.category-filter__item')[3].trigger('keydown', { key: ' ' })
      
      expect(wrapper.emitted('select')).toBeTruthy()
      expect(wrapper.emitted('select')![0]).toEqual(['学习笔记'])
    })

    it('按其他键不应该触发 select 事件', async () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      await wrapper.findAll('.category-filter__item')[1].trigger('keydown', { key: 'Tab' })
      
      expect(wrapper.emitted('select')).toBeFalsy()
    })
  })

  describe('无障碍测试', () => {
    it('应该有正确的 role 属性', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      expect(wrapper.find('.category-filter').attributes('role')).toBe('navigation')
    })

    it('应该有正确的 aria-label 属性', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      expect(wrapper.find('.category-filter').attributes('aria-label')).toBe('博客分类筛选')
    })

    it('所有按钮应该是 button 类型', () => {
      const wrapper = mount(CategoryFilter, {
        props: {
          categories: mockCategories,
          selectedCategory: null
        }
      })
      
      const buttons = wrapper.findAll('.category-filter__item')
      buttons.forEach(button => {
        expect(button.attributes('type')).toBe('button')
      })
    })
  })
})
