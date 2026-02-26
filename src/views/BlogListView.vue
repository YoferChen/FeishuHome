<script setup lang="ts">
/**
 * BlogListView - 博客列表视图组件
 * 
 * 展示所有博客文章，支持卡片视图和时间线视图切换
 * 集成分类筛选功能，展示加载和错误状态
 * 支持明暗主题
 * 
 * @example
 * <BlogListView />
 * 
 * @description 验证需求: 2.1-2.6
 */

import { ref, computed, onMounted } from 'vue'
import { useBlogData } from '@/composables/useBlogData'
import BlogCard from '@/components/blog/BlogCard.vue'
import CategoryFilter from '@/components/blog/CategoryFilter.vue'
import Timeline from '@/components/blog/Timeline.vue'
import Loading from '@/components/common/Loading.vue'

/** 视图模式类型 */
type ViewMode = 'card' | 'timeline'

// 使用博客数据 composable
const { categories, loading, error, fetchBlogs, filterByCategory } = useBlogData()

// 当前选中的分类
const selectedCategory = ref<string | null>(null)

// 当前视图模式
const viewMode = ref<ViewMode>('card')

/**
 * 根据选中分类筛选后的博客列表
 */
const filteredBlogs = computed(() => {
  return filterByCategory(selectedCategory.value)
})

/**
 * 处理分类选择
 */
const handleCategorySelect = (category: string | null) => {
  selectedCategory.value = category
}

/**
 * 切换视图模式
 */
const toggleViewMode = (mode: ViewMode) => {
  viewMode.value = mode
}

/**
 * 重新加载博客数据
 */
const handleRetry = () => {
  fetchBlogs()
}

// 组件挂载时获取博客数据
onMounted(() => {
  fetchBlogs()
})
</script>

<template>
  <div class="blog-list-view">
    <div class="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      <!-- 页面头部 -->
      <header class="mb-8">
        <!-- 返回首页链接 -->
        <router-link 
          to="/" 
          class="link inline-flex items-center gap-2 mb-4 text-sm"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>返回首页</span>
        </router-link>
        
        <!-- 页面标题 -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
              博客文章
            </h1>
            <p class="text-sm text-[var(--color-text-secondary)] mt-1">
              共 {{ filteredBlogs.length }} 篇文章
            </p>
          </div>
          
          <!-- 视图切换按钮 -->
          <div class="view-toggle flex items-center gap-2">
            <span class="text-sm text-[var(--color-text-secondary)] mr-2">视图:</span>
            <button
              type="button"
              class="view-toggle__btn"
              :class="{ 'view-toggle__btn--active': viewMode === 'card' }"
              :aria-pressed="viewMode === 'card'"
              aria-label="卡片视图"
              @click="toggleViewMode('card')"
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              type="button"
              class="view-toggle__btn"
              :class="{ 'view-toggle__btn--active': viewMode === 'timeline' }"
              :aria-pressed="viewMode === 'timeline'"
              aria-label="时间线视图"
              @click="toggleViewMode('timeline')"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- 加载状态 -->
      <div 
        v-if="loading" 
        class="flex justify-center py-16"
      >
        <Loading text="正在加载博客..." size="lg" />
      </div>

      <!-- 错误状态 -->
      <div 
        v-else-if="error" 
        class="error-state card p-8 text-center"
      >
        <svg 
          class="w-12 h-12 mx-auto mb-4 text-red-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 class="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
          加载失败
        </h2>
        <p class="text-sm text-[var(--color-text-secondary)] mb-4">
          {{ error }}
        </p>
        <button 
          type="button"
          class="btn btn-primary"
          @click="handleRetry"
        >
          重新加载
        </button>
      </div>

      <!-- 博客内容区域 -->
      <div v-else>
        <!-- 分类筛选器 -->
        <div class="mb-6">
          <CategoryFilter
            :categories="categories"
            :selected-category="selectedCategory"
            @select="handleCategorySelect"
          />
        </div>

        <!-- 空状态 -->
        <div 
          v-if="filteredBlogs.length === 0" 
          class="empty-state card p-8 text-center"
        >
          <svg 
            class="w-12 h-12 mx-auto mb-4 text-[var(--color-text-secondary)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 class="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            暂无文章
          </h2>
          <p class="text-sm text-[var(--color-text-secondary)]">
            {{ selectedCategory ? `"${selectedCategory}" 分类下暂无文章` : '暂无博客文章' }}
          </p>
        </div>

        <!-- 卡片视图 -->
        <div 
          v-else-if="viewMode === 'card'" 
          class="blog-grid"
        >
          <BlogCard
            v-for="blog in filteredBlogs"
            :key="blog.id"
            :blog="blog"
          />
        </div>

        <!-- 时间线视图 -->
        <div 
          v-else 
          class="timeline-container card p-4 sm:p-6"
        >
          <Timeline :blogs="filteredBlogs" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 博客列表视图容器 */
.blog-list-view {
  min-height: calc(100vh - 80px);
  padding-bottom: 2rem;
}

/* 博客卡片网格布局 */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

/* 响应式网格 - 平板 */
@media (min-width: 640px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 响应式网格 - 桌面 */
@media (min-width: 1024px) {
  .blog-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 视图切换按钮组 */
.view-toggle {
  display: flex;
  align-items: center;
}

/* 视图切换按钮 */
.view-toggle__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-duration) ease-in-out;
}

.view-toggle__btn:hover {
  background-color: var(--color-hover);
  color: var(--color-text-primary);
}

.view-toggle__btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-primary);
}

/* 视图切换按钮激活状态 */
.view-toggle__btn--active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.view-toggle__btn--active:hover {
  background-color: var(--color-primary);
  color: white;
  opacity: 0.9;
}

/* 时间线容器 */
.timeline-container {
  background-color: var(--color-surface);
}

/* 错误状态和空状态卡片 */
.error-state,
.empty-state {
  background-color: var(--color-surface);
}
</style>
