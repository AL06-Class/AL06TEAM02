#!/bin/bash
# 촬영몬 개발 서버 종료 (Mac). 더블클릭.
cd "$(dirname "$0")"
docker compose down
echo "🛑 서버를 종료했습니다."
sleep 1
