/**
 * useBlogData Composable 单元测试
 * 
 * 测试博客数据管理功能的正确性
 * 验证需求: 2.4, 4.1-4.5, 7.1-7.6, 9.3-9.5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  useBlogData,
  sortBlogsByDate,
  normalizeBlogCategories,
  aggregateCategories,
  filterBlogsByCategory,
  parseBitableRecord
} from './useBlogData'
import type { Blog } from '@/types'

// 模拟博客数据
const mockBlogs: Blog[] = [
  {
    id: '1',
    title: '博客文章 1',
    summary: '这是博客 1 的摘要',
    category: '技术',
    publishedAt: '2024-01-15T10:00:00.000Z',
    feishuDocUrl: 'https://example.com/doc1'
  },
  {
    id: '2',
    title: '博客文章 2',
    summary: '这是博客 2 的摘要',
    category: '生活',
    publishedAt: '2024-01-10T10:00:00.000Z',
    feishuDocUrl: 'https://example.com/doc2'
  },
  {
    id: '3',
    title: '博客文章 3',
    summary: '这是博客 3 的摘要',
    category: '技术',
    publishedAt: '2024-01-20T10:00:00.000Z',
    feishuDocUrl: 'https://example.com/doc3'
  },
  {
    id: '4',
    title: '博客文章 4',
    summary: '这是博客 4 的摘要',
    category: '', // 空分类
    publishedAt: '2024-01-05T10:00:00.000Z',
    feishuDocUrl: 'https://example.com/doc4'
  }
]

describe('sortBlogsByDate', () => {
  it('应该按发布时间降序排列博客', () => {
    const sorted = sortBlogsByDate(mockBlogs)
    
    // 验证排序结果
    expect(sorted[0].id).toBe('3') // 2024-01-20
    expect(sorted[1].id).toBe('1') // 2024-01-15
    expect(sorted[2].id).toBe('2') // 2024-01-10
    expect(sorted[3].id).toBe('4') // 2024-01-05
  })
  
  it('应该返回新数组，不修改原数组', () => {
    const original = [...mockBlogs]
    const sorted = sortBlogsByDate(mockBlogs)
    
    expect(sorted).not.toBe(mockBlogs)
    expect(mockBlogs).toEqual(original)
  })
  
  it('应该处理空数组', () => {
    const sorted = sortBlogsByDate([])
    expect(sorted).toEqual([])
  })
  
  it('应该处理单个元素的数组', () => {
    const singleBlog = [mockBlogs[0]]
    const sorted = sortBlogsByDate(singleBlog)
    expect(sorted).toHaveLength(1)
    expect(sorted[0].id).toBe('1')
  })
})

describe('normalizeBlogCategories', () => {
  it('应该将空分类归入"未分类"', () => {
    const normalized = normalizeBlogCategories(mockBlogs)
    
    const blogWithEmptyCategory = normalized.find(b => b.id === '4')
    expect(blogWithEmptyCategory?.category).toBe('未分类')
  })
  
  it('应该保留非空分类', () => {
    const normalized = normalizeBlogCategories(mockBlogs)
    
    const techBlog = normalized.find(b => b.id === '1')
    expect(techBlog?.category).toBe('技术')
  })
  
  it('应该处理只有空格的分类', () => {
    const blogsWithWhitespace: Blog[] = [
      {
        id: '1',
        title: '测试',
        summary: '测试',
        category: '   ',
        publishedAt: '2024-01-01T00:00:00.000Z',
        feishuDocUrl: 'https://example.com'
      }
    ]
    
    const normalized = normalizeBlogCategories(blogsWithWhitespace)
    expect(normalized[0].category).toBe('未分类')
  })
  
  it('应该返回新数组，不修改原数组', () => {
    const original = [...mockBlogs]
    const normalized = normalizeBlogCategories(mockBlogs)
    
    expect(normalized).not.toBe(mockBlogs)
    expect(mockBlogs).toEqual(original)
  })
})

describe('aggregateCategories', () => {
  it('应该正确统计每个分类的文章数量', () => {
    const categories = aggregateCategories(mockBlogs)
    
    const techCategory = categories.find(c => c.name === '技术')
    const lifeCategory = categories.find(c => c.name === '生活')
    
    expect(techCategory?.count).toBe(2)
    expect(lifeCategory?.count).toBe(1)
  })
  
  it('应该将空分类归入"未分类"', () => {
    const categories = aggregateCategories(mockBlogs)
    
    const uncategorized = categories.find(c => c.name === '未分类')
    expect(uncategorized?.count).toBe(1)
  })
  
  it('应该按文章数量降序排列分类', () => {
    const categories = aggregateCategories(mockBlogs)
    
    // 技术(2) > 生活(1) = 未分类(1)
    expect(categories[0].name).toBe('技术')
    expect(categories[0].count).toBe(2)
  })
  
  it('应该处理空数组', () => {
    const categories = aggregateCategories([])
    expect(categories).toEqual([])
  })
  
  it('应该返回所有唯一分类', () => {
    const categories = aggregateCategories(mockBlogs)
    const categoryNames = categories.map(c => c.name)
    
    expect(categoryNames).toContain('技术')
    expect(categoryNames).toContain('生活')
    expect(categoryNames).toContain('未分类')
    expect(categories).toHaveLength(3)
  })
})

describe('filterBlogsByCategory', () => {
  it('应该返回指定分类的所有文章', () => {
    const filtered = filterBlogsByCategory(mockBlogs, '技术')
    
    expect(filtered).toHaveLength(2)
    expect(filtered.every(b => b.category === '技术')).toBe(true)
  })
  
  it('当 category 为 null 时应该返回所有文章', () => {
    const filtered = filterBlogsByCategory(mockBlogs, null)
    
    expect(filtered).toHaveLength(mockBlogs.length)
    expect(filtered).toEqual(mockBlogs)
  })
  
  it('应该返回空数组当没有匹配的分类', () => {
    const filtered = filterBlogsByCategory(mockBlogs, '不存在的分类')
    
    expect(filtered).toHaveLength(0)
  })
  
  it('筛选结果不应包含其他分类的文章', () => {
    const filtered = filterBlogsByCategory(mockBlogs, '生活')
    
    expect(filtered).toHaveLength(1)
    expect(filtered[0].category).toBe('生活')
    expect(filtered.some(b => b.category === '技术')).toBe(false)
  })
})

describe('parseBitableRecord', () => {
  it('应该正确解析飞书多维表格记录', () => {
    const record = {
      record_id: 'rec123',
      fields: {
        title: '测试标题',
        summary: '测试摘要',
        category: '技术',
        publishedAt: '2024-01-15T10:00:00.000Z',
        feishuDocUrl: 'https://example.com/doc',
        coverImage: 'https://example.com/cover.jpg'
      }
    }
    
    const blog = parseBitableRecord(record)
    
    expect(blog.id).toBe('rec123')
    expect(blog.title).toBe('测试标题')
    expect(blog.summary).toBe('测试摘要')
    expect(blog.category).toBe('技术')
    expect(blog.publishedAt).toBe('2024-01-15T10:00:00.000Z')
    expect(blog.feishuDocUrl).toBe('https://example.com/doc')
    expect(blog.coverImage).toBe('https://example.com/cover.jpg')
  })
  
  it('应该支持中文字段名', () => {
    const record = {
      id: 'rec456',
      fields: {
        '标题': '中文标题',
        '摘要': '中文摘要',
        '分类': '生活',
        '发布时间': '2024-01-10T10:00:00.000Z',
        '文档链接': 'https://example.com/doc2'
      }
    }
    
    const blog = parseBitableRecord(record)
    
    expect(blog.id).toBe('rec456')
    expect(blog.title).toBe('中文标题')
    expect(blog.summary).toBe('中文摘要')
    expect(blog.category).toBe('生活')
  })
  
  it('应该处理缺失的可选字段', () => {
    const record = {
      record_id: 'rec789',
      fields: {
        title: '测试',
        summary: '测试',
        category: '技术',
        publishedAt: '2024-01-01T00:00:00.000Z',
        feishuDocUrl: 'https://example.com'
        // 没有 coverImage
      }
    }
    
    const blog = parseBitableRecord(record)
    
    expect(blog.coverImage).toBeUndefined()
  })
})

describe('useBlogData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })
  
  it('应该返回正确的初始状态', () => {
    const { blogs, categories, loading, error } = useBlogData()
    
    expect(blogs.value).toEqual([])
    expect(categories.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })
  
  it('fetchBlogs 应该加载静态数据', async () => {
    const { blogs, loading, error, fetchBlogs } = useBlogData()
    
    await fetchBlogs()
    
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(blogs.value.length).toBeGreaterThan(0)
  })
  
  it('fetchBlogs 应该按发布时间降序排列博客', async () => {
    const { blogs, fetchBlogs } = useBlogData()
    
    await fetchBlogs()
    
    // 验证排序
    for (let i = 0; i < blogs.value.length - 1; i++) {
      const currentDate = new Date(blogs.value[i].publishedAt).getTime()
      const nextDate = new Date(blogs.value[i + 1].publishedAt).getTime()
      expect(currentDate).toBeGreaterThanOrEqual(nextDate)
    }
  })
  
  it('categories 应该自动聚合分类信息', async () => {
    const { categories, fetchBlogs } = useBlogData()
    
    await fetchBlogs()
    
    expect(categories.value.length).toBeGreaterThan(0)
    // 每个分类都应该有 name 和 count
    categories.value.forEach(category => {
      expect(category.name).toBeDefined()
      expect(category.count).toBeGreaterThan(0)
    })
  })
  
  it('getBlogById 应该返回正确的博客', async () => {
    const { fetchBlogs, getBlogById, blogs } = useBlogData()
    
    await fetchBlogs()
    
    // 使用实际存在的博客 ID（从加载的数据中获取第一个博客的 ID）
    const firstBlogId = blogs.value[0]?.id
    expect(firstBlogId).toBeDefined()
    
    const blog = getBlogById(firstBlogId!)
    expect(blog).toBeDefined()
    expect(blog?.id).toBe(firstBlogId)
  })
  
  it('getBlogById 应该返回 undefined 当博客不存在', async () => {
    const { fetchBlogs, getBlogById } = useBlogData()
    
    await fetchBlogs()
    
    const blog = getBlogById('不存在的ID')
    expect(blog).toBeUndefined()
  })
  
  it('filterByCategory 应该正确筛选博客', async () => {
    const { fetchBlogs, filterByCategory } = useBlogData()
    
    await fetchBlogs()
    
    const techBlogs = filterByCategory('技术')
    expect(techBlogs.every(b => b.category === '技术')).toBe(true)
  })
  
  it('filterByCategory(null) 应该返回所有博客', async () => {
    const { blogs, fetchBlogs, filterByCategory } = useBlogData()
    
    await fetchBlogs()
    
    const allBlogs = filterByCategory(null)
    expect(allBlogs.length).toBe(blogs.value.length)
  })
})
