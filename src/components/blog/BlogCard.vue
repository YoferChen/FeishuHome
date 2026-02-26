<script setup lang="ts">
/**
 * BlogCard 组件 - 博客卡片
 * 
 * 展示博客标题、摘要、发布时间、分类和封面图片
 * 点击卡片跳转到博客详情页
 * 
 * @example
 * <BlogCard :blog="blogData" />
 * 
 * 验证需求: 2.1, 2.2, 2.3
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Blog } from '@/types'
import Card from '@/components/common/Card.vue'

interface Props {
  /** 博客数据对象 */
  blog: Blog
}

const props = defineProps<Props>()
const router = useRouter()

/**
 * 格式化发布时间
 * 将 ISO 8601 格式的日期转换为友好的显示格式
 */
const formattedDate = computed(() => {
  const date = new Date(props.blog.publishedAt)
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return props.blog.publishedAt
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
})

/**
 * 处理卡片点击事件
 * 跳转到博客详情页
 */
const handleClick = () => {
  router.push(`/blogs/${props.blog.id}`)
}

/**
 * 处理键盘事件
 * 支持 Enter 和 Space 键触发点击
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick()
  }
}
</script>

<template>
  <Card
    hover
    padding="p-0"
    class="blog-card cursor-pointer overflow-hidden"
    role="article"
    tabindex="0"
    :aria-label="`博客文章: ${blog.title}`"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- 封面图片区域 -->
    <div
      v-if="blog.coverImage"
      class="blog-card__cover"
    >
      <img
        :src="blog.coverImage"
        :alt="`${blog.title} 封面图片`"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    
    <!-- 内容区域 -->
    <div class="blog-card__content p-4">
      <!-- 分类标签 -->
      <div class="blog-card__category mb-2">
        <span class="tag">
          {{ blog.category || '未分类' }}
        </span>
      </div>
      
      <!-- 博客标题 -->
      <h3 class="blog-card__title text-lg font-semibold mb-2 line-clamp-2">
        {{ blog.title }}
      </h3>
      
      <!-- 博客摘要 -->
      <p class="blog-card__summary text-sm mb-3 line-clamp-3">
        {{ blog.summary }}
      </p>
      
      <!-- 发布时间 -->
      <div class="blog-card__meta flex items-center text-xs">
        <svg
          class="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <time :datetime="blog.publishedAt">
          {{ formattedDate }}
        </time>
      </div>
    </div>
  </Card>
</template>

<style scoped>
/* 博客卡片样式 */
.blog-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 封面图片容器 */
.blog-card__cover {
  width: 100%;
  height: 160px;
  overflow: hidden;
  background-color: var(--color-hover);
}

/* 封面图片悬停效果 */
.blog-card:hover .blog-card__cover img {
  transform: scale(1.05);
  transition: transform 300ms ease-in-out;
}

/* 内容区域 */
.blog-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 标题样式 */
.blog-card__title {
  color: var(--color-text-primary);
}

/* 摘要样式 */
.blog-card__summary {
  color: var(--color-text-secondary);
  flex: 1;
}

/* 元信息样式 */
.blog-card__meta {
  color: var(--color-text-secondary);
  margin-top: auto;
}
</style>
