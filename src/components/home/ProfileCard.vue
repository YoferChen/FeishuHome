<script setup lang="ts">
/**
 * ProfileCard 组件 - 个人信息卡片
 * 
 * 展示博主的个人信息，包括头像、昵称、简介、邮箱和社交媒体链接
 * 使用 Card 组件作为容器，支持明暗主题
 * 
 * @example
 * <ProfileCard />
 * 
 * @description 验证需求: 1.2, 6.1, 6.7
 */

import Card from '@/components/common/Card.vue'
import { siteConfig } from '@/config/site.config'

// 从配置中获取个人信息
const { profile } = siteConfig

/**
 * 获取社交平台图标
 * 根据平台名称返回对应的 SVG 图标
 * 
 * @param platform - 平台名称
 * @returns SVG 图标路径或默认图标
 */
const getSocialIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    github: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
    juejin: 'M12 2L1 7l11 5 11-5-11-5zM1 12l11 5 11-5M1 17l11 5 11-5',
    zhihu: 'M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.751 2.252 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.75 0 18.281 0zm1.964 4.078c-.271.73-.5 1.434-.68 2.11h4.587c.545-.006.445 1.168.445 1.171H9.384a58.104 58.104 0 01-.112 3.797h2.712c.388.023.393 1.251.393 1.251H9.183c-.039 1.903-.269 3.308-.269 3.308l-.008.053h1.657c.545 0 .64 1.027.64 1.027H5.565c-.545 0-.64-1.027-.64-1.027h2.712s.269-1.405.269-3.308H5.194c-.388-.023-.393-1.251-.393-1.251h2.712c.039-1.903.112-3.797.112-3.797H5.194c-.545.006-.445-1.168-.445-1.171h2.712c.18-.676.409-1.38.68-2.11h-2.456zm7.911 0c-.271.73-.5 1.434-.68 2.11h4.587c.545-.006.445 1.168.445 1.171h-2.712a58.104 58.104 0 01-.112 3.797h2.712c.388.023.393 1.251.393 1.251h-2.712c-.039 1.903-.269 3.308-.269 3.308l-.008.053h1.657c.545 0 .64 1.027.64 1.027h-4.587c-.545 0-.64-1.027-.64-1.027h2.712s.269-1.405.269-3.308h-2.712c-.388-.023-.393-1.251-.393-1.251h2.712c.039-1.903.112-3.797.112-3.797h-2.712c-.545.006-.445-1.168-.445-1.171h2.712c.18-.676.409-1.38.68-2.11h-2.456z',
    twitter: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
    linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    weibo: 'M9.82 18.932c-3.267.39-6.087-1.158-6.297-3.457-.21-2.299 2.268-4.46 5.535-4.85 3.267-.39 6.087 1.158 6.297 3.457.21 2.299-2.268 4.46-5.535 4.85zm10.18-9.932c-.5 0-.91.41-.91.91s.41.91.91.91.91-.41.91-.91-.41-.91-.91-.91zm-1.82 0c-.5 0-.91.41-.91.91s.41.91.91.91.91-.41.91-.91-.41-.91-.91-.91z'
  }
  
  const key = platform.toLowerCase()
  return icons[key] || icons.github // 默认使用 GitHub 图标
}

/**
 * 检查是否有社交链接
 */
const hasSocialLinks = profile.socialLinks && profile.socialLinks.length > 0
</script>

<template>
  <Card class="profile-card">
    <!-- 头像区域 -->
    <div class="flex flex-col items-center">
      <!-- 圆形头像 -->
      <div class="avatar-container mb-4">
        <img
          :src="profile.avatar"
          :alt="`${profile.nickname}的头像`"
          class="avatar"
          loading="lazy"
        />
      </div>
      
      <!-- 昵称 -->
      <h2 class="nickname text-xl font-bold mb-2">
        {{ profile.nickname }}
      </h2>
      
      <!-- 个人简介 -->
      <p class="bio text-sm text-center mb-4 line-clamp-3">
        {{ profile.bio }}
      </p>
      
      <!-- 邮箱（如果配置了） -->
      <a
        v-if="profile.email"
        :href="`mailto:${profile.email}`"
        class="email flex items-center gap-2 text-sm mb-4 hover:underline"
      >
        <!-- 邮箱图标 -->
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <span>{{ profile.email }}</span>
      </a>
      
      <!-- 社交媒体链接 -->
      <div
        v-if="hasSocialLinks"
        class="social-links flex flex-wrap justify-center gap-3"
      >
        <a
          v-for="link in profile.socialLinks"
          :key="link.platform"
          :href="link.url"
          :title="link.platform"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path :d="getSocialIcon(link.icon || link.platform)" />
          </svg>
        </a>
      </div>
    </div>
  </Card>
</template>

<style scoped>
/* 个人信息卡片样式 */
.profile-card {
  text-align: center;
}

/* 头像容器 */
.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--color-primary);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* 头像图片 */
.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms ease-in-out;
}

.avatar-container:hover .avatar {
  transform: scale(1.1);
}

/* 昵称样式 */
.nickname {
  color: var(--color-text-primary);
}

/* 简介样式 */
.bio {
  color: var(--color-text-secondary);
  max-width: 280px;
}

/* 邮箱链接样式 */
.email {
  color: var(--color-primary);
}

/* 社交链接样式 */
.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-hover);
  color: var(--color-text-secondary);
  transition: all 200ms ease-in-out;
}

.social-link:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}
</style>
