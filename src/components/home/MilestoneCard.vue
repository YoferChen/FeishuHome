<script setup lang="ts">
/**
 * MilestoneCard 组件 - 里程碑/重要事件卡片
 * 
 * 展示博主的里程碑和重要事件列表，使用时间线样式展示
 * 使用 Card 组件作为容器，支持明暗主题
 * 如果没有里程碑数据，组件不会渲染
 * 
 * @example
 * <MilestoneCard />
 * 
 * @description 验证需求: 6.4
 */

import Card from '@/components/common/Card.vue'
import { siteConfig } from '@/config/site.config'
import type { Milestone } from '@/types'

// 从配置中获取里程碑列表
const milestoneList: Milestone[] = siteConfig.milestones

/**
 * 检查是否有里程碑数据
 */
const hasMilestones = milestoneList && milestoneList.length > 0

/**
 * 格式化日期显示
 * 将 YYYY-MM 格式转换为更友好的显示格式
 * 
 * @param dateStr - 日期字符串，格式为 YYYY-MM 或 YYYY-MM-DD
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
</script>

<template>
  <!-- 仅在有里程碑数据时渲染 -->
  <Card v-if="hasMilestones" class="milestone-card">
    <!-- 卡片标题 -->
    <div class="card-header mb-4">
      <div class="flex items-center gap-2">
        <!-- 里程碑图标 -->
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
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
        <h3 class="card-title text-lg font-semibold">
          里程碑
        </h3>
      </div>
    </div>

    <!-- 时间线列表 -->
    <div class="timeline">
      <div
        v-for="(milestone, index) in milestoneList"
        :key="index"
        class="timeline-item"
      >
        <!-- 时间线节点 -->
        <div class="timeline-node">
          <div class="timeline-dot"></div>
          <!-- 连接线（最后一项不显示） -->
          <div
            v-if="index < milestoneList.length - 1"
            class="timeline-line"
          ></div>
        </div>

        <!-- 里程碑内容 -->
        <div class="timeline-content">
          <!-- 日期 -->
          <span class="milestone-date">
            {{ formatDate(milestone.date) }}
          </span>
          
          <!-- 标题 -->
          <h4 class="milestone-title">
            {{ milestone.title }}
          </h4>
          
          <!-- 描述（如果有） -->
          <p
            v-if="milestone.description"
            class="milestone-description"
          >
            {{ milestone.description }}
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
/* 里程碑卡片样式 */
.milestone-card {
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

/* 时间线容器 */
.timeline {
  position: relative;
}

/* 时间线项目 */
.timeline-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

/* 时间线节点容器 */
.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

/* 时间线圆点 */
.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--color-primary);
  border: 2px solid var(--color-bg-card, var(--color-bg-primary));
  box-shadow: 0 0 0 3px var(--color-primary-light, rgba(59, 130, 246, 0.2));
  flex-shrink: 0;
}

/* 时间线连接线 */
.timeline-line {
  width: 2px;
  flex-grow: 1;
  background-color: var(--color-border);
  margin-top: 4px;
  min-height: 20px;
}

/* 时间线内容区域 */
.timeline-content {
  flex-grow: 1;
  padding-top: 0;
  min-width: 0;
}

/* 里程碑日期样式 */
.milestone-date {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary);
  background-color: var(--color-primary-light, rgba(59, 130, 246, 0.1));
  padding: 2px 8px;
  border-radius: 9999px;
  margin-bottom: 0.5rem;
}

/* 里程碑标题样式 */
.milestone-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

/* 里程碑描述样式 */
.milestone-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .timeline-item {
    gap: 0.75rem;
  }
  
  .timeline-dot {
    width: 10px;
    height: 10px;
  }
  
  .milestone-title {
    font-size: 0.875rem;
  }
  
  .milestone-description {
    font-size: 0.8125rem;
  }
}
</style>
