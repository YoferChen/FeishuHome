<script setup lang="ts">
/**
 * Card 组件 - 基础卡片容器
 * 
 * 提供统一的卡片样式，支持明暗主题和可选的悬停效果
 * 
 * @example
 * <Card>默认卡片内容</Card>
 * <Card hover>带悬停效果的卡片</Card>
 * <Card padding="p-4">自定义 padding 的卡片</Card>
 */

interface Props {
  /** 是否启用悬停效果，默认 false */
  hover?: boolean
  /** 自定义 padding 类名，默认 'p-6' */
  padding?: string
}

withDefaults(defineProps<Props>(), {
  hover: false,
  padding: 'p-6'
})
</script>

<template>
  <div
    class="card"
    :class="[
      padding,
      { 'card-hover': hover }
    ]"
  >
    <!-- 默认插槽，用于放置卡片内容 -->
    <slot />
  </div>
</template>

<style scoped>
/* 
 * 卡片样式使用全局 CSS 变量，支持明暗主题自动切换
 * 基础样式定义在 src/assets/styles/main.css 中的 .card 和 .card-hover 类
 */
</style>
