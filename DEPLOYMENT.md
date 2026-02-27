# 部署指南

本文档说明如何将飞书博客主页部署到 GitHub Pages。

## 📋 前置要求

1. GitHub 账号
2. 飞书开放平台账号
3. 已创建的飞书多维表格（包含博客数据）

## 🚀 快速部署步骤

### 步骤 1：推送代码到 GitHub

1. 在 GitHub 上创建新仓库
2. 将本地代码推送到仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

### 步骤 2：启用 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 **Settings** (设置)
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** (来源) 下拉菜单中选择 **GitHub Actions**

### 步骤 3：配置 GitHub Secrets

#### 3.1 获取飞书应用凭证

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 记录 **App ID** 和 **App Secret**
4. 添加权限：
   - `bitable:app` - 查看、评论、编辑和管理多维表格
   - `bitable:app:readonly` - 查看多维表格（只读）

#### 3.2 获取多维表格 ID

1. 打开飞书多维表格
2. 从浏览器地址栏复制 URL：
   ```
   https://xxx.feishu.cn/base/bascnxxxxxxxxxxxxxx?table=tblxxxxxxxxxxxxxx
   ```
3. 提取 `app_token` 和 `table_id`：
   - `app_token`: `bascnxxxxxxxxxxxxxx`（base/ 后面的部分）
   - `table_id`: `tblxxxxxxxxxxxxxx`（table= 后面的部分）
4. 组合格式：`app_token/table_id`

#### 3.3 配置 Secrets

在 GitHub 仓库中配置以下 Secrets：

1. 进入仓库的 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret** 添加以下密钥：

**必需的 Secrets：**

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `FEISHU_APP_ID` | 飞书应用 ID | `cli_a9f6734891781cc4` |
| `FEISHU_APP_SECRET` | 飞书应用密钥 | `936WY0aIDc2dKwbpybqfsgcnlNnwh4jo` |
| `FEISHU_TABLE_ID` | 博客列表表格 ID | `QpLxbQap9aubhpsFwUXc2J7UnHe/tbl8XprYPNg9v5Nm` |
| `FEISHU_TABLE_ID_SITE_CONFIG` | 网站基础配置表格 ID | `QpLxbQap9aubhpsFwUXc2J7UnHe/tblcJPxcWPd9JEGo` |
| `FEISHU_TABLE_ID_PROFILE` | 个人信息表格 ID | `QpLxbQap9aubhpsFwUXc2J7UnHe/tblt5iiHTJo1yxAn` |
| `FEISHU_TABLE_ID_EDUCATION` | 教育经历表格 ID | `QpLxbQap9aubhpsFwUXc2J7UnHe/tblwj1t4kXDjHWRl` |
| `FEISHU_TABLE_ID_PROJECTS` | 项目经历表格 ID | `QpLxbQap9aubhpsFwUXc2J7UnHe/tblM1v1unibw8Slm` |
| `FEISHU_TABLE_ID_MILESTONES` | 里程碑表格 ID | `QpLxbQap9aubhpsFwUXc2J7UnHe/tblfUJbqfKQMRkYL` |
| `FEISHU_TABLE_ID_THEME` | 主题样式表格 ID | `QpLxbQap9aubhpsFwUXc2J7UnHe/tbleTZuXND79XGte` |
3. 提取并组合：
   - app_token: `bascnxxxxxxxxxxxxxx`
   - table_id: `tblxxxxxxxxxxxxxx`
   - 组合格式: `bascnxxxxxxxxxxxxxx/tblxxxxxxxxxxxxxx`

#### 3.3 添加 Secrets

1. 在 GitHub 仓库中，点击 **Settings** > **Secrets and variables** > **Actions**
2. 点击 **New repository secret**，依次添加：

| 名称 | 值 |
|------|-----|
| `FEISHU_APP_ID` | 你的飞书应用 App ID |
| `FEISHU_APP_SECRET` | 你的飞书应用 App Secret |
| `FEISHU_TABLE_ID` | 你的多维表格 ID（格式：app_token/table_id） |

### 步骤 4：触发部署

推送任何代码到 `main` 分支，GitHub Actions 会自动：
1. 运行测试
2. 从飞书获取最新博客数据
3. 构建项目
4. 部署到 GitHub Pages

```bash
git add .
git commit -m "Update content"
git push
```

### 步骤 5：访问网站

部署完成后，你的网站将在以下地址可用：
- 用户站点：`https://你的用户名.github.io/`
- 项目站点：`https://你的用户名.github.io/仓库名/`

## 🔄 更新博客内容

### 方法一：通过飞书多维表格更新（推荐）

1. 在飞书多维表格中添加或修改博客记录
2. 推送任意代码到 GitHub（或手动触发 Actions）
3. GitHub Actions 会自动获取最新数据并重新部署

### 方法二：本地更新

1. 运行数据获取脚本：
   ```bash
   npm run fetch-blogs
   ```
2. 提交并推送更改：
   ```bash
   git add src/data/blogs.json
   git commit -m "Update blog data"
   git push
   ```

## 🛠️ 手动触发部署

1. 进入 GitHub 仓库的 **Actions** 页面
2. 选择 "部署到 GitHub Pages" 工作流
3. 点击 **Run workflow** 按钮
4. 选择 `main` 分支
5. 点击 **Run workflow**

## ⚙️ 自定义配置

### 修改基础路径

如果需要自定义基础路径，编辑 `.github/workflows/deploy.yml`：

```yaml
- name: 构建项目
  run: npm run build
  env:
    BASE_PATH: /你的自定义路径/
```

### 配置自定义域名

1. 在仓库根目录创建 `public/CNAME` 文件
2. 写入你的域名：
   ```
   blog.example.com
   ```
3. 在域名提供商处配置 DNS：
   - A 记录指向 GitHub Pages IP
   - 或 CNAME 记录指向 `你的用户名.github.io`

## 📊 监控部署状态

1. 进入 GitHub 仓库的 **Actions** 页面
2. 查看最近的工作流运行记录
3. 点击具体的运行查看详细日志

### 常见状态

- ✅ **Success**: 部署成功
- ❌ **Failure**: 部署失败（查看日志排查问题）
- 🟡 **In progress**: 正在部署中

## 🐛 故障排查

### 部署失败

**检查清单：**
- [ ] GitHub Secrets 是否正确配置（3 个都需要）
- [ ] 飞书应用权限是否足够
- [ ] 多维表格 ID 格式是否正确
- [ ] 测试是否通过

**查看日志：**
1. 进入 Actions 页面
2. 点击失败的工作流
3. 查看具体步骤的错误信息

### 飞书数据获取失败

**可能原因：**
- Secrets 配置错误
- 飞书应用权限不足
- 多维表格 ID 格式错误
- 网络连接问题

**解决方法：**
1. 检查 Secrets 配置
2. 确认飞书应用权限
3. 验证多维表格 ID 格式：`app_token/table_id`

### 页面样式丢失

**可能原因：**
- 基础路径配置错误

**解决方法：**
1. 检查 `BASE_PATH` 环境变量
2. 确保与实际部署路径一致
3. 项目站点需要设置为 `/仓库名/`

## 📚 相关文档

- [GitHub Actions 配置说明](.github/workflows/README.md)
- [飞书数据预取脚本说明](scripts/README.md)
- [项目 README](README.md)

## 💡 提示

- 每次推送到 `main` 分支都会触发部署
- 部署通常需要 2-5 分钟
- 可以在 Actions 页面查看实时进度
- 建议在本地测试后再推送到 GitHub
