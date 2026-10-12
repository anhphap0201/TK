@echo off
title EVN Tracker - Frontend Client
cd /d "%~dp0"
echo ====================================================
echo   Khoi dong Frontend Client (Vite Vue - Port 5173)
echo ====================================================
start http://localhost:5173
npm run client
pause
