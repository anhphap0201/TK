# EVN Tra Cứu Tiền Điện & Thanh Toán Trực Tuyến

Hệ thống **Tra cứu tiền điện sinh hoạt** và **Đóng tiền điện trực tuyến** theo biểu giá bậc thang 6 bậc luỹ kế chuẩn EVN.

---

## 🌟 Tính Năng Nổi Bật

1. **Xác thực linh hoạt (Auth)**:
   - **Khách hàng**: Tra cứu tức thì bằng **Mã khách hàng** (ví dụ: `KH0001`, `KH0002`...) không cần mật khẩu.
   - **Quản trị viên (Admin)**: Nhập mã `admin` vào ô mã khách hàng -> tự động hiện ô nhập mật khẩu quản trị (mặc định: `admin123`).

2. **Theo dõi lịch sử tiền điện (4 năm)**:
   - Dữ liệu lưu trữ dưới dạng sản lượng kWh thực tế của từng tháng; tiền điện và chi tiết 6 bậc luỹ kế được **tính toán động** tại thời điểm tra cứu dựa trên biểu giá hiện hành.
   - Hiển thị đầy đủ: Chỉ số cũ, chỉ số mới, điện tiêu thụ (kWh), thành tiền trước thuế, thuế VAT 8%, tổng tiền, trạng thái thanh toán.
   - Bảng phân tích chi tiết từng bậc EVN và hỗ trợ chế độ In hoá đơn (Print-friendly).

3. **Đóng tiền điện trực tuyến**:
   - Tích hợp cổng thanh toán **PayOS (VietQR)** (quét mã QR chuẩn NAPAS 247 chuyển khoản liên ngân hàng tự động nhận diện hóa đơn).
   - Hỗ trợ nút **Mô phỏng thanh toán nhanh (Quick Simulation)** để test nghiệp vụ chuyển trạng thái nợ cước mà không cần app ngân hàng thật.

4. **Biểu đồ xu hướng sử dụng điện**:
   - Biểu đồ kết hợp cột (kWh) và đường (VNĐ) theo từng tháng.
   - Bộ lọc xem theo từng năm (`2023`, `2024`, `2025`, `2026`) hoặc toàn bộ 4 năm.

5. **Trang Quản Trị Viên (Admin Portal)**:
   - Quản lý danh sách 1,000 khách hàng (tìm kiếm theo mã KH, họ tên, số điện thoại, mã công tơ; phân trang).
   - Thêm, sửa, xoá khách hàng.
   - Cấu hình biểu giá 6 bậc EVN & thuế VAT.
   - Cấu hình tham số kết nối cổng thanh toán PayOS (`clientId`, `apiKey`, `checksumKey`).

6. **Dữ liệu mẫu thực tế (Python Generator)**:
   - Script Python sinh tự động 1,000 khách hàng với lịch sử dùng điện ngẫu nhiên trong 4 năm.
   - Số điện biến thiên tự nhiên +- 20 đến 100 kWh/tháng.
   - Mùa hè (tháng 5, 6, 7, 8) tăng 10% - 30% do sử dụng điều hoà.
   - Chạy lại dữ liệu mẫu bất cứ lúc nào qua lệnh: `python server/scripts/generate_seed_data.py`.

---

## 🚀 Khởi Chạy Nhanh Bằng File `.bat` (Windows)

- Nhấp đúp vào [`run-all.bat`](file:///f:/PKA/Code/KT/run-all.bat) để khởi chạy cả Backend và Frontend, tự động mở trình duyệt `http://localhost:5173`.
- Hoặc chạy riêng:
  - [`run-server.bat`](file:///f:/PKA/Code/KT/run-server.bat): Chạy Backend cổng `3001`.
  - [`run-client.bat`](file:///f:/PKA/Code/KT/run-client.bat): Chạy Frontend cổng `5173`.

---

## 🔑 Tài Khoản Thử Nghiệm

- **Khách hàng**: Nhập `KH0001`, `KH0002`, `KH0015` hoặc chọn nút thử nhanh trên giao diện.
- **Quản trị viên**: Nhập `admin` -> Mật khẩu: `admin123`.
