# 博客数据预取脚本使用说明

## 概述

`fetch-blogs.ts` 脚本用于从飞书多维表格获取博客列表数据，并生成静态 JSON 文件。这样可以在构建时预取数据，避免运行时的 API 调用限制。

## 前置准备

### 1. 创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 获取 **App ID** 和 **App Secret**
4. 在应用权限管理中添加以下权限：
   - `bitable:app` - 查看、评论和编辑多维表格
   - `bitable:app:readonly` - 查看多维表格（只读）

### 2. 创建飞书多维表格

在飞书中创建多维表格，包含以下字段：

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| 标题 | 文本 | 是 | 博客标题 |
| 摘要 | 文本 | 否 | 博客摘要 |
| 分类 | 文本/单选 | 否 | 博客分类（默认"未分类"） |
| 发布时间 | 日期 | 否 | 发布时间（默认当前时间） |
| 文档链接 | 文本/URL | 是 | 飞书文档链接 |
| 封面图片 | 文本/URL | 否 | 封面图片链接 |

**注意**：字段名支持中文或英文，脚本会自动识别。

### 3. 获取多维表格 ID

1. 打开你创建的多维表格
2. 从浏览器地址栏复制 URL，格式如下：
   ```
   https://xxx.feishu.cn/base/bascnxxxxxxxxxxxxxx?table=tblxxxxxxxxxxxxxx
   ```
3. 提取 `app_token` 和 `table_id`：
   - `app_token`: `bascnxxxxxxxxxxxxxx`
   - `table_id`: `tblxxxxxxxxxxxxxx`
4. 组合成格式：`app_token/table_id`

## 配置环境变量

### 方式一：使用 .env 文件（推荐）

1. 复制 `.env.example` 为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入实际配置：
   ```env
   FEISHU_APP_ID=cli_xxxxxxxxxxxxxxxx
   FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   FEISHU_TABLE_ID=bascnxxxxxxxxxxxxxx/tblxxxxxxxxxxxxxx
   ```

### 方式二：直接设置环境变量

**Linux/macOS:**
```bash
export FEISHU_APP_ID=cli_xxxxxxxxxxxxxxxx
export FEISHU_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
export FEISHU_TABLE_ID=bascnxxxxxxxxxxxxxx/tblxxxxxxxxxxxxxx
```

**Windows (PowerShell):**
```powershell
$env:FEISHU_APP_ID="cli_xxxxxxxxxxxxxxxx"
$env:FEISHU_APP_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:FEISHU_TABLE_ID="bascnxxxxxxxxxxxxxx/tblxxxxxxxxxxxxxx"
```

## 安装依赖

```bash
npm install
```

## 运行脚本

```bash
npm run fetch-blogs
```

## 输出结果

脚本执行成功后，会在 `src/data/blogs.json` 生成博客数据文件，格式如下：

```json
[
  {
    "id": "recxxxxxxxxxxxxxx",
    "title": "博客标题",
    "summary": "博客摘要",
    "category": "技术",
    "publishedAt": "2024-01-15T10:30:00.000Z",
    "feishuDocUrl": "https://example.feishu.cn/docx/xxxxx",
    "coverImage": "https://example.com/cover.jpg"
  }
]
```

## 集成到构建流程

如果希望在每次构建前自动获取最新数据，可以修改 `package.json` 的构建脚本：

```json
{
  "scripts": {
    "build": "npm run fetch-blogs && vue-tsc && vite build"
  }
}
```

**注意**：这需要在 CI/CD 环境中配置相应的环境变量。

## 故障排查

### 错误：缺少环境变量

```
[ERROR] 缺少必要的环境变量: FEISHU_APP_ID, FEISHU_APP_SECRET, FEISHU_TABLE_ID
```

**解决方案**：检查环境变量是否正确配置。

### 错误：获取访问令牌失败

```
[ERROR] 获取访问令牌失败: 飞书 API 错误: app_access_token invalid
```

**解决方案**：
- 检查 App ID 和 App Secret 是否正确
- 确认应用状态是否正常（未停用）

### 错误：获取数据失败

```
[ERROR] 获取数据失败: 飞书 API 错误: permission denied
```

**解决方案**：
- 检查应用是否有多维表格的访问权限
- 确认 Table ID 格式是否正确（app_token/table_id）

### 警告：记录缺少必填字段

```
[WARN] 记录 recxxxxxx 缺少必填字段（标题或文档链接），已跳过
```

**解决方案**：检查多维表格中的记录，确保每条记录都有标题和文档链接。

## 字段映射说明

脚本支持以下字段名（中文或英文）：

| 中文字段名 | 英文字段名 | 备选字段名 |
|-----------|-----------|-----------|
| 标题 | title | - |
| 摘要 | summary | - |
| 分类 | category | - |
| 发布时间 | publishedAt | published_at |
| 文档链接 | feishuDocUrl | doc_url |
| 封面图片 | coverImage | cover_image |

如果你的表格使用了不同的字段名，可以修改 `scripts/fetch-blogs.ts` 中的 `transformRecordToBlog` 函数。

## 安全提示

- **不要将 .env 文件提交到 Git 仓库**（已在 .gitignore 中配置）
- App Secret 是敏感信息，请妥善保管
- 在 CI/CD 环境中使用加密的环境变量存储凭证

## 相关文档

- [飞书开放平台文档](https://open.feishu.cn/document/home/index)
- [多维表格 API 文档](https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-overview)
