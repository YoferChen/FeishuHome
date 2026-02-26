/**
 * Vue Router 路由配置
 * 
 * 配置网站的路由结构，支持 HTML5 History 模式
 */
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/blogs',
    name: 'BlogList',
    component: () => import('@/views/BlogListView.vue'),
    meta: {
      title: '博客列表'
    }
  },
  {
    path: '/blogs/:id',
    name: 'BlogDetail',
    component: () => import('@/views/BlogDetailView.vue'),
    meta: {
      title: '博客详情'
    }
  },
  {
    // 404 路由 - 匹配所有未定义的路径
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 History 模式
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 滚动行为配置
  scrollBehavior(_to, _from, savedPosition) {
    // 如果有保存的位置（浏览器前进/后退），恢复到该位置
    if (savedPosition) {
      return savedPosition
    }
    // 否则滚动到页面顶部
    return { top: 0 }
  }
})

// 路由守卫 - 更新页面标题
router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} - 飞书博客主页`
  }
  next()
})

export default router
