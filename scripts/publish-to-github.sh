#!/usr/bin/env bash
set -e

echo "========================================================"
echo "🚀 آماده‌سازی و انتشار مخزن بازی رزم‌نامه روی گیت‌هاب (v1.0.5)"
echo "   Razmnameh Studio - Multi-Platform GitHub Release v1.0.5"
echo "========================================================"

if [ ! -d ".git" ]; then
  echo "📦 مقداردهی اولیه مخزن محلی گیت (git init)..."
  git init
  git config user.name "Razmnameh Studio"
  git config user.email "hyn198911@gmail.com"
fi

git branch -M main

echo "🔨 ساخت بسته‌های چندپلتفرمه نسخه v1.0.5..."
npm run build:releases

echo "📝 افزودن فایل‌های پروژه و بسته‌های ریلیز..."
git add -A
git commit -m "release: Razmnameh multi-platform release v1.0.5 (Qahveh-Khaneh & StoryLogicManager)" || echo "تغییر جدیدی برای کامیت وجود ندارد."

echo "🏷️ بروزرسانی تگ ریلیز نسخه v1.0.5..."
git tag -d v1.0.5 2>/dev/null || true
git tag -a v1.0.5 -m "Release v1.0.5: Authentic Qahveh-Khaneh visual style, StoryLogicManager & Multi-Platform Bundles"

echo "========================================================"
echo "✅ مخزن محلی و تگ‌های v1.0.0 تا v1.0.5 آماده شدند!"
echo "   git remote add origin https://github.com/USERNAME/REPO_NAME.git"
echo "   git push -u origin main --tags"
echo "========================================================"
