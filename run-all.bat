@echo off
title EVN Tracker - Fullstack
cd /d "%~dp0"
echo ====================================================
echo   Khoi dong Fullstack (Backend 3001 + Frontend 5173)
echo ====================================================
start http://localhost:5173
npm run dev
pause
