<script setup lang="ts">
/**
 * 飞书博客主页根组件
 * 
 * 包含全局布局、导航栏和主题切换功能
 */
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

// 主题状态
const isDark = ref(false)

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// 初始化主题
onMounted(() => {
  // 检查本地存储的主题偏好
  const savedTheme = localStorage.getItem('theme')
  // 检查系统主题偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>

<template>
  <div class="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
    <!-- 顶部导航栏 -->
    <header class="glass sticky top-0 z-50 border-b border-[var(--color-border)]">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <!-- 网站标题/Logo -->
        <RouterLink to="/" class="text-xl font-bold text-gradient hover:opacity-80 transition-opacity">
          飞书博客主页
        </RouterLink>
        
        <!-- 导航菜单 -->
        <nav class="flex items-center gap-6">
          <RouterLink 
            to="/" 
            class="link hidden sm:inline"
            active-class="text-[var(--color-primary)]"
          >
            首页
          </RouterLink>
          <RouterLink 
            to="/blogs" 
            class="link hidden sm:inline"
            active-class="text-[var(--color-primary)]"
          >
            博客
          </RouterLink>
          
          <!-- 主题切换按钮 -->
          <button 
            @click="toggleTheme"
            class="btn-secondary flex items-center gap-2"
            :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
          >
            <span v-if="isDark">🌙</span>
            <span v-else>☀️</span>
            <span class="hidden sm:inline">{{ isDark ? '暗色' : '亮色' }}</span>
          </button>
        </nav>
      </div>
    </header>

    <!-- 主内容区域 - 路由视图 -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* 组件特定样式（如有需要） */
</style>
