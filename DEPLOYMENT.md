# 部署指南

本文档介绍如何将金融资产配置网站部署到 Vercel 或 Netlify。

## 项目信息

- **项目名称**: finance-portfolio
- **技术栈**: React + TypeScript + Vite + Tailwind CSS
- **构建工具**: Vite
- **包管理器**: npm

---

## 方式一：部署到 Vercel（推荐）

### 1. 准备工作

- 注册 [Vercel](https://vercel.com) 账号
- 将 GitHub 仓库连接到 Vercel

### 2. 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lccuhk/finance--portfolio)

### 3. 手动部署步骤

#### 步骤 1：导入项目
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 选择你的 GitHub 仓库 `finance--portfolio`

#### 步骤 2：配置构建设置
| 配置项 | 值 |
|--------|-----|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

#### 步骤 3：环境变量（可选）
如果项目需要环境变量，在 Vercel 项目设置中添加：

```
# 示例环境变量
VITE_API_KEY=your_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

#### 步骤 4：部署
点击 "Deploy" 按钮，等待构建完成。

### 4. 自定义域名（可选）

1. 在 Vercel 项目设置中选择 "Domains"
2. 添加你的自定义域名
3. 按照提示配置 DNS 记录

---

## 方式二：部署到 Netlify

### 1. 准备工作

- 注册 [Netlify](https://netlify.com) 账号
- 准备好 GitHub 仓库访问权限

### 2. 一键部署

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/lccuhk/finance--portfolio)

### 3. 手动部署步骤

#### 步骤 1：导入项目
1. 登录 [Netlify Dashboard](https://app.netlify.com)
2. 点击 "Add new site" → "Import an existing project"
3. 选择 "GitHub" 作为 Git 提供商
4. 选择你的仓库 `finance--portfolio`

#### 步骤 2：配置构建设置
| 配置项 | 值 |
|--------|-----|
| Build command | `npm run build` |
| Publish directory | `dist` |

#### 步骤 3：环境变量
在 "Environment variables" 部分添加所需的环境变量。

#### 步骤 4：部署
点击 "Deploy site" 按钮。

### 4. 使用 netlify.toml 配置

项目已包含 `netlify.toml` 配置文件：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 本地构建测试

在部署前，建议先在本地测试构建：

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 自动部署配置

### Git 集成

Vercel 和 Netlify 都支持 Git 集成，当你推送代码到以下分支时会自动触发部署：

- **main 分支**: 生产环境部署
- **其他分支**: 预览环境部署

### 部署钩子（可选）

如果你需要手动触发部署，可以配置部署钩子：

**Vercel**:
1. 项目设置 → Git → Deploy Hooks
2. 创建新的 Deploy Hook
3. 使用生成的 URL 触发部署

**Netlify**:
1. 站点设置 → Build & deploy → Build hooks
2. 添加 Build hook
3. 使用生成的 URL 触发部署

---

## 故障排除

### 常见问题

#### 1. 构建失败：找不到依赖
```bash
# 解决方案：清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

#### 2. 路由刷新 404 错误
- Vercel: 已自动配置，无需额外操作
- Netlify: 已配置 `_redirects` 或 `netlify.toml`

#### 3. 环境变量未生效
- 检查环境变量名称是否以 `VITE_` 开头（客户端可用）
- 重新部署以应用新的环境变量

#### 4. 构建内存不足
对于 Vercel，可以在 `vercel.json` 中配置：
```json
{
  "functions": {
    "**/*.js": {
      "maxDuration": 30
    }
  }
}
```

---

## 性能优化建议

### 1. 启用 CDN
- Vercel 和 Netlify 都自带全球 CDN，无需额外配置

### 2. 图片优化
- 使用 WebP 格式
- 配置懒加载
- 使用响应式图片

### 3. 代码分割
Vite 会自动进行代码分割，确保：
- 路由级别懒加载
- 第三方库单独打包

### 4. 缓存策略
在 `vercel.json` 或 `netlify.toml` 中配置静态资源缓存：

```json
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 监控和分析

### Vercel Analytics
1. 在 Vercel 项目设置中启用 Analytics
2. 查看 Core Web Vitals 和访问数据

### Netlify Analytics
1. 在 Netlify 站点设置中启用 Analytics
2. 查看访问统计和性能指标

---

## 联系方式

如有部署问题，请通过以下方式联系：
- GitHub Issues: https://github.com/lccuhk/finance--portfolio/issues

---

## 更新日志

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-04-22 | 1.0.0 | 初始部署文档 |
