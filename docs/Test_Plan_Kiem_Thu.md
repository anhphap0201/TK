# Trường Đại học Phenikaa
## Khoa Công nghệ Thông tin
### Bài tập lớn môn học: Đánh giá và kiểm định chất lượng phần mềm

---

# TÀI LIỆU KẾ HOẠCH KIỂM THỬ (TEST PLAN)
## Đề tài: Kiểm thử Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN

**Nhóm thực hiện:** Nhóm sinh viên Phenikaa  
**Ngày lập:** 12/10/2026  
**Phiên bản tài liệu:** 1.0  

---

### Lịch sử các lần cập nhật

| Date | Version | Description | Prepared by | Reviewed by | Approved By |
| :--- | :---: | :--- | :--- | :--- | :--- |
| 12/10/2026 | 1.0 | Kế hoạch kiểm thử chi tiết 2 chức năng chính của hệ thống | Nhóm kiểm thử | Giảng viên bộ môn | Bộ môn KTCN |

---

## MỤC LỤC

- [1. Giới thiệu](#1-giới-thiệu)
  - [1.1 Mục đích](#11-mục-đích)
  - [1.2 Tổng quan hệ thống](#12-tổng-quan-hệ-thống)
  - [1.3 Phạm vi kiểm thử](#13-phạm-vi-kiểm-thử)
  - [1.4 Các định nghĩa và từ viết tắt](#14-các-định-nghĩa-và-từ-viết-tắt)
  - [1.5 Người sử dụng tài liệu](#15-người-sử-dụng-tài-liệu)
- [2. Tài liệu tham khảo](#2-tài-liệu-tham-khảo)
- [3. Lịch trình công việc](#3-lịch-trình-công-việc)
- [4. Yêu cầu về tài nguyên](#4-yêu-cầu-về-tài-nguyên)
  - [4.1 Phần cứng](#41-phần-cứng)
  - [4.2 Phần mềm](#42-phần-mềm)
  - [4.3 Công cụ kiểm thử](#43-công-cụ-kiểm-thử)
  - [4.4 Môi trường kiểm thử](#44-môi-trường-kiểm-thử)
  - [4.5 Nhân sự và phân công](#45-nhân-sự-và-phân-công)
- [5. Phạm vi kiểm thử chi tiết](#5-phạm-vi-kiểm-thử-chi-tiết)
  - [5.1 Những chức năng được kiểm thử (In-Scope)](#51-những-chức-năng-được-kiểm-thử-in-scope)
  - [5.2 Những chức năng không được kiểm thử (Out-of-Scope)](#52-những-chức-năng-không-được-kiểm-thử-out-of-scope)
- [6. Chiến lược kiểm thử](#6-chiến-lược-kiểm-thử)
  - [6.1 Các giai đoạn kiểm thử](#61-các-giai-đoạn-kiểm-thử)
  - [6.2 Các loại hình kiểm thử áp dụng](#62-các-loại-hình-kiểm-thử-áp-dụng)
- [7. Tiêu chí nghiệm thu và điều kiện dừng kiểm thử](#7-tiêu-chí-nghiệm-thu-và-điều-kiện-dừng-kiểm-thử)
- [8. Quản lý và theo dõi lỗi (Defect Tracking)](#8-quản-lý-và-theo-dõi-lỗi-defect-tracking)
  - [8.1 Phân loại mức độ nghiêm trọng của lỗi](#81-phân-loại-mức-độ-nghiêm-trọng-của-lỗi)
  - [8.2 Quy trình xử lý lỗi](#82-quy-trình-xử-lý-lỗi)
- [9. Các sản phẩm bàn giao (Test Deliverables)](#9-các-sản-phẩm-bàn-giao-test-deliverables)

---

# 1. Giới thiệu

## 1.1 Mục đích
Tài liệu Kế hoạch kiểm thử (Test Plan) này mô tả toàn bộ chiến lược, phạm vi, tài nguyên, quy trình và lịch trình thực hiện kiểm thử cho hệ thống **Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN**. Kế hoạch đảm bảo rằng phần mềm được kiểm tra nghiêm ngặt trước khi nghiệm thu, đáp ứng đúng các đặc tả yêu cầu nghiệp vụ, tính bảo mật dữ liệu công dân và độ ổn định về mặt hiệu năng.

## 1.2 Tổng quan hệ thống
Hệ thống là ứng dụng web cho phép người dân tra cứu chỉ số điện năng tiêu thụ và số tiền thanh toán hàng tháng theo biểu giá lũy kế 6 bậc của Tập đoàn Điện lực Việt Nam (EVN). Hệ thống áp dụng cơ chế phân quyền bảo mật 2 lớp: người dùng chỉ xem được hóa đơn kỳ này nếu chỉ có Mã khách hàng, và chỉ khi nhập đúng Số điện thoại chính chủ thì mới mở khóa toàn bộ lịch sử và thông tin cá nhân. Phía Quản trị viên cho phép nhân viên điện lực quản lý danh bạ khách hàng và điều chỉnh biểu giá khi có quyết định thay đổi giá điện.

## 1.3 Phạm vi kiểm thử
- Tập trung kiểm thử 2 chức năng trọng tâm:
  1. **Chức năng Tra cứu tiền điện & Phân quyền bảo mật qua SĐT** (Cổng khách hàng).
  2. **Chức năng Quản trị khách hàng & Cấu hình Biểu giá EVN** (Cổng quản trị viên).
- Loại trừ: Chức năng thanh toán trực tuyến qua cổng Sandbox VNPAY (theo yêu cầu phạm vi bài kiểm thử).

## 1.4 Các định nghĩa và từ viết tắt

| Thuật ngữ / Từ viết tắt | Định nghĩa đầy đủ |
| :--- | :--- |
| **EVN** | Tập đoàn Điện lực Việt Nam (Electricity Vietnam) |
| **Mã KH** | Mã số định danh duy nhất của khách hàng dùng điện (Ví dụ: `KH0001`) |
| **SĐT** | Số điện thoại liên hệ chính chủ ký hợp đồng mua bán điện |
| **kWh** | Kilôoát giờ (Số điện tiêu thụ) |
| **VAT** | Thuế giá trị gia tăng (Value Added Tax) |
| **SRS** | Tài liệu đặc tả yêu cầu phần mềm (Software Requirement Specification) |
| **AUT** | Ứng dụng đang được kiểm thử (Application Under Test) |
| **BVA** | Phân tích giá trị biên (Boundary Value Analysis) |
| **EP** | Phân vùng tương đương (Equivalence Partitioning) |

## 1.5 Người sử dụng tài liệu
- Giảng viên phụ trách môn học Đánh giá và kiểm định chất lượng phần mềm.
- Thành viên nhóm phát triển (Developer) để nắm bắt tiêu chí kiểm thử và sửa lỗi (Bug fix).
- Kiểm thử viên (Tester / QA) để làm kim chỉ nam thực hiện viết Test Case và ghi nhận báo cáo lỗi.

---

# 2. Tài liệu tham khảo
1. Tài liệu đặc tả yêu cầu phần mềm: `docs/SRS_Dac_Ta_Yeu_Cau.md`.
2. Hướng dẫn lập kế hoạch kiểm thử chuẩn Phenikaa: `Test_Plan_Template_Vn.md`.
3. Biểu mẫu thiết kế ca kiểm thử: `Test_Case_Template.md`.
4. Quy định biểu giá điện sinh hoạt 6 bậc hiện hành ban hành theo Quyết định của Bộ Công Thương.

---

# 3. Lịch trình công việc

| Giai đoạn | Hoạt động chính | Thời gian dự kiến | Người thực hiện | Sản phẩm đầu ra |
| :---: | :--- | :---: | :--- | :--- |
| **Phase 1** | Phân tích tài liệu SRS và lập Test Plan | Ngày 1 - 2 | Nhóm kiểm thử | `docs/Test_Plan_Kiem_Thu.md` |
| **Phase 2** | Thiết kế bộ Test Cases chi tiết (Function & Security) | Ngày 3 - 4 | Tester 1, Tester 2 | `docs/Test_Cases_Chi_Tiet.md` |
| **Phase 3** | Thiết lập môi trường và thực thi kiểm thử (Test Execution) | Ngày 5 - 6 | Cả nhóm | Bảng kết quả Actual Result |
| **Phase 4** | Báo cáo lỗi (Defect Logging) và kiểm thử hồi quy (Regression) | Ngày 7 | Tester, Developer | Bug Tracker Report |
| **Phase 5** | Tổng kết và nghiệm thu báo cáo kiểm thử | Ngày 8 | Trưởng nhóm | Báo cáo hoàn thành kiểm thử |

---

# 4. Yêu cầu về tài nguyên

## 4.1 Phần cứng
- Máy tính cá nhân (PC / Laptop):
  - CPU: Intel Core i5 / AMD Ryzen 5 hoặc tương đương trở lên.
  - RAM: Tối thiểu 8 GB RAM (khuyến nghị 16 GB).
  - Ổ cứng: Tối thiểu 10 GB dung lượng trống để chạy cơ sở dữ liệu SQLite và node_modules.

## 4.2 Phần mềm
- Hệ điều hành: Windows 10/11 x64 hoặc macOS / Linux.
- Môi trường chạy backend: **Node.js phiên bản 24.x LTS**.
- Trình quản lý gói: **npm 10.x**.
- Môi trường database: SQLite 3 tích hợp sẵn qua Node.js (`node:sqlite`).
- Công cụ quản trị DB trực quan: **Navicat for SQLite** hoặc **DB Browser for SQLite**.

## 4.3 Công cụ kiểm thử
- **Trình duyệt web:** Google Chrome (v120+), Microsoft Edge (v120+), Firefox (v120+).
- **Chrome DevTools:** Kiểm tra DOM elements, Network requests (Payload/Response), Application Storage, Console logs.
- **Postman / cURL / Node test script:** Kiểm thử tính đúng đắn và an toàn của các RESTful API endpoints.

## 4.4 Môi trường kiểm thử
- **Local Testing Environment:**
  - Client URL: `http://localhost:5173` (Vite dev server) hoặc bản build tĩnh phục vụ qua Express.
  - Server API: `http://localhost:5000/api` (Node Express).
  - Database file: `F:\PKA\Code\KT\server\data\electricity.db` (chứa dữ liệu hạt nhân 1.000 khách hàng và 27.580 kỳ chỉ số điện).

## 4.5 Nhân sự và phân công

| Họ và tên | Vai trò | Trách nhiệm chính |
| :--- | :--- | :--- |
| **Nguyễn Văn A** | Test Leader | Lập kế hoạch kiểm thử (Test Plan), phân công nhiệm vụ, tổng hợp báo cáo nghiệm thu. |
| **Trần Thị B** | QA Tester 1 | Thiết kế và thực thi Test Cases cho Chức năng 1 (Tra cứu tiền điện & Bảo mật SĐT). |
| **Lê Văn C** | QA Tester 2 | Thiết kế và thực thi Test Cases cho Chức năng 2 (Admin: Khách hàng & Biểu giá EVN). |
| **Phạm Văn D** | Developer | Hỗ trợ giải thích nghiệp vụ, phối hợp xác nhận và khắc phục các khiếm khuyết phần mềm. |

---

# 5. Phạm vi kiểm thử chi tiết

## 5.1 Những chức năng được kiểm thử (In-Scope)

### Nhóm 1: Chức năng Tra cứu tiền điện & Phân quyền bảo mật 2 lớp
1. **Kiểm tra đăng nhập / tra cứu bằng Mã khách hàng:**
   - Tra cứu với mã hợp lệ (đúng định dạng `KHxxxx`).
   - Tra cứu với mã không tồn tại trong hệ thống.
   - Để trống ô tra cứu và gửi yêu cầu.
   - Xử lý cắt tỉa khoảng trắng thừa (Leading/Trailing spaces) và không phân biệt chữ hoa/thường (`kh0001` và `KH0001`).
2. **Kiểm tra mức độ hiển thị thông tin ở chế độ ẩn danh (Mức 1):**
   - Chỉ hiển thị Họ tên, Mã KH, Trạng thái hợp đồng.
   - Không được phép hiển thị Số điện thoại, Địa chỉ, Mã công tơ.
   - Không được hiển thị danh sách các tháng cũ và nút mở khóa biểu đồ.
   - Hiển thị hóa đơn tháng hiện tại và thông báo tình trạng thanh toán ("Đã thanh toán" hoặc "Chưa đóng").
3. **Kiểm tra quy trình xác thực Số điện thoại (Mức 2):**
   - Mở modal xác thực số điện thoại.
   - Nhập đúng số điện thoại đã lưu trong hợp đồng $\rightarrow$ Mở khóa thành công toàn bộ thông tin cá nhân và trọn vẹn lịch sử.
   - Nhập sai số điện thoại $\rightarrow$ Báo lỗi từ chối, duy trì trạng thái bảo vệ an toàn.
   - Nhập chuỗi rỗng hoặc số điện thoại có ký tự đặc biệt/chữ cái.
4. **Kiểm tra Biểu đồ tiêu thụ điện:**
   - Khi chưa xác thực SĐT: Tab biểu đồ bị khóa, bấm vào kích hoạt mở modal nhập SĐT.
   - Khi đã xác thực SĐT: Tab biểu đồ hiển thị chính xác các cột sản lượng kWh và đường chi phí qua các năm.

### Nhóm 2: Chức năng Quản trị Khách hàng & Cấu hình Biểu giá EVN
1. **Kiểm tra Đăng nhập Quản trị viên:**
   - Nhập từ khóa bí mật `admin` $\rightarrow$ Tự động mở trường mật khẩu.
   - Nhập đúng mật khẩu quản trị (`admin123`) $\rightarrow$ Truy cập thành công vào Admin Portal.
   - Nhập sai mật khẩu quản trị $\rightarrow$ Báo lỗi 401 không được phép.
2. **Kiểm tra Quản lý danh sách khách hàng:**
   - Phân trang dữ liệu (Hiển thị 50 khách hàng/trang, chuyển trang 1, 2, 3...).
   - Tìm kiếm thời gian thực (Search Debounce): Tìm theo Mã KH, Họ tên, SĐT, Mã công tơ.
   - Thêm mới khách hàng: Kiểm tra tính hợp lệ dữ liệu, kiểm tra ràng buộc không trùng lặp Mã KH / Mã công tơ.
   - Chỉnh sửa thông tin khách hàng: Cập nhật họ tên, địa chỉ, số điện thoại.
   - Hiển thị nhãn hợp đồng: Khách hàng `ACTIVE` (Đang hiệu lực) và `TERMINATED` (Đã chấm dứt).
3. **Kiểm tra Cấu hình Biểu giá EVN & Thuế VAT:**
   - Mở modal biểu giá và đọc đúng 6 bậc giá hiện hành từ database.
   - Sửa đơn giá bậc 1 đến bậc 6 và tỷ lệ thuế VAT $\rightarrow$ Lưu thành công.
   - Xác minh tính toàn vẹn: Khi biểu giá thay đổi, việc tra cứu tiền điện của khách hàng phải tự động áp dụng công thức theo biểu giá mới.

## 5.2 Những chức năng không được kiểm thử (Out-of-Scope)
- Cổng thanh toán trực tuyến qua VNPAY Sandbox (URL redirect, hash SHA512, IPN callback).
- Chức năng mô phỏng thanh toán nhanh (Simulate payment).
- Các chức năng thanh toán tiền mặt tại quầy giao dịch.

---

# 6. Chiến lược kiểm thử

## 6.1 Các giai đoạn kiểm thử
1. **Kiểm thử đơn vị và tích hợp (Unit & Integration Testing):**
   - Kiểm thử độc lập module tính toán tiền điện `calculator.js`.
   - Kiểm thử tích hợp các API endpoint của Express (`/api/readings/customer/:code`, `/api/tariffs`, `/api/customers`).
2. **Kiểm thử chức năng hệ thống (System Functional Testing):**
   - Thực thi tương tác end-to-end trên giao diện web mô phỏng hành vi của người dùng thật.
3. **Kiểm thử hồi quy (Regression Testing):**
   - Thực hiện lại toàn bộ các test case quan trọng sau khi có bất kỳ sửa đổi nào về code để đảm bảo không làm phát sinh lỗi mới.

## 6.2 Các loại hình kiểm thử áp dụng
- **Kiểm thử chức năng (Functional Testing):**
  - Áp dụng kỹ thuật phân vùng tương đương (Equivalence Partitioning) và phân tích giá trị biên (Boundary Value Analysis) đối với các trường nhập liệu (Mã KH, SĐT, số điện tiêu thụ).
- **Kiểm thử bảo mật và phân quyền (Security & Access Control Testing):**
  - Kiểm tra xem API có rò rỉ dữ liệu cá nhân hay không khi request không có tham số `phone`.
  - Kiểm tra xem người dùng có thể can thiệp URL để xem trộm lịch sử hay không.
- **Kiểm thử giao diện người dùng (UI/UX Usability Testing):**
  - Đảm bảo tính nhất quán về màu sắc (`#0099ff`), thông báo lỗi rõ ràng, bố cục trực quan trên các độ phân giải màn hình khác nhau.

---

# 7. Tiêu chí nghiệm thu và điều kiện dừng kiểm thử

- **Tiêu chuẩn hoàn thành kiểm thử (Exit Criteria):**
  - $100\%$ các Test Case đã được thực thi.
  - Tỷ lệ Test Case đạt kết quả **Passed $\ge 95\%$**.
  - Không còn bất kỳ lỗi nào ở mức độ Nghiêm trọng (**Critical**) hoặc Nặng (**Major**).
  - Toàn bộ các lỗi phát sinh (nếu có) phải được ghi nhận và có phương án xử lý rõ ràng.
- **Điều kiện dừng kiểm thử khẩn cấp (Suspension Criteria):**
  - Cơ sở dữ liệu SQLite bị khóa/hỏng không thể truy vấn.
  - Server backend gặp lỗi crash không thể khởi động.

---

# 8. Quản lý và theo dõi lỗi (Defect Tracking)

## 8.1 Phân loại mức độ nghiêm trọng của lỗi

| Mức độ (Severity) | Mô tả | Tiêu chí đánh giá |
| :---: | :--- | :--- |
| **Critical (Khẩn cấp)** | Lỗi làm sập toàn bộ hệ thống hoặc hỏng dữ liệu | Server crash, DB crash, rò rỉ toàn bộ dữ liệu cá nhân khách hàng. |
| **Major (Nặng)** | Chức năng chính không hoạt động | Không thể tra cứu tiền điện, nhập đúng SĐT nhưng không mở khóa được lịch sử. |
| **Medium (Trung bình)** | Chức năng phụ lỗi hoặc tính toán sai lệch nhỏ | Lỗi định dạng hiển thị tiền tệ, không tự động đóng modal khi xác thực xong. |
| **Low (Nhẹ)** | Lỗi giao diện, chính tả, thẩm mỹ | Lệch khoảng cách lề, lỗi hiển thị icon, sai chính tả từ ngữ. |

## 8.2 Quy trình xử lý lỗi
1. **Phát hiện & Ghi nhận (New):** Tester phát hiện lỗi, chụp ảnh/quay video màn hình và tạo báo cáo lỗi với đầy đủ các bước tái hiện (Steps to Reproduce).
2. **Phân tích & Tiếp nhận (Assigned):** Developer xác nhận lỗi và tiến hành sửa chữa trên nhánh code.
3. **Khắc phục (Resolved):** Developer sửa lỗi và triển khai bản vá.
4. **Kiểm tra lại (Retest):** Tester thực hiện lại các bước kiểm thử.
5. **Đóng lỗi (Closed):** Nếu lỗi đã được giải quyết triệt để, tester chuyển trạng thái sang Closed. Nếu vẫn còn, chuyển sang Re-opened.

---

# 9. Các sản phẩm bàn giao (Test Deliverables)
1. **Tài liệu Kế hoạch kiểm thử (Test Plan):** `docs/Test_Plan_Kiem_Thu.md`.
2. **Bộ bảng biểu thiết kế Test Cases chi tiết:** `docs/Test_Cases_Chi_Tiet.md`.
3. **Báo cáo kết quả thực thi kiểm thử và tổng kết nghiệm thu:** Đính kèm trong hồ sơ bài tập lớn.
