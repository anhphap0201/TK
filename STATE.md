# STATE.md - Handoff State

## 1. Current Goal
Xây dựng và hoàn thiện Hệ Thống Tra Cứu & Quản Trị Tiền Điện EVN (Phenikaa University):
- Tái cấu trúc bộ kiểm thử & tài liệu kỹ thuật theo phân vai Tester 1 (Đàm Anh Pháp - 23010360) và Tester 2 (Bùi Văn Đại - 23010366).
- Tích hợp cổng thanh toán thực tế PayOS (VietQR) và VNPAY Sandbox.
- Chuẩn hóa toàn bộ giao diện người dùng theo ngôn ngữ thiết kế **Flat UI / Modern Minimal**.
- Xây dựng **Admin Dashboard Điều Hành Ngành Điện** (giám sát sản lượng, doanh thu, tăng trưởng MoM, cơ cấu 6 bậc, công nợ) và cấp quyền cho Admin phân tích chi tiết hồ sơ tiêu thụ của từng cá nhân.

---

## 2. Completed Steps
1. **Tái cấu trúc bộ kiểm thử tự động**:
   - Tách các file kiểm thử nguyên khối cũ thành 2 thư mục độc lập: `server/test/customer/` (3 files) và `server/test/admin/` (5 files).
   - Xóa bỏ các file test cũ trùng lặp (`Admin_lookup.test.js`, `customer_lookup.test.js`).
   - Cấu hình lệnh kiểm thử `node --test --test-concurrency=1` trong `server/package.json` ngăn lỗi SQLite database locked trên Windows. Bộ 23/23 unit tests vượt qua 100%.
2. **Cập nhật hồ sơ tài liệu theo mẫu chuẩn & kỹ năng humanizer**:
   - `docs/SRS_Dac_Ta_Yeu_Cau.md`: Đặc tả yêu cầu phần mềm chi tiết.
   - `docs/Test_Plan_Kiem_Thu.md`: Kế hoạch kiểm thử phân công nhân sự Đàm Anh Pháp & Bùi Văn Đại.
   - `docs/Test_Cases_Chi_Tiet.md`: Danh mục ca kiểm thử chi tiết.
   - `docs/HUONG_DAN_TESTER_2.md`: Hướng dẫn kiểm thử cho Tester 2.
3. **Tích hợp cổng thanh toán PayOS & VNPAY**:
   - Cấu hình PayOS với thông tin credentials được cấp (`8a373872-a401-488c-8d6d-711cc600ea0c`, `e7f4a56a-5b06-4edd-9929-de63796cd0be`, `6bc8a3513de774f8a8655c9ea9544c3186fec3b9f3881f25524dbb4fc54b8843`).
   - Cung cấp 3 luồng thanh toán: PayOS VietQR, VNPAY Sandbox, Test Bypass gạch nợ tức thì. Không kèm bài test mới (`--no-test` boundary).
4. **Tái thiết kế giao diện Flat UI / Modern Minimal**:
   - Tích hợp Google Fonts `Geist` và `JetBrains Mono` (`font-mono tabular-nums`).
   - Nền canvas `#FAFAFA`, thẻ trắng viền phẳng `1px solid #EAEAEA`, màu chữ charcoal `#171717` và muted `#737373`.
   - Loại bỏ hoàn toàn hiệu ứng đổ bóng mờ màu mè (`shadow-2xl`), góc bo tròn bong bóng (`rounded-3xl`); chuẩn hóa về góc phẳng sắc sảo (`rounded-md` / `rounded-lg`).
   - Muted pastel status badges: Đã thanh toán (`#EDF3EC`), Chưa đóng (`#FDF6E7`), Chấm dứt (`#FDEBEC`).
5. **Xây dựng Backend Analytics API (`server/src/routes/stats.js`)**:
   - `GET /api/stats/dashboard`: Tổng hợp dữ liệu động 49 kỳ (2022 – 2026) cho 1.000 khách hàng (27.580 bản ghi chỉ số).
   - Tính toán 5 chỉ số then chốt (Sản lượng kWh, Doanh thu VNĐ, Tỷ lệ thu hồi cước %, Nợ đọng, Tiêu thụ bình quân/hộ).
   - Tỷ lệ tăng trưởng % MoM của sản lượng và tiền.
   - Cơ cấu sản lượng rơi vào 6 bậc thang EVN.
   - `GET /api/stats/period/:period`: Drill-down kỳ cụ thể, phân nhóm hộ tiêu thụ và trả về Top 20 khách hàng nợ cước lớn nhất kỳ.
6. **Cấp quyền Admin phân tích chi tiết từng cá nhân**:
   - Cập nhật `server/src/routes/readings.js`: Hỗ trợ tham số `admin=true` / token quản trị để mở khóa toàn bộ lịch sử 4 năm, biểu đồ và thông tin cá nhân của từng khách hàng mà không bị chặn bởi bước xác thực SĐT.
7. **Frontend Admin Dashboard & Chuyển đổi chế độ cá nhân**:
   - Tạo `client/src/components/AdminDashboard.vue` gồm 5 thẻ KPI Bento, 4 biểu đồ Chart.js tương tác (Combo Bar+Line, Bar tăng trưởng MoM, Doughnut 6 bậc, Stacked Bar công nợ), bảng chi tiết theo kỳ, modal drill-down và thanh tra cứu cá nhân trực tiếp.
   - Cập nhật `client/src/components/AdminPortal.vue`: Thêm thanh điều hướng Tab "Dashboard Giám Sát" và "Hồ Sơ Khách Hàng".
   - Cập nhật `client/src/App.vue`: Thêm thanh banner Quản trị viên khi xem hồ sơ cá nhân và nút `← Quay lại Admin Dashboard`.

---

## 3. Next Immediate Step
- **Mở phiên chat mới (Fresh Session)**: Ngữ cảnh của phiên này đã hoàn thành toàn diện các yêu cầu lớn. Khởi tạo chat mới để giữ token tối ưu.
- Nếu có yêu cầu mở rộng: Có thể bổ sung tính năng xuất báo cáo Excel/PDF cho Dashboard hoặc tùy biến thêm bộ lọc nâng cao theo khu vực địa lý/quận huyện.

---

## 4. Modified Files
- `client/index.html`
- `client/src/style.css`
- `client/src/api.js`
- `client/src/App.vue`
- `client/src/components/AdminDashboard.vue` *(mới tạo)*
- `client/src/components/AdminPortal.vue`
- `client/src/components/CustomerPortal.vue`
- `client/src/components/ElectricityChart.vue`
- `client/src/components/LookupLogin.vue`
- `client/src/components/PaymentModal.vue`
- `client/src/components/QuickCalculator.vue`
- `client/src/components/ReadingDetailModal.vue`
- `client/src/components/TariffModal.vue`
- `client/src/components/TierBreakdownTable.vue`
- `server/package.json`
- `server/src/db.js`
- `server/src/index.js`
- `server/src/routes/payment.js`
- `server/src/routes/readings.js`
- `server/src/routes/stats.js`
- `server/test/customer/lookup.test.js`
- `server/test/customer/billing.test.js`
- `server/test/customer/security.test.js`
- `server/test/admin/auth.test.js`
- `server/test/admin/customers_crud.test.js`
- `server/test/admin/customers_search.test.js`
- `server/test/admin/tariffs.test.js`
- `server/test/admin/calculator.test.js`
- `docs/SRS_Dac_Ta_Yeu_Cau.md`
- `docs/Test_Plan_Kiem_Thu.md`
- `docs/Test_Cases_Chi_Tiet.md`
- `docs/HUONG_DAN_TESTER_2.md`

---

## 5. Lingering Bugs / Warnings
- **Không có bug tồn đọng**: Cả frontend Vite build (`npm run build`) và backend tests (`npm test` 23/23 test cases) đều đã được xác minh thành công.
- **Lưu ý vận hành**: Chạy backend server trước khi mở frontend client để các API `/api/stats/dashboard`, `/api/payment` và `/api/readings` hoạt động đồng bộ.
