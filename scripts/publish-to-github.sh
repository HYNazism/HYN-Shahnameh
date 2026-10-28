#!/usr/bin/env bash
set -e

echo "========================================================"
echo "🚀 آماده‌سازی و انتشار مخزن بازی رزم‌نامه روی گیت‌هاب"
echo "   Razmnameh Studio - Multi-Platform GitHub Release"
echo "========================================================"

# ۱. مقداردهی اولیه گیت در صورت لزوم
if [ ! -d ".git" ]; then
  echo "📦 مقداردهی اولیه مخزن محلی گیت (git init)..."
  git init
  git config user.name "Razmnameh Studio"
  git config user.email "hyn198911@gmail.com"
fi

# ۲. اطمینان از تنظیم برنچ اصلی روی main
git branch -M main

# ۳. افزودن فایل‌ها و ثبت کامیت
echo "📝 افزودن فایل‌های پروژه و کامپوننت‌های چندپلتفرمه..."
git add .
git commit -m "feat: Razmnameh multi-platform release v1.0.0 with crypto vaults and PWA" || echo "تغییر جدیدی برای کامیت وجود ندارد."

# ۴. ایجاد تگ نسخه جهت راه‌اندازی خودکار GitHub Actions Release
echo "🏷️ ایجاد تگ ریلیز نسخه v1.0.0..."
git tag -d v1.0.0 2>/dev/null || true
git tag -a v1.0.0 -m "انتشار رسمی نسخه ۱.۰.۰ رزم‌نامه با پشتیبانی از وب، اندروید، دسکتاپ و درگاه‌های کریپتو"

echo "========================================================"
echo "✅ مخزن محلی با موفقیت آماده شد!"
echo ""
echo "برای ارسال به گیت‌هاب و فعال شدن ریلیز خودکار GitHub Actions:"
echo "۱. در گیت‌هاب یک مخزن جدید (New Repository) با نام دلخواه بسازید."
echo "۲. دستور زیر را با لینک مخزن خود در ترمینال اجرا کنید:"
echo ""
echo "   git remote add origin https://github.com/USERNAME/REPO_NAME.git"
echo "   git push -u origin main --tags"
echo ""
echo "با اجرای دستور بالا، گیت‌هاب اکشنز به طور خودکار بسته‌های"
echo "اندروید، دسکتاپ، PWA و فایل‌های ZIP را تولید و پابلیش می‌کند."
echo "========================================================"
