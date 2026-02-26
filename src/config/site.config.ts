/**
 * 网站配置文件
 * 
 * 本文件包含网站的所有可配置项，用户可以根据需要修改以下配置：
 * - 网站基本信息（标题、描述）
 * - 个人信息（头像、昵称、简介、社交链接）
 * - 教育经历
 * - 项目经历
 * - 里程碑/重要事件
 * - 飞书配置（多维表格链接、是否启用运行时获取）
 * - 样式配置（背景图片、主题色等）
 * 
 * @module config/site.config
 * @description 验证需求: 6.1-6.8
 */

import type { SiteConfig } from '@/types'

/**
 * 网站配置对象
 * 
 * 请根据您的实际情况修改以下配置项
 */
export const siteConfig: SiteConfig = {
  // ============================================
  // 网站基本信息
  // ============================================
  
  /**
   * 网站标题
   * 显示在浏览器标签页和网站头部
   */
  title: '我的个人博客',
  
  /**
   * 网站描述
   * 用于 SEO 和社交分享
   */
  description: '一个基于飞书文档的现代化个人博客网站',
  
  /**
   * 网站基础路径
   * 如果部署在 GitHub Pages 的子路径下，需要设置此项
   * 例如：部署在 https://username.github.io/blog/ 则设置为 '/blog/'
   * 如果部署在根路径，设置为 '/'
   */
  basePath: '/',

  // ============================================
  // 个人信息配置
  // ============================================
  
  profile: {
    /**
     * 头像链接
     * 支持本地路径（如 '/avatar.png'）或网络链接
     */
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    
    /**
     * 昵称
     * 显示在主页个人信息卡片中
     */
    nickname: '张三',
    
    /**
     * 个人简介
     * 简短介绍自己，支持多行文本
     */
    bio: '一名热爱技术的全栈开发者，专注于 Web 开发和云原生技术。喜欢分享技术心得，记录成长点滴。',
    
    /**
     * 邮箱地址（可选）
     * 用于联系方式展示
     */
    email: 'example@email.com',
    
    /**
     * 社交媒体链接（可选）
     * 支持多个平台，每个平台包含名称、链接和图标
     */
    socialLinks: [
      {
        platform: 'GitHub',
        url: 'https://github.com/username',
        icon: 'github'  // 图标标识，可用于匹配图标库
      },
      {
        platform: '掘金',
        url: 'https://juejin.cn/user/username',
        icon: 'juejin'
      },
      {
        platform: '知乎',
        url: 'https://www.zhihu.com/people/username',
        icon: 'zhihu'
      }
    ]
  },

  // ============================================
  // 教育经历配置
  // ============================================
  
  /**
   * 教育经历列表
   * 按时间倒序排列（最近的在前）
   */
  education: [
    {
      school: '某某大学',
      degree: '硕士',
      major: '计算机科学与技术',
      startDate: '2020-09',
      endDate: '2023-06',
      description: '研究方向：分布式系统与云计算'
    },
    {
      school: '某某大学',
      degree: '学士',
      major: '软件工程',
      startDate: '2016-09',
      endDate: '2020-06',
      description: '主修课程：数据结构、算法、操作系统、计算机网络'
    }
  ],

  // ============================================
  // 项目经历配置
  // ============================================
  
  /**
   * 项目经历列表
   * 展示个人项目或参与的开源项目
   */
  projects: [
    {
      name: '飞书博客系统',
      description: '基于 Vue 3 + TypeScript 的现代化博客系统，集成飞书文档作为内容载体，支持 GitHub Pages 部署。',
      techStack: ['Vue 3', 'TypeScript', 'Vite', 'TailwindCSS'],
      url: 'https://github.com/username/feishu-blog'
    },
    {
      name: '在线协作工具',
      description: '一个支持多人实时协作的在线文档编辑工具，支持 Markdown 语法和实时预览。',
      techStack: ['React', 'Node.js', 'WebSocket', 'MongoDB'],
      url: 'https://github.com/username/collab-tool'
    },
    {
      name: '个人效率工具集',
      description: '包含待办事项、番茄钟、习惯追踪等功能的效率工具集合。',
      techStack: ['Flutter', 'Dart', 'SQLite']
    }
  ],

  // ============================================
  // 里程碑配置
  // ============================================
  
  /**
   * 里程碑/重要事件列表
   * 记录个人成长中的重要时刻
   */
  milestones: [
    {
      title: '获得某某技术认证',
      date: '2023-12',
      description: '通过了 AWS Solutions Architect 认证考试'
    },
    {
      title: '开源项目突破 1000 Star',
      date: '2023-08',
      description: '个人开源项目在 GitHub 上获得了 1000+ Star'
    },
    {
      title: '发表技术博客 100 篇',
      date: '2023-05',
      description: '累计发表技术博客文章突破 100 篇'
    },
    {
      title: '研究生毕业',
      date: '2023-06',
      description: '顺利完成硕士学业，获得工学硕士学位'
    }
  ],

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
  // 样式配置（可选）
  // ============================================
  
  /**
   * 自定义样式配置
   * 用于个性化网站外观
   */
  style: {
    /**
     * 背景图片链接（可选）
     * 设置网站背景图片，留空则使用默认背景
     */
    backgroundImage: '',
    
    /**
     * 主题色（可选）
     * 用于按钮、链接等主要元素的颜色
     * 支持 CSS 颜色值，如 '#3b82f6' 或 'rgb(59, 130, 246)'
     */
    primaryColor: '#3b82f6',
    
    /**
     * 强调色（可选）
     * 用于高亮、徽章等强调元素的颜色
     */
    accentColor: '#8b5cf6'
  }
}

/**
 * 导出默认配置
 * 方便其他模块导入使用
 */
export default siteConfig
