import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局样式（包含 TailwindCSS）
import './assets/styles/main.css'

// 创建 Vue 应用实例
const app = createApp(App)

// 注册路由
app.use(router)

// 挂载应用
app.mount('#app')
