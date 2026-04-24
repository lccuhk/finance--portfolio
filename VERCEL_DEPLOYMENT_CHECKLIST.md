# Vercel 部署配置检查清单

本文档提供详细的 Vercel 部署前检查和配置指南，确保每次部署都能成功。

---

## 📋 部署前检查清单

### 1. 项目基础配置

| 检查项 | 状态 | 说明 |
|--------|------|------|
| [ ] 项目使用 Vite 构建工具 | ✅ | 已配置 `vite.config.ts` |
| [ ] 构建命令正确 | ✅ | `npm run build` |
| [ ] 输出目录正确 | ✅ | `dist` |
| [ ] package.json 存在 | ✅ | 包含必要的 scripts |
| [ ] 依赖已安装 | ✅ | `node_modules` 存在 |

### 2. 本地构建测试

在部署前，必须在本地成功构建：

```bash
# 1. 清理缓存（可选但推荐）
rm -rf node_modules package-lock.json

# 2. 重新安装依赖
npm install

# 3. 运行测试
npm test

# 4. 本地构建
npm run build

# 5. 预览生产构建
npm run preview
```

**检查点：**
- [ ] `npm install` 无错误
- [ ] `npm test` 所有测试通过
- [ ] `npm run build` 成功生成 `dist` 目录
- [ ] `npm run preview` 能正常访问网站

### 3. Vercel 项目设置

#### 3.1 导入项目

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 选择 "Import Git Repository"
4. 选择 GitHub 仓库 `finance--portfolio`

#### 3.2 构建设置（关键）

| 配置项 | 必需值 | 当前值 | 状态 |
|--------|--------|--------|------|
| Framework Preset | Vite | Vite | ✅ |
| Build Command | `npm run build` | `npm run build` | ✅ |
| Output Directory | `dist` | `dist` | ✅ |
| Install Command | `npm install` | `npm install` | ✅ |
| Development Command | `npm run dev` | `npm run dev` | ✅ |

#### 3.3 Node.js 版本

- [ ] 使用 Node.js 18.x 或更高版本
- [ ] 在 `package.json` 中指定引擎版本：

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 4. 环境变量配置

如果项目需要环境变量，在 Vercel 项目设置 → Environment Variables 中添加：

| 变量名 | 必需 | 说明 | 示例值 |
|--------|------|------|--------|
| `VITE_SUPABASE_URL` | 可选 | Supabase 项目 URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | 可选 | Supabase 匿名密钥 | `eyJhbGciOiJIUzI1NiIs...` |

**注意：**
- 客户端可用的环境变量必须以 `VITE_` 开头
- 修改环境变量后需要重新部署才能生效

### 5. 路由配置

对于单页应用（SPA），需要配置路由重写：

创建 `vercel.json` 文件：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
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

检查点：
- [ ] `vercel.json` 文件存在于项目根目录
- [ ] 路由重写配置正确
- [ ] 静态资源缓存头配置（可选但推荐）

---

## 🔧 常见错误及解决方案

### 错误 1: Build Command Failed

**症状：**
```
Error: Command "npm run build" exited with 1
```

**解决方案：**
1. 检查本地是否能成功构建：`npm run build`
2. 检查 `package.json` 中的 `build` 脚本
3. 检查 TypeScript 错误：`npm run check`

### 错误 2: Module Not Found

**症状：**
```
Error: Cannot find module 'xxx'
```

**解决方案：**
1. 确保依赖在 `dependencies` 中，而非 `devDependencies`（如果是运行时必需）
2. 重新安装依赖：`rm -rf node_modules && npm install`
3. 检查是否有遗漏的依赖

### 错误 3: Out of Memory

**症状：**
```
Error: ENOMEM: not enough memory
```

**解决方案：**
1. 增加 Node.js 内存限制：
   ```json
   {
     "scripts": {
       "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
     }
   }
   ```

### 错误 4: TypeScript 编译错误

**症状：**
```
Error: TypeScript compilation failed
```

**解决方案：**
1. 本地运行 `npm run check` 检查类型错误
2. 修复所有 TypeScript 错误
3. 确保 `tsconfig.json` 配置正确

### 错误 5: 路由刷新 404

**症状：**
刷新页面后出现 404 错误

**解决方案：**
1. 确保 `vercel.json` 中配置了路由重写
2. 重新部署项目

---

## 📊 部署后验证清单

### 1. 基础功能检查

- [ ] 首页正常加载
- [ ] 导航链接正常工作
- [ ] 资产配置页面功能正常
- [ ] 图表正确显示
- [ ] 响应式布局正常

### 2. 性能检查

- [ ] 首屏加载时间 < 3 秒
- [ ] Lighthouse 评分 > 80
- [ ] 无控制台错误

### 3. 环境检查

- [ ] 生产环境变量正确加载
- [ ] API 调用正常（如果有）
- [ ] 静态资源正确缓存

---

## 🚀 快速部署命令

### 使用 Vercel CLI（可选）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

---

## 📝 部署日志解读

### 成功的部署日志示例

```
[14:23:45.123] Running build in Washington, D.C., USA
[14:23:45.456] Cloning github.com/lccuhk/finance--portfolio (Branch: main, Commit: xxx)
[14:23:46.789] Cloning completed: 1.333s
[14:23:47.012] Installing dependencies...
[14:24:01.234] Dependencies installed
[14:24:01.567] Build command: npm run build
[14:24:02.890] > finance-portfolio@0.0.0 build
[14:24:02.901] > tsc -b && vite build
[14:24:05.123] dist/                     0.05 kB │ gzip: 0.07 kB
[14:24:05.234] dist/assets/index-xxx.js  150.23 kB │ gzip: 45.12 kB
[14:24:05.345] Build Completed in /vercel/output
[14:24:06.678] Deployed to production
[14:24:07.012] Available at: https://finance-portfolio-xxx.vercel.app
```

### 关键检查点

1. **Dependencies installed** - 依赖安装成功
2. **Build command** - 构建命令执行
3. **Build Completed** - 构建完成
4. **Deployed to production** - 部署成功

---

## 🔄 持续集成配置

### Git 集成

Vercel 会自动部署以下分支：

| 分支 | 环境 | 自动部署 |
|------|------|----------|
| `main` | 生产环境 | ✅ |
| `develop` | 预览环境 | ✅ |
| Pull Request | 预览环境 | ✅ |

### 部署钩子

如需手动触发部署：

1. 项目设置 → Git → Deploy Hooks
2. 创建 Deploy Hook
3. 使用生成的 URL：`https://api.vercel.com/v1/integrations/deploy/...`

---

## 📞 故障排除流程

```
部署失败？
    │
    ▼
查看构建日志
    │
    ├── 依赖错误？→ 重新安装依赖
    │
    ├── 构建错误？→ 本地测试构建
    │
    ├── 类型错误？→ 运行 npm run check
    │
    └── 内存错误？→ 增加内存限制
    │
    ▼
本地修复
    │
    ▼
提交并推送
    │
    ▼
自动重新部署
```

---

## ✅ 最终检查清单

在点击 "Deploy" 按钮前，确认：

- [ ] 本地构建成功 (`npm run build`)
- [ ] 所有测试通过 (`npm test`)
- [ ] 无 TypeScript 错误 (`npm run check`)
- [ ] 构建输出目录是 `dist`
- [ ] 环境变量已配置（如果需要）
- [ ] `vercel.json` 已配置（如果需要路由重写）
- [ ] Git 仓库已推送到 GitHub

---

## 📚 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#vercel)
- [项目 GitHub 仓库](https://github.com/lccuhk/finance--portfolio)
- [项目部署文档](./DEPLOYMENT.md)

---

## 📝 更新日志

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-04-22 | 1.0.0 | 初始检查清单 |
