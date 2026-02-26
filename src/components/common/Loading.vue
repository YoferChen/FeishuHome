<script setup lang="ts">
/**
 * Loading 组件 - 加载状态指示器
 * 
 * 显示旋转的加载动画和可选的提示文字，支持明暗主题
 * 
 * @example
 * <Loading />
 * <Loading text="正在加载博客..." />
 * <Loading size="lg" text="请稍候" />
 */

interface Props {
  /** 加载提示文字，默认 '加载中...' */
  text?: string
  /** 加载图标大小，默认 'md' */
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
  size: 'md'
})

/** 根据 size 属性返回对应的尺寸类名 */
const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
}

/** 根据 size 属性返回对应的文字大小类名 */
const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
}
</script>

<template>
  <div class="loading-container flex flex-col items-center justify-center gap-3">
    <!-- 旋转加载图标 -->
    <div
      class="loading-spinner rounded-full border-2 border-solid animate-spin"
      :class="sizeClasses[size]"
      role="status"
      aria-label="加载中"
    />
    
    <!-- 加载提示文字 -->
    <span
      v-if="text"
      class="loading-text"
      :class="textSizeClasses[size]"
    >
      {{ text }}
    </span>
  </div>
</template>

<style scoped>
/* 加载动画容器 */
.loading-container {
  padding: 1rem;
}

/* 旋转加载图标样式 */
.loading-spinner {
  /* 使用主题色作为边框颜色 */
  border-color: var(--color-border);
  /* 顶部边框使用主色调，形成旋转效果 */
  border-top-color: var(--color-primary);
}

/* 加载提示文字样式 */
.loading-text {
  color: var(--color-text-secondary);
}
</style>
