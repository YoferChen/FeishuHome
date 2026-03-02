/**
 * 网站配置文件
 * 
 * 本文件从预获取的 JSON 数据文件中加载配置，数据来源于飞书多维表格
 * 
 * 数据文件位置：
 * - src/data/site-config.json - 网站基本信息
 * - src/data/profile.json - 个人信息
 * - src/data/education.json - 教育经历
 * - src/data/projects.json - 项目经历
 * - src/data/milestones.json - 里程碑
 * - src/data/theme.json - 主题样式
 * 
 * 更新数据：运行 npm run fetch-config 从飞书多维表格重新获取数据
 * 
 * @module config/site.config
 * @description 验证需求: 6.1-6.8
 */

import type { SiteConfig } from '@/types'

// 导入预获取的数据文件
import siteConfigData from '@/data/site-config.json'
import profileData from '@/data/profile.json'
import educationData from '@/data/education.json'
import projectsData from '@/data/projects.json'
import milestonesData from '@/data/milestones.json'
import themeData from '@/data/theme.json'

/**
 * 网站配置对象
 * 
 * 数据从飞书多维表格预获取，通过 npm run fetch-config 更新
 */
export const siteConfig: SiteConfig = {
  // ============================================
  // 网站基本信息（从飞书多维表格获取）
  // ============================================
  
  /**
   * 网站标题
   */
  title: siteConfigData.site_title || '我的个人博客',
  
  /**
   * 网站描述
   */
  description: siteConfigData.site_description || '一个基于飞书文档的现代化个人博客网站',
  
  /**
   * 网站基础路径
   */
  basePath: '/',

  // ============================================
  // 个人信息配置（从飞书多维表格获取）
  // ============================================
  
  profile: {
    avatar: profileData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    nickname: profileData.nickname || '张三',
    bio: profileData.bio || '一名热爱技术的全栈开发者',
    email: profileData.email || '',
    socialLinks: profileData.socialLinks || []
  },
  
  /**
   * GitHub 仓库地址
   */
  githubRepo: siteConfigData.github_repo || 'https://github.com/YoferChen/FeishuHome',

  // ============================================
  // 教育经历配置（从飞书多维表格获取）
  // ============================================
  
  education: educationData || [],

  // ============================================
  // 项目经历配置（从飞书多维表格获取）
  // ============================================
  
  projects: projectsData || [],

  // ============================================
  // 里程碑配置（从飞书多维表格获取）
  // ============================================
  
  milestones: milestonesData || [],

  // ============================================
  // 飞书配置
  // ============================================
  
  feishu: {
    /**
     * 飞书多维表格公开链接
     * 用于获取博客列表数据
     * 
     * 配置步骤：
     * 1. 在飞书中创建多维表格
     * 2. 添加以下字段：标题、摘要、分类、发布时间、文档链接、封面图片（可选）
     * 3. 将多维表格设置为"公开可访问"
     * 4. 复制公开链接粘贴到此处
     */
    bitableUrl: 'https://your-feishu-bitable-url.feishu.cn/base/xxxxx',
    
    /**
     * 是否启用运行时动态获取数据
     * 
     * - true: 每次访问页面时从飞书获取最新数据（需要配置 CORS 代理或使用公开链接）
     * - false: 仅使用构建时预取的静态数据（推荐，避免 API 限制）
     * 
     * 注意：个人版飞书有 API 调用限制，建议设置为 false
     */
    enableRuntimeFetch: false
  },

  // ============================================
  // 样式配置（从飞书多维表格获取）
  // ============================================
  
  style: {
    backgroundImage: '',
    primaryColor: themeData.primary_color || '#3b82f6',
    accentColor: themeData.accent_color || '#8b5cf6'
  }
}

/**
 * 导出默认配置
 * 方便其他模块导入使用
 */
export default siteConfig
