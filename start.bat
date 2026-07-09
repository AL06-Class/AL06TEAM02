@echo off
rem Shootmon dev server - one click (Windows). Double-click to run.
cd /d "%~dp0"

docker info >nul 2>&1
if errorlevel 1 (
  echo [!] Please start Docker Desktop first, then run this again.
  pause
  exit /b 1
)

echo Starting Shootmon dev server...
docker compose up -d

echo Waiting for server... first run takes a few minutes.
:wait
ping -n 4 127.0.0.1 >nul
curl -s -o nul http://localhost:5173 2>nul
if errorlevel 1 goto wait

echo Ready - opening http://localhost:5173
start http://localhost:5173
