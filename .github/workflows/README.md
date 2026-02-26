# GitHub Actions 部署配置说明

本目录包含用于自动部署到 GitHub Pages 的 GitHub Actions 工作流配置。

## 配置步骤

### 1. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** (设置)
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** (来源) 下拉菜单中选择 **GitHub Actions**

### 2. 配置基础路径

工作流会自动检测你的仓库类型并设置正确的基础路径：

- **用户/组织站点** (如 `username.github.io`): 基础路径为 `/`
- **项目站点** (如 `username.github.io/repo-name`): 基础路径为 `/repo-name/`

如果需要自定义基础路径，可以修改 `deploy.yml` 中的 `BASE_PATH` 环境变量。

### 3. 配置飞书 API（可选）

如果你想在构建时自动从飞书多维表格获取最新博客数据，需要：

#### 3.1 获取飞书应用凭证

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 获取 **App ID** 和 **App Secret**
4. 为应用添加以下权限：
   - `bitable:app` - 查看、评论、编辑和管理多维表格
   - `bitable:app:readonly` - 查看多维表格（只读）

#### 3.2 配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 **Settings** > **Secrets and variables** > **Actions**
3. 点击 **New repository secret** 添加以下密钥：
   - `FEISHU_APP_ID`: 你的飞书应用 App ID
   - `FEISHU_APP_SECRET`: 你的飞书应用 App Secret

#### 3.3 启用数据预取步骤

在 `deploy.yml` 文件中，取消注释以下部分：

```yaml
# 5. 预取博客数据（可选）
- name: 预取博客数据
  run: npm run fetch-blogs
  env:
    FEISHU_APP_ID: ${{ secrets.FEISHU_APP_ID }}
    FEISHU_APP_SECRET: ${{ secrets.FEISHU_APP_SECRET }}
```

### 4. 配置自定义域名（可选）

如果你想使用自定义域名：

1. 在仓库根目录创建 `public/CNAME` 文件
2. 在文件中写入你的域名（如 `blog.example.com`）
3. 在你的域名提供商处配置 DNS 记录：
   - 对于 apex 域名（如 `example.com`），添加 A 记录指向 GitHub Pages IP
   - 对于子域名（如 `blog.example.com`），添加 CNAME 记录指向 `username.github.io`

详细说明请参考 [GitHub Pages 自定义域名文档](https://docs.github.com/cn/pages/configuring-a-custom-domain-for-your-github-pages-site)

## 工作流说明

### 触发条件

工作流会在以下情况下自动触发：

- 推送代码到 `main` 分支
- 手动触发（在 Actions 页面点击 "Run workflow"）

### 构建步骤

1. **检出代码**: 从仓库拉取最新代码
2. **设置 Node.js**: 安装 Node.js 20 环境
3. **安装依赖**: 使用 `npm ci` 安装项目依赖
4. **运行测试**: 执行测试确保代码质量
5. **预取博客数据** (可选): 从飞书获取最新博客数据
6. **构建项目**: 使用 Vite 构建生产版本
7. **配置 Pages**: 配置 GitHub Pages 设置
8. **上传构建产物**: 上传 `dist` 目录到 GitHub Pages

### 部署步骤

构建完成后，工作流会自动将构建产物部署到 GitHub Pages。

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `BASE_PATH` | 网站基础路径 | 自动检测 |
| `FEISHU_APP_ID` | 飞书应用 ID | - |
| `FEISHU_APP_SECRET` | 飞书应用密钥 | - |

## 故障排查

### 部署失败

1. 检查 Actions 页面的构建日志
2. 确认 GitHub Pages 已启用并设置为 "GitHub Actions" 模式
3. 确认仓库有正确的权限设置

### 测试失败

如果测试失败导致部署中断，可以临时注释掉测试步骤：

```yaml
# - name: 运行测试
#   run: npm run test
```

### 基础路径错误

如果页面样式或资源加载失败，检查：

1. `BASE_PATH` 环境变量是否正确
2. `src/config/site.config.ts` 中的 `basePath` 配置
3. 确保两者保持一致

### 飞书数据获取失败

1. 检查 GitHub Secrets 是否正确配置
2. 确认飞书应用权限是否足够
3. 检查飞书多维表格链接是否正确

## 手动部署

如果需要手动部署：

```bash
# 1. 构建项目
npm run build

# 2. 部署 dist 目录到 GitHub Pages
# 可以使用 gh-pages 工具或手动推送到 gh-pages 分支
```

## 更多资源

- [GitHub Actions 文档](https://docs.github.com/cn/actions)
- [GitHub Pages 文档](https://docs.github.com/cn/pages)
- [Vite 部署文档](https://cn.vitejs.dev/guide/static-deploy.html)
- [飞书开放平台文档](https://open.feishu.cn/document/home/index)
