/**
 * 核心类型定义文件
 * 定义飞书博客主页的所有数据模型和配置类型
 * 
 * @module types
 * @description 包含博客、分类、配置等核心接口定义
 * 验证需求: 4.2, 6.1-6.8
 */

// ============================================
// 博客相关类型
// ============================================

/**
 * 博客文章
 * 表示从飞书多维表格读取的博客数据
 */
export interface Blog {
  /** 博客唯一标识 */
  id: string
  /** 博客标题 */
  title: string
  /** 博客摘要 */
  summary: string
  /** 博客分类 */
  category: string
  /** 发布时间 (ISO 8601 格式) */
  publishedAt: string
  /** 飞书文档链接 */
  feishuDocUrl: string
  /** 封面图片链接 (可选) */
  coverImage?: string
}

/**
 * 分类信息
 * 用于博客分类筛选和统计
 */
export interface Category {
  /** 分类名称 */
  name: string
  /** 该分类下的文章数量 */
  count: number
}

// ============================================
// 个人信息相关类型
// ============================================

/**
 * 社交链接
 * 用于展示社交媒体链接
 */
export interface SocialLink {
  /** 平台名称 (如 GitHub, Twitter 等) */
  platform: string
  /** 链接地址 */
  url: string
  /** 图标 (可选，可以是图标类名或图片链接) */
  icon?: string
}

/**
 * 个人信息配置
 * 用于主页展示博主基本信息
 */
export interface ProfileConfig {
  /** 头像链接 */
  avatar: string
  /** 昵称 */
  nickname: string
  /** 个人简介 */
  bio: string
  /** 邮箱地址 (可选) */
  email?: string
  /** 社交媒体链接列表 (可选) */
  socialLinks?: SocialLink[]
}

/**
 * 教育经历
 * 用于主页展示教育背景
 */
export interface Education {
  /** 学校名称 */
  school: string
  /** 学位 */
  degree: string
  /** 专业 */
  major: string
  /** 开始日期 */
  startDate: string
  /** 结束日期 (可选，在读可不填) */
  endDate?: string
  /** 描述 (可选) */
  description?: string
}

/**
 * 项目经历
 * 用于主页展示项目作品
 */
export interface Project {
  /** 项目名称 */
  name: string
  /** 项目描述 */
  description: string
  /** 技术栈 (可选) */
  techStack?: string[]
  /** 项目链接 (可选) */
  url?: string
}

/**
 * 里程碑
 * 用于主页展示重要事件
 */
export interface Milestone {
  /** 里程碑标题 */
  title: string
  /** 日期 */
  date: string
  /** 描述 (可选) */
  description?: string
}

// ============================================
// 配置相关类型
// ============================================

/**
 * 飞书配置
 * 用于配置飞书多维表格数据源
 */
export interface FeishuConfig {
  /** 飞书多维表格公开链接 */
  bitableUrl: string
  /** 是否启用运行时动态获取数据 */
  enableRuntimeFetch: boolean
}

/**
 * 样式配置
 * 用于自定义网站样式
 */
export interface StyleConfig {
  /** 背景图片链接 (可选) */
  backgroundImage?: string
  /** 主题色 (可选) */
  primaryColor?: string
  /** 强调色 (可选) */
  accentColor?: string
}

/**
 * 网站配置
 * 网站的完整配置对象
 */
export interface SiteConfig {
  /** 网站标题 */
  title: string
  /** 网站描述 */
  description: string
  /** 网站基础路径 (用于 GitHub Pages 部署) */
  basePath: string
  /** 个人信息配置 */
  profile: ProfileConfig
  /** GitHub 仓库地址 */
  githubRepo: string
  /** 教育经历列表 */
  education: Education[]
  /** 项目经历列表 */
  projects: Project[]
  /** 里程碑列表 */
  milestones: Milestone[]
  /** 飞书配置 */
  feishu: FeishuConfig
  /** 样式配置 (可选) */
  style?: StyleConfig
}

// ============================================
// 枚举类型
// ============================================

/**
 * 主题类型
 * 支持明亮和暗黑两种主题
 */
export type Theme = 'light' | 'dark'

/**
 * 视图模式
 * 博客列表支持卡片和时间线两种视图
 */
export type ViewMode = 'card' | 'timeline'
