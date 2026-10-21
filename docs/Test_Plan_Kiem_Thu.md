# Trường Đại học Phenikaa
## Khoa Công nghệ Thông tin
### Bài tập lớn môn học: Đánh giá và kiểm định chất lượng phần mềm

---

# TÀI LIỆU KẾ HOẠCH KIỂM THỬ (TEST PLAN)
## Đề tài: Kiểm thử Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN

- **Nhóm sinh viên thực hiện:** Nhóm sinh viên Phenikaa
- **Thành viên tham gia:**
  - **Đàm Anh Pháp (MSV: 23010360) - Tester 1:** Phụ trách Phân hệ Tra cứu khách hàng, bảo mật số điện thoại 2 lớp, giao diện Flat UI và tích hợp thanh toán trực tuyến đa kênh (PayOS VietQR, VNPAY Sandbox).
  - **Bùi Văn Đại (MSV: 23010366) - Tester 2:** Phụ trách Phân hệ Quản trị khách hàng, cấu hình biểu giá EVN, thuật toán tính tiền điện 6 bậc, Trung tâm Điều hành Quản trị Ngành điện (Admin Executive Dashboard) và phân quyền phân tích hồ sơ cá nhân.
- **Ngày cập nhật:** 20/10/2026
- **Phiên bản tài liệu:** 1.2

---

## MỤC LỤC

- [1. Giới thiệu](#1-giới-thiệu)
  - [1.1 Mục đích](#11-mục-đích)
  - [1.2 Tổng quan hệ thống](#12-tổng-quan-hệ-thống)
  - [1.3 Phạm vi tài liệu](#13-phạm-vi-tài-liệu)
  - [1.4 Các định nghĩa và từ viết tắt](#14-các-định-nghĩa-và-từ-viết-tắt)
- [2. Tài liệu tham khảo](#2-tài-liệu-tham-khảo)
- [3. Lịch trình công việc](#3-lịch-trình-công-việc)
  - [3.1 Bảng phân bổ lịch trình (Milestones & Deliverables)](#31-bảng-phân-bổ-lịch-trình-milestones--deliverables)
  - [3.2 Biểu đồ tiến độ Gantt (Gantt Chart Timeline)](#32-biểu-đồ-tiến-độ-gantt-gantt-chart-timeline)
- [4. Yêu cầu về tài nguyên](#4-yêu-cầu-về-tài-nguyên)
  - [4.1 Phần cứng](#41-phần-cứng)
  - [4.2 Phần mềm và môi trường](#42-phần-mềm-và-môi-trường)
  - [4.3 Công cụ kiểm thử](#43-công-cụ-kiểm-thử)
  - [4.4 Nhân sự và phân công trách nhiệm](#44-nhân-sự-và-phân-công-trách-nhiệm)
- [5. Phạm vi kiểm thử chi tiết](#5-phạm-vi-kiểm-thử-chi-tiết)
  - [5.1 Chức năng trong phạm vi (In-Scope)](#51-chức-năng-trong-phạm-vi-in-scope)
  - [5.2 Chức năng ngoài phạm vi (Out-of-Scope)](#52-chức-năng-ngoài-phạm-vi-out-of-scope)
- [6. Cấu trúc bộ kịch bản kiểm thử tự động](#6-cấu-trúc-bộ-kịch-bản-kiểm-thử-tự-động)
- [7. Chiến lược kiểm thử](#7-chiến-lược-kiểm-thử)
- [8. Điều kiện dừng và tiêu chuẩn nghiệm thu](#8-điều-kiện-dừng-và-tiêu-chuẩn-nghiệm-thu)
- [9. Quản lý và theo dõi lỗi](#9-quản-lý-và-theo-dõi-lỗi)
- [10. Các sản phẩm bàn giao](#10-các-sản-phẩm-bàn-giao)

---

# 1. Giới thiệu

## 1.1 Mục đích
Kế hoạch kiểm thử này xác định mục tiêu, phạm vi, nguồn lực, môi trường, phương pháp thực hiện và tiêu chuẩn nghiệm thu cho hệ thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN. Trọng tâm của kế hoạch là kiểm tra tính chính xác của công thức tính tiền điện theo biểu giá lũy kế 6 bậc, đánh giá cơ chế bảo mật thông tin 2 lớp cho khách hàng, xác thực các kênh thanh toán trực tuyến (PayOS VietQR, VNPAY Sandbox), kiểm định hoạt động của Trung tâm Điều hành Ngành điện (Admin Executive Dashboard) và bảo đảm tính ổn định của mã nguồn thông qua bộ kiểm thử tự động.

## 1.2 Tổng quan hệ thống
Hệ thống là ứng dụng web hai phân hệ:
1. **Cổng khách hàng (Customer Portal):** Người dùng tra cứu thông tin hóa đơn tiền điện theo mã khách hàng. Cơ chế bảo vệ dữ liệu 2 lớp chỉ hiển thị hóa đơn tháng gần nhất ở chế độ cơ bản và yêu cầu xác thực số điện thoại chính chủ để xem toàn bộ lịch sử 4 năm, địa chỉ, mã công tơ và biểu đồ tiêu thụ. Hệ thống tích hợp thanh toán trực tuyến đa kênh (PayOS VietQR, VNPAY Sandbox, mô phỏng gạch nợ nhanh) trên nền giao diện Flat UI / Modern Minimal.
2. **Cổng quản trị viên (Admin Portal):** Quản lý danh sách khách hàng, cập nhật biểu giá điện 6 bậc, điều chỉnh thuế VAT, vận hành Trung tâm Điều hành Ngành điện với 5 chỉ số KPI, 4 biểu đồ Chart.js, phân tích tăng trưởng MoM, rà soát công nợ kỳ, danh sách Top 20 khách hàng nợ cước và công cụ tra cứu phân tích hồ sơ từng cá nhân mà không cần số điện thoại.

## 1.3 Phạm vi tài liệu
Tài liệu áp dụng cho toàn bộ hoạt động kiểm thử của đồ án môn học, bao gồm kiểm thử tự động mã nguồn backend (Node.js Test Runner), kiểm thử API tích hợp và kiểm thử thủ công giao diện người dùng (Vue 3).

## 1.4 Các định nghĩa và từ viết tắt

| Thuật ngữ / Viết tắt | Tên đầy đủ tiếng Anh | Giải thích nghĩa |
| :--- | :--- | :--- |
| **AUT** | Application Under Test | Ứng dụng phần mềm đang được kiểm thử |
| **EVN** | Electricity Vietnam | Tập đoàn Điện lực Việt Nam |
| **Mã KH** | Customer Code | Mã khách hàng định danh duy nhất (ví dụ: `KH0001`) |
| **SĐT** | Phone Number | Số điện thoại di động chính chủ của khách hàng |
| **VAT** | Value Added Tax | Thuế giá trị gia tăng (mặc định 8%) |
| **MoM** | Month-over-Month | Tỷ lệ tăng trưởng so với tháng liền kề trước đó |
| **BVA** | Boundary Value Analysis | Kỹ thuật phân tích giá trị biên |
| **EP** | Equivalence Partitioning | Kỹ thuật phân vùng tương đương |
| **SRS** | Software Requirement Specification | Tài liệu đặc tả yêu cầu phần mềm |

---

# 2. Tài liệu tham khảo
1. Tài liệu đặc tả yêu cầu phần mềm: `docs/SRS_Dac_Ta_Yeu_Cau.md` (phiên bản 1.2.0).
2. Hướng dẫn kế hoạch kiểm thử môn học: `docs/Test_Plan_Template_Vn.docx`.
3. Biểu mẫu thiết kế ca kiểm thử: `docs/Test_Case_Template.xlsx`.
4. Hướng dẫn phân công kỹ thuật: `docs/HUONG_DAN_TESTER_2.md`.
5. Quyết định quy định biểu giá bán lẻ điện sinh hoạt của Bộ Công Thương.

---

# 3. Lịch trình công việc

## 3.1 Bảng phân bổ lịch trình (Milestones & Deliverables)

| Milestone | Deliverables | Duration | Start Date | End Date |
| :--- | :--- | :---: | :---: | :---: |
| **1. Lập kế hoạch kiểm thử**<br>*(Test Planning)* | - Tài liệu Kế hoạch kiểm thử (`docs/Test_Plan_Kiem_Thu.md` v1.2)<br>- Phân định mục tiêu, phạm vi kiểm định, tài nguyên và tiêu chí dừng kiểm thử | 3 ngày | 06/10/2026 | 08/10/2026 |
| **2. Xem lại các tài liệu**<br>*(Document & SRS Review)* | - Tài liệu Đặc tả yêu cầu phần mềm (`docs/SRS_Dac_Ta_Yeu_Cau.md`)<br>- Ma trận truy vết yêu cầu (RTM), biểu giá 6 bậc EVN, tài liệu tích hợp cổng PayOS VietQR & VNPAY | 2 ngày | 09/10/2026 | 10/10/2026 |
| **3. Thiết kế các testcase**<br>*(Test Case Design)* | - Tài liệu Thiết kế ca kiểm thử chi tiết (`docs/Test_Cases_Chi_Tiet.md`)<br>- File bảng tính ma trận kiểm thử (`docs/Test_Case_Template.xlsx`) bao quát Customer Portal (bảo mật 2 lớp, thanh toán) và Admin Portal (CRUD, biểu giá, Executive Dashboard) | 3 ngày | 11/10/2026 | 13/10/2026 |
| **4. Viết các testcase**<br>*(Test Case Implementation)* | - Bộ kịch bản kiểm thử tự động `node:test` chia tách 2 thư mục độc lập: `server/test/customer/` và `server/test/admin/`<br>- Danh mục kịch bản kiểm thử thủ công đa kênh và kiểm định Flat UI | 3 ngày | 14/10/2026 | 16/10/2026 |
| **5. Xem lại các testcase**<br>*(Test Case Review)* | - Biên bản thẩm định, đánh giá chéo giữa Tester 1 (Đàm Anh Pháp) & Tester 2 (Bùi Văn Đại)<br>- Tối ưu độ bao phủ biên (BVA), phân vùng tương đương (EP) và các kịch bản bất thường | 1 ngày | 17/10/2026 | 17/10/2026 |
| **6. Thực thi các testcase**<br>*(Test Execution & Defect Logging)* | - Toàn bộ 23 ca kiểm thử tự động đạt kết quả 100% Passed<br>- Nhật ký thực thi kiểm thử giao diện Flat UI, drill-down kỳ Dashboard, Top 20 công nợ và cổng thanh toán sandbox | 2 ngày | 18/10/2026 | 19/10/2026 |
| **7. Ghi nhận và đánh giá kết quả kiểm thử**<br>*(Defect Tracking & Test Reporting)* | - Báo cáo tổng kết nghiệm thu kiểm thử (Test Summary Report)<br>- Xuất bản bộ tài liệu chính thức (`Test_Plan_Kiem_Thu.pdf`, `Test_Cases_Chi_Tiet.pdf`, `SRS_Dac_Ta_Yeu_Cau.pdf`) và đóng gói mã nguồn nghiệm thu | 1 ngày | 20/10/2026 | 20/10/2026 |

## 3.2 Biểu đồ tiến độ Gantt (Gantt Chart Timeline)

| Hoạt động kiểm thử (Milestone) | Tuần 1 (06/10 - 12/10) | Tuần 2 (13/10 - 19/10) | Tuần 3 (20/10) | Người phụ trách chính |
| :--- | :---: | :---: | :---: | :--- |
| **1. Lập kế hoạch kiểm thử** | `[ 06/10 === 08/10 ]` | | | Toàn bộ nhóm kiểm thử |
| **2. Xem lại các tài liệu** | `[ 09/10 = 10/10 ]` | | | Đàm Anh Pháp, Bùi Văn Đại |
| **3. Thiết kế các testcase** | `[ 11/10 = 12/10 ]` | `[ 13/10 ]` | | Đàm Anh Pháp, Bùi Văn Đại |
| **4. Viết các testcase** | | `[ 14/10 === 16/10 ]` | | Đàm Anh Pháp, Bùi Văn Đại |
| **5. Xem lại các testcase** | | `[ 17/10 ]` | | Nhóm QA (Rà soát chéo) |
| **6. Thực thi các testcase** | | `[ 18/10 = 19/10 ]` | | Đàm Anh Pháp, Bùi Văn Đại |
| **7. Ghi nhận & đánh giá kết quả** | | | `[ 20/10 ]` | Toàn bộ nhóm kiểm thử |

---

# 4. Yêu cầu về tài nguyên

## 4.1 Phần cứng
- Máy tính chạy thử nghiệm: CPU tối thiểu 4 nhân (Intel Core i5 hoặc tương đương), RAM tối thiểu 8 GB, dung lượng ổ đĩa trống từ 5 GB trở lên.

## 4.2 Phần mềm và môi trường
- Hệ điều hành: Windows 10/11 x64.
- Runtime backend: Node.js phiên bản 20+ hoặc 24 LTS.
- Trình quản lý gói: npm 10.x.
- Cơ sở dữ liệu: SQLite 3 tích hợp qua module `node:sqlite`.
- Frontend server: Vite dev server chạy tại cổng mặc định `5173`.
- Backend server: Express server chạy tại cổng `3001` (hoặc cổng ngẫu nhiên do hệ điều hành cấp phát khi chạy test tự động).

## 4.3 Công cụ kiểm thử
- **Node.js Test Runner:** Thư viện tích hợp sẵn `node:test` và `node:assert/strict` để chạy các kịch bản kiểm thử tự động.
- **Chrome DevTools:** Kiểm tra các request mạng (Network Tab), log giao diện (Console Tab) và kiểm tra tính đáp ứng giao diện trên các độ phân giải màn hình.
- **cURL / Fetch API:** Kiểm tra độc lập các API endpoint trước khi gắn vào giao diện.

## 4.4 Nhân sự và phân công trách nhiệm

| Thành viên | Vai trò | Trách nhiệm cụ thể |
| :--- | :--- | :--- |
| **Đàm Anh Pháp (23010360)**<br>(Tester 1) | QA Engineer | - Thiết kế kế hoạch kiểm thử và tổng hợp báo cáo test case.<br>- Viết và duy trì các file kiểm thử phân hệ Khách hàng (`lookup.test.js`, `phone_auth.test.js`, `billing.test.js`).<br>- Kiểm thử các kênh thanh toán trực tuyến (PayOS VietQR, VNPAY Sandbox, Test Bypass).<br>- Kiểm thử chuẩn hóa giao diện Flat UI / Modern Minimal. |
| **Bùi Văn Đại (23010366)**<br>(Tester 2) | QA Engineer | - Phụ trách phân hệ Quản trị viên và thuật toán tính tiền điện.<br>- Viết và duy trì các file kiểm thử Admin (`auth.test.js`, `customers_search.test.js`, `customers_crud.test.js`, `tariffs.test.js`, `calculator.test.js`).<br>- Kiểm thử các API thống kê phân tích ngành điện (`/api/stats/dashboard`, `/api/stats/period/:period`).<br>- Kiểm thử tính năng Admin Dashboard, drill-down kỳ, Top 20 nợ cước và quyền xem hồ sơ cá nhân. |

---

# 5. Phạm vi kiểm thử chi tiết

## 5.1 Chức năng trong phạm vi (In-Scope)

### Phân hệ Khách hàng (Customer Portal):
1. Tra cứu bằng mã khách hàng hợp lệ, mã viết thường, mã có khoảng trắng thừa đầu cuối.
2. Kiểm tra bắt lỗi mã khách hàng không tồn tại (HTTP 404) hoặc để trống ô nhập.
3. Kiểm tra bảo mật ở chế độ cơ bản: chỉ trả về họ tên và 1 hóa đơn kỳ này, ẩn hoàn toàn số điện thoại, địa chỉ và mã công tơ.
4. Kiểm tra modal xác thực số điện thoại: nhập đúng số điện thoại mở khóa đầy đủ lịch sử; nhập sai số điện thoại duy trì trạng thái khóa an toàn.
5. Kiểm tra tự động làm sạch định dạng số điện thoại (loại bỏ dấu gạch nối và khoảng trắng).
6. Kiểm tra bảng bóc tách chi tiết 6 bậc giá EVN kèm thuế VAT 8%.
7. Kiểm tra khóa và mở khóa tab biểu đồ tiêu thụ theo năm.
8. Kiểm tra thanh toán đa kênh:
   - Tạo yêu cầu thanh toán PayOS, sinh mã VietQR chuẩn NAPAS 247 và kiểm tra xác nhận giao dịch.
   - Tạo URL thanh toán qua cổng VNPAY Sandbox và kiểm tra callback hoàn tất giao dịch.
   - Chức năng mô phỏng gạch nợ tức thì phục vụ kiểm thử nhanh.
9. Kiểm tra giao diện Flat UI: font Geist, bảng số liệu JetBrains Mono (`font-mono tabular-nums`), nền `#FAFAFA`, viền phẳng `#EAEAEA` và các nhãn trạng thái pastel nhạt.

### Phân hệ Quản trị viên (Admin Portal):
1. Đăng nhập quản trị viên với mật khẩu đúng và bắt lỗi mật khẩu sai.
2. Tìm kiếm khách hàng theo mã khách hàng và theo tên tiếng Việt có dấu.
3. Phân trang danh sách khách hàng (tối đa 50 khách hàng mỗi trang).
4. Thêm khách hàng mới, kiểm tra bắt lỗi trùng lặp mã công tơ hoặc trùng mã khách hàng.
5. Cập nhật thông tin địa chỉ, số điện thoại của khách hàng đã có.
6. Cập nhật đơn giá 6 bậc và thuế VAT, kiểm tra tính toán động trên hóa đơn.
7. Kiểm thử đơn vị thuật toán tính tiền điện theo 6 bậc lũy kế (0 kWh, 50 kWh và 250 kWh).
8. Kiểm thử Trung tâm Điều hành Ngành điện (Admin Executive Dashboard):
   - Kiểm tra API `GET /api/stats/dashboard`: Tổng hợp dữ liệu động 49 kỳ trên 27.580 bản ghi, kiểm tra 5 chỉ số Bento KPI (sản lượng, doanh thu, tỷ lệ thu hồi, công nợ, bình quân/hộ) và tỷ lệ tăng trưởng MoM %.
   - Kiểm tra render 4 biểu đồ Chart.js: Combo sản lượng và tiền, cột tăng trưởng MoM %, Doughnut cơ cấu 6 bậc và Stacked Bar phân tích công nợ.
   - Kiểm tra API `GET /api/stats/period/:period`: Drill-down kỳ cụ thể, phân nhóm hộ tiêu thụ và truy vấn danh sách Top 20 khách hàng nợ cước lớn nhất kỳ.
   - Kiểm tra phân quyền Admin tra cứu chi tiết cá nhân (`admin=true`): Bỏ qua bước xác thực số điện thoại, hiển thị đầy đủ thông tin cá nhân và 49 kỳ hóa đơn.

## 5.2 Chức năng ngoài phạm vi (Out-of-Scope)
- Thực hiện giao dịch chuyển tiền thật từ tài khoản ngân hàng thương mại ngoài môi trường Sandbox.
- Quản lý phân quyền nâng cao cho nhiều cấp tài khoản quản trị viên khác nhau (hệ thống sử dụng một tài khoản quản trị viên duy nhất).

---

# 6. Cấu trúc bộ kịch bản kiểm thử tự động

Toàn bộ các file kiểm thử tự động được tổ chức thành các file nhỏ, mỗi file đảm nhiệm một chức năng riêng biệt và chia vào 2 thư mục rõ ràng:

```text
server/test/
├── customer/
│   ├── lookup.test.js          # Tra cứu mã khách hàng cơ bản, lỗi 404, xử lý chữ hoa/thường
│   ├── phone_auth.test.js      # Xác thực số điện thoại chính chủ, bảo mật dữ liệu, chuẩn hóa chuỗi
│   └── billing.test.js         # Bóc tách 6 bậc giá EVN và tính thuế VAT trong hóa đơn
└── admin/
    ├── auth.test.js            # Đăng nhập quản trị viên với mật khẩu đúng và sai
    ├── customers_search.test.js # Tìm kiếm mã KH, tên tiếng Việt và phân trang danh sách
    ├── customers_crud.test.js   # Thêm mới, kiểm tra trùng mã công tơ và sửa thông tin
    ├── tariffs.test.js          # Điều chỉnh biểu giá 6 bậc, thuế VAT và tính tiền điện động
    └── calculator.test.js      # Kiểm thử đơn vị thuật toán tính tiền điện lũy kế 6 bậc
```

**Cấu hình thực thi:** Trong `server/package.json`, lệnh kiểm thử được thiết lập là:
```json
"scripts": {
  "test": "node --test --test-concurrency=1"
}
```
Việc gắn cờ `--test-concurrency=1` giúp các file kiểm thử chạy tuần tự thay vì chạy song song, loại bỏ hoàn toàn lỗi khóa file cơ sở dữ liệu (`database is locked`) do SQLite không hỗ trợ ghi đồng thời từ nhiều luồng tiến trình riêng biệt.

---

# 7. Chiến lược kiểm thử

1. **Kiểm thử đơn vị và tích hợp (Automated Testing):**
   - Sử dụng Node.js Test Runner để kiểm tra toàn bộ logic API và thuật toán tính toán.
   - Mỗi file test tự tạo máy chủ Express nội bộ trên cổng ngẫu nhiên (`listen(0)`), tự động dọn dẹp tài nguyên sau khi kết thúc (`after`).
2. **Kiểm thử chức năng giao diện thủ công (Manual Functional Testing):**
   - Kiểm tra các tương tác trực tiếp trên trình duyệt: nhập liệu form, click nút, mở modal, chuyển tab, kiểm tra hiển thị biểu đồ Chart.js và các thao tác drill-down trên Dashboard.
3. **Kiểm thử hồi quy (Regression Testing):**
   - Chạy lại toàn bộ lệnh `npm test` sau mỗi lần điều chỉnh mã nguồn backend để chắc chắn không làm ảnh hưởng đến các chức năng đã chạy đúng.
4. **Kiểm thử bảo mật (Security Testing):**
   - Gửi request trực tiếp qua cURL để bảo đảm dữ liệu nhạy cảm không bị lộ khi chưa có tham số xác thực hợp lệ.
   - Kiểm tra tính hợp lệ của cờ `admin=true` chỉ phát huy tác dụng khi đi kèm token quản trị viên.

---

# 8. Điều kiện dừng và tiêu chuẩn nghiệm thu

- **Tiêu chuẩn nghiệm thu:**
  - 100% các ca kiểm thử trong tài liệu thiết kế được thực thi đầy đủ.
  - Tỷ lệ ca kiểm thử đạt kết quả **Passed đạt 100%** (23/23 ca kiểm thử tự động cùng toàn bộ các ca kiểm thử thủ công và API test).
  - Không còn lỗi mức độ Nghiêm trọng (Critical) hoặc Lớn (Major).
  - Lệnh `npm test` trong thư mục `server` chạy thành công không có lỗi nào.
  - Lệnh `npm run build` trong thư mục `client` biên dịch thành công không có lỗi cú pháp.
- **Tiêu chuẩn tạm dừng kiểm thử:**
  - Cơ sở dữ liệu SQLite bị hỏng hoặc máy chủ backend không thể khởi động.

---

# 9. Quản lý và theo dõi lỗi

Lỗi phát hiện trong quá trình kiểm thử được phân theo 4 mức độ:
- **Critical (Khẩn cấp):** Rò rỉ thông tin cá nhân qua API khi chưa xác thực, hoặc lỗi làm sập máy chủ.
- **Major (Nghiêm trọng):** Chức năng chính không hoạt động (nhập đúng số điện thoại nhưng không mở khóa, không lưu được khách hàng mới, lỗi tính sai số liệu thống kê Dashboard).
- **Medium (Trung bình):** Tính sai tiền điện, sai thuế VAT, hoặc lỗi phân trang hiển thị thiếu dữ liệu.
- **Low (Nhẹ):** Lỗi chính tả, lệch khoảng cách nút bấm, hiển thị chưa chuẩn màu pastel trên một số trình duyệt cũ.

Quy trình xử lý: Ghi nhận lỗi -> Tạo kịch bản tái hiện -> Sửa mã nguồn -> Chạy lại ca kiểm thử -> Xác nhận hoàn thành.

---

# 10. Các sản phẩm bàn giao
1. Tài liệu Kế hoạch kiểm thử: `docs/Test_Plan_Kiem_Thu.md` (phiên bản 1.2).
2. Tài liệu Thiết kế ca kiểm thử chi tiết: `docs/Test_Cases_Chi_Tiet.md` (phiên bản 1.2).
3. Bộ mã nguồn kịch bản kiểm thử tự động: Thư mục `server/test/customer/` và `server/test/admin/`.
4. Kết quả thực thi kiểm thử được ghi nhận trực tiếp trong tài liệu test case.
