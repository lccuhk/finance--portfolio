# Vercel 部署指南

> 详细的 Vercel 部署步骤，包含自动化脚本和手动操作指南

---

## 方法一：使用自动化脚本（推荐）

### 1. 运行部署脚本

```bash
# 给脚本执行权限
chmod +x vercel-deploy.sh

# 运行部署脚本
./vercel-deploy.sh
```

脚本会自动完成以下步骤：
- ✅ 检查并安装 Vercel CLI
- ✅ TypeScript 类型检查
- ✅ 本地构建测试
- ✅ 检查 vercel.json 配置
- ✅ 检查登录状态
- ✅ 执行部署

### 2. 首次部署交互提示

运行脚本后，如果是首次部署，会进入交互模式：

```
? Set up and deploy "~/finance-portfolio"? [Y/n] y

? Which scope do you want to deploy to? [选择你的 Vercel 账户]

? Link to existing project? [y/N] n

? What's your project name? [finance-portfolio]

? In which directory is your code located? [./]

? Which framework are you using? [Vite]
```

### 3. 等待部署完成

部署成功后，会显示：
```
🔍  Inspect: https://vercel.com/你的用户名/finance-portfolio/xxxxx
✅  Production: https://finance-portfolio-xxx.vercel.app
```

---

## 方法二：手动部署步骤

### 步骤 1：安装 Vercel CLI

```bash
npm install -g vercel
```

### 步骤 2：登录 Vercel

```bash
vercel login
```

按提示完成浏览器登录。

### 步骤 3：代码检查

```bash
# 类型检查
npm run check

# 构建测试
npm run build
```

### 步骤 4：部署

```bash
# 开发环境部署（预览）
vercel

# 生产环境部署
vercel --prod
```

---

## 方法三：GitHub 自动部署（推荐用于持续集成）

### 1. Vercel Dashboard 设置

1. 登录 https://vercel.com/dashboard
2. 点击 "Add New Project"
3. 导入 GitHub 仓库 `finance-portfolio`
4. 框架预设选择 **Vite**
5. 点击 **Deploy**

### 2. 自动部署配置

连接 GitHub 后，每次推送到 main 分支会自动触发部署：

```bash
# 修改代码
git add .
git commit -m "更新功能"
git push origin main

# Vercel 会自动构建并部署
```

---

## 部署前检查清单

### 必需文件检查

| 文件 | 状态 | 说明 |
|------|------|------|
| `vercel.json` | ✅ 已存在 | SPA 路由配置 |
| `package.json` | ✅ 已存在 | 构建脚本配置 |
| `vite.config.ts` | ✅ 已存在 | Vite 配置 |
| `tsconfig.json` | ✅ 已存在 | TypeScript 配置 |

### 配置验证

```bash
# 1. 验证类型检查
npm run check

# 2. 验证构建
npm run build

# 3. 本地预览
npm run preview
```

---

## 常见问题解决

### 问题 1：路径别名解析失败

**症状：** `Failed to resolve import "@/components/Layout"`

**解决：** 确保 `vite.config.ts` 包含：

```typescript
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ...
})
```

### 问题 2：路由 404

**症状：** 刷新页面显示 404

**解决：** 确保 `vercel.json` 包含 SPA 重写规则：

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

### 问题 3：构建失败

**症状：** Vercel 构建日志显示错误

**解决步骤：**
1. 本地运行 `npm run check` 检查类型错误
2. 本地运行 `npm run build` 测试构建
3. 修复所有错误后再推送

### 问题 4：环境变量未生效

**症状：** API 请求失败

**解决：**
- 在 Vercel Dashboard > Project Settings > Environment Variables 中配置
- 客户端变量必须以 `VITE_` 开头
- 重新部署以应用新变量

---

## 部署后验证

### 验证清单

- [ ] 首页正常加载
- [ ] 导航菜单可点击
- [ ] 页面刷新不 404
- [ ] 图表正常显示
- [ ] 响应式布局正常
- [ ] 静态资源加载正常

### 性能检查

访问部署后的网站，打开浏览器开发者工具：

1. **Network 面板**
   - 检查资源加载时间
   - 确认静态资源有缓存

2. **Console 面板**
   - 检查是否有 JavaScript 错误
   - 查看日志输出

3. **Lighthouse**
   - 运行性能测试
   - 检查可访问性

---

## 自定义域名配置

### 1. 添加域名

1. 进入 Vercel Dashboard
2. 选择项目
3. 点击 **Settings** > **Domains**
4. 输入你的域名，点击 **Add**

### 2. DNS 配置

根据 Vercel 提示，在你的域名服务商处添加 DNS 记录：

**方式 A：CNAME 记录**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**方式 B：A 记录**
```
Type: A
Name: @
Value: 76.76.21.21
```

### 3. 等待生效

DNS 传播通常需要几分钟到几小时。

---

## 环境变量配置

### 开发环境

创建 `.env.local` 文件（不提交到 Git）：

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 生产环境

在 Vercel Dashboard 配置：

1. Project Settings > Environment Variables
2. 添加变量名和值
3. 选择环境（Production / Preview / Development）
4. 点击 **Save**
5. 重新部署项目

---

## 回滚操作

如果部署出现问题，快速回滚方法：

### 方法 1：Vercel Dashboard 回滚

1. 进入 Project > Deployments
2. 找到上一个正常版本
3. 点击 **Promote to Production**

### 方法 2：Git 回滚

```bash
# 查看提交历史
git log --oneline

# 回滚到上一个版本
git revert HEAD
git push origin main
```

---

## 参考资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Vercel CLI 文档](https://vercel.com/docs/cli)

---

**最后更新：** 2026-04-22
