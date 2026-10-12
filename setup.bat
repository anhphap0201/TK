@echo off
chcp 65001 >nul
title Cai dat He thong Tra Cuu Tien Dien EVN
cd /d "%~dp0"

echo ======================================================================
echo    BẮT ĐẦU CÀI ĐẶT DỰ ÁN HỆ THỐNG TRA CỨU TIỀN ĐIỆN EVN
echo ======================================================================
echo.

:: 1. Kiểm tra Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LỖI] Chưa tìm thấy Node.js trên máy tính!
    echo Vui lòng tải và cài đặt Node.js LTS (>= 20.x hoặc khuyến nghị 24.x) tại:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo [1/5] Đã phát hiện Node.js phiên bản: %NODE_VERSION%
echo.

:: 2. Cài đặt dependencies tại thư mục gốc (root)
echo [2/5] Đang cài đặt thư viện quản lý tiến trình gốc (concurrently)...
call npm install
if %errorlevel% neq 0 (
    echo [CẢNH BÁO] Có lỗi khi cài đặt thư viện gốc!
)
echo.

:: 3. Cài đặt dependencies cho Backend Server
echo [3/5] Đang cài đặt thư viện Backend Server (server/node_modules)...
call npm --prefix server install
if %errorlevel% neq 0 (
    echo [LỖI] Cài đặt dependencies cho Backend thất bại!
    pause
    exit /b 1
)
echo.

:: 4. Cài đặt dependencies cho Frontend Client
echo [4/5] Đang cài đặt thư viện Frontend Client (client/node_modules)...
call npm --prefix client install
if %errorlevel% neq 0 (
    echo [LỖI] Cài đặt dependencies cho Frontend thất bại!
    pause
    exit /b 1
)
echo.

:: 5. Khởi tạo/Kiểm tra cơ sở dữ liệu SQLite
echo [5/5] Kiểm tra cơ sở dữ liệu SQLite (server/data/electricity.db)...
if not exist "server\data\electricity.db" (
    echo Đang tạo mới và nạp dữ liệu mẫu 1000 khách hàng...
    where python >nul 2>nul
    if %errorlevel% equ 0 (
        python server/scripts/generate_seed_data.py
    ) else (
        echo [LƯU Ý] Chưa tìm thấy Python. Cơ sở dữ liệu sẽ được tự động khởi tạo khi chạy server!
    )
) else (
    echo Cơ sở dữ liệu server\data\electricity.db đã sẵn sàng!
)

echo.
echo ======================================================================
echo    CÀI ĐẶT HOÀN TẤT THÀNH CÔNG 100%%!
echo ======================================================================
echo.
echo Bạn có thể khởi động hệ thống ngay bằng cách:
echo   1. Nhấp đúp vào file "run-all.bat" để chạy cả Backend và Frontend.
echo   2. Truy cập trình duyệt tại: http://localhost:5173
echo.
pause
