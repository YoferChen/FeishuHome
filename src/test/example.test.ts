/**
 * 示例测试文件
 * 用于验证测试框架配置是否正确
 */
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'

describe('测试框架配置验证', () => {
  // 基础单元测试
  describe('基础测试', () => {
    it('应该能够运行基本断言', () => {
      expect(1 + 1).toBe(2)
    })

    it('应该能够测试数组', () => {
      const arr = [1, 2, 3]
      expect(arr).toHaveLength(3)
      expect(arr).toContain(2)
    })

    it('应该能够测试对象', () => {
      const obj = { name: '测试', value: 42 }
      expect(obj).toHaveProperty('name')
      expect(obj.value).toBe(42)
    })
  })

  // fast-check 属性测试
  describe('属性测试 (fast-check)', () => {
    it('加法交换律：a + b === b + a', () => {
      fc.assert(
        fc.property(
          fc.integer(),
          fc.integer(),
          (a, b) => a + b === b + a
        ),
        { numRuns: 100 }
      )
    })

    it('字符串连接长度：len(a + b) === len(a) + len(b)', () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.string(),
          (a, b) => (a + b).length === a.length + b.length
        ),
        { numRuns: 100 }
      )
    })

    it('数组过滤：过滤后的数组长度 <= 原数组长度', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer()),
          (arr) => {
            const filtered = arr.filter(x => x > 0)
            return filtered.length <= arr.length
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
