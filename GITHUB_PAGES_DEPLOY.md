# GitHub Pages 部署指南

由于 Vercel 访问和验证问题，我们使用 GitHub Pages 部署，这是完全免费且稳定的方案。

## 🚀 部署步骤

### 步骤 1：更新 vite.config.ts（适配 GitHub Pages）

GitHub Pages 需要配置 base 路径：

```typescript
// vite.config.ts
export default defineConfig({
  base: '/finance-portfolio/',  // 添加这一行
  // ... 其他配置
})
```

### 步骤 2：启用 GitHub Pages

1. 打开 GitHub 仓库：`https://github.com/lccuhk/finance-portfolio`
2. 点击 **Settings** 标签
3. 左侧菜单选择 **Pages**
4. **Source** 选择 **GitHub Actions**
5. 保存设置

### 步骤 3：推送代码触发部署

```bash
git add .
git commit -m "添加 GitHub Pages 自动部署"
git push origin main
```

### 步骤 4：查看部署状态

1. 打开 GitHub 仓库
2. 点击 **Actions** 标签
3. 查看工作流运行状态
4. 等待显示绿色 ✅

### 步骤 5：访问网站

部署完成后，访问地址：
```
https://lccuhk.github.io/finance-portfolio/
```

## ✅ 优势

- 完全免费
- 无需额外账户验证
- 自动部署（每次 push 到 main 分支）
- 支持自定义域名
- 全球 CDN 加速

## 🔧 故障排除

### 部署失败

1. 检查 Actions 日志
2. 确认 `vite.config.ts` 有 `base: '/finance-portfolio/'`
3. 确认 GitHub Pages 设置为 GitHub Actions

### 页面空白或 404

确保 `base` 路径配置正确：
- 如果你的仓库名是 `finance-portfolio`，base 应该是 `/finance-portfolio/`
- 如果你使用自定义域名，base 应该设为 `/`

### 资源加载失败

检查浏览器开发者工具，确认资源路径是否正确。

## 📝 注意事项

- GitHub Pages 适合静态网站
- 部署可能需要 1-2 分钟
- 首次部署后可能需要几分钟才能访问

---

**部署完成后，你的网站将在 `https://你的用户名.github.io/finance-portfolio/` 访问**
