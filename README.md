# 飞书博客主页

一个基于 Vue 3 + TypeScript + Vite 的现代化个人博客主页，集成飞书多维表格作为内容管理系统。

## ✨ 特性

- 🚀 **现代化技术栈**: Vue 3 + TypeScript + Vite + TailwindCSS
- 📝 **飞书集成**: 使用飞书多维表格管理博客内容
- 🎨 **主题切换**: 支持明暗主题，自动跟随系统偏好
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🔍 **分类筛选**: 支持按分类浏览博客文章
- 📊 **多视图模式**: 卡片视图和时间线视图自由切换
- ⚡ **自动部署**: GitHub Actions 自动构建和部署
- 🧪 **完整测试**: 167 个单元测试，确保代码质量

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | ^3.4.21 | 渐进式 JavaScript 框架 |
| TypeScript | ^5.4.2 | JavaScript 的超集，提供类型安全 |
| Vite | ^5.1.6 | 下一代前端构建工具 |
| Vue Router | ^4.6.4 | Vue.js 官方路由管理器 |
| TailwindCSS | ^4.2.1 | 实用优先的 CSS 框架 |
| Vitest | ^4.0.18 | 基于 Vite 的单元测试框架 |

### 项目结构

```
feishu-blog-homepage/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Actions 部署配置
│       └── README.md           # Actions 配置说明
├── scripts/
│   ├── fetch-blogs.ts          # 飞书数据预取脚本
│   ├── fetch-blogs.test.ts     # 脚本测试
│   └── README.md               # 脚本使用说明
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css        # 全局样式和主题变量
│   ├── components/
│   │   ├── blog/               # 博客相关组件
│   │   │   ├── BlogCard.vue
│   │   │   ├── CategoryFilter.vue
│   │   │   └── Timeline.vue
│   │   ├── common/             # 通用组件
│   │   │   ├── Card.vue
│   │   │   ├── Loading.vue
│   │   │   └── ThemeToggle.vue
│   │   └── home/               # 主页组件
│   │       ├── ProfileCard.vue
│   │       ├── EducationCard.vue
│   │       ├── ProjectCard.vue
│   │       └── MilestoneCard.vue
│   ├── composables/            # 组合式函数
│   │   ├── useBlogData.ts      # 博客数据管理
│   │   └── useTheme.ts         # 主题管理
│   ├── config/
│   │   └── site.config.ts      # 网站配置
│   ├── data/
│   │   └── blogs.json          # 博客数据（自动生成）
│   ├── router/
│   │   └── index.ts            # 路由配置
│   ├── types/
│   │   └── index.ts            # TypeScript 类型定义
│   ├── utils/
│   │   └── validateConfig.ts  # 配置验证工具
│   ├── views/                  # 页面视图
│   │   ├── HomeView.vue        # 首页
│   │   ├── BlogListView.vue    # 博客列表
│   │   ├── BlogDetailView.vue  # 博客详情
│   │   └── NotFoundView.vue    # 404 页面
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 应用入口
├── .env.example                # 环境变量示例
├── .gitignore                  # Git 忽略配置
├── DEPLOYMENT.md               # 部署指南
├── package.json                # 项目依赖配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
├── vitest.config.ts            # Vitest 配置
└── README.md                   # 项目说明文档

```

### 核心功能模块

#### 1. 博客数据管理 (`useBlogData`)
- 从飞书多维表格获取博客数据
- 支持静态数据回退
- 分类自动聚合
- 按分类筛选
- 按时间排序

#### 2. 主题管理 (`useTheme`)
- 明暗主题切换
- 自动跟随系统偏好
- localStorage 持久化
- 平滑过渡动画

#### 3. 路由管理
- 首页：个人信息展示
- 博客列表：支持多视图和筛选
- 博客详情：iframe 嵌入飞书文档
- 404 页面：友好的错误提示

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- npm >= 9
- 飞书开放平台账号（用于内容管理）

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/你的用户名/feishu-blog-homepage.git
   cd feishu-blog-homepage
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   ```
   
   编辑 `.env` 文件，填入你的飞书应用配置：
   ```env
   FEISHU_APP_ID=cli_xxxxxxxxxxxxxxxx
   FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   FEISHU_TABLE_ID=bascnxxxxxxxxxxxxxx/tblxxxxxxxxxxxxxx
   ```

4. **获取博客数据**
   ```bash
   npm run fetch-blogs
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   访问 http://localhost:3000 查看网站

### 可用命令

```bash
# 开发
npm run dev              # 启动开发服务器

# 构建
npm run build            # 构建生产版本
npm run build:prod       # 获取最新数据并构建
npm run preview          # 预览构建结果

# 测试
npm run test             # 运行所有测试
npm run test:watch       # 监听模式运行测试
npm run test:coverage    # 生成测试覆盖率报告

# 数据管理
npm run fetch-blogs      # 从飞书获取最新博客数据
```

## 📝 内容管理

### 飞书多维表格配置

1. **创建飞书应用**
   - 访问 [飞书开放平台](https://open.feishu.cn/)
   - 创建企业自建应用
   - 获取 App ID 和 App Secret
   - 添加权限：`bitable:app` 和 `bitable:app:readonly`

2. **创建多维表格**
   
   在飞书中创建多维表格，包含以下字段：

   | 字段名 | 类型 | 必填 | 说明 |
   |--------|------|------|------|
   | 标题 | 文本 | ✅ | 博客标题 |
   | 摘要 | 文本 | ❌ | 博客摘要 |
   | 分类 | 单选 | ❌ | 博客分类 |
   | 发布时间 | 日期 | ❌ | 发布时间 |
   | 文档链接 | 超链接 | ✅ | 飞书文档链接 |
   | 封面图片 | 超链接 | ❌ | 封面图片链接 |

3. **获取表格 ID**
   
   从多维表格 URL 中提取：
   ```
   https://xxx.feishu.cn/base/bascnxxxxxxxxxxxxxx?table=tblxxxxxxxxxxxxxx
   ```
   
   组合格式：`bascnxxxxxxxxxxxxxx/tblxxxxxxxxxxxxxx`

4. **更新博客内容**
   
   - 在飞书多维表格中添加或修改记录
   - 运行 `npm run fetch-blogs` 获取最新数据
   - 或推送代码到 GitHub，自动触发更新

详细说明请参考 [scripts/README.md](scripts/README.md)

## 🌐 部署

### 部署到 GitHub Pages

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

2. **配置 GitHub Secrets**
   
   在仓库 Settings > Secrets and variables > Actions 中添加：
   - `FEISHU_APP_ID`
   - `FEISHU_APP_SECRET`
   - `FEISHU_TABLE_ID`

3. **启用 GitHub Pages**
   
   在仓库 Settings > Pages 中：
   - Source 选择 "GitHub Actions"

4. **自动部署**
   
   每次推送到 `main` 分支，GitHub Actions 会自动：
   - 运行测试
   - 从飞书获取最新数据
   - 构建项目
   - 部署到 GitHub Pages

详细说明请参考 [DEPLOYMENT.md](DEPLOYMENT.md)

### 其他部署平台

项目支持部署到任何静态网站托管平台：

- **Vercel**: 导入 GitHub 仓库即可
- **Netlify**: 连接 GitHub 仓库，构建命令 `npm run build`
- **Cloudflare Pages**: 连接 GitHub，构建命令 `npm run build`

## 🎨 自定义配置

### 网站配置

编辑 `src/config/site.config.ts` 修改网站信息：

```typescript
export const siteConfig: SiteConfig = {
  // 网站基本信息
  title: '你的名字',
  description: '你的简介',
  
  // 个人信息
  profile: {
    name: '你的名字',
    avatar: '头像链接',
    bio: '个人简介',
    // ...
  },
  
  // 社交媒体链接
  social: {
    github: 'https://github.com/你的用户名',
    // ...
  }
}
```

### 主题样式

编辑 `src/assets/styles/main.css` 修改主题颜色：

```css
:root {
  --color-primary: #3b82f6;      /* 主色调 */
  --color-background: #ffffff;    /* 背景色 */
  --color-text-primary: #1f2937; /* 主文本色 */
  /* ... */
}
```

### 路由配置

编辑 `src/router/index.ts` 添加或修改路由。

## 🧪 测试

项目包含完整的单元测试：

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

测试覆盖：
- ✅ 组件测试（60 tests）
- ✅ Composables 测试（51 tests）
- ✅ 工具函数测试（38 tests）
- ✅ 数据预取脚本测试（12 tests）
- ✅ 路由测试

## 📚 文档

- [部署指南](DEPLOYMENT.md) - 详细的部署步骤和故障排查
- [GitHub Actions 配置](.github/workflows/README.md) - CI/CD 配置说明
- [数据预取脚本](scripts/README.md) - 飞书 API 使用说明

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TailwindCSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [飞书开放平台](https://open.feishu.cn/) - 提供内容管理能力

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- GitHub Issues: [提交 Issue](https://github.com/你的用户名/feishu-blog-homepage/issues)
- Email: your.email@example.com

---

⭐ 如果这个项目对你有帮助，欢迎给个 Star！
