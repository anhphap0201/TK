# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM
## (Software Requirement Specification – SRS)

### Dự án: HỆ THỐNG TRA CỨU TIỀN ĐIỆN VÀ BIỂU GIÁ EVN
**Phiên bản:** 1.0.0  
**Đơn vị thực hiện:** Nhóm sinh viên Đại học Phenikaa  
**Ngày tạo:** 12/10/2026  

---

## Mục lục

- [1. Phạm vi](#1-phạm-vi)
  - [1.1 Mục đích](#11-mục-đích)
  - [1.2 Nhận diện hệ thống](#12-nhận-diện-hệ-thống)
  - [1.3 Kiến trúc hệ thống](#13-kiến-trúc-hệ-thống)
- [2. Các yêu cầu chức năng](#2-các-yêu-cầu-chức-năng)
  - [2.1 Mô tả hệ thống](#21-mô-tả-hệ-thống)
  - [2.2 Các chức năng của hệ thống](#22-các-chức-năng-của-hệ-thống)
  - [2.3 Đặc tả Use Case chi tiết](#23-đặc-tả-use-case-chi-tiết)
    - [2.3.1 Use Case 1: Tra cứu tiền điện và phân quyền bảo mật 2 lớp](#231-use-case-1-tra-cứu-tiền-điện-và-phân-quyền-bảo-mật-2-lớp)
    - [2.3.2 Use Case 2: Quản trị khách hàng và Cấu hình biểu giá EVN](#232-use-case-2-quản-trị-khách-hàng-và-cấu-hình-biểu-giá-evn)
- [3. Yêu cầu về hiệu năng và phi chức năng](#3-yêu-cầu-về-hiệu-năng-và-phi-chức-năng)
  - [3.1 Yêu cầu về hiệu năng](#31-yêu-cầu-về-hiệu-năng)
  - [3.2 Yêu cầu về bảo mật và quyền riêng tư](#32-yêu-cầu-về-bảo-mật-và-quyền-riêng-tư)
  - [3.3 Yêu cầu về khả năng tương thích](#33-yêu-cầu-về-khả-năng-tương-thích)

---

# 1. Phạm vi

## 1.1 Mục đích
Tài liệu này đặc tả chi tiết các yêu cầu chức năng và phi chức năng của hệ thống ứng dụng web **"Tra Cứu Tiền Điện"**. Tài liệu đóng vai trò là cơ sở kỹ thuật chính thức để đội ngũ phát triển, kiểm thử viên (QA/Tester), và giảng viên đánh giá chất lượng phần mềm trong môn học Đánh giá và kiểm định chất lượng phần mềm.

## 1.2 Nhận diện hệ thống
- **Tên hệ thống:** Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN
- **Mã định danh:** EVN-BILL-LOOKUP-V1
- **Phân hệ chính:**
  1. Phân hệ Cổng tra cứu khách hàng (Citizen/Customer Portal) với cơ chế bảo mật danh tính qua số điện thoại.
  2. Phân hệ Quản trị viên (Admin Portal) quản lý cơ sở dữ liệu khách hàng và thiết lập đơn giá điện 6 bậc lũy kế cùng thuế suất GTGT.

## 1.3 Kiến trúc hệ thống
Hệ thống được thiết kế theo mô hình kiến trúc phân tầng (Client - Server Architecture) tối giản, hiện đại và hiệu năng cao:
- **Tầng Client (Giao diện người dùng):**
  - Nền tảng: Single Page Application (SPA) phát triển bằng **Vue 3** (Composition API, `<script setup>`).
  - Giao diện & Styling: **Tailwind CSS v4** với phong cách Fintech hiện đại (gam màu chủ đạo Electric Blue `#0099ff`, typography sạch sẽ, bo góc `rounded-2xl/3xl`, tối ưu khả năng tương tác).
  - Bộ biểu tượng: **Lucide Vue Next**.
  - Công cụ đóng gói: **Vite 8**.
- **Tầng Server (Xử lý nghiệp vụ & API):**
  - Môi trường thực thi: **Node.js 24 LTS** (hỗ trợ chuẩn ECMAScript Modules `ESM`).
  - Framework: **Express.js** cung cấp các RESTful API endpoints.
  - Xử lý tính toán động: Module `calculator.js` chịu trách nhiệm tính toán tiền điện 6 bậc luỹ kế và thuế VAT tức thời tại thời điểm truy vấn.
- **Tầng Database (Lưu trữ dữ liệu):**
  - Hệ quản trị cơ sở dữ liệu: **SQLite 3**, được kết nối thông qua module tích hợp sẵn `node:sqlite` (`DatabaseSync`) trên Node.js 24, đảm bảo tính toàn vẹn dữ liệu chuẩn ACID mà không cần cài đặt thêm runtime phụ trợ bên ngoài.

---

# 2. Các yêu cầu chức năng

## 2.1 Mô tả hệ thống
Hệ thống cung cấp dịch vụ tra cứu tiền điện cho người dân và quản lý công tác thu nộp cho cơ quan điện lực. Thay vì buộc người dân phải đăng ký tài khoản rườm rà, hệ thống cho phép tra cứu ngay bằng Mã khách hàng (VD: `KH0001`). Để đảm bảo an toàn thông tin cá nhân theo quy định bảo vệ dữ liệu, hệ thống chia làm 2 cấp độ truy cập:
- **Cấp độ tra cứu công cộng (Mã KH):** Chỉ xem hóa đơn kỳ hiện tại để nhanh chóng biết số tiền cần thanh toán. Các thông tin nhạy cảm (SĐT, địa chỉ, mã công tơ) và lịch sử tiêu thụ các tháng cũ bị ẩn.
- **Cấp độ xác thực danh tính (Mã KH + SĐT):** Người dùng nhập đúng số điện thoại đã đăng ký hợp đồng với EVN sẽ được xem toàn bộ hồ sơ cá nhân và trọn vẹn lịch sử tiêu thụ qua các năm.

Đồng thời, ban quản lý điện lực có thể đăng nhập phân hệ Admin để quản lý danh sách khách hàng và điều chỉnh biểu giá khi nhà nước có sự thay đổi về chính sách giá điện.

## 2.2 Các chức năng của hệ thống
Hệ thống bao gồm các nhóm chức năng chính (loại trừ chức năng thanh toán trực tuyến qua cổng trung gian VNPAY trong phạm vi kiểm thử này):
1. **Chức năng Tra cứu tiền điện:**
   - Tra cứu nhanh bằng Mã khách hàng.
   - Hiển thị hóa đơn tháng hiện tại (chỉ số công tơ, sản lượng kWh, tổng tiền, trạng thái nợ).
   - Xác thực số điện thoại chính chủ để mở khóa toàn bộ lịch sử các tháng.
   - Xem bảng phân tích chi tiết tiền điện theo 6 bậc luỹ kế của từng hóa đơn.
   - Xem biểu đồ xu hướng tiêu thụ điện năng và chi phí theo từng năm (2022 - 2026).
2. **Chức năng Quản trị hệ thống (Admin):**
   - Đăng nhập quản trị viên với mật khẩu bảo vệ.
   - Xem danh sách khách hàng có phân trang.
   - Tìm kiếm khách hàng theo Mã KH, Họ tên, Số điện thoại, Mã công tơ.
   - Thêm mới, chỉnh sửa và xóa thông tin khách hàng.
   - Xem trạng thái hợp đồng (`ACTIVE` - Đang hiệu lực, `TERMINATED` - Đã chấm dứt).
   - Cấu hình và cập nhật Biểu giá điện sinh hoạt 6 bậc và tỷ lệ thuế GTGT (VAT).
3. **Chức năng Tiện ích chung:**
   - Công cụ Tính nhanh tiền điện bậc thang (Quick Calculator) trên thanh tiêu đề chung.

---

## 2.3 Đặc tả Use Case chi tiết

### 2.3.1 Use Case 1: Tra cứu tiền điện và phân quyền bảo mật 2 lớp
- **Mã Use Case:** `UC01_CUSTOMER_LOOKUP`
- **Tên Use Case:** Tra cứu tiền điện và xác thực số điện thoại
- **Tác nhân (Actor):** Khách hàng sử dụng điện (Customer)
- **Tiền điều kiện (Pre-conditions):**
  - Khách hàng đã được khởi tạo thông tin hợp đồng trong cơ sở dữ liệu của hệ thống.
  - Khách hàng truy cập vào trang chủ hệ thống Tra Cứu Tiền Điện.
- **Hậu điều kiện (Post-conditions):**
  - Hệ thống hiển thị đúng thông tin hóa đơn và lịch sử tiêu thụ tương ứng với cấp độ xác thực.

#### Luồng sự kiện chính (Main Success Scenario):
1. Người dùng truy cập trang chủ, nhập Mã khách hàng (VD: `KH0001`) vào ô tra cứu và bấm nút "Tra cứu".
2. Hệ thống kiểm tra trong cơ sở dữ liệu:
   - Trả về mã HTTP 200 kèm cờ `is_authenticated: false`.
   - Dữ liệu trả về chỉ gồm: `customer_code`, `full_name`, `status` và duy nhất bản ghi hóa đơn của kỳ gần nhất (`2026-10`).
   - Các trường `phone`, `address`, `meter_code` bị lọc bỏ khỏi phản hồi API.
3. Giao diện chuyển sang màn hình Cổng khách hàng (Customer Portal):
   - Hiển thị tên khách hàng, mã khách hàng, trạng thái hợp đồng.
   - Hiển thị banner thông báo: "Chế độ bảo mật: Đang ẩn địa chỉ, số công tơ và lịch sử tiền điện".
   - Hiển thị hóa đơn tháng hiện tại và trạng thái ("Đã thanh toán" hoặc "Chưa đóng").
   - Tab "Biểu đồ tiêu thụ" bị khóa với biểu tượng ổ khóa.
4. Người dùng bấm nút **"Nhập SĐT xem lịch sử"** (hoặc bấm vào tab Biểu đồ bị khóa).
5. Hệ thống hiển thị modal **"Xác Thực Số Điện Thoại"**.
6. Người dùng nhập số điện thoại chính chủ (VD: `0884980616`) và bấm "Xác thực & Mở khóa".
7. Hệ thống gửi yêu cầu xác thực lên Backend (`GET /api/readings/customer/KH0001?phone=0884980616`).
8. Backend so khớp số điện thoại nhập vào với số điện thoại trong hợp đồng khách hàng:
   - Kết quả trùng khớp, trả về `is_authenticated: true`, kèm toàn bộ thông tin cá nhân và mảng tất cả các kỳ hóa đơn lịch sử.
9. Giao diện Portal tự động mở khóa:
   - Hiển thị đầy đủ số công tơ, số điện thoại, địa chỉ dùng điện.
   - Bảng lịch sử hiển thị đầy đủ tất cả các tháng từ khi ký hợp đồng.
   - Tab "Biểu đồ tiêu thụ" được mở khóa, hiển thị trực quan biểu đồ cột sản lượng điện và biểu đồ đường chi phí.

#### Các luồng phụ và luồng ngoại lệ (Alternative & Exception Flows):
- **Luồng A1 - Để trống Mã khách hàng:**
  - Tại bước 1, người dùng không nhập gì mà bấm Tra cứu $\rightarrow$ Hệ thống hiển thị thông báo lỗi: *"Vui lòng nhập Mã khách hàng"*, không gửi request.
- **Luồng A2 - Mã khách hàng không tồn tại:**
  - Tại bước 2, người dùng nhập mã không có trong hệ thống (VD: `KH9999`) $\rightarrow$ Backend trả về lỗi 404 $\rightarrow$ Giao diện hiển thị: *"Không tìm thấy mã khách hàng..."*.
- **Luồng A3 - Nhập sai số điện thoại xác thực:**
  - Tại bước 8, người dùng nhập số điện thoại không khớp với hồ sơ khách hàng $\rightarrow$ Backend trả về `is_authenticated: false` $\rightarrow$ Modal hiển thị thông báo lỗi màu đỏ: *"Số điện thoại không chính xác. Vui lòng kiểm tra lại!"* và giữ nguyên trạng thái khóa an toàn.
- **Luồng A4 - Chuyển đổi mã tra cứu:**
  - Người dùng bấm nút "Đổi mã tra cứu" $\rightarrow$ Hệ thống xóa bỏ phiên làm việc, xóa số điện thoại tạm lưu trong bộ nhớ và quay lại màn hình tra cứu ban đầu.

---

### 2.3.2 Use Case 2: Quản trị khách hàng và Cấu hình biểu giá EVN
- **Mã Use Case:** `UC02_ADMIN_MANAGEMENT`
- **Tên Use Case:** Quản trị hồ sơ khách hàng và thiết lập biểu giá điện
- **Tác nhân (Actor):** Quản trị viên (Admin)
- **Tiền điều kiện (Pre-conditions):**
  - Quản trị viên có tài khoản và mật khẩu quản trị hợp lệ (mặc định: `admin123`).

#### Luồng sự kiện chính (Main Success Scenario):
1. Quản trị viên nhập từ khóa `admin` vào ô tra cứu tại trang chủ.
2. Giao diện nhận diện tự động và hiển thị thêm ô nhập mật khẩu quản trị viên.
3. Quản trị viên nhập mật khẩu đúng và bấm "Đăng nhập quản trị".
4. Hệ thống xác thực thành công qua API `POST /api/auth/login`, cấp token quản trị và điều hướng vào màn hình Quản Trị Viên (Admin Portal).
5. Quản trị viên thực hiện các tác vụ quản lý:
   - **Tìm kiếm khách hàng:** Nhập từ khóa vào ô tìm kiếm $\rightarrow$ Bảng tự động lọc danh sách theo Mã KH, Tên, SĐT, hoặc Mã công tơ sau 300ms (debounce).
   - **Thêm khách hàng mới:** Bấm nút "Thêm khách hàng" $\rightarrow$ Nhập Họ tên, SĐT, Địa chỉ, Mã công tơ $\rightarrow$ Bấm Lưu $\rightarrow$ Hệ thống kiểm tra tính duy nhất và thêm mới vào cơ sở dữ liệu $\rightarrow$ Cập nhật lại danh sách.
   - **Chỉnh sửa khách hàng:** Bấm nút "Sửa" tại một dòng khách hàng $\rightarrow$ Thay đổi thông tin $\rightarrow$ Bấm Cập nhật $\rightarrow$ Dữ liệu được ghi đè chính xác trong SQLite.
   - **Cấu hình Biểu giá EVN:** Bấm nút "Biểu giá EVN" $\rightarrow$ Mở modal hiển thị 6 bậc giá hiện hành và thuế suất VAT $\rightarrow$ Sửa đơn giá bậc hoặc thay đổi thuế VAT $\rightarrow$ Bấm "Lưu biểu giá" $\rightarrow$ Backend cập nhật bảng `tariffs` và `settings`. Mọi hóa đơn tra cứu sau đó sẽ được tính toán theo biểu giá mới.
6. Quản trị viên bấm "Thoát" để đăng xuất khỏi chế độ quản trị an toàn.

#### Các luồng phụ và luồng ngoại lệ (Alternative & Exception Flows):
- **Luồng B1 - Nhập sai mật khẩu quản trị:**
  - Tại bước 3, người dùng nhập sai mật khẩu $\rightarrow$ Backend trả về lỗi HTTP 401: *"Mật khẩu quản trị viên không chính xác"*.
- **Luồng B2 - Thêm khách hàng bị trùng mã công tơ:**
  - Tại bước 5, Admin nhập mã công tơ đã được gán cho một khách hàng khác $\rightarrow$ Cơ sở dữ liệu kích hoạt ràng buộc `UNIQUE` $\rightarrow$ Hệ thống trả về lỗi thông báo mã công tơ đã tồn tại.

---

# 3. Yêu cầu về hiệu năng và phi chức năng

## 3.1 Yêu cầu về hiệu năng
- **Thời gian phản hồi truy vấn (Response Time):**
  - Thời gian xử lý API tra cứu khách hàng và tính toán động toàn bộ hóa đơn phải $\le 200$ms trên cơ sở dữ liệu có sẵn 1.000 khách hàng và hơn 27.000 bản ghi chỉ số.
  - Thời gian render giao diện trên trình duyệt $\le 100$ms.
- **Tính toán động chính xác (Calculation Accuracy):**
  - Thuật toán phân rã 6 bậc thang lũy kế theo sản lượng kWh thực tế phải chính xác đến từng đồng (sai số 0 VNĐ so với công thức chuẩn của EVN và Bộ Công Thương).
  - Thuế suất VAT (8%) được tính chính xác bằng phép làm tròn `Math.round((subtotal * vat_rate) / 100)`.

## 3.2 Yêu cầu về bảo mật và quyền riêng tư
- **Bảo mật dữ liệu cá nhân (Data Privacy):**
  - Khi chưa cung cấp số điện thoại chính chủ, API tuyệt đối không trả về các trường dữ liệu nhạy cảm: `phone`, `address`, `meter_code`, `readings` cũ trong payload JSON.
  - Kiểm tra số điện thoại hỗ trợ định dạng chuẩn hóa (loại bỏ ký tự không phải số) nhằm chống bypass và bảo vệ khách hàng.
- **Bảo vệ trang quản trị:**
  - Mật khẩu admin được kiểm soát tại tầng Backend.
  - Các thao tác nhạy cảm (sửa biểu giá, thêm xóa khách hàng) được kiểm tra quyền chặt chẽ.

## 3.3 Yêu cầu về khả năng tương thích
- Hoạt động tương thích hoàn toàn trên các trình duyệt web hiện đại: Google Chrome (v110+), Microsoft Edge (v110+), Mozilla Firefox (v110+), Safari (v16+).
- Hỗ trợ tốt trên màn hình máy tính để bàn (Desktop), máy tính xách tay (Laptop) và hiển thị thân thiện trên máy tính bảng/di động (Responsive Design).
