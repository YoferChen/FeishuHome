<script setup lang="ts">
/**
 * ProjectCard 组件 - 项目经历卡片
 * 
 * 展示博主的项目经历列表，包括项目名称、描述、技术栈和项目链接
 * 使用 Card 组件作为容器，支持明暗主题
 * 如果没有项目经历数据，组件不会渲染
 * 
 * @example
 * <ProjectCard />
 * 
 * @description 验证需求: 6.3
 */

import Card from '@/components/common/Card.vue'
import { siteConfig } from '@/config/site.config'
import type { Project } from '@/types'

// 从配置中获取项目经历列表
const projectList: Project[] = siteConfig.projects

/**
 * 检查是否有项目经历数据
 */
const hasProjects = projectList && projectList.length > 0
</script>

<template>
  <!-- 仅在有项目经历数据时渲染 -->
  <Card v-if="hasProjects" class="project-card">
    <!-- 卡片标题 -->
    <div class="card-header mb-4">
      <div class="flex items-center gap-2">
        <!-- 项目图标 -->
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
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <h3 class="card-title text-lg font-semibold">
          项目经历
        </h3>
      </div>
    </div>

    <!-- 项目经历列表 -->
    <div class="project-list space-y-4">
      <div
        v-for="(project, index) in projectList"
        :key="index"
        class="project-item"
        :class="{ 'border-t border-divider pt-4': index > 0 }"
      >
        <!-- 项目名称和链接 -->
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h4 class="project-name font-medium">
            {{ project.name }}
          </h4>
          <!-- 项目链接（如果有） -->
          <a
            v-if="project.url"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="project-link"
            :aria-label="`访问项目 ${project.name}`"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        <!-- 项目描述 -->
        <p class="project-description text-sm mb-2">
          {{ project.description }}
        </p>

        <!-- 技术栈标签（如果有） -->
        <div
          v-if="project.techStack && project.techStack.length > 0"
          class="tech-stack flex flex-wrap gap-2"
        >
          <span
            v-for="(tech, techIndex) in project.techStack"
            :key="techIndex"
            class="tech-tag"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
/* 项目经历卡片样式 */
.project-card {
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

/* 项目名称样式 */
.project-name {
  color: var(--color-text-primary);
}

/* 项目链接样式 */
.project-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: var(--color-text-secondary);
  border-radius: 4px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.project-link:hover {
  color: var(--color-primary);
  background-color: var(--color-primary-light, rgba(59, 130, 246, 0.1));
}

/* 项目描述样式 */
.project-description {
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* 技术栈标签样式 */
.tech-tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary);
  background-color: var(--color-primary-light, rgba(59, 130, 246, 0.1));
  border-radius: 9999px;
}

/* 分隔线样式 */
.border-divider {
  border-color: var(--color-border);
}
</style>
