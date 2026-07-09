@echo off
chcp 65001 >nul
rem 촬영몬 개발 서버 원클릭 실행 (Windows)
rem 사용법: 이 파일을 더블클릭.
cd /d "%~dp0"

docker info >nul 2>&1
if errorlevel 1 (
  echo [!] Docker Desktop을 먼저 실행한 뒤 다시 시도해 주세요.
  pause
  exit /b 1
)

echo [*] 촬영몬 개발 서버를 시작합니다...
docker compose up -d

echo [*] 서버 준비 중 (첫 실행은 의존성 설치로 몇 분 걸립니다)...
:wait
timeout /t 3 >nul
curl -s -o nul http://localhost:5173 2>nul
if errorlevel 1 goto wait

echo [+] 준비 완료 : http://localhost:5173
start http://localhost:5173
