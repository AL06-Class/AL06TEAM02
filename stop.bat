@echo off
rem Shootmon dev server - stop (Windows). Double-click to run.
cd /d "%~dp0"
docker compose down
echo Server stopped.
ping -n 3 127.0.0.1 >nul
