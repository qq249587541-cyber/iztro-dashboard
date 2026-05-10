#!/bin/bash
# 一键部署 iztro-dashboard 到 gh-pages
set -e

cd /root/.openclaw/workspace/iztro-dashboard

# 1. 确保 dist 产物是最新的
npm run build

# 2. 进入 dist 目录（gh-pages 分支工作树）
cd dist

# 3. 添加所有文件
git add -A

# 4. 提交（如果有变更）
if git diff --cached --quiet; then
  echo "No changes to deploy"
  exit 0
fi

git commit -m "古排笔记风格 v7.2 - 古籍纸张底+暗金装饰+朱砂印章"

# 5. Push
git push origin gh-pages

echo "✅ Deployed to https://qq249587541-cyber.github.io/iztro-dashboard/"
