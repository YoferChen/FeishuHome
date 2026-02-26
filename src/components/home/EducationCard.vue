<script setup lang="ts">
/**
 * EducationCard 组件 - 教育经历卡片
 * 
 * 展示博主的教育经历列表，包括学校、学位、专业、时间范围和描述
 * 使用 Card 组件作为容器，支持明暗主题
 * 如果没有教育经历数据，组件不会渲染
 * 
 * @example
 * <EducationCard />
 * 
 * @description 验证需求: 6.2
 */

import Card from '@/components/common/Card.vue'
import { siteConfig } from '@/config/site.config'
import type { Education } from '@/types'

// 从配置中获取教育经历列表
const educationList: Education[] = siteConfig.education

/**
 * 检查是否有教育经历数据
 */
const hasEducation = educationList && educationList.length > 0

/**
 * 格式化日期显示
 * 将 YYYY-MM 格式转换为更友好的显示格式
 * 
 * @param dateStr - 日期字符串，格式为 YYYY-MM
 * @returns 格式化后的日期字符串
 */
const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  
  // 解析日期字符串
  const parts = dateStr.split('-')
  if (parts.length >= 2) {
    const year = parts[0]
    const month = parts[1]
    return `${year}年${month}月`
  }
  return dateStr
}

/**
 * 获取时间范围显示文本
 * 
 * @param startDate - 开始日期
 * @param endDate - 结束日期（可选，未填写表示在读）
 * @returns 时间范围文本
 */
const getDateRange = (startDate: string, endDate?: string): string => {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : '至今'
  return `${start} - ${end}`
}
</script>

<template>
  <!-- 仅在有教育经历数据时渲染 -->
  <Card v-if="hasEducation" class="education-card">
    <!-- 卡片标题 -->
    <div class="card-header mb-4">
      <div class="flex items-center gap-2">
        <!-- 教育图标 -->
        <svg
          class="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
        <h3 class="card-title text-lg font-semibold">
          教育经历
        </h3>
      </div>
    </div>

    <!-- 教育经历列表 -->
    <div class="education-list space-y-4">
      <div
        v-for="(edu, index) in educationList"
        :key="index"
        class="education-item"
        :class="{ 'border-t border-divider pt-4': index > 0 }"
      >
        <!-- 学校名称和学位 -->
        <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
          <h4 class="school-name font-medium">
            {{ edu.school }}
          </h4>
          <span class="degree-badge">
            {{ edu.degree }}
          </span>
        </div>

        <!-- 专业 -->
        <p class="major text-sm mb-1">
          {{ edu.major }}
        </p>

        <!-- 时间范围 -->
        <p class="date-range text-xs mb-2">
          <svg
            class="inline-block w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {{ getDateRange(edu.startDate, edu.endDate) }}
        </p>

        <!-- 描述（如果有） -->
        <p
          v-if="edu.description"
          class="description text-sm"
        >
          {{ edu.description }}
        </p>
      </div>
    </div>
  </Card>
</template>

<style scoped>
/* 教育经历卡片样式 */
.education-card {
  /* 继承 Card 组件的基础样式 */
}

/* 卡片标题样式 */
.card-title {
  color: var(--color-text-primary);
}

/* 图标主题色 */
.text-primary {
  color: var(--color-primary);
}

/* 学校名称样式 */
.school-name {
  color: var(--color-text-primary);
}

/* 学位徽章样式 */
.degree-badge {
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary);
  background-color: var(--color-primary-light, rgba(59, 130, 246, 0.1));
  border-radius: 9999px;
}

/* 专业样式 */
.major {
  color: var(--color-text-secondary);
}

/* 时间范围样式 */
.date-range {
  color: var(--color-text-muted, var(--color-text-secondary));
  opacity: 0.8;
}

/* 描述样式 */
.description {
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* 分隔线样式 */
.border-divider {
  border-color: var(--color-border);
}
</style>
