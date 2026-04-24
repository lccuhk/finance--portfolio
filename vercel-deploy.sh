#!/bin/bash

# Vercel 部署脚本
# 自动完成构建检查并部署到 Vercel

set -e  # 遇到错误立即退出

echo "=========================================="
echo "  Vercel 部署脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否安装了 Vercel CLI
echo -e "${YELLOW}步骤 1: 检查 Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI 未安装，正在安装...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✓ Vercel CLI 安装完成${NC}"
else
    echo -e "${GREEN}✓ Vercel CLI 已安装${NC}"
    vercel --version
fi
echo ""

# 类型检查
echo -e "${YELLOW}步骤 2: TypeScript 类型检查...${NC}"
npm run check
echo -e "${GREEN}✓ 类型检查通过${NC}"
echo ""

# 构建测试
echo -e "${YELLOW}步骤 3: 本地构建测试...${NC}"
npm run build
echo -e "${GREEN}✓ 构建成功${NC}"
echo ""

# 检查 vercel.json
echo -e "${YELLOW}步骤 4: 检查 Vercel 配置...${NC}"
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓ vercel.json 存在${NC}"
    cat vercel.json
else
    echo -e "${RED}✗ vercel.json 不存在，创建中...${NC}"
    cat > vercel.json << 'EOF'
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
EOF
    echo -e "${GREEN}✓ vercel.json 创建完成${NC}"
fi
echo ""

# 检查是否已登录 Vercel
echo -e "${YELLOW}步骤 5: 检查 Vercel 登录状态...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}请先登录 Vercel...${NC}"
    vercel login
else
    echo -e "${GREEN}✓ 已登录 Vercel${NC}"
    vercel whoami
fi
echo ""

# 部署到 Vercel
echo -e "${YELLOW}步骤 6: 部署到 Vercel...${NC}"
echo -e "${BLUE}提示: 如果是首次部署，请按照交互提示选择项目设置${NC}"
echo ""

# 检查是否已有 Vercel 项目配置
if [ -d ".vercel" ]; then
    echo -e "${GREEN}✓ 检测到已有 Vercel 项目配置${NC}"
    echo -e "${YELLOW}执行生产环境部署...${NC}"
    vercel --prod
else
    echo -e "${YELLOW}首次部署，进入初始化流程...${NC}"
    echo ""
    echo "请按照提示操作："
    echo "  1. 选择 'Continue to Existing Project' 或 'Add New Project'"
    echo "  2. 选择或输入项目名称"
    echo "  3. 选择目录 (默认当前目录)"
    echo "  4. 选择框架预设: Vite"
    echo ""
    vercel
fi

echo ""
echo "=========================================="
echo -e "${GREEN}  部署流程执行完毕！${NC}"
echo "=========================================="
echo ""
echo -e "${YELLOW}后续操作提示:${NC}"
echo "  1. 访问 Vercel Dashboard 查看部署状态"
echo "     https://vercel.com/dashboard"
echo ""
echo "  2. 配置自定义域名 (可选)"
echo "     Project Settings > Domains"
echo ""
echo "  3. 设置环境变量 (如需要)"
echo "     Project Settings > Environment Variables"
echo ""
echo "  4. 启用自动部署"
echo "     连接 GitHub 仓库后，每次 push 会自动部署"
echo ""
