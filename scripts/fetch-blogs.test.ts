/**
 * 博客数据预取脚本测试
 * 
 * 测试数据转换和验证逻辑
 */

import { describe, it, expect } from 'vitest'
import { transformRecordToBlog } from './fetch-blogs'

describe('fetch-blogs 脚本测试', () => {
  describe('transformRecordToBlog', () => {
    it('应该正确转换包含所有字段的记录（中文字段名）', () => {
      const record = {
        record_id: 'rec123',
        fields: {
          '标题': '测试博客',
          '摘要': '这是一篇测试博客',
          '分类': '技术',
          '发布时间': '2024-01-15T10:30:00.000Z',
          '文档链接': 'https://example.feishu.cn/docx/test',
          '封面图片': 'https://example.com/cover.jpg'
        }
      }

      const result = transformRecordToBlog(record)

      expect(result).toEqual({
        id: 'rec123',
        title: '测试博客',
        summary: '这是一篇测试博客',
        category: '技术',
        publishedAt: '2024-01-15T10:30:00.000Z',
        feishuDocUrl: 'https://example.feishu.cn/docx/test',
        coverImage: 'https://example.com/cover.jpg'
      })
    })

    it('应该正确转换包含所有字段的记录（英文字段名）', () => {
      const record = {
        record_id: 'rec456',
        fields: {
          'title': 'Test Blog',
          'summary': 'This is a test blog',
          'category': 'Tech',
          'publishedAt': '2024-01-15T10:30:00.000Z',
          'feishuDocUrl': 'https://example.feishu.cn/docx/test',
          'coverImage': 'https://example.com/cover.jpg'
        }
      }

      const result = transformRecordToBlog(record)

      expect(result).toEqual({
        id: 'rec456',
        title: 'Test Blog',
        summary: 'This is a test blog',
        category: 'Tech',
        publishedAt: '2024-01-15T10:30:00.000Z',
        feishuDocUrl: 'https://example.feishu.cn/docx/test',
        coverImage: 'https://example.com/cover.jpg'
      })
    })

    it('应该正确处理只有必填字段的记录', () => {
      const record = {
        record_id: 'rec789',
        fields: {
          '标题': '最小博客',
          '文档链接': 'https://example.feishu.cn/docx/minimal'
        }
      }

      const result = transformRecordToBlog(record)

      expect(result).toBeTruthy()
      expect(result?.id).toBe('rec789')
      expect(result?.title).toBe('最小博客')
      expect(result?.feishuDocUrl).toBe('https://example.feishu.cn/docx/minimal')
      expect(result?.summary).toBe('')
      expect(result?.category).toBe('未分类')
      expect(result?.publishedAt).toBeTruthy() // 应该有默认时间
    })

    it('应该为缺少分类的记录设置默认分类', () => {
      const record = {
        record_id: 'rec999',
        fields: {
          '标题': '无分类博客',
          '文档链接': 'https://example.feishu.cn/docx/no-category'
        }
      }

      const result = transformRecordToBlog(record)

      expect(result?.category).toBe('未分类')
    })

    it('应该正确转换时间戳格式的发布时间', () => {
      const timestamp = new Date('2024-01-15T10:30:00.000Z').getTime()
      const record = {
        record_id: 'rec111',
        fields: {
          '标题': '时间戳测试',
          '文档链接': 'https://example.feishu.cn/docx/timestamp',
          '发布时间': timestamp
        }
      }

      const result = transformRecordToBlog(record)

      expect(result?.publishedAt).toBe('2024-01-15T10:30:00.000Z')
    })

    it('应该正确转换字符串格式的发布时间', () => {
      const record = {
        record_id: 'rec222',
        fields: {
          '标题': '字符串时间测试',
          '文档链接': 'https://example.feishu.cn/docx/string-date',
          '发布时间': '2024-01-15'
        }
      }

      const result = transformRecordToBlog(record)

      expect(result?.publishedAt).toBeTruthy()
      // 应该能解析为有效的 ISO 日期
      expect(() => new Date(result!.publishedAt)).not.toThrow()
    })

    it('应该拒绝缺少标题的记录', () => {
      const record = {
        record_id: 'rec333',
        fields: {
          '文档链接': 'https://example.feishu.cn/docx/no-title'
        }
      }

      const result = transformRecordToBlog(record)

      expect(result).toBeNull()
    })

    it('应该拒绝缺少文档链接的记录', () => {
      const record = {
        record_id: 'rec444',
        fields: {
          '标题': '无链接博客'
        }
      }

      const result = transformRecordToBlog(record)

      expect(result).toBeNull()
    })

    it('应该拒绝标题为空字符串的记录', () => {
      const record = {
        record_id: 'rec555',
        fields: {
          '标题': '',
          '文档链接': 'https://example.feishu.cn/docx/empty-title'
        }
      }

      const result = transformRecordToBlog(record)

      expect(result).toBeNull()
    })

    it('应该拒绝文档链接为空字符串的记录', () => {
      const record = {
        record_id: 'rec666',
        fields: {
          '标题': '空链接博客',
          '文档链接': ''
        }
      }

      const result = transformRecordToBlog(record)

      expect(result).toBeNull()
    })

    it('应该正确处理混合中英文字段名', () => {
      const record = {
        record_id: 'rec777',
        fields: {
          '标题': '混合字段测试',
          'summary': 'Mixed fields test',
          '分类': '测试',
          'publishedAt': '2024-01-15T10:30:00.000Z',
          '文档链接': 'https://example.feishu.cn/docx/mixed'
        }
      }

      const result = transformRecordToBlog(record)

      expect(result).toBeTruthy()
      expect(result?.title).toBe('混合字段测试')
      expect(result?.summary).toBe('Mixed fields test')
      expect(result?.category).toBe('测试')
    })

    it('应该将所有字段值转换为字符串', () => {
      const record = {
        record_id: 'rec888',
        fields: {
          '标题': 123, // 数字
          '摘要': true, // 布尔值
          '分类': null, // null
          '文档链接': 'https://example.feishu.cn/docx/type-conversion'
        }
      }

      const result = transformRecordToBlog(record)

      expect(result).toBeTruthy()
      expect(typeof result?.title).toBe('string')
      expect(typeof result?.summary).toBe('string')
      expect(typeof result?.category).toBe('string')
    })
  })
})
