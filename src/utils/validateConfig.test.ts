/**
 * 配置验证函数单元测试
 * 
 * 测试 validateConfig 函数的各种场景
 * 验证需求: 6.9
 */

import { describe, it, expect } from 'vitest'
import { validateConfig, _testHelpers } from './validateConfig'
import type { SiteConfig } from '@/types'

/**
 * 创建有效的完整配置对象
 * 用于测试的基础配置
 */
function createValidConfig(): SiteConfig {
  return {
    title: '测试博客',
    description: '这是一个测试博客',
    basePath: '/',
    profile: {
      avatar: 'https://example.com/avatar.png',
      nickname: '测试用户',
      bio: '这是个人简介'
    },
    education: [
      {
        school: '测试大学',
        degree: '学士',
        major: '计算机科学',
        startDate: '2020-09'
      }
    ],
    projects: [
      {
        name: '测试项目',
        description: '这是一个测试项目'
      }
    ],
    milestones: [
      {
        title: '测试里程碑',
        date: '2023-01'
      }
    ],
    feishu: {
      bitableUrl: 'https://feishu.cn/base/xxx',
      enableRuntimeFetch: false
    }
  }
}

describe('validateConfig', () => {
  describe('基础验证', () => {
    it('应该接受有效的配置对象', () => {
      const config = createValidConfig()
      const result = validateConfig(config)
      expect(result).toEqual(config)
    })

    it('应该拒绝 null 配置', () => {
      expect(() => validateConfig(null)).toThrow('配置必须是一个对象')
    })

    it('应该拒绝 undefined 配置', () => {
      expect(() => validateConfig(undefined)).toThrow('配置必须是一个对象')
    })

    it('应该拒绝非对象配置', () => {
      expect(() => validateConfig('string')).toThrow('配置必须是一个对象')
      expect(() => validateConfig(123)).toThrow('配置必须是一个对象')
      expect(() => validateConfig([])).toThrow('配置必须是一个对象')
    })
  })

  describe('顶级字段验证', () => {
    it('应该拒绝缺少 title 的配置', () => {
      const config = createValidConfig() as unknown as Record<string, unknown>
      delete config.title
      expect(() => validateConfig(config)).toThrow('title 必须是非空字符串')
    })

    it('应该拒绝空字符串 title', () => {
      const config = createValidConfig()
      config.title = ''
      expect(() => validateConfig(config)).toThrow('title 必须是非空字符串')
    })

    it('应该拒绝缺少 description 的配置', () => {
      const config = createValidConfig() as unknown as Record<string, unknown>
      delete config.description
      expect(() => validateConfig(config)).toThrow('description 必须是非空字符串')
    })

    it('应该拒绝缺少 basePath 的配置', () => {
      const config = createValidConfig() as unknown as Record<string, unknown>
      delete config.basePath
      expect(() => validateConfig(config)).toThrow('basePath 必须是非空字符串')
    })
  })


  describe('profile 验证', () => {
    it('应该拒绝缺少 profile 的配置', () => {
      const config = createValidConfig() as unknown as Record<string, unknown>
      delete config.profile
      expect(() => validateConfig(config)).toThrow('profile 必须是对象')
    })

    it('应该拒绝缺少 profile.avatar 的配置', () => {
      const config = createValidConfig()
      const profile = config.profile as unknown as Record<string, unknown>
      delete profile.avatar
      expect(() => validateConfig(config)).toThrow('profile.avatar 必须是非空字符串')
    })

    it('应该拒绝缺少 profile.nickname 的配置', () => {
      const config = createValidConfig()
      const profile = config.profile as unknown as Record<string, unknown>
      delete profile.nickname
      expect(() => validateConfig(config)).toThrow('profile.nickname 必须是非空字符串')
    })

    it('应该拒绝缺少 profile.bio 的配置', () => {
      const config = createValidConfig()
      const profile = config.profile as unknown as Record<string, unknown>
      delete profile.bio
      expect(() => validateConfig(config)).toThrow('profile.bio 必须是非空字符串')
    })

    it('应该接受带有可选 email 的配置', () => {
      const config = createValidConfig()
      config.profile.email = 'test@example.com'
      expect(() => validateConfig(config)).not.toThrow()
    })

    it('应该拒绝非字符串类型的 email', () => {
      const config = createValidConfig()
      const profile = config.profile as unknown as Record<string, unknown>
      profile.email = 123
      expect(() => validateConfig(config)).toThrow('profile.email 如果提供，必须是字符串')
    })

    it('应该接受带有 socialLinks 的配置', () => {
      const config = createValidConfig()
      config.profile.socialLinks = [
        { platform: 'GitHub', url: 'https://github.com/test' }
      ]
      expect(() => validateConfig(config)).not.toThrow()
    })

    it('应该拒绝无效的 socialLinks', () => {
      const config = createValidConfig()
      const profile = config.profile as unknown as Record<string, unknown>
      profile.socialLinks = 'invalid'
      expect(() => validateConfig(config)).toThrow('profile.socialLinks 如果提供，必须是数组')
    })

    it('应该拒绝缺少 platform 的 socialLink', () => {
      const config = createValidConfig()
      config.profile.socialLinks = [
        { url: 'https://github.com/test' } as any
      ]
      expect(() => validateConfig(config)).toThrow('profile.socialLinks[0].platform 必须是非空字符串')
    })

    it('应该拒绝缺少 url 的 socialLink', () => {
      const config = createValidConfig()
      config.profile.socialLinks = [
        { platform: 'GitHub' } as any
      ]
      expect(() => validateConfig(config)).toThrow('profile.socialLinks[0].url 必须是非空字符串')
    })
  })

  describe('education 验证', () => {
    it('应该拒绝非数组的 education', () => {
      const config = createValidConfig() as unknown as Record<string, unknown>
      config.education = 'invalid'
      expect(() => validateConfig(config)).toThrow('education 必须是数组')
    })

    it('应该接受空的 education 数组', () => {
      const config = createValidConfig()
      config.education = []
      expect(() => validateConfig(config)).not.toThrow()
    })

    it('应该拒绝缺少必填字段的 education 项', () => {
      const config = createValidConfig()
      config.education = [{ school: '测试大学' } as any]
      expect(() => validateConfig(config)).toThrow('education[0].degree 必须是非空字符串')
    })

    it('应该验证 education 数组中的每一项', () => {
      const config = createValidConfig()
      config.education = [
        { school: '大学1', degree: '学士', major: '计算机', startDate: '2020-09' },
        { school: '大学2' } as any
      ]
      expect(() => validateConfig(config)).toThrow('education[1].degree 必须是非空字符串')
    })
  })


  describe('projects 验证', () => {
    it('应该拒绝非数组的 projects', () => {
      const config = createValidConfig() as unknown as Record<string, unknown>
      config.projects = 'invalid'
      expect(() => validateConfig(config)).toThrow('projects 必须是数组')
    })

    it('应该接受空的 projects 数组', () => {
      const config = createValidConfig()
      config.projects = []
      expect(() => validateConfig(config)).not.toThrow()
    })

    it('应该拒绝缺少 name 的 project', () => {
      const config = createValidConfig()
      config.projects = [{ description: '描述' } as any]
      expect(() => validateConfig(config)).toThrow('projects[0].name 必须是非空字符串')
    })

    it('应该拒绝缺少 description 的 project', () => {
      const config = createValidConfig()
      config.projects = [{ name: '项目名' } as any]
      expect(() => validateConfig(config)).toThrow('projects[0].description 必须是非空字符串')
    })

    it('应该接受带有 techStack 的 project', () => {
      const config = createValidConfig()
      config.projects = [
        { name: '项目', description: '描述', techStack: ['Vue', 'TypeScript'] }
      ]
      expect(() => validateConfig(config)).not.toThrow()
    })

    it('应该拒绝非数组的 techStack', () => {
      const config = createValidConfig()
      config.projects = [
        { name: '项目', description: '描述', techStack: 'Vue' as any }
      ]
      expect(() => validateConfig(config)).toThrow('projects[0].techStack 如果提供，必须是数组')
    })

    it('应该拒绝包含非字符串元素的 techStack', () => {
      const config = createValidConfig()
      config.projects = [
        { name: '项目', description: '描述', techStack: ['Vue', 123 as any] }
      ]
      expect(() => validateConfig(config)).toThrow('projects[0].techStack 数组元素必须都是字符串')
    })
  })

  describe('milestones 验证', () => {
    it('应该拒绝非数组的 milestones', () => {
      const config = createValidConfig() as unknown as Record<string, unknown>
      config.milestones = 'invalid'
      expect(() => validateConfig(config)).toThrow('milestones 必须是数组')
    })

    it('应该接受空的 milestones 数组', () => {
      const config = createValidConfig()
      config.milestones = []
      expect(() => validateConfig(config)).not.toThrow()
    })

    it('应该拒绝缺少 title 的 milestone', () => {
      const config = createValidConfig()
      config.milestones = [{ date: '2023-01' } as any]
      expect(() => validateConfig(config)).toThrow('milestones[0].title 必须是非空字符串')
    })

    it('应该拒绝缺少 date 的 milestone', () => {
      const config = createValidConfig()
      config.milestones = [{ title: '里程碑' } as any]
      expect(() => validateConfig(config)).toThrow('milestones[0].date 必须是非空字符串')
    })
  })

  describe('feishu 验证', () => {
    it('应该拒绝缺少 feishu 的配置', () => {
      const config = createValidConfig() as unknown as Record<string, unknown>
      delete config.feishu
      expect(() => validateConfig(config)).toThrow('feishu 必须是对象')
    })

    it('应该拒绝缺少 bitableUrl 的 feishu 配置', () => {
      const config = createValidConfig()
      const feishu = config.feishu as unknown as Record<string, unknown>
      delete feishu.bitableUrl
      expect(() => validateConfig(config)).toThrow('feishu.bitableUrl 必须是非空字符串')
    })

    it('应该拒绝缺少 enableRuntimeFetch 的 feishu 配置', () => {
      const config = createValidConfig()
      const feishu = config.feishu as unknown as Record<string, unknown>
      delete feishu.enableRuntimeFetch
      expect(() => validateConfig(config)).toThrow('feishu.enableRuntimeFetch 必须是布尔值')
    })

    it('应该拒绝非布尔值的 enableRuntimeFetch', () => {
      const config = createValidConfig()
      const feishu = config.feishu as unknown as Record<string, unknown>
      feishu.enableRuntimeFetch = 'true'
      expect(() => validateConfig(config)).toThrow('feishu.enableRuntimeFetch 必须是布尔值')
    })
  })

  describe('多个错误聚合', () => {
    it('应该收集并报告所有错误', () => {
      const config = {
        // 缺少 title, description, basePath
        profile: {}, // 缺少必填字段
        education: 'invalid',
        projects: 'invalid',
        milestones: 'invalid',
        feishu: {}
      }
      
      try {
        validateConfig(config)
        expect.fail('应该抛出错误')
      } catch (error) {
        const message = (error as Error).message
        expect(message).toContain('配置验证失败')
        expect(message).toContain('title 必须是非空字符串')
        expect(message).toContain('description 必须是非空字符串')
        expect(message).toContain('basePath 必须是非空字符串')
        expect(message).toContain('profile.avatar 必须是非空字符串')
        expect(message).toContain('education 必须是数组')
        expect(message).toContain('projects 必须是数组')
        expect(message).toContain('milestones 必须是数组')
        expect(message).toContain('feishu.bitableUrl 必须是非空字符串')
      }
    })
  })
})
