# 贡献指南

感谢你考虑为飞书博客主页项目做贡献！

## 🤝 如何贡献

### 报告问题

如果你发现了 bug 或有功能建议：

1. 检查 [Issues](https://github.com/yourusername/feishu-blog-homepage/issues) 是否已有相关问题
2. 如果没有，创建新的 Issue，并提供：
   - 清晰的标题和描述
   - 重现步骤（如果是 bug）
   - 预期行为和实际行为
   - 截图或错误信息
   - 环境信息（浏览器、Node.js 版本等）

### 提交代码

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上点击 Fork 按钮
   ```

2. **克隆你的 Fork**
   ```bash
   git clone https://github.com/你的用户名/feishu-blog-homepage.git
   cd feishu-blog-homepage
   ```

3. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

4. **安装依赖**
   ```bash
   npm install
   ```

5. **进行修改**
   - 遵循项目的代码风格
   - 添加必要的测试
   - 更新相关文档

6. **运行测试**
   ```bash
   npm run test
   npm run test:coverage
   ```

7. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   # 或
   git commit -m "fix: 修复某个问题"
   ```

8. **推送到你的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **创建 Pull Request**
   - 在 GitHub 上打开你的 Fork
   - 点击 "New Pull Request"
   - 填写 PR 描述，说明你的更改

## 📝 提交信息规范

使用 [约定式提交](https://www.conventionalcommits.org/zh-hans/) 格式：

```
<类型>(<范围>): <描述>

[可选的正文]

[可选的脚注]
```

### 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构（既不是新功能也不是修复）
- `perf`: 性能优化
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
feat(blog): 添加博客搜索功能
fix(theme): 修复暗色模式下的文字颜色问题
docs(readme): 更新安装说明
test(blog): 添加博客列表组件测试
```

## 🎨 代码风格

### TypeScript

- 使用 TypeScript 严格模式
- 为所有函数添加类型注解
- 避免使用 `any` 类型
- 使用接口定义数据结构

### Vue

- 使用组合式 API（Composition API）
- 使用 `<script setup>` 语法
- 组件名使用 PascalCase
- Props 和 Events 使用 TypeScript 类型

### 样式

- 使用 TailwindCSS 工具类
- 避免内联样式
- 使用 CSS 变量定义主题颜色
- 确保响应式设计

### 命名规范

- 文件名：PascalCase（组件）或 kebab-case（其他）
- 变量名：camelCase
- 常量名：UPPER_SNAKE_CASE
- 类型名：PascalCase

## 🧪 测试

### 编写测试

- 为新功能添加单元测试
- 确保测试覆盖率不降低
- 使用描述性的测试名称
- 测试边界情况和错误处理

### 运行测试

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

## 📚 文档

### 更新文档

如果你的更改影响到：
- 功能使用方式 → 更新 README.md
- 部署流程 → 更新 DEPLOYMENT.md
- API 接口 → 更新相关文档
- 配置选项 → 更新配置说明

### 代码注释

- 为复杂逻辑添加注释
- 使用 JSDoc 格式注释函数
- 注释应该解释"为什么"而不是"是什么"

## 🔍 代码审查

Pull Request 会经过以下审查：

- ✅ 代码风格是否符合规范
- ✅ 测试是否通过
- ✅ 是否有足够的测试覆盖
- ✅ 文档是否更新
- ✅ 提交信息是否规范
- ✅ 是否有破坏性变更

## 🚀 发布流程

项目维护者会：

1. 审查并合并 PR
2. 更新 CHANGELOG.md
3. 更新版本号
4. 创建 Git 标签
5. 发布新版本

## 💡 开发建议

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 在另一个终端运行测试
npm run test:watch
```

### 调试

- 使用浏览器开发者工具
- 使用 Vue DevTools
- 查看控制台日志
- 使用断点调试

### 性能优化

- 使用 Vite 的代码分割
- 懒加载路由组件
- 优化图片资源
- 减少不必要的重渲染

## 📞 获取帮助

如果你有任何问题：

- 查看 [文档](README.md)
- 搜索 [Issues](https://github.com/yourusername/feishu-blog-homepage/issues)
- 创建新的 Issue 提问
- 加入讨论区交流

## 🙏 致谢

感谢所有为项目做出贡献的开发者！

你的贡献将被记录在 [贡献者列表](https://github.com/yourusername/feishu-blog-homepage/graphs/contributors) 中。

---

再次感谢你的贡献！🎉
