#!/usr/bin/env bash
set -e

BUMP_TYPE="${1:-auto}"
CUSTOM_MSG="${2:-}"

echo "========================================================"
echo "🚀 سامانه انتشار خودکار چندپلتفرمه بازی رزم‌نامه"
echo "   Razmnameh Automated SemVer & Multi-Device Publisher"
echo "========================================================"

if [ ! -d ".git" ]; then
  git init
  git config user.name "Razmnameh Studio"
  git config user.email "hyn198911@gmail.com"
fi

git branch -M main

node scripts/auto-release.mjs "$BUMP_TYPE" "$CUSTOM_MSG"
