<script setup lang="ts">
/**
 * 飞书博客主页根组件
 * 
 * 包含全局布局、导航栏和主题切换功能
 */
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { siteConfig } from '@/config/site.config'

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
          
          <!-- GitHub 按钮 -->
          <a 
            :href="siteConfig.githubRepo"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary flex items-center gap-2"
            aria-label="访问 GitHub 仓库"
            title="访问 GitHub 仓库"
          >
            <svg 
              class="w-5 h-5" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span class="hidden sm:inline">GitHub</span>
          </a>
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
