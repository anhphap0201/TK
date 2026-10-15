# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM
## (Software Requirement Specification – SRS)

### Dự án: HỆ THỐNG TRA CỨU TIỀN ĐIỆN VÀ BIỂU GIÁ EVN
**Phiên bản:** 1.0.0  
**Đơn vị thực hiện:** Nhóm sinh viên Đại học Phenikaa  
**Thành viên thực hiện (Tôi - Tester 1):** Phụ trách Module Tra Cứu Khách Hàng & Phân Quyền Bảo Mật SĐT  
**Thành viên phối hợp (Tester 2):** Phụ trách Module Quản Trị Khách Hàng & Biểu Giá EVN  
**Ngày lập:** 12/10/2026  

---

## Mục lục

- [1. Phạm vi](#1-phạm-vi)
  - [1.1 Mục đích](#11-mục-đích)
  - [1.2 Nhận diện](#12-nhận-diện)
  - [1.3 Kiến trúc hệ thống](#13-kiến-trúc-hệ-thống)
- [2. Các yêu cầu chức năng](#2-các-yêu-cầu-chức-năng)
  - [2.1 Mô tả hệ thống](#21-mô-tả-hệ-thống)
  - [2.2 Các chức năng của hệ thống](#22-các-chức-năng-của-hệ-thống)
  - [2.3 Đặc tả Use Case chi tiết](#23-đặc-tả-use-case-chi-tiết)
    - [2.3.1 Use Case 1: Tra cứu tiền điện và phân quyền bảo mật 2 lớp qua SĐT (Phần tôi phụ trách)](#231-use-case-1-tra-cứu-tiền-điện-và-phân-quyền-bảo-mật-2-lớp-qua-sđt-phần-tôi-phụ-trách)
    - [2.3.2 Use Case 2: Quản trị khách hàng và Cấu hình biểu giá EVN (Phần do Tester 2 phụ trách)](#232-use-case-2-quản-trị-khách-hàng-và-cấu-hình-biểu-giá-evn-phần-do-tester-2-phụ-trách)
- [3. Yêu cầu về hiệu năng và phi chức năng](#3-yêu-cầu-về-hiệu-năng-và-phi-chức-năng)
  - [3.1 Yêu cầu về hiệu năng](#31-yêu-cầu-về-hiệu-năng)
  - [3.2 Yêu cầu về bảo mật và quyền riêng tư công dân](#32-yêu-cầu-về-bảo-mật-và-quyền-riêng-tư-công-dân)
  - [3.3 Yêu cầu về khả năng tương thích](#33-yêu-cầu-về-khả-năng-tương-thích)

---

# 1. Phạm vi

## 1.1 Mục đích
Tài liệu Đặc tả yêu cầu phần mềm (SRS) này mô tả toàn bộ các yêu cầu chức năng và phi chức năng của hệ thống **Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN**. Tài liệu đóng vai trò là cơ sở kỹ thuật chính thức để đội ngũ phát triển, kiểm thử viên (QA/Tester), và giảng viên đánh giá chất lượng phần mềm trong môn học Đánh giá và kiểm định chất lượng phần mềm tại Trường Đại học Phenikaa.

Nội dung tài liệu tập trung chi tiết vào các thành phần, luồng nghiệp vụ và ca kiểm thử thuộc phần việc **Tôi (Tester 1)** trực tiếp phát triển và kiểm thử, đồng thời phân định ranh giới rõ ràng với phần việc của **Tester 2**.

## 1.2 Nhận diện
- **Tên hệ thống:** Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN.
- **Mã định danh:** EVN-BILL-LOOKUP-V1.
- **Phân hệ ứng dụng:**
  1. **Cổng tra cứu khách hàng (Customer Portal):** Người dân tra cứu hóa đơn tiền điện với cơ chế bảo vệ thông tin 2 lớp (Mã KH & Xác thực SĐT) - *Phần tôi phụ trách*.
  2. **Cổng quản trị viên (Admin Portal):** Quản lý hồ sơ khách hàng, chỉ số công tơ và thiết lập biểu giá 6 bậc lũy kế cùng thuế GTGT - *Phần do Tester 2 phụ trách*.

## 1.3 Kiến trúc hệ thống
Hệ thống được thiết kế theo mô hình kiến trúc phân tầng Client - Server hiện đại:
- **Tầng Giao diện người dùng (Client SPA):**
  - Khung ứng dụng: **Vue 3** (Composition API, `<script setup>`).
  - Giao diện & Định kiểu: **Tailwind CSS v4** với phong cách Fintech hiện đại (gam màu chủ đạo Electric Blue `#0099ff`, typography sạch sẽ, bo góc `rounded-2xl/3xl`).
  - Bộ biểu tượng: **Lucide Vue Next**.
  - Công cụ đóng gói: **Vite 8**.
- **Tầng Xử lý dịch vụ & Nghiệp vụ (Server API):**
  - Môi trường chạy: **Node.js 24 LTS** (chuẩn ECMAScript Modules `ESM`).
  - Framework: **Express.js** cung cấp các RESTful API endpoints.
  - Xử lý nghiệp vụ tiền điện: Module `calculator.js` tính toán động biểu giá 6 bậc EVN và thuế VAT thời gian thực tại thời điểm truy vấn.
- **Tầng Cơ sở dữ liệu (Database):**
  - Hệ quản trị cơ sở dữ liệu: **SQLite 3** tích hợp sẵn qua module chuẩn của Node.js 24 (`node:sqlite`), đảm bảo tuân thủ ACID và tốc độ truy vấn cao.

---

# 2. Các yêu cầu chức năng

## 2.1 Mô tả hệ thống
Hệ thống cung cấp giải pháp tra cứu tiền điện minh bạch cho công dân mà không yêu cầu tạo tài khoản mật khẩu phức tạp. Để bảo vệ dữ liệu cá nhân theo quy định về bảo vệ dữ liệu công dân, hệ thống thiết lập cơ chế kiểm soát truy cập 2 cấp độ:
- **Cấp độ 1 - Ẩn danh (Mã KH):** Khi chỉ cung cấp Mã khách hàng, hệ thống chỉ hiển thị Họ tên và hóa đơn kỳ gần nhất để phục vụ mục đích kiểm tra nợ cước. Toàn bộ thông tin cá nhân (SĐT, Địa chỉ, Mã công tơ) và lịch sử các tháng cũ được bảo vệ ẩn hoàn toàn.
- **Cấp độ 2 - Xác thực chính chủ (Mã KH + SĐT):** Người dùng nhập đúng Số điện thoại đã ký hợp đồng với EVN để mở khóa toàn bộ hồ sơ cá nhân, lịch sử các kỳ và biểu đồ tiêu thụ điện.

## 2.2 Các chức năng của hệ thống
Phân chia trách nhiệm thực hiện giữa các thành viên:

| Phân hệ / Chức năng | Mô tả tóm tắt | Thành viên phụ trách | Trạng thái thực hiện |
| :--- | :--- | :---: | :---: |
| **Tra cứu tiền điện cơ bản** | Nhập Mã KH, kiểm tra hợp lệ, hiển thị hóa đơn kỳ này | **Tôi (Tester 1)** | Đã hoàn thành & Đã kiểm thử |
| **Bảo mật phân quyền 2 lớp qua SĐT** | Modal xác thực SĐT chính chủ, ẩn/hiển thị thông tin cá nhân | **Tôi (Tester 1)** | Đã hoàn thành & Đã kiểm thử |
| **Phân tích chi tiết 6 bậc EVN** | Modal bóc tách sản lượng và đơn giá từng bậc của hóa đơn | **Tôi (Tester 1)** | Đã hoàn thành & Đã kiểm thử |
| **Biểu đồ tiêu thụ điện trực quan** | Biểu đồ cột sản lượng kWh và chi phí theo các năm | **Tôi (Tester 1)** | Đã hoàn thành & Đã kiểm thử |
| **Công cụ tính nhanh (Quick Calc)** | Widget tính thử tiền điện 6 bậc tức thì | **Tôi (Tester 1)** | Đã hoàn thành & Đã kiểm thử |
| **Quản trị khách hàng (Admin)** | Thêm, sửa, tìm kiếm, phân trang khách hàng | *Tester 2* | *Tester 2 phụ trách* |
| **Cấu hình Biểu giá & Thuế VAT** | Đổi giá 6 bậc và thuế VAT trong DB | *Tester 2* | *Tester 2 phụ trách* |

---

## 2.3 Đặc tả Use Case chi tiết

### 2.3.1 Use Case 1: Tra cứu tiền điện và phân quyền bảo mật 2 lớp qua SĐT (Phần tôi phụ trách)

- **Mã Use Case:** `UC01_CUSTOMER_LOOKUP`
- **Tên Use Case:** Tra cứu tiền điện và xác thực số điện thoại bảo mật
- **Tác nhân chính (Actor):** Khách hàng sử dụng điện (Customer / Citizen)
- **Tiền điều kiện (Pre-conditions):**
  - Khách hàng đã có thông tin trong cơ sở dữ liệu `electricity.db`.
  - Ứng dụng web phía Client và Backend Server đang hoạt động bình thường.
- **Hậu điều kiện (Post-conditions):**
  - Khách hàng xem được đúng thông tin hóa đơn kỳ hiện tại (khi chưa xác thực SĐT).
  - Khách hàng xem được trọn vẹn lịch sử và thông tin hợp đồng cá nhân (sau khi xác thực đúng SĐT).

#### Luồng sự kiện chính (Main Success Scenario):
1. Người dùng mở trang chủ, nhập Mã khách hàng (VD: `KH0001` hoặc `kh0001`) vào ô tra cứu và bấm **"Tra cứu"**.
2. Hệ thống kiểm tra hợp lệ chuỗi nhập, gửi request `GET /api/readings/customer/KH0001` (không kèm `phone`).
3. Backend truy vấn CSDL, kiểm tra Mã KH hợp lệ:
   - Nhận diện `isAuthenticated = false`.
   - Lọc bỏ hoàn toàn các trường dữ liệu nhạy cảm (`phone`, `address`, `meter_code`) khỏi JSON payload.
   - Chỉ trả về duy nhất 1 bản ghi hóa đơn kỳ mới nhất (`latest_reading`) trong mảng `readings`.
   - Trả về mã HTTP 200 kèm cờ `is_authenticated: false`.
4. Giao diện Cổng khách hàng (`CustomerPortal.vue`) hiển thị:
   - Họ tên, Mã KH, Huy hiệu trạng thái hợp đồng (`Đang hiệu lực` hoặc `Đã chấm dứt`).
   - Huy hiệu cảnh báo màu vàng: *"Chế độ bảo mật: Đang ẩn địa chỉ, số công tơ và lịch sử tiền điện"*.
   - Hóa đơn kỳ này kèm trạng thái nợ cước ("Đã thanh toán" hoặc "Chưa đóng").
   - Tab "Biểu đồ tiêu thụ" bị khóa với biểu tượng ổ khóa.
5. Người dùng bấm nút **"Nhập SĐT xem lịch sử"** (hoặc bấm vào Tab Biểu đồ).
6. Hệ thống hiển thị modal **"Xác Thực Số Điện Thoại"**.
7. Người dùng nhập số điện thoại chính chủ (VD: `0884980616` hoặc `088-498-0616`) và bấm **"Xác thực & Mở khóa"**.
8. Hệ thống gửi request xác thực `GET /api/readings/customer/KH0001?phone=0884980616`.
9. Backend chuẩn hóa chuỗi số điện thoại (loại bỏ ký tự không phải số) và so khớp với số điện thoại trong hồ sơ khách hàng:
   - So khớp thành công, Backend thiết lập `isAuthenticated = true`.
   - Trả về toàn bộ dữ liệu hợp đồng: SĐT, Địa chỉ, Mã công tơ và danh sách đầy đủ các kỳ hóa đơn trong CSDL.
10. Giao diện tự động đóng modal xác thực, hiển thị thông báo thành công và mở khóa:
    - Hiển thị đầy đủ Địa chỉ, Số điện thoại và Số công tơ.
    - Bảng lịch sử nạp đầy đủ toàn bộ các kỳ từ trước đến nay.
    - Nút "Chi tiết" tại mỗi kỳ mở ra bảng phân rã chi tiết 6 bậc giá EVN kèm thuế VAT 8%.
    - Mở khóa tab "Biểu đồ tiêu thụ" cho phép phân tích sản lượng điện và chi phí qua các năm.

#### Các luồng phụ và ngoại lệ (Alternative & Exception Flows):
- **Luồng A1 - Để trống ô tra cứu:** Người dùng để trống và bấm Tra cứu $\rightarrow$ Hệ thống hiển thị cảnh báo đỏ *"Vui lòng nhập Mã khách hàng"*, ngăn chặn gửi request.
- **Luồng A2 - Mã khách hàng không tồn tại:** Nhập mã không có trong hệ thống (VD: `KH9999`) $\rightarrow$ Backend phản hồi HTTP 404 $\rightarrow$ Giao diện báo lỗi *"Không tìm thấy thông tin khách hàng"*.
- **Luồng A3 - Mã KH có khoảng trắng thừa hoặc viết thường:** Nhập `"  kh0001  "` $\rightarrow$ Hệ thống tự động `trim()` và chuyển chữ hoa, tra cứu thành công bình thường.
- **Luồng A4 - Nhập sai số điện thoại xác thực:** Nhập số điện thoại không khớp với hợp đồng $\rightarrow$ Backend trả về `is_authenticated: false` $\rightarrow$ Modal hiển thị thông báo đỏ *"Số điện thoại không chính xác. Vui lòng kiểm tra lại!"*, giữ nguyên trạng thái khóa an toàn.
- **Luồng A5 - Đổi mã tra cứu:** Người dùng bấm "Đổi mã tra cứu" $\rightarrow$ Hệ thống xóa bỏ phiên làm việc, xóa cache thông tin khách hàng và trở về màn hình tra cứu ban đầu.

---

### 2.3.2 Use Case 2: Quản trị khách hàng và Cấu hình biểu giá EVN (Phần do Tester 2 phụ trách)

> **Ghi chú phân công:**  
> Use Case này thuộc phạm vi phân công của **Thành viên 2 (Tester 2)** trong nhóm. Để đảm bảo tính độc lập và phân định rõ ràng trách nhiệm theo yêu cầu bài tập lớn, phần đặc tả chi tiết các bước thực hiện, dữ liệu và kiểm thử tự động của Use Case này do Tester 2 chịu trách nhiệm thực hiện (tham chiếu tài liệu hướng dẫn `docs/HUONG_DAN_TESTER_2.md`).

- **Mã Use Case:** `UC02_ADMIN_MANAGEMENT`
- **Tác nhân:** Quản trị viên (Admin)
- **Tóm tắt phạm vi chức năng bàn giao cho Tester 2:**
  - Xác thực quản trị viên bằng mật khẩu quản trị (`admin123`).
  - Quản lý danh bạ khách hàng: Tìm kiếm thời gian thực, xem phân trang (50 khách/trang), thêm mới khách hàng (ràng buộc không trùng mã công tơ), chỉnh sửa thông tin khách hàng.
  - Quản trị biểu giá EVN: Xem và điều chỉnh đơn giá 6 bậc thang và tỷ lệ thuế VAT trong cơ sở dữ liệu SQLite.

---

# 3. Yêu cầu về hiệu năng và phi chức năng

## 3.1 Yêu cầu về hiệu năng
- **Thời gian phản hồi API (Response Time):** Thời gian thực thi API tra cứu khách hàng và tính toán động tiền điện trên CSDL gồm 1.000 khách hàng và hơn 27.000 bản ghi kỳ chỉ số phải đạt $\le 150$ms.
- **Thời gian hiển thị giao diện (Render Time):** Tốc độ chuyển đổi giữa các tab và mở modal trên trình duyệt $\le 100$ms.
- **Độ chính xác trong tính toán:** Thuật toán phân rã 6 bậc lũy kế EVN trong `calculator.js` phải đảm bảo chính xác tuyệt đối (sai số 0 VNĐ) so với công thức chuẩn quy định của Bộ Công Thương và Tập đoàn Điện lực Việt Nam.

## 3.2 Yêu cầu về bảo mật và quyền riêng tư công dân
- **Nguyên tắc tối thiểu dữ liệu (Data Minimization):** Khi chưa xác thực số điện thoại chính chủ, Backend tuyệt đối không trả về bất kỳ trường thông tin định danh nhạy cảm nào (`phone`, `address`, `meter_code`) qua API.
- **Chống gian lận định dạng (Format Sanitization):** Hệ thống phải loại bỏ các ký tự phân cách (dấu cách, gạch nối) trước khi so khớp số điện thoại để đảm bảo tính an toàn và tiện lợi cho người dùng.

## 3.3 Yêu cầu về khả năng tương thích
- Hoạt động tương thích hoàn toàn trên các trình duyệt web phổ biến: Google Chrome, Microsoft Edge, Mozilla Firefox, Safari.
- Hỗ trợ tốt trên màn hình máy tính bàn, máy tính xách tay và thiết kế responsive co giãn linh hoạt trên thiết bị di động.
