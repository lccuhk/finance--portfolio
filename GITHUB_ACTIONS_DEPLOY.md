# GitHub Actions 自动部署到 Vercel

由于 Vercel 账户需要验证，我们使用 GitHub Actions 实现自动部署。

## 配置步骤

### 步骤 1：在 Vercel 获取 Token

1. 访问 https://vercel.com/account/tokens
2. 点击 **"Create Token"**
3. 输入 Token 名称（如 `github-actions`）
4. 选择 Scope（选择你的团队或个人账户）
5. 点击 **"Create Token"**
6. **复制生成的 Token**（只显示一次）

### 步骤 2：获取 Vercel Project ID

1. 访问 https://vercel.com/dashboard
2. 创建一个新项目（或选择现有项目）
3. 进入项目设置 **Settings** > **General**
4. 找到 **Project ID**，复制它

### 步骤 3：获取 Vercel Org ID

1. 访问 https://vercel.com/account/settings
2. 找到 **Team ID** 或 **Personal Account ID**
3. 复制这个 ID

### 步骤 4：在 GitHub 配置 Secrets

1. 打开你的 GitHub 仓库：`https://github.com/lccuhk/finance-portfolio`
2. 点击 **Settings** > **Secrets and variables** > **Actions**
3. 点击 **New repository secret**，添加以下 secrets：

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | 步骤1复制的 Token |
| `VERCEL_ORG_ID` | 步骤3复制的 Org ID |
| `VERCEL_PROJECT_ID` | 步骤2复制的 Project ID |

### 步骤 5：推送代码触发部署

```bash
git add .
git commit -m "添加 GitHub Actions 自动部署"
git push origin main
```

推送后，GitHub Actions 会自动运行并部署到 Vercel。

## 验证部署

1. 打开 GitHub 仓库
2. 点击 **Actions** 标签
3. 查看部署状态
4. 如果成功，会显示绿色的 ✅

## 后续自动部署

配置完成后，每次推送到 `main` 分支都会自动触发部署：

```bash
# 修改代码
git add .
git commit -m "更新功能"
git push origin main

# GitHub Actions 会自动部署
```

## 故障排除

### 部署失败怎么办？

1. 检查 GitHub Actions 日志
2. 确认 Secrets 配置正确
3. 确认 Vercel Token 有权限
4. 检查项目 ID 和 Org ID 是否正确

### 如何重新部署？

在 GitHub Actions 页面，点击失败的 workflow，然后点击 **"Re-run jobs"**。

---

**注意**：即使 Vercel 账户需要验证，通过 GitHub Actions 部署通常可以绕过这个限制，因为使用的是 Token 认证。
