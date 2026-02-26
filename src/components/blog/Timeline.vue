<script setup lang="ts">
/**
 * Timeline 组件 - 时间线视图
 * 
 * 按时间降序展示博客列表，按年份分组显示
 * 支持点击跳转到博客详情页
 * 
 * @example
 * <Timeline :blogs="blogs" />
 * 
 * 验证需求: 2.5
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Blog } from '@/types'

interface Props {
  /** 博客数据数组 */
  blogs: Blog[]
}

const props = defineProps<Props>()
const router = useRouter()

/**
 * 按年份分组的博客数据
 * 按时间降序排列
 */
interface YearGroup {
  year: number
  blogs: Blog[]
}

/**
 * 将博客按年份分组并按时间降序排列
 */
const groupedBlogs = computed<YearGroup[]>(() => {
  // 首先按发布时间降序排序
  const sortedBlogs = [...props.blogs].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })
  
  // 按年份分组
  const groups = new Map<number, Blog[]>()
  
  for (const blog of sortedBlogs) {
    const date = new Date(blog.publishedAt)
    const year = isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear()
    
    if (!groups.has(year)) {
      groups.set(year, [])
    }
    groups.get(year)!.push(blog)
  }
  
  // 转换为数组并按年份降序排列
  return Array.from(groups.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, blogs]) => ({ year, blogs }))
})

/**
 * 格式化发布日期
 * 显示月-日格式
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return dateStr
  }
  
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${month}-${day}`
}

/**
 * 处理博客项点击事件
 * 跳转到博客详情页
 */
const handleBlogClick = (blogId: string) => {
  router.push(`/blogs/${blogId}`)
}

/**
 * 处理键盘事件
 * 支持 Enter 和 Space 键触发点击
 */
const handleKeydown = (event: KeyboardEvent, blogId: string) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleBlogClick(blogId)
  }
}
</script>

<template>
  <div 
    class="timeline"
    role="feed"
    aria-label="博客时间线"
  >
    <!-- 空状态 -->
    <div 
      v-if="blogs.length === 0"
      class="timeline__empty"
    >
      <p>暂无博客文章</p>
    </div>
    
    <!-- 年份分组 -->
    <div
      v-for="group in groupedBlogs"
      :key="group.year"
      class="timeline__year-group"
    >
      <!-- 年份标题 -->
      <h2 class="timeline__year">
        {{ group.year }}
      </h2>
      
      <!-- 博客列表 -->
      <div class="timeline__list">
        <article
          v-for="blog in group.blogs"
          :key="blog.id"
          class="timeline__item"
          role="article"
          tabindex="0"
          :aria-label="`博客文章: ${blog.title}`"
          @click="handleBlogClick(blog.id)"
          @keydown="(e) => handleKeydown(e, blog.id)"
        >
          <!-- 时间线节点 -->
          <div class="timeline__node">
            <div class="timeline__dot" />
            <div class="timeline__line" />
          </div>
          
          <!-- 博客内容 -->
          <div class="timeline__content">
            <!-- 日期 -->
            <time 
              class="timeline__date"
              :datetime="blog.publishedAt"
            >
              {{ formatDate(blog.publishedAt) }}
            </time>
            
            <!-- 标题 -->
            <h3 class="timeline__title">
              {{ blog.title }}
            </h3>
            
            <!-- 分类标签 -->
            <span class="timeline__category tag">
              {{ blog.category || '未分类' }}
            </span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 时间线容器 */
.timeline {
  width: 100%;
}

/* 空状态 */
.timeline__empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);
}

/* 年份分组 */
.timeline__year-group {
  margin-bottom: 2rem;
}

.timeline__year-group:last-child {
  margin-bottom: 0;
}

/* 年份标题 */
.timeline__year {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  padding-left: 0.5rem;
}

/* 博客列表 */
.timeline__list {
  display: flex;
  flex-direction: column;
}

/* 时间线项 */
.timeline__item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color var(--transition-duration) ease-in-out;
}

.timeline__item:hover {
  background-color: var(--color-hover);
}

.timeline__item:focus {
  outline: none;
  background-color: var(--color-hover);
  box-shadow: 0 0 0 2px var(--color-primary);
}

/* 时间线节点 */
.timeline__node {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 1.5rem;
}

/* 时间线圆点 */
.timeline__dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 0.375rem;
}

/* 时间线连接线 */
.timeline__line {
  width: 2px;
  flex: 1;
  background-color: var(--color-border);
  margin-top: 0.5rem;
}

/* 最后一项隐藏连接线 */
.timeline__item:last-child .timeline__line {
  display: none;
}

/* 博客内容区域 */
.timeline__content {
  flex: 1;
  min-width: 0;
}

/* 日期 */
.timeline__date {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
}

/* 标题 */
.timeline__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
  
  /* 文字截断 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 分类标签 */
.timeline__category {
  font-size: 0.75rem;
}

/* 响应式布局 */
@media (min-width: 640px) {
  .timeline__item {
    padding: 1rem;
  }
  
  .timeline__title {
    font-size: 1.125rem;
  }
}
</style>
