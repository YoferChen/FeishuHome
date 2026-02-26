<script setup lang="ts">
/**
 * ThemeToggle 组件 - 主题切换按钮
 * 
 * 提供明暗主题切换功能，显示当前主题对应的图标（太阳/月亮）
 * 支持平滑的图标切换动画和无障碍属性
 * 
 * @example
 * <ThemeToggle />
 * <ThemeToggle showLabel />
 * 
 * 验证需求: 8.3, 8.6
 */

import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

interface Props {
  /** 是否显示文字标签，默认 false */
  showLabel?: boolean
}

withDefaults(defineProps<Props>(), {
  showLabel: false
})

// 使用主题 composable
const { theme, toggleTheme } = useTheme()

// 计算当前是否为暗黑主题
const isDark = computed(() => theme.value === 'dark')

// 计算无障碍标签
const ariaLabel = computed(() => 
  isDark.value ? '切换到明亮主题' : '切换到暗黑主题'
)

// 计算显示的文字标签
const labelText = computed(() => 
  isDark.value ? '暗黑模式' : '明亮模式'
)
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :class="{ 'with-label': showLabel }"
    :aria-label="ariaLabel"
    :title="ariaLabel"
    @click="toggleTheme"
  >
    <!-- 图标容器 - 用于实现切换动画 -->
    <span class="icon-container" aria-hidden="true">
      <!-- 太阳图标 - 明亮主题时显示 -->
      <svg
        class="icon sun-icon"
        :class="{ 'icon-active': !isDark, 'icon-hidden': isDark }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      
      <!-- 月亮图标 - 暗黑主题时显示 -->
      <svg
        class="icon moon-icon"
        :class="{ 'icon-active': isDark, 'icon-hidden': !isDark }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </span>
    
    <!-- 文字标签 -->
    <span v-if="showLabel" class="label-text">
      {{ labelText }}
    </span>
  </button>
</template>

<style scoped>
/* 主题切换按钮样式 */
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

.theme-toggle:hover {
  background-color: var(--color-hover);
}

.theme-toggle:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.theme-toggle:active {
  transform: scale(0.95);
}

/* 带标签时的样式 */
.theme-toggle.with-label {
  padding: 0.5rem 0.75rem;
}

/* 图标容器 */
.icon-container {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
}

/* 图标基础样式 */
.icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 300ms ease-in-out;
}

/* 图标激活状态 - 显示 */
.icon-active {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

/* 图标隐藏状态 */
.icon-hidden {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

/* 太阳图标特殊动画 */
.sun-icon.icon-active {
  transform: rotate(0deg) scale(1);
}

.sun-icon.icon-hidden {
  transform: rotate(-90deg) scale(0.5);
}

/* 月亮图标特殊动画 */
.moon-icon.icon-active {
  transform: rotate(0deg) scale(1);
}

.moon-icon.icon-hidden {
  transform: rotate(90deg) scale(0.5);
}

/* 文字标签样式 */
.label-text {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>
