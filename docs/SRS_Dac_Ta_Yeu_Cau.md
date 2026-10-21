# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM
## (Software Requirement Specification - SRS)

### Dự án: HỆ THỐNG TRA CỨU TIỀN ĐIỆN VÀ BIỂU GIÁ EVN
- **Phiên bản:** 1.2.0
- **Đơn vị thực hiện:** Nhóm sinh viên Khoa Công nghệ Thông tin, Đại học Phenikaa
- **Môn học:** Đánh giá và kiểm định chất lượng phần mềm
- **Thành viên thực hiện:**
  - **Đàm Anh Pháp (MSV: 23010360) - Tester 1:** Phụ trách Cổng tra cứu khách hàng, bảo mật số điện thoại 2 lớp, chuẩn hóa giao diện Flat UI và tích hợp thanh toán trực tuyến đa kênh (PayOS VietQR, VNPAY Sandbox).
  - **Bùi Văn Đại (MSV: 23010366) - Tester 2:** Phụ trách Cổng quản trị viên, cấu hình biểu giá EVN, thuật toán lũy kế 6 bậc, Trung tâm Điều hành Quản trị Ngành điện (Admin Executive Dashboard) và phân quyền phân tích hồ sơ cá nhân.
- **Ngày cập nhật:** 20/10/2026

---

## Mục lục

- [1. Phạm vi](#1-phạm-vi)
  - [1.1 Mục đích](#11-mục-đích)
  - [1.2 Phạm vi sản phẩm](#12-phạm-vi-sản-phẩm)
  - [1.3 Kiến trúc hệ thống](#13-kiến-trúc-hệ-thống)
- [2. Các yêu cầu chức năng](#2-các-yêu-cầu-chức-năng)
  - [2.1 Tổng quan các phân hệ](#21-tổng-quan-các-phân-hệ)
  - [2.2 Phân công trách nhiệm](#22-phân-công-trách-nhiệm)
  - [2.3 Đặc tả Use Case chi tiết](#23-đặc-tả-use-case-chi-tiết)
    - [2.3.1 Use Case 1: Tra cứu tiền điện và phân quyền bảo mật 2 lớp](#231-use-case-1-tra-cứu-tiền-điện-và-phân-quyền-bảo-mật-2-lớp)
    - [2.3.2 Use Case 2: Quản trị khách hàng và cấu hình biểu giá EVN](#232-use-case-2-quản-trị-khách-hàng-và-cấu-hình-biểu-giá-evn)
    - [2.3.3 Use Case 3: Thanh toán tiền điện trực tuyến đa kênh](#233-use-case-3-thanh-toán-tiền-điện-trực-tuyến-đa-kênh)
    - [2.3.4 Use Case 4: Trung tâm Điều hành và Giám sát Ngành điện](#234-use-case-4-trung-tâm-điều-hành-và-giám-sát-ngành-điện)
    - [2.3.5 Use Case 5: Phân tích chi tiết hồ sơ tiêu thụ cá nhân cho Quản trị viên](#235-use-case-5-phân-tích-chi-tiết-hồ-sơ-tiêu-thụ-cá-nhân-cho-quản-trị-viên)
- [3. Yêu cầu phi chức năng](#3-yêu-cầu-phi-chức-năng)
  - [3.1 Hiệu năng và độ chính xác tính toán](#31-hiệu-năng-và-độ-chính-xác-tính-toán)
  - [3.2 Tiêu chuẩn thiết kế Flat UI / Modern Minimal](#32-tiêu-chuẩn-thiết-kế-flat-ui--modern-minimal)
  - [3.3 Bảo mật dữ liệu cá nhân](#33-bảo-mật-dữ-liệu-cá-nhân)
  - [3.4 Khả năng tương thích trình duyệt](#34-khả-năng-tương-thích-trình-duyệt)

---

# 1. Phạm vi

## 1.1 Mục đích
Tài liệu này xác định các yêu cầu chức năng, yêu cầu phi chức năng và kiến trúc kỹ thuật của hệ thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN. Nội dung tài liệu làm cơ sở kỹ thuật để đội ngũ phát triển xây dựng phần mềm và nhóm kiểm thử thiết kế bộ kịch bản kiểm thử đánh giá chất lượng sản phẩm.

## 1.2 Phạm vi sản phẩm
Hệ thống gồm hai phân hệ làm việc chính:
1. **Cổng tra cứu khách hàng (Customer Portal):** Hỗ trợ người dùng tra cứu tiền điện theo mã khách hàng (ví dụ: `KH0001`). Ứng dụng áp dụng quy trình bảo vệ thông tin cá nhân 2 lớp: chỉ hiển thị hóa đơn tháng gần nhất khi nhập mã khách hàng; yêu cầu xác thực số điện thoại chính chủ để xem toàn bộ lịch sử 4 năm, địa chỉ, số công tơ và biểu đồ tiêu thụ. Cổng hỗ trợ thanh toán trực tuyến qua 3 hình thức: PayOS (mã VietQR chuẩn NAPAS 247), VNPAY Sandbox và chế độ gạch nợ mô phỏng. Toàn bộ giao diện áp dụng ngôn ngữ thiết kế Flat UI / Modern Minimal.
2. **Cổng quản trị viên (Admin Portal):** Cung cấp công cụ cho cán bộ điện lực quản lý danh sách khách hàng, cập nhật biểu giá điện 6 bậc, điều chỉnh tỷ lệ thuế VAT và theo dõi trung tâm điều hành ngành điện (Admin Executive Dashboard) với 5 chỉ số KPI, 4 biểu đồ phân tích xu hướng và công cụ xem chi tiết từng cá nhân mà không bị chặn bởi bước xác thực số điện thoại.

## 1.3 Kiến trúc hệ thống
Hệ thống sử dụng mô hình Client - Server tách biệt:
- **Client (Single Page Application):**
  - Framework: Vue 3 (Composition API, `<script setup>`).
  - Trình đóng gói: Vite.
  - Biểu đồ dữ liệu: Chart.js kết hợp thư viện vue-chartjs.
  - Phông chữ: Google Fonts Geist (giao diện chung) và JetBrains Mono (`font-mono tabular-nums` cho các bảng số liệu).
  - Phong cách thiết kế: Flat UI / Modern Minimal, nền canvas `#FAFAFA`, viền phẳng `#EAEAEA`, màu chữ `#171717` và `#737373`, nhãn trạng thái màu pastel nhạt.
- **Server (RESTful API):**
  - Nền tảng: Node.js (chuẩn ECMAScript Modules - ESM).
  - Web framework: Express.js.
  - Xử lý nghiệp vụ lõi:
    - Module `calculator.js`: Tính toán lũy kế 6 bậc giá EVN và thuế VAT thời gian thực.
    - Router `routes/stats.js`: Tổng hợp dữ liệu động 49 kỳ (2022 - 2026) cho 1.000 khách hàng (27.580 bản ghi chỉ số).
    - Router `routes/payment.js`: Tích hợp PayOS API (mã băm HMAC-SHA256) và VNPAY API (mã băm HMAC-SHA512).
    - Router `routes/readings.js`: Hỗ trợ cờ `admin=true` mở quyền tra cứu chuyên sâu cho quản trị viên.
- **Cơ sở dữ liệu:**
  - SQLite 3 thông qua module `node:sqlite` (`DatabaseSync`), lưu cục bộ tại `server/data/electricity.db`.

---

# 2. Các yêu cầu chức năng

## 2.1 Tổng quan các phân hệ
- **Khách hàng sử dụng điện:** Tra cứu nhanh bằng mã khách hàng in trên giấy báo tiền điện mà không cần tạo tài khoản mật khẩu. Khi cần xem chi tiết hồ sơ cá nhân và lịch sử nợ cước, người dùng nhập số điện thoại đăng ký hợp đồng để mở khóa.
- **Quản trị viên EVN:** Đăng nhập bằng tài khoản và mật khẩu quản trị (`admin` / `admin123`) để quản lý dữ liệu người dùng, cấu hình đơn giá, giám sát các chỉ số vận hành ngành điện và rà soát công nợ.

## 2.2 Phân công trách nhiệm

| Phân hệ / Chức năng | Mô tả chi tiết | Thành viên phụ trách | Trạng thái |
| :--- | :--- | :---: | :---: |
| Tra cứu mã khách hàng cơ bản | Nhập mã KH, tự động cắt khoảng trắng, hiển thị hóa đơn kỳ mới nhất | Đàm Anh Pháp (23010360) | Hoàn thành |
| Bảo mật 2 lớp qua số điện thoại | Ẩn số điện thoại, địa chỉ, mã công tơ khi chưa xác thực; mở khóa khi khớp SĐT | Đàm Anh Pháp (23010360) | Hoàn thành |
| Bóc tách 6 bậc thang EVN | Bảng chi tiết sản lượng, đơn giá từng bậc và thuế VAT tính toán động | Đàm Anh Pháp (23010360) | Hoàn thành |
| Biểu đồ tiêu thụ khách hàng | Biểu đồ cột sản lượng (kWh) và đường chi phí (VNĐ) lọc theo từng năm | Đàm Anh Pháp (23010360) | Hoàn thành |
| Tích hợp thanh toán đa kênh | Thanh toán qua PayOS VietQR, VNPAY Sandbox và chế độ gạch nợ mô phỏng | Đàm Anh Pháp (23010360) | Hoàn thành |
| Chuẩn hóa thiết kế Flat UI | Thiết kế giao diện phẳng, tối giản, font Geist và JetBrains Mono | Đàm Anh Pháp (23010360) | Hoàn thành |
| Đăng nhập quản trị viên | Xác thực tài khoản Admin, cấp token phiên làm việc | Bùi Văn Đại (23010366) | Hoàn thành |
| Quản lý danh mục khách hàng | Tìm kiếm tên/mã, phân trang 50 khách hàng/trang, thêm mới và cập nhật thông tin | Bùi Văn Đại (23010366) | Hoàn thành |
| Cấu hình biểu giá EVN & VAT | Điều chỉnh đơn giá 6 bậc và thuế VAT, tự động cập nhật cách tính hóa đơn | Bùi Văn Đại (23010366) | Hoàn thành |
| Thuật toán tính tiền điện 6 bậc | Kiểm thử đơn vị tính lũy kế, làm tròn số học và tính thuế VAT | Bùi Văn Đại (23010366) | Hoàn thành |
| Admin Executive Dashboard | Tổng hợp 49 kỳ, 5 chỉ số Bento KPI, 4 biểu đồ Chart.js, phân tích MoM và cơ cấu bậc | Bùi Văn Đại (23010366) | Hoàn thành |
| Drill-down kỳ & Top 20 nợ cước | Xem chi tiết từng kỳ, phân nhóm tiêu thụ và danh sách 20 hộ nợ cước lớn nhất | Bùi Văn Đại (23010366) | Hoàn thành |
| Phân tích cá nhân cho Quản trị | Admin xem trọn vẹn lịch sử và biểu đồ của từng khách hàng không cần nhập SĐT | Bùi Văn Đại (23010366) | Hoàn thành |

---

## 2.3 Đặc tả Use Case chi tiết

### 2.3.1 Use Case 1: Tra cứu tiền điện và phân quyền bảo mật 2 lớp
- **Mã Use Case:** `UC01_CUSTOMER_LOOKUP`
- **Tác nhân:** Khách hàng sử dụng điện.
- **Tiền điều kiện:** Ứng dụng client và máy chủ backend đang chạy; cơ sở dữ liệu có sẵn thông tin khách hàng.
- **Hậu điều kiện:** Khách hàng xem được hóa đơn kỳ này ở chế độ cơ bản; xem được toàn bộ thông tin cá nhân và lịch sử khi xác thực thành công.

#### Luồng sự kiện chính:
1. Người dùng vào trang chủ, nhập mã khách hàng (ví dụ: `KH0001` hoặc `kh0001`) rồi nhấn **Tra cứu**.
2. Client tự động cắt khoảng trắng thừa (`trim`), gửi request `GET /api/readings/customer/:code` (không kèm tham số `phone`).
3. Backend kiểm tra mã khách hàng trong SQLite:
   - Đặt cờ `is_authenticated = false`.
   - Lọc bỏ các trường nhạy cảm: `phone`, `address`, `meter_code`.
   - Trả về đúng 1 bản ghi hóa đơn kỳ mới nhất trong mảng `readings`.
   - Phản hồi mã HTTP 200.
4. Giao diện hiển thị họ tên, mã khách hàng, nhãn trạng thái hợp đồng, banner thông báo chế độ bảo mật và hóa đơn tháng hiện tại. Nút xem biểu đồ và bảng lịch sử cũ ở trạng thái khóa.
5. Người dùng nhấn nút **Nhập SĐT xem lịch sử** hoặc bấm vào tab **Biểu đồ tiêu thụ**.
6. Hệ thống hiển thị modal yêu cầu nhập số điện thoại.
7. Người dùng nhập số điện thoại (ví dụ: `0884980616` hoặc `088-498-0616`) rồi nhấn **Xác thực & Mở khóa**.
8. Client gửi request `GET /api/readings/customer/:code?phone=...`.
9. Backend chuẩn hóa chuỗi số điện thoại (loại bỏ ký tự không phải số), so sánh với trường `phone` trong bảng `customers`:
   - Nếu khớp: đặt cờ `is_authenticated = true`, trả về đầy đủ địa chỉ, số điện thoại, mã công tơ và toàn bộ danh sách hóa đơn lịch sử.
10. Giao diện đóng modal, hiển thị thông báo thành công và mở khóa toàn bộ lịch sử cùng biểu đồ tiêu thụ.

#### Các luồng phụ và ngoại lệ:
- **Ô nhập rỗng:** Người dùng để trống ô mã khách hàng rồi bấm Tra cứu. Client cảnh báo "Vui lòng nhập Mã khách hàng" và không gửi request.
- **Mã khách hàng không tồn tại:** Nhập mã không có trong CSDL (ví dụ `KH9999`). Backend trả về HTTP 404. Giao diện hiển thị cảnh báo "Không tìm thấy thông tin khách hàng".
- **Sai số điện thoại:** Nhập số điện thoại không khớp hồ sơ. Backend trả về `is_authenticated: false`. Giao diện hiển thị "Số điện thoại không khớp với hồ sơ khách hàng", dữ liệu nhạy cảm tiếp tục được bảo vệ.
- **Đổi mã tra cứu:** Người dùng nhấn nút "Đổi mã tra cứu". Hệ thống xóa trạng thái khách hàng hiện tại trong bộ nhớ và quay về màn hình tra cứu ban đầu.

---

### 2.3.2 Use Case 2: Quản trị khách hàng và cấu hình biểu giá EVN
- **Mã Use Case:** `UC02_ADMIN_MANAGEMENT`
- **Tác nhân:** Quản trị viên EVN.
- **Tiền điều kiện:** Máy chủ hoạt động bình thường.
- **Hậu điều kiện:** Dữ liệu khách hàng và biểu giá được cập nhật trong CSDL.

#### Luồng sự kiện chính:
1. Quản trị viên nhấn nút Đăng nhập Admin trên thanh điều hướng.
2. Nhập mã tài khoản `admin` và mật khẩu `admin123`.
3. Client gửi request `POST /api/auth/login`. Backend kiểm tra mật khẩu, trả về token phiên làm việc và quyền `role: admin`.
4. Quản trị viên thực hiện các thao tác:
   - **Tìm kiếm khách hàng:** Nhập mã khách hàng hoặc tên tiếng Việt có dấu. Backend tìm kiếm bằng câu lệnh `LIKE` trên các cột tương ứng.
   - **Phân trang danh sách:** Hiển thị 50 khách hàng mỗi trang, có tổng số trang và nút điều hướng trang trước/sau.
   - **Thêm khách hàng mới:** Nhập họ tên, mã khách hàng, số điện thoại, địa chỉ và mã công tơ. Backend kiểm tra tính duy nhất của `customer_code` và `meter_code`. Nếu trùng lặp, trả về mã HTTP 400.
   - **Chỉnh sửa thông tin:** Cập nhật số điện thoại, địa chỉ hoặc trạng thái hoạt động của khách hàng.
   - **Cấu hình biểu giá EVN:** Điều chỉnh đơn giá của 6 bậc điện sinh hoạt và tỷ lệ thuế VAT trong bảng `tariffs` và `settings`.
   - **Tính toán tiền điện động:** Khi biểu giá thay đổi, các hóa đơn truy vấn sau đó tự động áp dụng đơn giá mới.

---

### 2.3.3 Use Case 3: Thanh toán tiền điện trực tuyến đa kênh
- **Mã Use Case:** `UC03_PAYMENT_MULTICHANNEL`
- **Tác nhân:** Khách hàng sử dụng điện.
- **Tiền điều kiện:** Hóa đơn ở trạng thái chưa thanh toán (`UNPAID`).
- **Hậu điều kiện:** Hóa đơn chuyển sang trạng thái đã thanh toán (`PAID`), hệ thống lưu mã giao dịch và thời gian thanh toán.

#### Luồng sự kiện chính:
1. Tại bảng danh sách hóa đơn, khách hàng chọn kỳ hóa đơn chưa đóng và nhấn **Thanh toán**.
2. Hệ thống hiển thị modal thanh toán với 3 lựa chọn:
   - **Kênh 1: PayOS VietQR:**
     - Client gửi request `POST /api/payment/create-payos-url` kèm `reading_id`.
     - Backend tính tổng tiền theo biểu giá hiện hành, sinh `orderCode` ngẫu nhiên, tạo chữ ký số HMAC-SHA256 với `payos_checksum_key` và gọi API của PayOS (`https://api-merchant.payos.vn/v2/payment-requests`).
     - Backend lưu tạm `orderCode` vào ghi chú của hóa đơn và trả về đường dẫn `checkoutUrl`, mã `qrCode`, tên tài khoản và số tài khoản ngân hàng.
     - Modal hiển thị mã QR VietQR chuẩn NAPAS 247 để khách hàng quét app ngân hàng thanh toán. Sau khi chuyển khoản thành công, client gọi `POST /api/payment/verify-payos` để xác nhận giao dịch và cập nhật trạng thái `PAID`.
   - **Kênh 2: VNPAY Sandbox:**
     - Client gửi request `POST /api/payment/create-vnpay-url`. Backend tính số tiền cần đóng (nhân 100 theo chuẩn VNPAY), tạo chuỗi tham số, ký mã băm HMAC-SHA512 với `vnp_HashSecret` và trả về link thanh toán VNPAY.
     - Khách hàng thực hiện thao tác trên cổng VNPAY. Sau khi thanh toán, VNPAY chuyển hướng về `POST /api/payment/vnpay-return`. Backend kiểm tra chữ ký băm, nếu mã phản hồi là `00`, hóa đơn được cập nhật thành `PAID`.
   - **Kênh 3: Mô phỏng gạch nợ nhanh (Test Simulation Bypass):**
     - Dành cho mục đích thử nghiệm: Khách hàng nhấn nút "Mô phỏng thanh toán VNPAY Sandbox". Client gửi `POST /api/payment/simulate`, backend cập nhật hóa đơn thành `PAID` với mã giao dịch sinh tự động dạng `SIM_VNP_{timestamp}`.
3. Hóa đơn được chuyển sang nhãn "Đã thanh toán" với mã màu pastel nhạt.

---

### 2.3.4 Use Case 4: Trung tâm Điều hành và Giám sát Ngành điện
- **Mã Use Case:** `UC04_ADMIN_EXECUTIVE_DASHBOARD`
- **Tác nhân:** Quản trị viên EVN.
- **Tiền điều kiện:** Đã đăng nhập tài khoản quản trị thành công.
- **Hậu điều kiện:** Hiển thị toàn cảnh số liệu thống kê, biểu đồ điều hành và danh sách khách hàng nợ cước.

#### Luồng sự kiện chính:
1. Quản trị viên chuyển sang tab **Dashboard Giám Sát** trong trang Admin Portal.
2. Client gửi request `GET /api/stats/dashboard` (mặc định lấy tất cả các kỳ hoặc lọc theo năm `year`).
3. Backend tổng hợp dữ liệu từ 27.580 bản ghi chỉ số của 1.000 khách hàng qua 49 kỳ (từ năm 2022 đến 2026):
   - **5 chỉ số Bento KPI:**
     - Tổng sản lượng điện tiêu thụ toàn mạng lưới (kWh).
     - Tổng doanh thu tiền điện lũy kế (VNĐ).
     - Tỷ lệ thu hồi cước (tính bằng phần trăm số tiền đã thu trên tổng doanh thu).
     - Tổng công nợ tiền điện tồn đọng chưa thu (VNĐ).
     - Sản lượng tiêu thụ bình quân của mỗi hộ gia đình (kWh/hộ).
   - **4 biểu đồ Chart.js trực quan:**
     - *Biểu đồ phối hợp cột và đường:* Diễn biến sản lượng kWh (cột) và doanh thu VNĐ (đường) qua từng kỳ.
     - *Biểu đồ cột tăng trưởng:* Tỷ lệ tăng trưởng % MoM của sản lượng tiêu thụ so với kỳ liền trước.
     - *Biểu đồ Doughnut:* Cơ cấu sản lượng điện rơi vào từng bậc thang từ Bậc 1 đến Bậc 6.
     - *Biểu đồ cột chồng (Stacked Bar):* Phân tích công nợ (Số tiền đã thanh toán đối chiếu với Số tiền còn nợ) theo từng kỳ.
   - **Bảng tổng hợp chi tiết 49 kỳ:** Hiển thị sản lượng, số tiền, số hóa đơn đã thu, số hóa đơn nợ và nút xem chi tiết từng kỳ.
4. Quản trị viên bấm xem chi tiết một kỳ cụ thể:
   - Client gửi request `GET /api/stats/period/:period`.
   - Backend phân nhóm các hộ tiêu thụ (thấp dưới 100 kWh, trung bình 100-300 kWh, cao trên 300 kWh) và truy vấn danh sách **Top 20 khách hàng nợ tiền điện lớn nhất trong kỳ**.
   - Modal hiển thị chi tiết danh sách nợ kèm mã KH, tên khách hàng, số điện thoại, sản lượng và số tiền nợ để nhân viên theo dõi đôn đốc thu nợ.

---

### 2.3.5 Use Case 5: Phân tích chi tiết hồ sơ tiêu thụ cá nhân cho Quản trị viên
- **Mã Use Case:** `UC05_ADMIN_CUSTOMER_DRILLDOWN`
- **Tác nhân:** Quản trị viên EVN.
- **Tiền điều kiện:** Đang ở chế độ làm việc của Quản trị viên.
- **Hậu điều kiện:** Xem được trọn vẹn thông tin cá nhân và lịch sử tiêu thụ 4 năm của khách hàng mà không cần số điện thoại.

#### Luồng sự kiện chính:
1. Tại Admin Dashboard hoặc Danh sách khách hàng, quản trị viên nhập mã khách hàng vào thanh tra cứu trực tiếp hoặc nhấn nút xem hồ sơ.
2. Client gửi request `GET /api/readings/customer/:code?admin=true`.
3. Backend kiểm tra cờ `admin=true` (hoặc token xác thực trong header):
   - Bỏ qua bước kiểm tra số điện thoại chính chủ.
   - Đặt cờ `is_authenticated = true`.
   - Trả về toàn bộ họ tên, địa chỉ, số điện thoại, mã công tơ và lịch sử đầy đủ 49 kỳ.
4. Giao diện hiển thị thanh banner màu xanh thông báo "Chế độ Quản trị viên: Đang xem hồ sơ khách hàng [Tên KH]".
5. Quản trị viên xem được toàn bộ các bảng bóc tách 6 bậc và biểu đồ tiêu thụ nhiều năm của cá nhân đó.
6. Khi hoàn tất phân tích, quản trị viên nhấn nút **← Quay lại Admin Dashboard** để trở lại màn hình điều hành chung.

---

# 3. Yêu cầu phi chức năng

## 3.1 Hiệu năng và độ chính xác tính toán
- **Thời gian phản hồi truy vấn:** Với cơ sở dữ liệu gồm 1.000 khách hàng và 27.580 bản ghi chỉ số điện, các câu lệnh truy vấn và tính toán thống kê của API `/api/stats/dashboard` phản hồi trong thời gian dưới 200ms.
- **Tốc độ render giao diện:** Các thao tác chuyển tab, mở modal và vẽ lại biểu đồ Chart.js hoàn thành dưới 100ms.
- **Độ chính xác tính toán:** Thuật toán tính tiền điện 6 bậc trong `calculator.js` tuân thủ đúng quy định bậc thang lũy kế của EVN:
  - Bậc 1: 0 - 50 kWh (1.893 đ/kWh)
  - Bậc 2: 51 - 100 kWh (1.956 đ/kWh)
  - Bậc 3: 101 - 200 kWh (2.271 đ/kWh)
  - Bậc 4: 201 - 300 kWh (2.860 đ/kWh)
  - Bậc 5: 301 - 400 kWh (3.197 đ/kWh)
  - Bậc 6: Từ 401 kWh trở lên (3.302 đ/kWh)
  - Thuế VAT mặc định: 8% trên tổng tiền trước thuế, làm tròn đến hàng đơn vị theo nguyên tắc số học. Sai số cho phép: 0 đồng.

## 3.2 Tiêu chuẩn thiết kế Flat UI / Modern Minimal
- **Bố cục và màu sắc:** Áp dụng phong cách tối giản phẳng, nền canvas `#FAFAFA`, thẻ nội dung màu trắng với đường viền mảnh `1px solid #EAEAEA`.
- **Màu sắc nhãn trạng thái:** Dùng tông màu pastel nhạt, độ tương phản cao, dễ đọc:
  - Trạng thái Đã thanh toán: Nền `#EDF3EC`, chữ `#275A2C`.
  - Trạng thái Chưa đóng tiền: Nền `#FDF6E7`, chữ `#744210`.
  - Trạng thái Chấm dứt hợp đồng: Nền `#FDEBEC`, chữ `#9B1C1C`.
- **Kiểu chữ:** Dùng font Geist cho văn bản thông thường và font JetBrains Mono (`font-mono tabular-nums`) cho các bảng số liệu, chỉ số công tơ và giá tiền để các con số thẳng hàng khi so sánh.
- **Cấu trúc thị giác:** Loại bỏ các hiệu ứng đổ bóng mờ sặc sỡ, hạn chế các góc bo tròn quá lớn, sử dụng góc phẳng thanh thoát (`rounded-md` hoặc `rounded-lg`).

## 3.3 Bảo mật dữ liệu cá nhân
- **Phân quyền tầng API:** Phía backend chỉ gửi các trường dữ liệu nhạy cảm (`phone`, `address`, `meter_code`) khi request có số điện thoại chính chủ hợp lệ hoặc có cờ phân quyền của Quản trị viên (`admin=true`). Khi chưa xác thực, các trường này hoàn toàn bị loại bỏ khỏi payload JSON.
- **Chuẩn hóa chuỗi nhập:** Loại bỏ ký tự phân cách (khoảng trắng, dấu gạch nối) trước khi đối soát số điện thoại để tránh lỗi so khớp.
- **Chữ ký số thanh toán:** Toàn bộ dữ liệu thanh toán gửi sang cổng VNPAY được ký băm mật mã HMAC-SHA512; dữ liệu gửi sang cổng PayOS được ký băm mật mã HMAC-SHA256 để bảo vệ tính toàn vẹn của số tiền và mã hóa đơn.

## 3.4 Khả năng tương thích trình duyệt
- Vận hành mượt mà trên các trình duyệt phổ biến: Google Chrome, Microsoft Edge, Mozilla Firefox và Apple Safari.
- Giao diện đáp ứng tốt trên các kích thước màn hình máy tính bàn, máy tính xách tay và thiết bị di động.
