@echo off
chcp 65001 >nul
rem 촬영몬 개발 서버 종료 (Windows). 더블클릭.
cd /d "%~dp0"
docker compose down
echo [+] 서버를 종료했습니다.
timeout /t 2 >nul
