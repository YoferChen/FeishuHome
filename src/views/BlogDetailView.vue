<script setup lang="ts">
/**
 * BlogDetailView - 博客详情视图组件
 * 
 * 通过 iframe 嵌入飞书文档展示博客完整内容
 * 展示博客标题和元信息，提供返回列表的导航
 * 实现 iframe 加载状态和错误处理
 * 支持明暗主题
 * 
 * @example
 * <BlogDetailView />
 * 
 * @description 验证需求: 3.1-3.5
 */

import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogData } from '@/composables/useBlogData'
import Loading from '@/components/common/Loading.vue'
import type { Blog } from '@/types'

// 路由实例
const route = useRoute()
const router = useRouter()

// 使用博客数据 composable
const { blogs, loading: dataLoading, fetchBlogs, getBlogById } = useBlogData()

// 当前博客数据
const blog = ref<Blog | null>(null)

// iframe 加载状态
const iframeLoading = ref(true)

// iframe 加载错误状态
const iframeError = ref(false)

// iframe 引用
const iframeRef = ref<HTMLIFrameElement | null>(null)

/**
 * 从路由参数获取博客 ID
 */
const blogId = computed(() => {
  return route.params.id as string
})

/**
 * 格式化发布日期
 */
const formattedDate = computed(() => {
  if (!blog.value?.publishedAt) return ''
  
  try {
    const date = new Date(blog.value.publishedAt)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return blog.value.publishedAt
  }
})

/**
 * 处理 iframe 加载完成
 */
const handleIframeLoad = () => {
  iframeLoading.value = false
  iframeError.value = false
}

/**
 * 处理 iframe 加载错误
 */
const handleIframeError = () => {
  iframeLoading.value = false
  iframeError.value = true
}

/**
 * 重试加载 iframe
 */
const handleRetry = () => {
  if (iframeRef.value && blog.value?.feishuDocUrl) {
    iframeLoading.value = true
    iframeError.value = false
    // 重新设置 src 触发重新加载
    iframeRef.value.src = blog.value.feishuDocUrl
  }
}

/**
 * 加载博客数据
 */
const loadBlog = async () => {
  // 如果博客列表为空，先获取数据
  if (blogs.value.length === 0) {
    await fetchBlogs()
  }
  
  // 根据 ID 获取博客
  const foundBlog = getBlogById(blogId.value)
  
  if (foundBlog) {
    blog.value = foundBlog
    // 重置 iframe 状态
    iframeLoading.value = true
    iframeError.value = false
  } else {
    // 博客不存在，重定向到 404 页面
    router.replace({ name: 'NotFound' })
  }
}

// 监听路由参数变化
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      loadBlog()
    }
  }
)

// 组件挂载时加载博客数据
onMounted(() => {
  loadBlog()
})
</script>

<template>
  <div class="blog-detail-view">
    <div class="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      <!-- 数据加载状态 -->
      <div 
        v-if="dataLoading && !blog" 
        class="flex justify-center py-16"
      >
        <Loading text="正在加载博客..." size="lg" />
      </div>

      <!-- 博客内容 -->
      <template v-else-if="blog">
        <!-- 页面头部 -->
        <header class="mb-6">
          <!-- 返回博客列表链接 -->
          <router-link 
            to="/blogs" 
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
            <span>返回博客列表</span>
          </router-link>
          
          <!-- 博客标题 -->
          <h1 class="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            {{ blog.title }}
          </h1>
          
          <!-- 博客元信息 -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
            <!-- 分类标签 -->
            <span 
              v-if="blog.category" 
              class="tag"
            >
              {{ blog.category }}
            </span>
            
            <!-- 发布时间 -->
            <span class="flex items-center gap-1">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{{ formattedDate }}</span>
            </span>
          </div>
        </header>

        <!-- iframe 容器 -->
        <div class="iframe-container card">
          <!-- iframe 加载状态 -->
          <div 
            v-if="iframeLoading" 
            class="iframe-loading flex items-center justify-center"
          >
            <Loading text="正在加载文档..." size="lg" />
          </div>

          <!-- iframe 加载错误状态 -->
          <div 
            v-if="iframeError" 
            class="iframe-error flex flex-col items-center justify-center p-8 text-center"
          >
            <svg 
              class="w-16 h-16 mb-4 text-red-500" 
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
              文档加载失败
            </h2>
            <p class="text-sm text-[var(--color-text-secondary)] mb-4 max-w-md">
              无法加载飞书文档，可能是网络问题或文档链接已失效。您可以尝试重新加载或直接访问原文档。
            </p>
            <div class="flex flex-wrap gap-3 justify-center">
              <button 
                type="button"
                class="btn btn-primary"
                @click="handleRetry"
              >
                重新加载
              </button>
              <a 
                :href="blog.feishuDocUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="btn btn-secondary inline-flex items-center gap-2"
              >
                <span>在飞书中打开</span>
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>

          <!-- 飞书文档 iframe -->
          <!-- 验证需求: 3.1 - 通过 iframe 嵌入飞书文档 -->
          <!-- 验证需求: 3.5 - 支持飞书文档原生的点赞和评论功能 -->
          <iframe
            ref="iframeRef"
            :src="blog.feishuDocUrl"
            :class="{ 'iframe-hidden': iframeLoading || iframeError }"
            class="blog-iframe"
            frameborder="0"
            allowfullscreen
            allow="clipboard-write"
            @load="handleIframeLoad"
            @error="handleIframeError"
          />
        </div>

        <!-- 底部导航 -->
        <footer class="mt-6 flex justify-between items-center">
          <router-link 
            to="/blogs" 
            class="link inline-flex items-center gap-2 text-sm"
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
            <span>返回博客列表</span>
          </router-link>
          
          <!-- 在飞书中打开链接 -->
          <a 
            :href="blog.feishuDocUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="link inline-flex items-center gap-2 text-sm"
          >
            <span>在飞书中打开</span>
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </footer>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* 博客详情视图容器 */
.blog-detail-view {
  min-height: calc(100vh - 80px);
  padding-bottom: 2rem;
}

/* iframe 容器 */
.iframe-container {
  position: relative;
  width: 100%;
  min-height: 600px;
  overflow: hidden;
}

/* 响应式 iframe 高度 */
@media (min-width: 640px) {
  .iframe-container {
    min-height: 700px;
  }
}

@media (min-width: 1024px) {
  .iframe-container {
    min-height: 800px;
  }
}

/* 博客 iframe 样式 */
.blog-iframe {
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: none;
}

@media (min-width: 640px) {
  .blog-iframe {
    min-height: 700px;
  }
}

@media (min-width: 1024px) {
  .blog-iframe {
    min-height: 800px;
  }
}

/* iframe 隐藏状态（加载中或错误时） */
.iframe-hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* iframe 加载状态容器 */
.iframe-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-surface);
  z-index: 10;
}

/* iframe 错误状态容器 */
.iframe-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-surface);
  z-index: 10;
}
</style>
