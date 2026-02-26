<script setup lang="ts">
/**
 * NotFoundView - 404 页面视图组件
 * 
 * 当访问不存在的路由时显示
 * 提供友好的错误提示和导航链接
 * 支持明暗主题
 * 
 * @example
 * <NotFoundView />
 * 
 * @description 验证需求: 错误处理
 */
</script>

<template>
  <div class="not-found-view">
    <div class="max-w-2xl mx-auto px-4 py-16 text-center">
      
      <!-- 404 图标 -->
      <div class="mb-8">
        <svg 
          class="w-32 h-32 mx-auto text-[var(--color-text-secondary)] opacity-50"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="1.5" 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <!-- 404 错误码 -->
      <h1 class="text-7xl sm:text-8xl font-bold mb-4 text-gradient">
        404
      </h1>
      
      <!-- 错误标题 -->
      <h2 class="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] mb-3">
        页面未找到
      </h2>
      
      <!-- 友好的错误说明 -->
      <p class="text-base text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
        抱歉，您访问的页面不存在或已被移除。请检查网址是否正确，或返回其他页面继续浏览。
      </p>
      
      <!-- 导航链接按钮组 -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <!-- 返回首页按钮 -->
        <router-link 
          to="/" 
          class="btn btn-primary inline-flex items-center gap-2 min-w-[140px] justify-center"
        >
          <svg 
            class="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>返回首页</span>
        </router-link>
        
        <!-- 返回博客列表按钮 -->
        <router-link 
          to="/blogs" 
          class="btn btn-secondary inline-flex items-center gap-2 min-w-[140px] justify-center"
        >
          <svg 
            class="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <span>浏览博客</span>
        </router-link>
      </div>

      <!-- 额外提示 -->
      <p class="mt-8 text-sm text-[var(--color-text-tertiary)]">
        如果您认为这是一个错误，请联系网站管理员。
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 404 页面视图容器 */
.not-found-view {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .not-found-view {
    padding: 2rem 0;
    align-items: flex-start;
    padding-top: 4rem;
  }
}

/* 404 图标动画 */
.not-found-view svg {
  transition: transform 0.3s ease;
}

.not-found-view:hover svg {
  transform: scale(1.05);
}
</style>
