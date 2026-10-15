# Trường Đại học Phenikaa
## Khoa Công nghệ Thông tin
### Bài tập lớn môn học: Đánh giá và kiểm định chất lượng phần mềm

---

# TÀI LIỆU KẾ HOẠCH KIỂM THỬ (TEST PLAN)
## Đề tài: Kiểm thử Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN

**Nhóm thực hiện:** Nhóm sinh viên Phenikaa  
**Thành viên lập kế hoạch (Tôi - Tester 1):** Phụ trách Module Tra Cứu Tiền Điện & Bảo Mật SĐT  
**Thành viên phối hợp (Tester 2):** Phụ trách Module Quản Trị Khách Hàng & Biểu Giá EVN  
**Ngày lập:** 12/10/2026  
**Phiên bản tài liệu:** 1.0  

---

### Lịch sử các lần cập nhật

| Date | Version | Description | Prepared by | Reviewed by | Approved By |
| :--- | :---: | :--- | :--- | :--- | :--- |
| 12/10/2026 | 1.0 | Kế hoạch kiểm thử chi tiết hệ thống, trọng tâm Module Tra cứu tiền điện & Bảo mật 2 lớp | Tester 1 (Tôi) | Giảng viên hướng dẫn | Bộ môn KT&ĐBCL |

---

## MỤC LỤC

- [1. Giới thiệu](#1-giới-thiệu)
  - [1.1 Mục đích](#11-mục-đích)
  - [1.2 Tổng quan](#12-tổng-quan)
  - [1.3 Phạm vi](#13-phạm-vi)
  - [1.4 Các định nghĩa và từ viết tắt](#14-các-định-nghĩa-và-từ-viết-tắt)
  - [1.5 Người sử dụng tài liệu](#15-người-sử-dụng-tài-liệu)
- [2. Tài liệu tham khảo](#2-tài-liệu-tham-khảo)
- [3. Lịch trình công việc](#3-lịch-trình-công-việc)
- [4. Yêu cầu về tài nguyên](#4-yêu-cầu-về-tài-nguyên)
  - [4.1 Phần cứng](#41-phần-cứng)
  - [4.2 Phần mềm](#42-phần-mềm)
  - [4.3 Công cụ kiểm thử](#43-công-cụ-kiểm-thử)
  - [4.4 Môi trường kiểm thử](#44-môi-trường-kiểm-thử)
  - [4.5 Nhân sự và phân công trách nhiệm](#45-nhân-sự-và-phân-công-trách-nhiệm)
- [5. Phạm vi kiểm thử chi tiết](#5-phạm-vi-kiểm-thử-chi-tiết)
  - [5.1 Những chức năng được kiểm thử (In-Scope)](#51-những-chức-năng-được-kiểm-thử-in-scope)
    - [5.1.1 Chức năng Tra cứu tiền điện & Bảo mật 2 lớp qua SĐT (Phần tôi phụ trách thực hiện)](#511-chức-năng-tra-cứu-tiền-điện--bảo-mật-2-lớp-qua-sđt-phần-tôi-phụ-trách-thực-hiện)
    - [5.1.2 Chức năng Quản trị Khách hàng & Cấu hình Biểu giá EVN (Phần do Tester 2 phụ trách)](#512-chức-năng-quản-trị-khách-hàng--cấu-hình-biểu-giá-evn-phần-do-tester-2-phụ-trách)
  - [5.2 Những chức năng không được kiểm thử (Out-of-Scope)](#52-những-chức-năng-không-được-kiểm-thử-out-of-scope)
- [6. Chiến lược kiểm thử](#6-chiến-lược-kiểm-thử)
  - [6.1 Các giai đoạn kiểm thử (Test Stages)](#61-các-giai-đoạn-kiểm-thử-test-stages)
  - [6.2 Các loại hình kiểm thử áp dụng](#62-các-loại-hình-kiểm-thử-áp-dụng)
- [7. Điều kiện chấp nhận và tiêu chuẩn dừng kiểm thử](#7-điều-kiện-chấp-nhận-và-tiêu-chuẩn-dừng-kiểm-thử)
- [8. Quản lý và theo dõi lỗi (Defect Tracking)](#8-quản-lý-và-theo-dõi-lỗi-defect-tracking)
  - [8.1 Phân loại mức độ nghiêm trọng của lỗi](#81-phân-loại-mức-độ-nghiêm-trọng-của-lỗi)
  - [8.2 Quy trình xử lý lỗi](#82-quy-trình-xử-lý-lỗi)
- [9. Các sản phẩm bàn giao (Test Deliverables)](#9-các-sản-phẩm-bàn-giao-test-deliverables)

---

# 1. Giới thiệu

## 1.1 Mục đích
Tài liệu Kế hoạch kiểm thử (Test Plan) này mô tả toàn diện chiến lược, phạm vi, nguồn lực, tiêu chuẩn nghiệm thu và lịch trình thực hiện kiểm thử cho hệ thống **Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN**. Kế hoạch định hướng rõ ràng mục tiêu kiểm thử nhằm phát hiện tối đa các khiếm khuyết phần mềm, đảm bảo chất lượng, tính chính xác trong tính toán số tiền điện theo bậc thang EVN và độ an toàn bảo mật dữ liệu công dân.

## 1.2 Tổng quan
Hệ thống là ứng dụng web cho phép người dân tra cứu số tiền điện và chỉ số tiêu thụ hàng tháng theo biểu giá lũy kế 6 bậc của Tập đoàn Điện lực Việt Nam (EVN). Điểm nổi bật là cơ chế phân quyền bảo mật 2 lớp: người dùng chỉ xem được hóa đơn kỳ này nếu chỉ có Mã khách hàng; chỉ khi nhập đúng Số điện thoại chính chủ thì mới mở khóa toàn bộ lịch sử và thông tin cá nhân. Phía Quản trị viên cho phép nhân viên điện lực quản lý danh bạ khách hàng và điều chỉnh biểu giá khi có quyết định thay đổi giá điện.

## 1.3 Phạm vi
- Kế hoạch này áp dụng cho toàn bộ các hoạt động kiểm thử trong khuôn khổ bài tập lớn môn học.
- Trọng tâm tài liệu tập trung chi tiết vào **Module Tra cứu tiền điện & Phân quyền bảo mật qua SĐT** (do tôi trực tiếp phụ trách phát triển và kiểm thử), đồng thời ghi nhận phân công công việc của thành viên thứ 2.

## 1.4 Các định nghĩa và từ viết tắt

### 1.4.1 Các định nghĩa
- **Ứng dụng kiểm thử (AUT):** Ứng dụng web Tra cứu tiền điện EVN.
- **Tính toán động (Dynamic Calculation):** Tiền điện và thuế VAT được tính toán tức thời tại thời điểm truy vấn từ dữ liệu biểu giá hiện hành trong database.
- **Chế độ ẩn danh (Anonymous Mode):** Trạng thái tra cứu chỉ bằng Mã KH, ẩn các dữ liệu riêng tư.

### 1.4.2 Các từ viết tắt

| Từ viết tắt | Tên đầy đủ tiếng Anh | Ý nghĩa tiếng Việt |
| :--- | :--- | :--- |
| **EVN** | Electricity Vietnam | Tập đoàn Điện lực Việt Nam |
| **Mã KH** | Customer Code | Mã khách hàng định danh duy nhất (VD: `KH0001`) |
| **SĐT** | Phone Number | Số điện thoại di động chính chủ |
| **kWh** | Kilowatt-hour | Đơn vị đo điện năng tiêu thụ |
| **VAT** | Value Added Tax | Thuế giá trị gia tăng (mặc định 8%) |
| **SRS** | Software Requirement Specification | Tài liệu đặc tả yêu cầu phần mềm |
| **BVA** | Boundary Value Analysis | Kỹ thuật phân tích giá trị biên |
| **EP** | Equivalence Partitioning | Kỹ thuật phân vùng tương đương |

## 1.5 Người sử dụng tài liệu
- Giảng viên phụ trách bộ môn Đánh giá và kiểm định chất lượng phần mềm.
- Tester 1 (Tôi): Sử dụng làm tài liệu căn cứ thiết kế và thực thi kiểm thử Module Khách hàng.
- Tester 2: Tham chiếu để thực thi Module Quản trị viên theo hướng dẫn riêng.

---

# 2. Tài liệu tham khảo
1. Tài liệu đặc tả yêu cầu phần mềm: `docs/SRS_Dac_Ta_Yeu_Cau.md`.
2. Hướng dẫn lập kế hoạch kiểm thử chuẩn Phenikaa: `docs/Test_Plan_Template_Vn.docx`.
3. Biểu mẫu thiết kế ca kiểm thử: `docs/Test_Case_Template.xlsx`.
4. Hướng dẫn phân công kiểm thử Tester 2: `docs/HUONG_DAN_TESTER_2.md`.
5. Quy định biểu giá điện sinh hoạt 6 bậc hiện hành của Bộ Công Thương.

---

# 3. Lịch trình công việc

| Milestone | Hoạt động chính | Thời gian | Người thực hiện | Sản phẩm đầu ra |
| :---: | :--- | :---: | :--- | :--- |
| **M1** | Phân tích SRS & Lập kế hoạch kiểm thử (Test Plan) | Ngày 1 - 2 | Tester 1 (Tôi) | `docs/Test_Plan_Kiem_Thu.md` |
| **M2** | Thiết kế bộ Test Cases chi tiết (Function, Security, Perf) | Ngày 3 - 4 | Tester 1 (Tôi) | `docs/Test_Cases_Chi_Tiet.md` |
| **M3** | Viết kịch bản kiểm thử tự động (Automation Scripts) | Ngày 5 | Tester 1 (Tôi) | `server/test/customer_lookup.test.js` |
| **M4** | Thực thi kiểm thử (Manual + Automated) & Ghi nhận kết quả | Ngày 6 | Tester 1 (Tôi) | Bảng kết quả Status trong Test Case |
| **M5** | Thực thi kiểm thử Module Admin & Viết test tự động Admin | Ngày 6 - 7 | *Tester 2* | `server/test/admin_tariffs.test.js` |
| **M6** | Tổng kết, đánh giá chất lượng và hoàn thiện báo cáo | Ngày 8 | Nhóm | Bộ tài liệu nghiệm thu hoàn chỉnh |

---

# 4. Yêu cầu về tài nguyên

## 4.1 Phần cứng
- Máy tính cá nhân (Laptop / PC):
  - CPU: Intel Core i5 / AMD Ryzen 5 trở lên.
  - RAM: Tối thiểu 8 GB RAM.
  - Ổ cứng: Tối thiểu 5 GB trống để chạy Node.js, Vite và SQLite.

## 4.2 Phần mềm
- Hệ điều hành: Windows 10/11 x64.
- Runtime backend: **Node.js phiên bản 24.x LTS**.
- Trình quản lý gói: **npm 10.x**.
- Cơ sở dữ liệu: SQLite 3 tích hợp sẵn qua `node:sqlite`.
- Trình duyệt web: Google Chrome (v120+), Microsoft Edge (v120+).

## 4.3 Công cụ kiểm thử
- **Node.js Test Runner:** Công cụ kiểm thử tự động tích hợp sẵn `node:test` và `node:assert/strict` để chạy các file test API và thuật toán.
- **Chrome DevTools:** Kiểm tra các thành phần giao diện, Network request/response, Console và bộ nhớ Client.
- **cURL / Fetch API:** Kiểm thử trực tiếp các API endpoint của Express server.

## 4.4 Môi trường kiểm thử
- **Frontend App:** `http://localhost:5173` (Vite dev server) hoặc bản build tĩnh phục vụ qua Express.
- **Backend API:** `http://localhost:5000/api` (Node Express).
- **Database:** `server/data/electricity.db` (Chứa 1.000 khách hàng và 27.580 kỳ chỉ số điện).

## 4.5 Nhân sự và phân công trách nhiệm

### 4.5.1 Vai trò và trách nhiệm

| Thành viên | Vai trò trong nhóm | Trách nhiệm cụ thể |
| :--- | :--- | :--- |
| **Tôi (Tester 1)** | Test Designer & QA Engineer | - Lập tài liệu Test Plan và thiết kế bộ Test Cases chi tiết.<br>- Trực tiếp thực thi kiểm thử và viết file test tự động `server/test/customer_lookup.test.js` cho Module Tra Cứu Khách Hàng & Phân Quyền Bảo Mật SĐT.<br>- Đảm bảo 100% test case phụ trách đạt Passed. |
| **Thành viên 2 (Tester 2)** | QA Engineer | - Phụ trách thiết kế và thực thi kiểm thử cho Module Quản Trị Khách Hàng & Cấu Hình Biểu Giá EVN.<br>- Viết kịch bản test tự động `server/test/admin_tariffs.test.js` theo tài liệu phân công. |

### 4.5.2 Đào tạo và trao đổi nhóm
- Nhóm đã tổ chức họp trao đổi phân định rõ ranh giới chức năng: Tester 1 phụ trách toàn bộ Cổng khách hàng (Customer Portal); Tester 2 phụ trách toàn bộ Cổng quản trị (Admin Portal).

---

# 5. Phạm vi kiểm thử chi tiết

## 5.1 Những chức năng được kiểm thử (In-Scope)

### 5.1.1 Chức năng Tra cứu tiền điện & Bảo mật 2 lớp qua SĐT (Phần tôi phụ trách thực hiện)
1. **Kiểm tra đăng nhập / tra cứu bằng Mã khách hàng:**
   - Tra cứu với mã hợp lệ (đúng định dạng `KH0001`).
   - Tra cứu với mã không tồn tại (`KH9999`) $\rightarrow$ Báo lỗi 404 thân thiện.
   - Để trống ô tra cứu $\rightarrow$ Bắt lỗi validate phía Client, không gửi request.
   - Xử lý cắt tỉa khoảng trắng thừa (`"  KH0002  "`) và không phân biệt hoa/thường (`kh0001` và `KH0001`).
2. **Kiểm tra bảo mật ở mức độ ẩn danh (Mức 1):**
   - Chỉ hiển thị Họ tên, Mã KH, trạng thái hợp đồng.
   - Kiểm tra kỹ thuật: API `GET /api/readings/customer/:code` tuyệt đối không trả về `phone`, `address`, `meter_code` trong JSON.
   - Chỉ trả về duy nhất 1 hóa đơn kỳ gần nhất; các tháng cũ bị ẩn hoàn toàn.
3. **Kiểm tra xác thực Số điện thoại chính chủ (Mức 2):**
   - Mở modal xác thực khi bấm nút "Nhập SĐT xem lịch sử" hoặc bấm vào tab Biểu đồ.
   - Nhập đúng số điện thoại hợp đồng $\rightarrow$ Mở khóa thành công toàn bộ thông tin cá nhân và trọn bộ lịch sử các kỳ.
   - Nhập sai số điện thoại $\rightarrow$ Báo lỗi từ chối, duy trì trạng thái bảo vệ an toàn.
   - Chuẩn hóa số điện thoại: Hệ thống tự động loại bỏ dấu cách, gạch nối (`088-498-0616` khớp với `0884980616`).
4. **Kiểm tra tính toán tiền điện 6 bậc & Thuế VAT:**
   - Bảng phân rã 6 bậc giá EVN của từng hóa đơn hiển thị chuẩn xác đơn giá từng bậc, sản lượng bậc, tiền trước thuế và tiền thuế VAT 8%.
5. **Kiểm tra biểu đồ tiêu thụ điện:**
   - Tab biểu đồ bị khóa khi chưa xác thực SĐT.
   - Mở khóa hiển thị đầy đủ biểu đồ cột sản lượng và đường chi phí sau khi xác thực đúng SĐT. Cho phép lọc theo năm (2025, 2026, Tất cả).
6. **Kiểm tra đổi mã tra cứu:**
   - Đăng xuất khỏi phiên tra cứu khách hàng hiện tại và quay về màn hình ban đầu.

### 5.1.2 Chức năng Quản trị Khách hàng & Cấu hình Biểu giá EVN (Phần do Tester 2 phụ trách)
- *Phần này thuộc phạm vi trách nhiệm của Tester 2 (Đăng nhập Admin, tìm kiếm khách hàng, phân trang 50 khách/trang, thêm/sửa khách hàng, đổi biểu giá EVN 6 bậc và thuế VAT).*
- Tester 2 chịu trách nhiệm thiết kế chi tiết và thực thi theo hướng dẫn tại `docs/HUONG_DAN_TESTER_2.md`.

## 5.2 Những chức năng không được kiểm thử (Out-of-Scope)
- Cổng thanh toán trực tuyến qua VNPAY Sandbox (URL redirect, hash SHA512, IPN callback).
- Các chức năng thanh toán mô phỏng hoặc thanh toán tiền mặt tại quầy.

---

# 6. Chiến lược kiểm thử

## 6.1 Các giai đoạn kiểm thử (Test Stages)
1. **Kiểm thử đơn vị và tích hợp tự động (Unit & Integration Automated Testing):**
   - Kiểm thử thuật toán tính tiền điện 6 bậc trong `calculator.js`.
   - Kiểm thử tự động các API của Module Khách Hàng bằng Node Test Runner qua file `server/test/customer_lookup.test.js`.
2. **Kiểm thử chức năng giao diện thủ công (Manual Functional Testing):**
   - Thực thi các thao tác người dùng trên giao diện web Vue 3: form validation, modal popup, chuyển tab, bộ lọc biểu đồ.
3. **Kiểm thử hồi quy (Regression Testing):**
   - Chạy lại toàn bộ bộ test tự động sau mỗi lần tinh chỉnh code để đảm bảo không phát sinh lỗi phụ.

## 6.2 Các loại hình kiểm thử áp dụng
- **Kiểm thử chức năng (Functional Testing):** Áp dụng kỹ thuật Phân vùng tương đương (EP) và Phân tích giá trị biên (BVA) cho các trường nhập liệu Mã KH, Số điện thoại.
- **Kiểm thử bảo mật (Security Testing):** Kiểm tra cơ chế chống rò rỉ dữ liệu qua API payload và kiểm tra phân quyền truy cập tab biểu đồ.
- **Kiểm thử hiệu năng (Performance Testing):** Đo lường thời gian phản hồi của API khi tải dữ liệu khách hàng có lịch sử nhiều năm (40+ kỳ).

---

# 7. Điều kiện chấp nhận và tiêu chuẩn dừng kiểm thử

- **Tiêu chuẩn hoàn thành kiểm thử (Exit Criteria):**
  - $100\%$ các Test Case thuộc phạm vi phân công của tôi đã được thiết kế và thực thi đầy đủ.
  - Tỷ lệ Test Case đạt kết quả **Passed đạt 100%** đối với phần việc của tôi.
  - Toàn bộ các ca kiểm thử tự động trong `server/test/customer_lookup.test.js` chạy thành công (dấu tích xanh `✔`).
  - Không còn bất kỳ lỗi nào ở mức Khẩn cấp (Critical) hay Nặng (Major).
- **Tiêu chuẩn dừng kiểm thử khẩn cấp (Suspension Criteria):**
  - Database SQLite bị khóa hoặc hỏng.
  - Backend server gặp sự cố crash không khởi động được.

---

# 8. Quản lý và theo dõi lỗi (Defect Tracking)

## 8.1 Phân loại mức độ nghiêm trọng của lỗi

| Mức độ | Định nghĩa | Ví dụ thực tế |
| :---: | :--- | :--- |
| **Critical** | Sự cố nghiêm trọng làm sập hệ thống hoặc lộ thông tin | API rò rỉ SĐT/Địa chỉ khách hàng khi chưa xác thực |
| **Major** | Chức năng chính không hoạt động | Nhập đúng SĐT nhưng không mở khóa được lịch sử |
| **Medium** | Chức năng hoạt động sai lệch nhưng có thể thao tác tiếp | Tính sai tiền thuế VAT, lỗi hiển thị số âm |
| **Low** | Lỗi nhỏ về giao diện, thẩm mỹ, định dạng | Lệch khoảng cách nút bấm, lỗi font chữ |

## 8.2 Quy trình xử lý lỗi
Khi phát hiện lỗi: Ghi nhận mã lỗi $\rightarrow$ Xác định bước tái hiện $\rightarrow$ Sửa mã nguồn trên backend/frontend $\rightarrow$ Kiểm thử lại (Retest) $\rightarrow$ Đóng lỗi (Close).

---

# 9. Các sản phẩm bàn giao (Test Deliverables)
1. **Tài liệu Kế hoạch kiểm thử (Test Plan):** `docs/Test_Plan_Kiem_Thu.md`.
2. **Bộ bảng biểu thiết kế Test Cases chi tiết:** `docs/Test_Cases_Chi_Tiet.md`.
3. **Kịch bản kiểm thử tự động:** `server/test/customer_lookup.test.js`.
4. **Báo cáo kết quả thực thi kiểm thử:** Tích hợp trực tiếp trong bảng Test Cases.
