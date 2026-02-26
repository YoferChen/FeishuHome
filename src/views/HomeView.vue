<script setup lang="ts">
/**
 * HomeView - 主页视图组件
 * 
 * 组合展示个人信息、教育经历、项目经历和里程碑卡片
 * 实现响应式布局，提供博客列表入口导航
 * 支持明暗主题
 * 
 * @example
 * <HomeView />
 * 
 * @description 验证需求: 1.1-1.5
 */

import ProfileCard from '@/components/home/ProfileCard.vue'
import EducationCard from '@/components/home/EducationCard.vue'
import ProjectCard from '@/components/home/ProjectCard.vue'
import MilestoneCard from '@/components/home/MilestoneCard.vue'
import { siteConfig } from '@/config/site.config'
</script>

<template>
  <div class="home-view">
    <!-- 主容器 - 响应式最大宽度和内边距 -->
    <div class="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      <!-- 页面标题区域 -->
      <header class="text-center mb-8 sm:mb-12">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-gradient">
          {{ siteConfig.title }}
        </h1>
        <p class="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          {{ siteConfig.description }}
        </p>
      </header>

      <!-- 主内容区域 - 响应式网格布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        <!-- 左侧栏 - 个人信息卡片 -->
        <aside class="lg:col-span-4">
          <div class="lg:sticky lg:top-24">
            <ProfileCard />
            
            <!-- 博客入口按钮 - 移动端显示在个人信息下方 -->
            <div class="mt-6 lg:hidden">
              <router-link 
                to="/blogs" 
                class="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <svg 
                  class="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <span>查看博客</span>
              </router-link>
            </div>
          </div>
        </aside>

        <!-- 右侧栏 - 详细信息卡片 -->
        <main class="lg:col-span-8 space-y-6">
          
          <!-- 博客入口卡片 - 桌面端显示 -->
          <div class="hidden lg:block">
            <div class="card p-6">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 class="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                    探索我的博客
                  </h2>
                  <p class="text-sm text-[var(--color-text-secondary)]">
                    阅读我的技术文章、学习笔记和生活感悟
                  </p>
                </div>
                <router-link 
                  to="/blogs" 
                  class="btn btn-primary flex items-center gap-2 shrink-0"
                >
                  <span>查看博客</span>
                  <svg 
                    class="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>

          <!-- 教育经历卡片 -->
          <EducationCard />

          <!-- 项目经历卡片 -->
          <ProjectCard />

          <!-- 里程碑卡片 -->
          <MilestoneCard />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 主页视图容器 */
.home-view {
  min-height: calc(100vh - 80px);
  padding-bottom: 2rem;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .home-view {
    padding-bottom: 1rem;
  }
}

/* 确保粘性定位在滚动时正常工作 */
@media (min-width: 1024px) {
  aside {
    align-self: start;
  }
}
</style>
