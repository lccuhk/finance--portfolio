# Vercel 部署配置检查清单

> 本清单用于确保 Vercel 部署顺利进行，避免常见错误

---

## 一、项目配置检查

### 1.1 package.json 配置

| 检查项 | 状态 | 说明 |
|--------|------|------|
| ✅ 项目类型 | 已配置 | `"type": "module"` 启用 ES Module |
| ✅ 构建脚本 | 已配置 | `"build": "tsc -b && vite build"` |
| ✅ 类型检查 | 已配置 | `"check": "tsc -b --noEmit"` |
| ✅ 开发依赖 | 已安装 | TypeScript、Vite、ESLint 等 |

**关键配置示例：**
```json
{
  "type": "module",
  "scripts": {
    "build": "tsc -b && vite build",
    "check": "tsc -b --noEmit"
  }
}
```

### 1.2 vite.config.ts 配置

| 检查项 | 状态 | 说明 |
|--------|------|------|
| ✅ 构建配置 | 已配置 | `sourcemap: 'hidden'` 启用 sourcemap |
| ✅ React 插件 | 已配置 | `@vitejs/plugin-react` |
| ✅ 路径别名 | 已配置 | `vite-tsconfig-paths` 支持 `@/*` |

**关键配置：**
```typescript
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react(),
    tsconfigPaths()
  ],
})
```

### 1.3 tsconfig.json 配置

| 检查项 | 状态 | 说明 |
|--------|------|------|
| ✅ 模块系统 | 已配置 | `"module": "ESNext"` |
| ✅ 模块解析 | 已配置 | `"moduleResolution": "bundler"` |
| ✅ 路径别名 | 已配置 | `"@/*": ["./src/*"]` |
| ⚠️ 严格模式 | 已关闭 | `"strict": false`（根据项目需求） |

**重要提示：** Vercel 部署时不支持 `tsconfig.json` 中的 `references` 或复杂路径别名，保持简单配置。

---

## 二、Vercel 配置文件检查

### 2.1 vercel.json 完整配置

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
  ],
  "github": {
    "silent": true
  }
}
```

### 2.2 配置项说明

| 配置项 | 用途 | 是否必需 |
|--------|------|----------|
| `rewrites` | SPA 路由支持，所有路径指向 index.html | ✅ 必需 |
| `headers` | 静态资源缓存控制 | ⚠️ 推荐 |
| `github.silent` | 关闭 GitHub 评论通知 | ❌ 可选 |

### 2.3 ❌ 已废弃配置（不要使用）

```json
// ❌ 错误：functions 配置已废弃
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## 三、部署前检查清单

### 3.1 代码质量检查

```bash
# 1. 类型检查
npm run check

# 2. 构建测试
npm run build

# 3. 本地预览
npm run preview
```

| 检查项 | 命令 | 预期结果 |
|--------|------|----------|
| TypeScript 类型检查 | `npm run check` | 无错误 |
| 项目构建 | `npm run build` | dist 目录生成 |
| 本地预览 | `npm run preview` | 正常访问 |

### 3.2 环境变量检查

如果使用环境变量（如 Supabase）：

| 检查项 | 说明 |
|--------|------|
| ✅ 本地 `.env` 文件 | 开发环境使用，不提交到 Git |
| ✅ Vercel Dashboard 配置 | 生产环境在 Vercel 后台配置 |
| ✅ 变量名一致性 | 确保前后端变量名一致 |

**环境变量示例：**
```bash
# .env.local（本地开发）
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3.3 文件结构检查

```
finance-portfolio/
├── src/                    # 源代码
├── dist/                   # 构建输出（自动生成）
├── package.json            # 依赖配置
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── vercel.json             # Vercel 配置 ⭐
├── index.html              # 入口 HTML
└── DEPLOY_CHECKLIST.md     # 本清单
```

---

## 四、常见错误及解决方案

### 4.1 路由 404 错误

**症状：** 刷新页面或直接访问 `/portfolio` 返回 404

**原因：** 未配置 SPA 路由重写

**解决：** 确保 `vercel.json` 包含：
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 4.2 TypeScript 路径别名错误

**症状：** `Cannot find module '@/components/Button'`

**原因：** Vercel 构建时无法解析路径别名

**解决：** 
1. 安装 `vite-tsconfig-paths`
2. 在 `vite.config.ts` 中导入使用
3. 确保 `tsconfig.json` 中 `baseUrl` 和 `paths` 配置正确

### 4.3 构建失败

**症状：** Vercel 构建日志显示 TypeScript 错误

**解决步骤：**
1. 本地运行 `npm run check` 检查类型错误
2. 本地运行 `npm run build` 测试构建
3. 修复所有错误后再推送

### 4.4 环境变量未生效

**症状：** Supabase 等客户端服务无法连接

**解决：**
- 客户端变量必须以 `VITE_` 开头
- 在 Vercel Dashboard > Project Settings > Environment Variables 中配置
- 重新部署以应用新变量

---

## 五、部署步骤

### 5.1 首次部署

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "准备 Vercel 部署"
   git push origin main
   ```

2. **Vercel Dashboard 操作**
   - 登录 [vercel.com](https://vercel.com)
   - 点击 "Add New Project"
   - 导入 GitHub 仓库
   - 框架预设选择 "Vite"
   - 点击 Deploy

3. **验证部署**
   - 等待构建完成
   - 访问生成的域名
   - 测试所有页面路由

### 5.2 后续更新部署

```bash
# 1. 代码修改后
npm run check      # 检查类型
npm run build      # 本地构建测试

# 2. 提交并推送
git add .
git commit -m "更新内容"
git push origin main

# 3. Vercel 自动部署
# 等待 Vercel 自动构建完成
```

---

## 六、部署后验证清单

| 验证项 | 方法 | 预期结果 |
|--------|------|----------|
| 首页访问 | 直接访问域名 | 正常显示 |
| 路由跳转 | 点击导航菜单 | 正常跳转 |
| 页面刷新 | 在子页面按 F5 | 正常显示，不 404 |
| 静态资源 | 检查图片/CSS/JS 加载 | 正常加载 |
| API 请求 | 如有后端接口 | 正常响应 |
| 响应速度 | 观察页面加载时间 | < 3 秒 |

---

## 七、性能优化建议

### 7.1 已配置优化

- ✅ 静态资源长期缓存（1年）
- ✅ Sourcemap 隐藏（生产环境）
- ✅ 代码分割（Vite 默认）

### 7.2 可选优化

- [ ] 启用 Vercel Analytics
- [ ] 配置自定义域名
- [ ] 启用 HTTPS 强制跳转
- [ ] 配置 Edge Network 缓存

---

## 八、紧急回滚

如果部署出现问题，快速回滚方法：

1. **Vercel Dashboard 回滚**
   - 进入 Project > Deployments
   - 找到上一个正常版本
   - 点击 "Promote to Production"

2. **Git 回滚**
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## 九、参考资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Vercel Configuration](https://vercel.com/docs/projects/project-configuration)

---

**最后更新：** 2026-04-22  
**适用项目：** finance-portfolio（React + TypeScript + Vite）
