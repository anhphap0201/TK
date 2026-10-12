# HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH TRÊN MÁY TÍNH MỚI
## Dự án: Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN

Tài liệu này hướng dẫn chi tiết các bước thiết lập, cài đặt thư viện và khởi chạy ứng dụng web khi sao chép toàn bộ dự án sang một máy tính mới.

---

## 1. Yêu Cầu Môi Trường Tiên Quyết (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính đã cài đặt:
1. **Node.js**: Phiên bản **LTS 20.x trở lên** (khuyến nghị **Node.js 24.x** để hỗ trợ module `node:sqlite` tích hợp sẵn tốt nhất).
   - Link tải chính thức: [https://nodejs.org/](https://nodejs.org/)
   - Kiểm tra bằng lệnh: `node -v` và `npm -v` trong Command Prompt hoặc PowerShell.
2. *(Tùy chọn)* **Python 3.x**: Dùng nếu bạn muốn sinh lại bộ dữ liệu mẫu ngẫu nhiên 1.000 khách hàng mới (`server/scripts/generate_seed_data.py`).
3. *(Tùy chọn)* **Navicat for SQLite** hoặc **DB Browser for SQLite**: Dùng để mở và quan sát cơ sở dữ liệu `server/data/electricity.db`.

---

## 2. Cài Đặt Tự Động Bằng 1 Click (Khuyến Nghị)

Nhấp đúp chuột vào file:

```text
setup.bat
```

Script này sẽ tự động:
- Kiểm tra phiên bản Node.js trên máy.
- Cài đặt toàn bộ thư viện cần thiết tại thư mục gốc (`concurrently`).
- Cài đặt các thư viện Backend trong thư mục `server/` (`express`, `cors`...).
- Cài đặt các thư viện Frontend trong thư mục `client/` (`vue`, `vite`, `tailwindcss`, `lucide-vue-next`...).
- Kiểm tra và đảm bảo file cơ sở dữ liệu `server/data/electricity.db` đã sẵn sàng.

---

## 3. Cài Đặt Bằng Dòng Lệnh Thủ Công (Alternative)

Nếu không chạy qua file `.bat`, bạn có thể mở terminal tại thư mục gốc của dự án (`KT/`) và gõ các lệnh sau:

```bash
# 1. Cài đặt thư viện quản lý tiến trình đồng thời
npm install

# 2. Cài đặt dependencies cho Backend Server
npm --prefix server install

# 3. Cài đặt dependencies cho Frontend Client
npm --prefix client install
```

---

## 4. Hướng Dẫn Khởi Chạy Ứng Dụng

Sau khi cài đặt xong, bạn có thể khởi chạy bằng 1 trong các cách sau:

### Cách 1: Chạy toàn bộ (Cả Backend và Frontend)
- Nhấp đúp vào file **`run-all.bat`** (Tự động mở trình duyệt `http://localhost:5173`).
- Hoặc gõ lệnh: `npm run dev`

### Cách 2: Chạy riêng từng phần
- **Chạy Backend:** Nhấp đúp vào **`run-server.bat`** (Lắng nghe tại cổng `http://localhost:3001`).
- **Chạy Frontend:** Nhấp đúp vào **`run-client.bat`** (Lắng nghe tại cổng `http://localhost:5173`).

---

## 5. Hướng Dẫn Chạy Bộ Test Tự Động (Automated Testing)

Để chạy bộ kiểm thử tự động phục vụ bài tập lớn môn Kiểm định chất lượng phần mềm:

```bash
# Chạy bộ test tự động
npm --prefix server test
```

Hệ thống sẽ chạy file test `server/test/customer_lookup.test.js` (và file `server/test/admin_tariffs.test.js` khi Tester 2 thêm vào) và báo kết quả **100% Passed**.

---

## 6. Thông Tin Đăng Nhập & Tài Khoản Mẫu

- **Cổng Khách Hàng (Tra cứu tiền điện):**
  - Nhập một trong các mã khách hàng có sẵn: `KH0001`, `KH0002`, `KH0015`...
  - Nhập số điện thoại để mở khóa toàn bộ lịch sử (Ví dụ tài khoản `KH0001` có số điện thoại là: `0884980616`).
- **Cổng Quản Trị Viên (Admin):**
  - Nhập mã: `admin` vào ô tra cứu.
  - Mật khẩu quản trị mặc định: `admin123`.

---

## 7. Cấu Trúc Thư Mục Dự Án

```text
KT/
├── client/                     # Mã nguồn Frontend (Vue 3, Vite, Tailwind CSS)
│   ├── src/components/         # Các component giao diện (Portal, Modal, Chart)
│   └── package.json
├── server/                     # Mã nguồn Backend API (Express.js, Node.js 24)
│   ├── data/electricity.db    # Cơ sở dữ liệu SQLite
│   ├── src/routes/             # Các API router (readings, auth, customers, tariffs)
│   ├── test/                   # Thư mục chứa các file hàm test tự động
│   └── package.json
├── docs/                       # Thư mục lưu trữ bộ 3 tài liệu kiểm thử chính thức
│   ├── SRS_Dac_Ta_Yeu_Cau.md   # Đặc tả yêu cầu phần mềm
│   ├── Test_Plan_Kiem_Thu.md   # Kế hoạch kiểm thử
│   ├── Test_Cases_Chi_Tiet.md  # Danh sách 25 Test Cases chi tiết
│   └── HUONG_DAN_TESTER_2.md   # Hướng dẫn viết test case cho người thứ 2
├── setup.bat                   # File .bat cài đặt tự động toàn bộ thư viện trên máy mới
├── HUONG_DAN_CAI_DAT.md        # File hướng dẫn chi tiết này
├── run-all.bat                 # Khởi chạy toàn bộ hệ thống
├── run-server.bat              # Khởi chạy riêng Backend
└── run-client.bat              # Khởi chạy riêng Frontend
```
