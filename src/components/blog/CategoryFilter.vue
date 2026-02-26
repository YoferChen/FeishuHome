<script setup lang="ts">
/**
 * CategoryFilter 组件 - 分类筛选器
 * 
 * 展示分类标签列表，支持分类选择和文章数量显示
 * 
 * @example
 * <CategoryFilter 
 *   :categories="categories" 
 *   :selected-category="selectedCategory"
 *   @select="handleCategorySelect"
 * />
 * 
 * 验证需求: 7.3, 7.4, 7.5
 */
import { computed } from 'vue'
import type { Category } from '@/types'

interface Props {
  /** 分类列表 */
  categories: Category[]
  /** 当前选中的分类名称，null 表示全部 */
  selectedCategory: string | null
}

interface Emits {
  /** 分类选择事件 */
  (e: 'select', category: string | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * 计算所有文章的总数量
 */
const totalCount = computed(() => {
  return props.categories.reduce((sum, cat) => sum + cat.count, 0)
})

/**
 * 判断分类是否被选中
 */
const isSelected = (categoryName: string | null): boolean => {
  return props.selectedCategory === categoryName
}

/**
 * 处理分类点击事件
 */
const handleSelect = (categoryName: string | null) => {
  emit('select', categoryName)
}

/**
 * 处理键盘事件
 * 支持 Enter 和 Space 键触发选择
 */
const handleKeydown = (event: KeyboardEvent, categoryName: string | null) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleSelect(categoryName)
  }
}
</script>

<template>
  <div 
    class="category-filter"
    role="navigation"
    aria-label="博客分类筛选"
  >
    <div class="category-filter__list">
      <!-- 全部选项 -->
      <button
        type="button"
        class="category-filter__item"
        :class="{ 'category-filter__item--active': isSelected(null) }"
        :aria-pressed="isSelected(null)"
        @click="handleSelect(null)"
        @keydown="(e) => handleKeydown(e, null)"
      >
        <span class="category-filter__name">全部</span>
        <span class="category-filter__count">{{ totalCount }}</span>
      </button>
      
      <!-- 分类列表 -->
      <button
        v-for="category in categories"
        :key="category.name"
        type="button"
        class="category-filter__item"
        :class="{ 'category-filter__item--active': isSelected(category.name) }"
        :aria-pressed="isSelected(category.name)"
        @click="handleSelect(category.name)"
        @keydown="(e) => handleKeydown(e, category.name)"
      >
        <span class="category-filter__name">{{ category.name }}</span>
        <span class="category-filter__count">{{ category.count }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 分类筛选器容器 */
.category-filter {
  width: 100%;
}

/* 分类列表 - 使用 flex 布局支持换行 */
.category-filter__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* 分类项基础样式 */
.category-filter__item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  transition: all var(--transition-duration) ease-in-out;
}

/* 分类项悬停效果 */
.category-filter__item:hover {
  background-color: var(--color-hover);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

/* 分类项聚焦效果 */
.category-filter__item:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-primary);
}

/* 选中状态样式 */
.category-filter__item--active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.category-filter__item--active:hover {
  background-color: var(--color-primary);
  color: white;
  opacity: 0.9;
}

/* 分类名称 */
.category-filter__name {
  white-space: nowrap;
}

/* 文章数量标签 */
.category-filter__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: rgb(0 0 0 / 0.1);
}

/* 选中状态下的数量标签 */
.category-filter__item--active .category-filter__count {
  background-color: rgb(255 255 255 / 0.2);
}
</style>
