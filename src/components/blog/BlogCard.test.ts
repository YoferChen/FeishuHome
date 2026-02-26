/**
 * BlogCard 组件单元测试
 * 
 * 测试博客卡片组件的渲染和交互功能
 * 验证需求: 2.1, 2.2, 2.3
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import BlogCard from './BlogCard.vue'
import type { Blog } from '@/types'

// 创建测试用的路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/blogs/:id', component: { template: '<div>Blog Detail</div>' } }
  ]
})

// 测试用的博客数据
const mockBlog: Blog = {
  id: 'test-blog-1',
  title: '测试博客标题',
  summary: '这是一篇测试博客的摘要内容，用于测试 BlogCard 组件的渲染功能。',
  category: '技术分享',
  publishedAt: '2024-01-15T10:30:00Z',
  feishuDocUrl: 'https://feishu.cn/doc/test',
  coverImage: 'https://example.com/cover.jpg'
}

// 无封面图片的博客数据
const mockBlogWithoutCover: Blog = {
  id: 'test-blog-2',
  title: '无封面博客',
  summary: '这是一篇没有封面图片的博客。',
  category: '生活随笔',
  publishedAt: '2024-02-20',
  feishuDocUrl: 'https://feishu.cn/doc/test2'
}

// 无分类的博客数据
const mockBlogWithoutCategory: Blog = {
  id: 'test-blog-3',
  title: '无分类博客',
  summary: '这是一篇没有分类的博客。',
  category: '',
  publishedAt: '2024-03-10',
  feishuDocUrl: 'https://feishu.cn/doc/test3'
}

describe('BlogCard 组件', () => {
  beforeEach(async () => {
    // 重置路由
    router.push('/')
    await router.isReady()
  })

  describe('渲染测试', () => {
    it('应该正确渲染博客标题', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      expect(wrapper.find('.blog-card__title').text()).toBe(mockBlog.title)
    })

    it('应该正确渲染博客摘要', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      expect(wrapper.find('.blog-card__summary').text()).toBe(mockBlog.summary)
    })

    it('应该正确渲染分类标签', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      expect(wrapper.find('.tag').text()).toBe(mockBlog.category)
    })

    it('应该正确格式化并显示发布时间', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      // ISO 8601 格式的日期应该被格式化为 YYYY-MM-DD
      expect(wrapper.find('time').text()).toBe('2024-01-15')
    })

    it('应该正确渲染封面图片', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      const img = wrapper.find('.blog-card__cover img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe(mockBlog.coverImage)
      expect(img.attributes('alt')).toContain(mockBlog.title)
    })

    it('没有封面图片时不应该渲染封面区域', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlogWithoutCover },
        global: { plugins: [router] }
      })
      
      expect(wrapper.find('.blog-card__cover').exists()).toBe(false)
    })

    it('没有分类时应该显示"未分类"', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlogWithoutCategory },
        global: { plugins: [router] }
      })
      
      expect(wrapper.find('.tag').text()).toBe('未分类')
    })
  })

  describe('日期格式化测试', () => {
    it('应该正确处理简单日期格式', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlogWithoutCover },
        global: { plugins: [router] }
      })
      
      expect(wrapper.find('time').text()).toBe('2024-02-20')
    })

    it('应该正确处理无效日期', () => {
      const blogWithInvalidDate: Blog = {
        ...mockBlog,
        publishedAt: 'invalid-date'
      }
      
      const wrapper = mount(BlogCard, {
        props: { blog: blogWithInvalidDate },
        global: { plugins: [router] }
      })
      
      // 无效日期应该原样显示
      expect(wrapper.find('time').text()).toBe('invalid-date')
    })
  })

  describe('交互测试', () => {
    it('点击卡片应该跳转到博客详情页', async () => {
      const pushSpy = vi.spyOn(router, 'push')
      
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      await wrapper.find('.blog-card').trigger('click')
      
      expect(pushSpy).toHaveBeenCalledWith(`/blogs/${mockBlog.id}`)
    })

    it('按 Enter 键应该跳转到博客详情页', async () => {
      const pushSpy = vi.spyOn(router, 'push')
      
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      await wrapper.find('.blog-card').trigger('keydown', { key: 'Enter' })
      
      expect(pushSpy).toHaveBeenCalledWith(`/blogs/${mockBlog.id}`)
    })

    it('按空格键应该跳转到博客详情页', async () => {
      const pushSpy = vi.spyOn(router, 'push')
      
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      await wrapper.find('.blog-card').trigger('keydown', { key: ' ' })
      
      expect(pushSpy).toHaveBeenCalledWith(`/blogs/${mockBlog.id}`)
    })
  })

  describe('无障碍测试', () => {
    it('应该有正确的 role 属性', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      expect(wrapper.find('.blog-card').attributes('role')).toBe('article')
    })

    it('应该有正确的 aria-label 属性', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      expect(wrapper.find('.blog-card').attributes('aria-label')).toContain(mockBlog.title)
    })

    it('应该可以通过键盘聚焦', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      expect(wrapper.find('.blog-card').attributes('tabindex')).toBe('0')
    })

    it('time 元素应该有 datetime 属性', () => {
      const wrapper = mount(BlogCard, {
        props: { blog: mockBlog },
        global: { plugins: [router] }
      })
      
      expect(wrapper.find('time').attributes('datetime')).toBe(mockBlog.publishedAt)
    })
  })
})
