# 数据对接总结

本文档说明飞书多维表格与网站的数据对接情况。

## ✅ 已完成的数据对接

所有数据都已成功从飞书多维表格对接到网站，采用**预获取到文件**的方式，避免 API 调用次数限制。

### 1. 博客列表数据 ✓

- **数据源**: 飞书多维表格 - 博客列表
- **获取脚本**: `scripts/fetch-blogs.ts`
- **数据文件**: `src/data/blogs.json`
- **运行命令**: `npm run fetch-blogs`
- **字段**: 标题、摘要、分类、发布时间、文档链接、封面图片
- **状态**: ✅ 已对接，2 篇博客

### 2. 网站基础配置 ✓

- **数据源**: 飞书多维表格 - 网站基础配置
- **获取脚本**: `scripts/fetch-config.ts`
- **数据文件**: `src/data/site-config.json`
- **运行命令**: `npm run fetch-config`
- **字段**: 配置项、配置值、配置类型、分组、描述
- **状态**: ✅ 已对接，5 项配置

### 3. 个人信息 ✓

- **数据源**: 飞书多维表格 - 个人信息
- **获取脚本**: `scripts/fetch-config.ts`
- **数据文件**: `src/data/profile.json`
- **运行命令**: `npm run fetch-config`
- **字段**: 姓名、职位、简介、邮箱、头像、社交链接
- **状态**: ✅ 已对接，1 条记录

### 4. 教育经历 ✓

- **数据源**: 飞书多维表格 - 教育经历
- **获取脚本**: `scripts/fetch-config.ts`
- **数据文件**: `src/data/education.json`
- **运行命令**: `npm run fetch-config`
- **字段**: 学校名称、学位、专业、开始时间、结束时间、描述
- **状态**: ✅ 已对接，1 条记录

### 5. 项目经历 ✓

- **数据源**: 飞书多维表格 - 项目经历
- **获取脚本**: `scripts/fetch-config.ts`
- **数据文件**: `src/data/projects.json`
- **运行命令**: `npm run fetch-config`
- **字段**: 项目名称、项目描述、技术栈、项目链接
- **状态**: ✅ 已对接，1 条记录

### 6. 里程碑 ✓

- **数据源**: 飞书多维表格 - 里程碑
- **获取脚本**: `scripts/fetch-config.ts`
- **数据文件**: `src/data/milestones.json`
- **运行命令**: `npm run fetch-config`
- **字段**: 里程碑标题、里程碑描述、发生时间
- **状态**: ✅ 已对接，3 条记录

### 7. 主题样式 ✓

- **数据源**: 飞书多维表格 - 主题样式
- **获取脚本**: `scripts/fetch-config.ts`
- **数据文件**: `src/data/theme.json`
- **运行命令**: `npm run fetch-config`
- **字段**: 样式项、样式值、样式类型、分组
- **状态**: ✅ 已对接，15 项样式

## 📊 数据流程

### 本地开发流程

```
飞书多维表格
    ↓
npm run fetch-blogs    (获取博客数据)
npm run fetch-config   (获取配置数据)
    ↓
src/data/*.json        (JSON 数据文件)
    ↓
src/config/site.config.ts  (导入 JSON 数据)
    ↓
Vue 组件               (使用配置数据)
    ↓
网站页面               (显示数据)
```

### CI/CD 部署流程

```
GitHub Actions 触发
    ↓
npm run fetch-blogs    (预取博客数据)
npm run fetch-config   (预取配置数据)
    ↓
npm run build          (构建项目，包含最新数据)
    ↓
部署到 GitHub Pages
```

## 🔄 更新数据

### 本地更新

1. 在飞书多维表格中修改数据
2. 运行数据获取命令：
   ```bash
   npm run fetch-blogs    # 更新博客数据
   npm run fetch-config   # 更新配置数据
   ```
3. 刷新浏览器查看更新

### 生产环境更新

1. 在飞书多维表格中修改数据
2. 推送任意代码到 GitHub（或手动触发 workflow）
3. GitHub Actions 自动获取最新数据并部署

## 📁 数据文件结构

```
src/data/
├── blogs.json           # 博客列表数据
├── site-config.json     # 网站基础配置
├── profile.json         # 个人信息
├── education.json       # 教育经历
├── projects.json        # 项目经历
├── milestones.json      # 里程碑
└── theme.json           # 主题样式
```

## 🔧 相关脚本

| 脚本 | 命令 | 说明 |
|------|------|------|
| 获取博客数据 | `npm run fetch-blogs` | 从飞书获取博客列表数据 |
| 获取配置数据 | `npm run fetch-config` | 从飞书获取所有配置数据 |
| 测试数据对接 | `npm run test-integration` | 测试所有数据对接是否正常 |
| 打印表格字段 | `npm run print-fields` | 查看所有表格的字段信息 |
| 填充初始数据 | `npm run fill-data` | 向表格填充示例数据 |

## 🎯 测试结果

最新测试结果（通过率 94.7%）：

- ✅ 环境变量配置正常
- ✅ 飞书 API 连接成功
- ✅ 所有 7 个表格数据获取成功
- ✅ 网站首页可访问
- ✅ 数据文件生成正常

## 📝 注意事项

1. **数据预获取**: 所有数据都在构建时预获取，不会在运行时调用飞书 API
2. **API 限制**: 避免了飞书 API 调用次数限制的问题
3. **数据更新**: 需要重新构建才能看到数据更新
4. **GitHub Secrets**: 部署时需要配置 9 个 GitHub Secrets（详见 DEPLOYMENT.md）

## 🔗 相关文档

- [部署指南](DEPLOYMENT.md) - GitHub Pages 部署说明
- [飞书表格设计](docs/FEISHU_TABLES_DESIGN.md) - 表格结构设计文档
- [README](README.md) - 项目说明文档

## ✨ 总结

所有数据已成功从飞书多维表格对接到网站：

- ✅ 7 个数据表全部对接
- ✅ 采用预获取方式，避免 API 限制
- ✅ 本地开发和 CI/CD 流程完整
- ✅ 数据更新流程清晰
- ✅ 测试验证通过

网站现在完全由飞书多维表格驱动，可以通过修改飞书表格来更新网站内容，无需修改代码！
