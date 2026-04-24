#!/bin/bash

# Vercel Token 部署脚本
# 使用 Vercel Token 进行非交互式部署

set -e

echo "=========================================="
echo "  Vercel Token 部署脚本"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}此脚本使用 Vercel Token 进行部署${NC}"
echo ""
echo "请先在 Vercel Dashboard 获取 Token:"
echo "  1. 访问 https://vercel.com/account/tokens"
echo "  2. 点击 'Create Token'"
echo "  3. 输入 Token 名称，选择 Scope"
echo "  4. 复制生成的 Token"
echo ""

# 检查是否已有 Token
if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${YELLOW}请输入你的 Vercel Token:${NC}"
    read -s VERCEL_TOKEN
    echo ""
fi

if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}错误: 未提供 Token${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Token 已接收${NC}"
echo ""

# 构建项目
echo -e "${YELLOW}正在构建项目...${NC}"
npm run build
echo -e "${GREEN}✓ 构建完成${NC}"
echo ""

# 使用 Token 部署
echo -e "${YELLOW}正在部署到 Vercel...${NC}"
echo ""

# 检查是否已有项目配置
if [ -d ".vercel" ]; then
    # 已有项目，直接部署
    vercel --token="$VERCEL_TOKEN" --prod --yes
else
    # 新项目，需要初始化
    echo "首次部署，创建新项目..."
    vercel --token="$VERCEL_TOKEN" --yes \
        --name="finance-portfolio" \
        --framework="vite"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}  部署完成！${NC}"
echo "=========================================="
