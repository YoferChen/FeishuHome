/**
 * 配置验证工具函数
 * 
 * 用于验证网站配置文件的格式和必填字段
 * 在构建时检测配置错误，输出明确的错误信息
 * 
 * @module utils/validateConfig
 * @description 验证需求: 6.9
 */

import type { SiteConfig } from '@/types'

/**
 * 验证配置对象
 * 
 * 对配置对象进行完整验证，包括：
 * - 必填字段存在性检查
 * - 字段类型检查
 * - 嵌套对象验证
 * - 数组元素验证
 * 
 * @param config - 待验证的配置对象
 * @returns 验证通过的 SiteConfig 对象
 * @throws Error 当配置验证失败时抛出包含详细错误信息的异常
 */
export function validateConfig(config: unknown): SiteConfig {
  const errors: string[] = []
  
  // 基础类型检查
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new Error('配置必须是一个对象')
  }
  
  const c = config as Record<string, unknown>
  
  // 验证顶级必填字段
  if (!c.title || typeof c.title !== 'string') {
    errors.push('title 必须是非空字符串')
  }
  
  if (!c.description || typeof c.description !== 'string') {
    errors.push('description 必须是非空字符串')
  }
  
  if (!c.basePath || typeof c.basePath !== 'string') {
    errors.push('basePath 必须是非空字符串')
  }
  
  // 验证 profile 对象
  if (!c.profile || typeof c.profile !== 'object') {
    errors.push('profile 必须是对象')
  } else {
    const profileErrors = validateProfile(c.profile as Record<string, unknown>)
    errors.push(...profileErrors)
  }
  
  // 验证 education 数组
  if (!Array.isArray(c.education)) {
    errors.push('education 必须是数组')
  } else {
    const educationErrors = validateEducationArray(c.education)
    errors.push(...educationErrors)
  }
  
  // 验证 projects 数组
  if (!Array.isArray(c.projects)) {
    errors.push('projects 必须是数组')
  } else {
    const projectErrors = validateProjectArray(c.projects)
    errors.push(...projectErrors)
  }
  
  // 验证 milestones 数组
  if (!Array.isArray(c.milestones)) {
    errors.push('milestones 必须是数组')
  } else {
    const milestoneErrors = validateMilestoneArray(c.milestones)
    errors.push(...milestoneErrors)
  }

  // 验证 feishu 对象
  if (!c.feishu || typeof c.feishu !== 'object') {
    errors.push('feishu 必须是对象')
  } else {
    const feishuErrors = validateFeishuConfig(c.feishu as Record<string, unknown>)
    errors.push(...feishuErrors)
  }
  
  // 如果有错误，抛出异常
  if (errors.length > 0) {
    throw new Error(`配置验证失败:\n${errors.join('\n')}`)
  }
  
  return config as SiteConfig
}

/**
 * 验证个人信息配置
 * 
 * @param profile - 待验证的 profile 对象
 * @returns 错误信息数组
 */
function validateProfile(profile: Record<string, unknown>): string[] {
  const errors: string[] = []
  
  if (!profile.avatar || typeof profile.avatar !== 'string') {
    errors.push('profile.avatar 必须是非空字符串')
  }
  
  if (!profile.nickname || typeof profile.nickname !== 'string') {
    errors.push('profile.nickname 必须是非空字符串')
  }
  
  if (!profile.bio || typeof profile.bio !== 'string') {
    errors.push('profile.bio 必须是非空字符串')
  }
  
  // 验证可选的 email 字段
  if (profile.email !== undefined && typeof profile.email !== 'string') {
    errors.push('profile.email 如果提供，必须是字符串')
  }
  
  // 验证可选的 socialLinks 字段
  if (profile.socialLinks !== undefined) {
    if (!Array.isArray(profile.socialLinks)) {
      errors.push('profile.socialLinks 如果提供，必须是数组')
    } else {
      const socialLinkErrors = validateSocialLinkArray(profile.socialLinks)
      errors.push(...socialLinkErrors)
    }
  }
  
  return errors
}

/**
 * 验证社交链接数组
 * 
 * @param socialLinks - 待验证的社交链接数组
 * @returns 错误信息数组
 */
function validateSocialLinkArray(socialLinks: unknown[]): string[] {
  const errors: string[] = []
  
  socialLinks.forEach((link, index) => {
    if (!link || typeof link !== 'object') {
      errors.push(`profile.socialLinks[${index}] 必须是对象`)
      return
    }
    
    const l = link as Record<string, unknown>
    
    if (!l.platform || typeof l.platform !== 'string') {
      errors.push(`profile.socialLinks[${index}].platform 必须是非空字符串`)
    }
    
    if (!l.url || typeof l.url !== 'string') {
      errors.push(`profile.socialLinks[${index}].url 必须是非空字符串`)
    }
  })
  
  return errors
}

/**
 * 验证教育经历数组
 * 
 * @param education - 待验证的教育经历数组
 * @returns 错误信息数组
 */
function validateEducationArray(education: unknown[]): string[] {
  const errors: string[] = []
  
  education.forEach((edu, index) => {
    if (!edu || typeof edu !== 'object') {
      errors.push(`education[${index}] 必须是对象`)
      return
    }
    
    const e = edu as Record<string, unknown>
    
    if (!e.school || typeof e.school !== 'string') {
      errors.push(`education[${index}].school 必须是非空字符串`)
    }
    
    if (!e.degree || typeof e.degree !== 'string') {
      errors.push(`education[${index}].degree 必须是非空字符串`)
    }
    
    if (!e.major || typeof e.major !== 'string') {
      errors.push(`education[${index}].major 必须是非空字符串`)
    }
    
    if (!e.startDate || typeof e.startDate !== 'string') {
      errors.push(`education[${index}].startDate 必须是非空字符串`)
    }
  })
  
  return errors
}


/**
 * 验证项目经历数组
 * 
 * @param projects - 待验证的项目经历数组
 * @returns 错误信息数组
 */
function validateProjectArray(projects: unknown[]): string[] {
  const errors: string[] = []
  
  projects.forEach((proj, index) => {
    if (!proj || typeof proj !== 'object') {
      errors.push(`projects[${index}] 必须是对象`)
      return
    }
    
    const p = proj as Record<string, unknown>
    
    if (!p.name || typeof p.name !== 'string') {
      errors.push(`projects[${index}].name 必须是非空字符串`)
    }
    
    if (!p.description || typeof p.description !== 'string') {
      errors.push(`projects[${index}].description 必须是非空字符串`)
    }
    
    // 验证可选的 techStack 字段
    if (p.techStack !== undefined) {
      if (!Array.isArray(p.techStack)) {
        errors.push(`projects[${index}].techStack 如果提供，必须是数组`)
      } else if (!p.techStack.every((item: unknown) => typeof item === 'string')) {
        errors.push(`projects[${index}].techStack 数组元素必须都是字符串`)
      }
    }
  })
  
  return errors
}

/**
 * 验证里程碑数组
 * 
 * @param milestones - 待验证的里程碑数组
 * @returns 错误信息数组
 */
function validateMilestoneArray(milestones: unknown[]): string[] {
  const errors: string[] = []
  
  milestones.forEach((ms, index) => {
    if (!ms || typeof ms !== 'object') {
      errors.push(`milestones[${index}] 必须是对象`)
      return
    }
    
    const m = ms as Record<string, unknown>
    
    if (!m.title || typeof m.title !== 'string') {
      errors.push(`milestones[${index}].title 必须是非空字符串`)
    }
    
    if (!m.date || typeof m.date !== 'string') {
      errors.push(`milestones[${index}].date 必须是非空字符串`)
    }
  })
  
  return errors
}

/**
 * 验证飞书配置
 * 
 * @param feishu - 待验证的飞书配置对象
 * @returns 错误信息数组
 */
function validateFeishuConfig(feishu: Record<string, unknown>): string[] {
  const errors: string[] = []
  
  if (!feishu.bitableUrl || typeof feishu.bitableUrl !== 'string') {
    errors.push('feishu.bitableUrl 必须是非空字符串')
  }
  
  if (typeof feishu.enableRuntimeFetch !== 'boolean') {
    errors.push('feishu.enableRuntimeFetch 必须是布尔值')
  }
  
  return errors
}

/**
 * 导出验证辅助函数（用于测试）
 */
export const _testHelpers = {
  validateProfile,
  validateSocialLinkArray,
  validateEducationArray,
  validateProjectArray,
  validateMilestoneArray,
  validateFeishuConfig
}
