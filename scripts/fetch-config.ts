/**
 * 飞书配置数据预取脚本
 * 
 * 从飞书多维表格获取网站配置数据（网站基础配置、个人信息、教育经历、项目经历、里程碑、主题样式）
 * 并保存为 JSON 文件供前端使用
 * 
 * 使用方法：
 * npm run fetch-config
 * 
 * @module scripts/fetch-config
 */

import { config } from 'dotenv'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

config()

// ============================================
// 配置
// ============================================

const FEISHU_APP_ID = process.env.FEISHU_APP_ID
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET

// 表格 ID 配置
const TABLES = {
  SITE_CONFIG: process.env.FEISHU_TABLE_ID_SITE_CONFIG,
  PROFILE: process.env.FEISHU_TABLE_ID_PROFILE,
  EDUCATION: process.env.FEISHU_TABLE_ID_EDUCATION,
  PROJECTS: process.env.FEISHU_TABLE_ID_PROJECTS,
  MILESTONES: process.env.FEISHU_TABLE_ID_MILESTONES,
  THEME: process.env.FEISHU_TABLE_ID_THEME
}

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PROJECT_ROOT = join(__dirname, '..')
const DATA_DIR = join(PROJECT_ROOT, 'src', 'data')

// ============================================
// 类型定义
// ============================================

interface FeishuResponse<T = unknown> {
  code: number
  msg: string
  data?: T
}

interface Record {
  record_id: string
  fields: Record<string, any>
}

// ============================================
// 工具函数
// ============================================

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const prefix = {
    info: '[INFO]',
    success: '[SUCCESS]',
    error: '[ERROR]',
    warn: '[WARN]'
  }[type]
  console.log(`${prefix} ${message}`)
}

async function getTenantAccessToken(): Promise<string> {
  log('正在获取飞书访问令牌...')
  
  const response = await fetch(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: FEISHU_APP_ID,
      app_secret: FEISHU_APP_SECRET
    })
  })
  
  const result = await response.json() as any
  
  if (result.code !== 0) {
    throw new Error(`获取令牌失败: ${result.msg}`)
  }
  
  log('访问令牌获取成功', 'success')
  return result.tenant_access_token
}

async function getRecords(token: string, tableId: string): Promise<Record[]> {
  const [appToken, tableIdOnly] = tableId.split('/')
  
  const url = `${FEISHU_API_BASE}/bitable/v1/apps/${appToken}/tables/${tableIdOnly}/records`
  
  const allRecords: Record[] = []
  let pageToken: string | undefined
  let hasMore = true
  
  while (hasMore) {
    const queryUrl = pageToken ? `${url}?page_token=${pageToken}` : url
    
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const result = await response.json() as FeishuResponse<{
      items: Record[]
      has_more: boolean
      page_token?: string
    }>
    
    if (result.code !== 0 || !result.data) {
      throw new Error(`获取数据失败: ${result.msg}`)
    }
    
    allRecords.push(...result.data.items)
    hasMore = result.data.has_more
    pageToken = result.data.page_token
  }
  
  return allRecords
}

function extractUrl(value: any): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value.link) return value.link
  return ''
}

// ============================================
// 数据转换函数
// ============================================

function transformSiteConfig(records: Record[]): Record<string, any> {
  const config: Record<string, any> = {}
  
  records.forEach(record => {
    const key = record.fields['配置项']
    const value = record.fields['配置值']
    
    if (key && value) {
      config[key] = value
    }
  })
  
  return config
}

function transformProfile(records: Record[]): any {
  if (records.length === 0) return null
  
  // 第一条记录作为基本信息
  const mainRecord = records[0].fields
  
  // 收集所有社交链接
  const socialLinks = records
    .filter(r => r.fields['社交链接类型'])
    .map(r => {
      const platform = r.fields['社交链接类型']
      
      // 处理 icon 字段：如果是对象（超链接类型），提取 text 属性；如果是字符串，直接使用；如果为空，使用平台名称的小写形式
      const iconField = r.fields['社交链接图标']
      let icon: string
      if (iconField && typeof iconField === 'object' && iconField.text) {
        icon = iconField.text
      } else if (typeof iconField === 'string') {
        icon = iconField
      } else {
        icon = platform.toLowerCase()
      }
      
      let url = extractUrl(r.fields['社交链接'])
      
      // 如果没有 URL，根据平台类型生成默认链接
      if (!url) {
        const defaultUrls: Record<string, string> = {
          'GitHub': 'https://github.com/username',
          'LinkedIn': 'https://linkedin.com/in/username',
          'Twitter': 'https://twitter.com/username',
          '微信': '#',
          '其他': '#'
        }
        url = defaultUrls[platform] || '#'
      }
      
      return {
        platform,
        url,
        icon
      }
    })
  
  return {
    nickname: mainRecord['姓名'] || '未命名',
    bio: mainRecord['简介'] || '',
    email: mainRecord['邮箱'] || '',
    avatar: extractUrl(mainRecord['头像']) || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    socialLinks
  }
}

function transformEducation(records: Record[]): any[] {
  return records
    .map(record => {
      const fields = record.fields
      return {
        school: fields['学校名称'] || '',
        degree: fields['学位'] || '',
        major: fields['专业'] || '',
        startDate: fields['开始时间'] ? new Date(fields['开始时间']).toISOString().slice(0, 7) : '',
        endDate: fields['结束时间'] ? new Date(fields['结束时间']).toISOString().slice(0, 7) : '',
        description: fields['描述'] || ''
      }
    })
    .filter(edu => edu.school && edu.degree)
    .sort((a, b) => {
      // 按开始时间倒序排列
      return b.startDate.localeCompare(a.startDate)
    })
}

function transformProjects(records: Record[]): any[] {
  return records
    .map(record => {
      const fields = record.fields
      const techStackStr = fields['技术栈'] || ''
      const techStack = techStackStr.split(/[,，、]/).map((s: string) => s.trim()).filter(Boolean)
      
      return {
        name: fields['项目名称'] || '',
        description: fields['项目描述'] || '',
        techStack,
        url: extractUrl(fields['项目链接']) || ''
      }
    })
    .filter(project => project.name && project.description)
    .sort((a, b) => {
      // 按显示顺序排列
      const orderA = records.find(r => r.fields['项目名称'] === a.name)?.fields['显示顺序'] || 999
      const orderB = records.find(r => r.fields['项目名称'] === b.name)?.fields['显示顺序'] || 999
      return orderA - orderB
    })
}

function transformMilestones(records: Record[]): any[] {
  return records
    .map(record => {
      const fields = record.fields
      return {
        title: fields['里程碑标题'] || '',
        date: fields['发生时间'] ? new Date(fields['发生时间']).toISOString().slice(0, 7) : '',
        description: fields['里程碑描述'] || ''
      }
    })
    .filter(milestone => milestone.title && milestone.date)
    .sort((a, b) => {
      // 按日期倒序排列
      return b.date.localeCompare(a.date)
    })
}

function transformTheme(records: Record[]): Record<string, any> {
  const theme: Record<string, any> = {}
  
  records.forEach(record => {
    const key = record.fields['样式项']
    const value = record.fields['样式值']
    
    if (key && value) {
      theme[key] = value
    }
  })
  
  return theme
}

// ============================================
// 主函数
// ============================================

async function main() {
  console.log('========================================')
  console.log('飞书配置数据预取脚本')
  console.log('========================================\n')
  
  try {
    // 1. 获取访问令牌
    const token = await getTenantAccessToken()
    
    // 2. 获取各个表格的数据
    log('正在从飞书多维表格获取配置数据...')
    
    const [
      siteConfigRecords,
      profileRecords,
      educationRecords,
      projectRecords,
      milestoneRecords,
      themeRecords
    ] = await Promise.all([
      TABLES.SITE_CONFIG ? getRecords(token, TABLES.SITE_CONFIG) : Promise.resolve([]),
      TABLES.PROFILE ? getRecords(token, TABLES.PROFILE) : Promise.resolve([]),
      TABLES.EDUCATION ? getRecords(token, TABLES.EDUCATION) : Promise.resolve([]),
      TABLES.PROJECTS ? getRecords(token, TABLES.PROJECTS) : Promise.resolve([]),
      TABLES.MILESTONES ? getRecords(token, TABLES.MILESTONES) : Promise.resolve([]),
      TABLES.THEME ? getRecords(token, TABLES.THEME) : Promise.resolve([])
    ])
    
    log('数据获取成功', 'success')
    
    // 3. 转换数据格式
    log('正在转换数据格式...')
    
    const siteConfig = transformSiteConfig(siteConfigRecords)
    const profile = transformProfile(profileRecords)
    const education = transformEducation(educationRecords)
    const projects = transformProjects(projectRecords)
    const milestones = transformMilestones(milestoneRecords)
    const theme = transformTheme(themeRecords)
    
    // 4. 确保数据目录存在
    mkdirSync(DATA_DIR, { recursive: true })
    
    // 5. 保存数据到文件
    log('正在保存数据到文件...')
    
    const files = [
      { name: 'site-config.json', data: siteConfig },
      { name: 'profile.json', data: profile },
      { name: 'education.json', data: education },
      { name: 'projects.json', data: projects },
      { name: 'milestones.json', data: milestones },
      { name: 'theme.json', data: theme }
    ]
    
    files.forEach(file => {
      const filePath = join(DATA_DIR, file.name)
      writeFileSync(filePath, JSON.stringify(file.data, null, 2), 'utf-8')
      log(`数据已保存到: ${filePath}`, 'success')
    })
    
    // 6. 输出统计信息
    console.log('\n========================================')
    console.log('数据预取完成！')
    console.log('========================================\n')
    
    log('统计信息：', 'info')
    log(`  网站配置: ${Object.keys(siteConfig).length} 项`)
    log(`  个人信息: ${profile ? '1 条' : '0 条'}`)
    log(`  教育经历: ${education.length} 条`)
    log(`  项目经历: ${projects.length} 条`)
    log(`  里程碑: ${milestones.length} 条`)
    log(`  主题样式: ${Object.keys(theme).length} 项`)
    
  } catch (error) {
    console.log('\n========================================')
    console.log('数据预取失败！')
    console.log('========================================')
    log(`错误: ${error instanceof Error ? error.message : String(error)}`, 'error')
    process.exit(1)
  }
}

main()
