/**
 * 博客数据预取脚本
 * 
 * 从飞书多维表格获取博客列表数据，并生成静态 JSON 文件
 * 用于构建时预取数据，避免运行时 API 调用限制
 * 
 * 使用方法：
 * 1. 配置环境变量：FEISHU_APP_ID, FEISHU_APP_SECRET, FEISHU_TABLE_ID
 * 2. 运行命令：npm run fetch-blogs
 * 
 * @module scripts/fetch-blogs
 * @description 验证需求: 9.2, 9.6
 */

import { config } from 'dotenv'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import type { Blog } from '../src/types'

// 加载 .env 文件
config()

// ============================================
// 环境变量配置
// ============================================

const FEISHU_APP_ID = process.env.FEISHU_APP_ID
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET
const FEISHU_TABLE_ID = process.env.FEISHU_TABLE_ID

// 飞书 API 端点
const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis'
const TOKEN_URL = `${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`
const BITABLE_RECORDS_URL = `${FEISHU_API_BASE}/bitable/v1/apps/{app_token}/tables/{table_id}/records`

// 输出文件路径
const OUTPUT_PATH = resolve(process.cwd(), 'src/data/blogs.json')

// ============================================
// 类型定义
// ============================================

/**
 * 飞书 API 响应基础结构
 */
interface FeishuResponse<T = unknown> {
  code: number
  msg: string
  data?: T
}

/**
 * 飞书租户访问令牌响应
 * 注意：tenant_access_token 在响应根级别，不在 data 中
 */
interface TenantAccessTokenResponse {
  code: number
  msg: string
  tenant_access_token: string
  expire: number
}

/**
 * 飞书多维表格记录
 */
interface BitableRecord {
  record_id: string
  fields: Record<string, unknown>
}

/**
 * 飞书多维表格记录列表响应
 */
interface BitableRecordsResponse {
  has_more: boolean
  page_token?: string
  total: number
  items: BitableRecord[]
}

// ============================================
// 工具函数
// ============================================

/**
 * 日志输出函数
 */
function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const prefix = {
    info: '[INFO]',
    success: '[SUCCESS]',
    error: '[ERROR]',
    warn: '[WARN]'
  }[type]
  
  console.log(`${prefix} ${message}`)
}

/**
 * 验证环境变量配置
 */
function validateEnv(): void {
  const missing: string[] = []
  
  if (!FEISHU_APP_ID) missing.push('FEISHU_APP_ID')
  if (!FEISHU_APP_SECRET) missing.push('FEISHU_APP_SECRET')
  if (!FEISHU_TABLE_ID) missing.push('FEISHU_TABLE_ID')
  
  if (missing.length > 0) {
    log(`缺少必要的环境变量: ${missing.join(', ')}`, 'error')
    log('请在 .env 文件或环境变量中配置以下变量：', 'info')
    log('  FEISHU_APP_ID - 飞书应用 ID', 'info')
    log('  FEISHU_APP_SECRET - 飞书应用密钥', 'info')
    log('  FEISHU_TABLE_ID - 飞书多维表格 ID（格式：app_token/table_id）', 'info')
    process.exit(1)
  }
}

/**
 * 获取飞书租户访问令牌
 */
async function getTenantAccessToken(): Promise<string> {
  log('正在获取飞书访问令牌...')
  
  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP 错误: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json() as TenantAccessTokenResponse
    
    if (result.code !== 0) {
      throw new Error(`飞书 API 错误 (code: ${result.code}): ${result.msg}`)
    }
    
    if (!result.tenant_access_token) {
      throw new Error(`未能获取访问令牌 - 响应数据: ${JSON.stringify(result)}`)
    }
    
    log('访问令牌获取成功', 'success')
    return result.tenant_access_token
  } catch (error) {
    log(`获取访问令牌失败: ${error instanceof Error ? error.message : String(error)}`, 'error')
    throw error
  }
}

/**
 * 从飞书多维表格获取记录
 */
async function fetchBitableRecords(token: string): Promise<BitableRecord[]> {
  log('正在从飞书多维表格获取博客数据...')
  
  // 解析 table_id（格式：app_token/table_id）
  const [appToken, tableId] = FEISHU_TABLE_ID!.split('/')
  
  if (!appToken || !tableId) {
    throw new Error('FEISHU_TABLE_ID 格式错误，应为：app_token/table_id')
  }
  
  const url = BITABLE_RECORDS_URL
    .replace('{app_token}', appToken)
    .replace('{table_id}', tableId)
  
  const allRecords: BitableRecord[] = []
  let pageToken: string | undefined
  let hasMore = true
  
  try {
    while (hasMore) {
      const queryUrl = pageToken ? `${url}?page_token=${pageToken}` : url
      
      const response = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json() as FeishuResponse<BitableRecordsResponse>
      
      if (result.code !== 0) {
        throw new Error(`飞书 API 错误: ${result.msg}`)
      }
      
      if (!result.data) {
        throw new Error('未能获取数据')
      }
      
      allRecords.push(...result.data.items)
      hasMore = result.data.has_more
      pageToken = result.data.page_token
      
      log(`已获取 ${allRecords.length} 条记录...`)
    }
    
    log(`数据获取成功，共 ${allRecords.length} 条记录`, 'success')
    return allRecords
  } catch (error) {
    log(`获取数据失败: ${error instanceof Error ? error.message : String(error)}`, 'error')
    throw error
  }
}

/**
 * 提取超链接字段的 URL
 * 飞书超链接字段格式：{ text: "显示文本", link: "https://..." }
 */
function extractUrl(field: unknown): string {
  if (!field) return ''
  
  // 如果是字符串，直接返回
  if (typeof field === 'string') return field
  
  // 如果是对象，尝试提取 link 或 url 属性
  if (typeof field === 'object' && field !== null) {
    const obj = field as Record<string, unknown>
    return String(obj.link || obj.url || '')
  }
  
  return ''
}

/**
 * 将飞书记录转换为 Blog 对象
 * 导出以便测试
 */
export function transformRecordToBlog(record: BitableRecord): Blog | null {
  try {
    const fields = record.fields
    
    // 提取字段（字段名可能需要根据实际表格调整）
    const id = record.record_id
    const title = fields['标题'] || fields['title'] || ''
    const summary = fields['摘要'] || fields['summary'] || ''
    const category = fields['分类'] || fields['category'] || '未分类'
    const publishedAt = fields['发布时间'] || fields['publishedAt'] || fields['published_at'] || new Date().toISOString()
    
    // 处理超链接字段
    const docUrlField = fields['文档链接'] || fields['feishuDocUrl'] || fields['doc_url']
    const feishuDocUrl = extractUrl(docUrlField)
    
    const coverImageField = fields['封面图片'] || fields['coverImage'] || fields['cover_image']
    const coverImage = extractUrl(coverImageField)
    
    // 验证必填字段
    if (!title || !feishuDocUrl) {
      log(`记录 ${id} 缺少必填字段（标题或文档链接），已跳过`, 'warn')
      return null
    }
    
    // 转换日期格式
    let isoDate: string
    if (typeof publishedAt === 'number') {
      // 时间戳（毫秒）
      isoDate = new Date(publishedAt).toISOString()
    } else if (typeof publishedAt === 'string') {
      // 尝试解析字符串日期
      const date = new Date(publishedAt)
      isoDate = isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
    } else {
      isoDate = new Date().toISOString()
    }
    
    return {
      id,
      title: String(title),
      summary: String(summary),
      category: String(category),
      publishedAt: isoDate,
      feishuDocUrl: String(feishuDocUrl),
      ...(coverImage && { coverImage: String(coverImage) })
    }
  } catch (error) {
    log(`转换记录 ${record.record_id} 失败: ${error instanceof Error ? error.message : String(error)}`, 'warn')
    return null
  }
}

/**
 * 保存博客数据到 JSON 文件
 */
function saveBlogsToFile(blogs: Blog[]): void {
  log('正在保存数据到文件...')
  
  try {
    const json = JSON.stringify(blogs, null, 2)
    writeFileSync(OUTPUT_PATH, json, 'utf-8')
    log(`数据已保存到: ${OUTPUT_PATH}`, 'success')
    log(`共保存 ${blogs.length} 篇博客`, 'info')
  } catch (error) {
    log(`保存文件失败: ${error instanceof Error ? error.message : String(error)}`, 'error')
    throw error
  }
}

// ============================================
// 主函数
// ============================================

/**
 * 主执行函数
 */
async function main() {
  console.log('========================================')
  console.log('飞书博客数据预取脚本')
  console.log('========================================\n')
  
  try {
    // 1. 验证环境变量
    validateEnv()
    
    // 2. 获取访问令牌
    const token = await getTenantAccessToken()
    
    // 3. 获取多维表格记录
    const records = await fetchBitableRecords(token)
    
    // 4. 转换为 Blog 对象
    log('正在转换数据格式...')
    const blogs = records
      .map(transformRecordToBlog)
      .filter((blog): blog is Blog => blog !== null)
    
    if (blogs.length === 0) {
      log('未找到有效的博客数据', 'warn')
      return
    }
    
    // 5. 按发布时间降序排序
    blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    
    // 6. 保存到文件
    saveBlogsToFile(blogs)
    
    console.log('\n========================================')
    console.log('数据预取完成！')
    console.log('========================================')
  } catch (error) {
    console.log('\n========================================')
    console.log('数据预取失败！')
    console.log('========================================')
    process.exit(1)
  }
}

// 执行主函数（仅在直接运行时执行，导入时不执行）
// 检查是否为直接运行（而非导入）
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))
if (isMainModule) {
  main()
}
