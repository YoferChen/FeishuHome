/**
 * 博客数据管理 Composable
 * 
 * 提供博客数据的获取、筛选和管理功能
 * 支持运行时从飞书多维表格获取数据，失败时回退到静态数据
 * 
 * @module composables/useBlogData
 * @description 验证需求: 2.4, 4.1-4.5, 7.1-7.6, 9.3-9.5
 */

import { ref, computed, type Ref } from 'vue'
import type { Blog, Category } from '@/types'
import { siteConfig } from '@/config/site.config'
import staticBlogs from '@/data/blogs.json'

/**
 * useBlogData 返回值接口
 */
export interface UseBlogDataReturn {
  /** 博客列表 */
  blogs: Ref<Blog[]>
  /** 分类列表（包含文章数量统计） */
  categories: Ref<Category[]>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 错误信息 */
  error: Ref<string | null>
  /** 获取博客数据 */
  fetchBlogs: () => Promise<void>
  /** 根据 ID 获取博客 */
  getBlogById: (id: string) => Blog | undefined
  /** 按分类筛选博客 */
  filterByCategory: (category: string | null) => Blog[]
}

/** 未分类的默认名称 */
const UNCATEGORIZED = '未分类'

/**
 * 按发布时间降序排序博客
 * 验证需求: 2.5 - 时间线视图按时间顺序展示博客
 * 
 * @param blogs - 博客列表
 * @returns 排序后的博客列表
 */
export function sortBlogsByDate(blogs: Blog[]): Blog[] {
  return [...blogs].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime()
    const dateB = new Date(b.publishedAt).getTime()
    return dateB - dateA // 降序排列
  })
}

/**
 * 处理博客分类，将空分类归入"未分类"
 * 验证需求: 7.6 - 无分类文章归入"未分类"类别
 * 
 * @param blogs - 原始博客列表
 * @returns 处理后的博客列表
 */
export function normalizeBlogCategories(blogs: Blog[]): Blog[] {
  return blogs.map(blog => ({
    ...blog,
    category: blog.category?.trim() || UNCATEGORIZED
  }))
}

/**
 * 聚合分类信息，统计每个分类的文章数量
 * 验证需求: 7.1, 7.2, 7.3, 7.5 - 分类自动聚合
 * 
 * @param blogs - 博客列表
 * @returns 分类列表（包含文章数量）
 */
export function aggregateCategories(blogs: Blog[]): Category[] {
  const categoryMap = new Map<string, number>()
  
  for (const blog of blogs) {
    const category = blog.category || UNCATEGORIZED
    const count = categoryMap.get(category) || 0
    categoryMap.set(category, count + 1)
  }
  
  // 转换为数组并按文章数量降序排列
  const categories: Category[] = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
  
  return categories
}

/**
 * 按分类筛选博客
 * 验证需求: 2.4, 7.4 - 分类筛选正确性
 * 
 * @param blogs - 博客列表
 * @param category - 分类名称，null 表示返回所有博客
 * @returns 筛选后的博客列表
 */
export function filterBlogsByCategory(blogs: Blog[], category: string | null): Blog[] {
  if (category === null) {
    return blogs
  }
  return blogs.filter(blog => blog.category === category)
}

/**
 * 解析飞书多维表格数据为博客对象
 * 验证需求: 4.2 - 多维表格数据解析
 * 
 * @param record - 飞书多维表格记录
 * @returns 博客对象
 */
export function parseBitableRecord(record: Record<string, unknown>): Blog {
  // 飞书多维表格字段映射
  // 实际字段名可能需要根据用户的多维表格配置调整
  const fields = record.fields as Record<string, unknown> || record
  
  return {
    id: String(record.record_id || record.id || ''),
    title: String(fields.title || fields['标题'] || ''),
    summary: String(fields.summary || fields['摘要'] || ''),
    category: String(fields.category || fields['分类'] || ''),
    publishedAt: String(fields.publishedAt || fields['发布时间'] || new Date().toISOString()),
    feishuDocUrl: String(fields.feishuDocUrl || fields['文档链接'] || ''),
    coverImage: fields.coverImage || fields['封面图片'] 
      ? String(fields.coverImage || fields['封面图片']) 
      : undefined
  }
}

/**
 * 博客数据管理 Composable
 * 
 * 提供博客数据的响应式状态和操作方法
 * 
 * @returns UseBlogDataReturn
 */
export function useBlogData(): UseBlogDataReturn {
  // 响应式状态
  const blogs = ref<Blog[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算属性：分类列表
  const categories = computed<Category[]>(() => {
    return aggregateCategories(blogs.value)
  })
  
  /**
   * 从飞书多维表格获取博客数据
   * 验证需求: 4.1, 4.3, 9.3, 9.4
   */
  async function fetchFromFeishu(): Promise<Blog[]> {
    const { bitableUrl } = siteConfig.feishu
    
    if (!bitableUrl || bitableUrl.includes('your-feishu-bitable-url')) {
      throw new Error('飞书多维表格链接未配置')
    }
    
    // 尝试从飞书公开链接获取数据
    // 注意：实际实现可能需要 CORS 代理或飞书 API
    const response = await fetch(bitableUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`获取飞书数据失败: ${response.status}`)
    }
    
    const data = await response.json()
    
    // 解析飞书多维表格数据
    const records = data.data?.items || data.items || data.records || []
    return records.map(parseBitableRecord)
  }
  
  /**
   * 加载静态博客数据
   * 验证需求: 9.2, 9.5 - 静态数据回退
   */
  function loadStaticBlogs(): Blog[] {
    // 从 JSON 文件加载静态数据
    return staticBlogs as Blog[]
  }
  
  /**
   * 获取博客数据
   * 支持运行时获取和静态数据回退
   * 验证需求: 9.3, 9.4, 9.5
   */
  async function fetchBlogs(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      let fetchedBlogs: Blog[]
      
      // 根据配置决定是否运行时获取
      if (siteConfig.feishu.enableRuntimeFetch) {
        try {
          fetchedBlogs = await fetchFromFeishu()
        } catch (fetchError) {
          // 运行时获取失败，回退到静态数据
          // 验证需求: 9.5 - 数据获取回退
          console.warn('运行时获取飞书数据失败，使用静态数据:', fetchError)
          fetchedBlogs = loadStaticBlogs()
        }
      } else {
        // 不启用运行时获取，直接使用静态数据
        fetchedBlogs = loadStaticBlogs()
      }
      
      // 处理分类（空分类归入"未分类"）
      const normalizedBlogs = normalizeBlogCategories(fetchedBlogs)
      
      // 按发布时间降序排序
      blogs.value = sortBlogsByDate(normalizedBlogs)
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取博客数据失败'
      // 即使出错也尝试加载静态数据
      const staticData = loadStaticBlogs()
      blogs.value = sortBlogsByDate(normalizeBlogCategories(staticData))
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 根据 ID 获取博客
   * 
   * @param id - 博客 ID
   * @returns 博客对象或 undefined
   */
  function getBlogById(id: string): Blog | undefined {
    return blogs.value.find(blog => blog.id === id)
  }
  
  /**
   * 按分类筛选博客
   * 验证需求: 2.4, 7.4 - 分类筛选正确性
   * 
   * @param category - 分类名称，null 表示返回所有博客
   * @returns 筛选后的博客列表
   */
  function filterByCategory(category: string | null): Blog[] {
    return filterBlogsByCategory(blogs.value, category)
  }
  
  return {
    blogs,
    categories,
    loading,
    error,
    fetchBlogs,
    getBlogById,
    filterByCategory
  }
}

export default useBlogData
