#!/bin/bash
# 촬영몬 개발 서버 원클릭 실행 (Mac)
# 사용법: 이 파일을 더블클릭. (처음 한 번은 우클릭 → 열기)
cd "$(dirname "$0")"

if ! docker info >/dev/null 2>&1; then
  echo "⚠️  Docker Desktop을 먼저 실행한 뒤 다시 시도해 주세요."
  read -p "엔터를 누르면 닫힙니다..."
  exit 1
fi

echo "🐳 촬영몬 개발 서버를 시작합니다..."
docker compose up -d

echo "⏳ 서버 준비 중 (첫 실행은 의존성 설치로 몇 분 걸립니다)..."
until curl -s -o /dev/null http://localhost:5173; do sleep 3; done

echo "✅ 준비 완료 → http://localhost:5173"
open http://localhost:5173
