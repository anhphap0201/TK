# Trường Đại học Phenikaa
## Khoa Công nghệ Thông tin
### Bài tập lớn môn học: Đánh giá và kiểm định chất lượng phần mềm

---

# TÀI LIỆU THIẾT KẾ VÀ KẾT QUẢ KIỂM THỬ CHI TIẾT
## Đề tài: Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN

---

## 1. Thông tin chung về dự án

| Thuộc tính | Nội dung chi tiết |
| :--- | :--- |
| **Tên dự án** | Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN |
| **Mã tài liệu** | TC-EVN-LOOKUP-V1.2 |
| **Ngày lập** | 12/10/2026 |
| **Ngày cập nhật** | 20/10/2026 |
| **Phiên bản** | 1.2 |
| **Đơn vị thực hiện** | Nhóm sinh viên Khoa CNTT, Trường Đại học Phenikaa |
| **Phân công thực hiện** | **Đàm Anh Pháp (MSV: 23010360 - Tester 1):** Cổng tra cứu khách hàng, bảo mật SĐT 2 lớp, chuẩn hóa giao diện Flat UI và tích hợp thanh toán trực tuyến đa kênh (PayOS VietQR, VNPAY Sandbox)<br>**Bùi Văn Đại (MSV: 23010366 - Tester 2):** Cổng quản trị viên, cấu hình biểu giá EVN, thuật toán tính tiền điện 6 bậc, Trung tâm Điều hành Ngành điện (Admin Executive Dashboard) và phân tích hồ sơ cá nhân |
| **Người đánh giá** | Giảng viên hướng dẫn môn học |

### Lịch sử cập nhật tài liệu

| Ngày | Phiên bản | Mô tả thay đổi | Người thực hiện |
| :---: | :---: | :--- | :--- |
| 12/10/2026 | 1.0 | Thiết kế 17 ca kiểm thử ban đầu cho cổng khách hàng | Đàm Anh Pháp (23010360) |
| 19/10/2026 | 1.1 | Cập nhật cấu trúc phân tách bộ kiểm thử thành 2 thư mục `customer` và `admin`, bổ sung chi tiết các ca kiểm thử quản trị viên và thanh toán | Đàm Anh Pháp & Bùi Văn Đại |
| 20/10/2026 | 1.2 | Bổ sung kiểm thử Trung tâm Điều hành Ngành điện (Admin Dashboard 5 KPI, 4 biểu đồ Chart.js, Top 20 nợ cước, tra cứu cá nhân admin), thanh toán PayOS VietQR và chuẩn hóa Flat UI | Đàm Anh Pháp & Bùi Văn Đại |

### Tài liệu tham khảo

| Tên tài liệu | Phiên bản | Đường dẫn lưu trữ |
| :--- | :---: | :--- |
| Đặc tả yêu cầu phần mềm (SRS) | 1.2 | `docs/SRS_Dac_Ta_Yeu_Cau.md` |
| Kế hoạch kiểm thử (Test Plan) | 1.2 | `docs/Test_Plan_Kiem_Thu.md` |
| Biểu mẫu thiết kế ca kiểm thử chuẩn | - | `docs/Test_Case_Template.xlsx` |
| Bộ kịch bản kiểm thử tự động Khách hàng | 1.2 | `server/test/customer/*.test.js` |
| Bộ kịch bản kiểm thử tự động Quản trị | 1.2 | `server/test/admin/*.test.js` |

---

## 2. Bảng thuật ngữ và từ viết tắt

| Viết tắt | Tên đầy đủ tiếng Anh | Ý nghĩa tiếng Việt |
| :--- | :--- | :--- |
| **TC** | Test Case | Ca kiểm thử |
| **Mã KH** | Customer Code | Mã khách hàng định danh duy nhất (ví dụ: `KH0001`) |
| **SĐT** | Phone Number | Số điện thoại di động chính chủ |
| **EVN** | Electricity Vietnam | Tập đoàn Điện lực Việt Nam |
| **VAT** | Value Added Tax | Thuế giá trị gia tăng (mặc định 8%) |
| **MoM** | Month-over-Month | Tỷ lệ tăng trưởng so với tháng trước |
| **BVA** | Boundary Value Analysis | Kỹ thuật phân tích giá trị biên |
| **EP** | Equivalence Partitioning | Kỹ thuật phân vùng tương đương |
| **AUT** | Application Under Test | Ứng dụng đang được kiểm thử |
| **Automated** | Automated Test | Ca kiểm thử chạy tự động bằng mã lệnh qua test runner |
| **Manual** | Manual Test | Ca kiểm thử thao tác thủ công trên giao diện |

---

## 3. Tổng hợp kết quả thực thi kiểm thử

### Bảng thống kê toàn hệ thống

| Hạng mục kiểm thử | Tổng số TCs | Tự động hóa | Thủ công / API | Đạt (Passed) | Không đạt (Failed) | Tỷ lệ Đạt |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Tra cứu khách hàng (Customer)** | 14 | 7 | 7 | 14 | 0 | **100%** |
| **Quản trị hệ thống (Admin Base)** | 11 | 10 | 1 | 11 | 0 | **100%** |
| **Admin Executive Dashboard (Stats & Drill-down)** | 4 | 2 | 2 | 4 | 0 | **100%** |
| **Thuật toán tính tiền điện (Unit Test)** | 3 | 3 | 0 | 3 | 0 | **100%** |
| **Bảo mật và hiệu năng (Sec & Perf)** | 4 | 1 | 3 | 4 | 0 | **100%** |
| **Thanh toán trực tuyến (Payment)** | 3 | 1 | 2 | 3 | 0 | **100%** |
| **Giao diện Flat UI / Modern Minimal** | 2 | 0 | 2 | 2 | 0 | **100%** |
| **Tổng cộng toàn bộ hệ thống** | **41** | **24** | **17** | **41** | **0** | **100%** |

*Ghi chú về kiểm thử tự động:* Bộ kịch bản kiểm thử tự động gồm 8 file test nằm trong 2 thư mục `server/test/customer/` và `server/test/admin/`, thực thi qua lệnh `npm test` với cấu hình `node --test --test-concurrency=1`, toàn bộ 23/23 unit/integration test cases đều vượt qua 100%. Các tính năng mở rộng về giao diện, cổng thanh toán và Dashboard được xác minh qua các ca kiểm thử tích hợp API và kiểm thử giao diện thủ công.

---

## 4. Danh sách chi tiết ca kiểm thử phân hệ Khách hàng (Customer Portal)

Phụ trách chính: **Đàm Anh Pháp (MSV: 23010360 - Tester 1)**

| Mã ca kiểm thử | Tên và mục tiêu kiểm thử | Tiền điều kiện | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Loại kiểm thử & File |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC_LOOKUP_001** | Tra cứu bằng Mã KH hợp lệ (chế độ ẩn danh cơ bản) | CSDL có khách hàng `KH0001` | 1. Mở trang chủ.<br>2. Nhập `KH0001`.<br>3. Bấm "Tra cứu". | Chuyển sang Cổng khách hàng. Hiển thị họ tên và hóa đơn tháng hiện tại. Ẩn toàn bộ số điện thoại, địa chỉ và mã công tơ. Banner báo chế độ bảo mật. | Hiển thị đúng họ tên, chỉ hiện 1 hóa đơn kỳ này, thông tin nhạy cảm bị ẩn hoàn toàn. | **Passed** | Automated<br>`test/customer/lookup.test.js` |
| **TC_LOOKUP_002** | Kiểm tra bảo mật payload API khi chưa xác thực SĐT | CSDL có khách hàng `KH0001` | 1. Mở DevTools Network.<br>2. Gửi `GET /api/readings/customer/KH0001`.<br>3. Kiểm tra dữ liệu JSON. | Trả về HTTP 200, `is_authenticated: false`. Các trường `phone`, `address`, `meter_code` không tồn tại trong JSON. Mảng `readings` chỉ có 1 phần tử. | JSON response không chứa các trường riêng tư, chỉ trả 1 hóa đơn kỳ gần nhất. | **Passed** | Automated<br>`test/customer/lookup.test.js` |
| **TC_LOOKUP_003** | Tra cứu bằng Mã khách hàng không tồn tại | Không có mã `KH9999` trong CSDL | 1. Nhập `KH9999` vào ô tra cứu.<br>2. Bấm "Tra cứu". | Backend trả về mã HTTP 404. Giao diện hiển thị cảnh báo đỏ: "Không tìm thấy thông tin khách hàng". Giữ nguyên màn hình nhập. | Nhận mã 404, hiển thị thông báo lỗi rõ ràng, không chuyển trang. | **Passed** | Automated<br>`test/customer/lookup.test.js` |
| **TC_LOOKUP_004** | Để trống ô nhập Mã KH khi bấm tra cứu | Đang ở màn hình tra cứu | 1. Để trống ô nhập.<br>2. Bấm "Tra cứu". | Báo lỗi màu đỏ: "Vui lòng nhập Mã khách hàng". Hệ thống không gửi request lên máy chủ. | Giao diện cảnh báo ngay, không gửi request mạng. | **Passed** | Manual (UI) |
| **TC_LOOKUP_005** | Tra cứu mã KH có khoảng trắng thừa đầu cuối | CSDL có khách hàng `KH0002` | 1. Nhập `"  KH0002  "`.<br>2. Bấm "Tra cứu". | Hệ thống tự động cắt tỉa khoảng trắng (`trim`), tra cứu thành công và mở cổng khách hàng `KH0002`. | Cắt khoảng trắng chuẩn xác, mở đúng hồ sơ `KH0002`. | **Passed** | Manual (UI) |
| **TC_LOOKUP_006** | Tra cứu mã KH viết chữ thường (Case-insensitive) | CSDL có khách hàng `KH0001` | 1. Nhập `kh0001` (chữ thường).<br>2. Bấm "Tra cứu". | Hệ thống xử lý không phân biệt hoa thường, tra cứu thành công thông tin khách hàng `KH0001`. | Tìm thấy dữ liệu, mở cổng khách hàng bình thường. | **Passed** | Automated<br>`test/customer/lookup.test.js` |
| **TC_LOOKUP_007** | Xác thực đúng số điện thoại chính chủ | Đang ở cổng `KH0001` ở chế độ ẩn danh | 1. Bấm "Nhập SĐT xem lịch sử".<br>2. Nhập `0884980616`.<br>3. Bấm "Xác thực & Mở khóa". | Đóng modal xác thực. Hiển thị thông báo thành công. Mở khóa toàn bộ số điện thoại, địa chỉ, mã công tơ, danh sách toàn bộ các kỳ hóa đơn và tab biểu đồ. | Cờ `is_authenticated` chuyển thành true, mở khóa toàn bộ thông tin cá nhân và 17 kỳ hóa đơn. | **Passed** | Automated<br>`test/customer/phone_auth.test.js` |
| **TC_LOOKUP_008** | Xác thực thất bại khi nhập sai số điện thoại | Đang ở cổng `KH0001` | 1. Mở modal xác thực SĐT.<br>2. Nhập số sai `0999888777`.<br>3. Bấm "Xác thực & Mở khóa". | Không đóng modal. Hiển thị thông báo đỏ: "Số điện thoại không khớp với hồ sơ khách hàng". Dữ liệu lịch sử tiếp tục được bảo vệ. | `is_authenticated` vẫn là false, thông tin cá nhân và lịch sử tiếp tục bị ẩn. | **Passed** | Automated<br>`test/customer/phone_auth.test.js` |
| **TC_LOOKUP_009** | Để trống số điện thoại khi bấm xác thực | Đang mở modal xác thực SĐT | 1. Để trống ô số điện thoại.<br>2. Bấm "Xác thực & Mở khóa". | Báo lỗi màu đỏ: "Vui lòng nhập số điện thoại". Không gửi request xác thực lên máy chủ. | Bắt lỗi trực tiếp trên client, không gửi request. | **Passed** | Manual (UI) |
| **TC_LOOKUP_010** | Bấm vào Tab Biểu đồ tiêu thụ khi chưa xác thực SĐT | Đang ở cổng `KH0001` chưa nhập SĐT | 1. Bấm vào tab "Biểu đồ tiêu thụ" (có biểu tượng ổ khóa). | Hệ thống chặn không cho vào tab biểu đồ, tự động mở modal yêu cầu nhập số điện thoại xác minh. | Tab bị khóa, modal xác thực tự động bật lên. | **Passed** | Manual (UI) |
| **TC_LOOKUP_011** | Xem chi tiết bảng phân rã 6 bậc giá EVN của hóa đơn | Đang xem danh sách hóa đơn | 1. Bấm nút "Chi tiết" ở một kỳ hóa đơn.<br>2. Quan sát bảng số liệu. | Modal hiển thị chi tiết sản lượng và đơn giá từng bậc từ 1 đến 6. Tiền trước thuế cộng thuế VAT 8% bằng đúng tổng tiền thanh toán. | Mảng `tier_details` có đủ 6 bậc, số tiền tính toán chuẩn xác. | **Passed** | Automated<br>`test/customer/billing.test.js` |
| **TC_LOOKUP_012** | Lọc dữ liệu biểu đồ tiêu thụ theo năm | Đã xác thực số điện thoại, mở tab Biểu đồ | 1. Chọn lọc năm "2026".<br>2. Chọn lọc "Tất cả". | Biểu đồ cột sản lượng và đường chi phí cập nhật lại tương ứng với các kỳ của năm được chọn, khớp với số liệu trong bảng lịch sử. | Biểu đồ chuyển đổi mượt mà, số liệu đồng bộ chính xác. | **Passed** | Manual (UI) |
| **TC_LOOKUP_013** | Đổi mã tra cứu (kết thúc phiên làm việc) | Đang ở Cổng khách hàng | 1. Bấm nút "Đổi mã tra cứu" ở góc trên bên phải. | Xóa thông tin khách hàng và số điện thoại tạm lưu trong bộ nhớ client, quay lại màn hình nhập mã ban đầu. | Trở về màn hình tìm kiếm, bộ nhớ tạm được dọn sạch. | **Passed** | Manual (UI) |
| **TC_LOOKUP_014** | Hiển thị trạng thái khách hàng đã chấm dứt hợp đồng | CSDL có khách hàng mang trạng thái `TERMINATED` | 1. Tra cứu mã khách hàng đã chấm dứt hợp đồng.<br>2. Quan sát giao diện. | Huy hiệu trạng thái hiển thị màu pastel đỏ: "Chấm dứt". Các chức năng tra cứu lịch sử vẫn hiển thị bình thường. | Nhãn trạng thái hiển thị đúng màu nền `#FDEBEC` và chữ đỏ `#9B1C1C`. | **Passed** | Manual (UI) |

---

## 5. Danh sách chi tiết ca kiểm thử phân hệ Quản trị viên (Admin Portal)

Phụ trách chính: **Bùi Văn Đại (MSV: 23010366 - Tester 2)**

| Mã ca kiểm thử | Tên và mục tiêu kiểm thử | Tiền điều kiện | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Loại kiểm thử & File |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC_ADMIN_001** | Đăng nhập Admin với mật khẩu đúng | Máy chủ đang chạy | 1. Gửi request `POST /api/auth/login` với mã `admin` và mật khẩu `admin123`. | Trả về mã HTTP 200, cấp quyền `role: admin`, kèm token xác thực và thông tin người dùng "Quản trị viên EVN". | Trả về HTTP 200, có token hợp lệ và thông tin quản trị viên. | **Passed** | Automated<br>`test/admin/auth.test.js` |
| **TC_ADMIN_002** | Đăng nhập Admin với mật khẩu sai | Máy chủ đang chạy | 1. Gửi request `POST /api/auth/login` với mã `admin` và mật khẩu sai `sai_mat_khau`. | Trả về mã HTTP 401, thông báo lỗi: "Mật khẩu quản trị viên không chính xác". | Nhận mã 401, thông báo từ chối truy cập rõ ràng. | **Passed** | Automated<br>`test/admin/auth.test.js` |
| **TC_ADMIN_003** | Tìm kiếm khách hàng theo mã khách hàng | Khách hàng thử nghiệm đã được tạo trong CSDL | 1. Gửi request `GET /api/customers?q=KH_TEST_...`. | Trả về mã HTTP 200, mảng dữ liệu chứa khách hàng có mã cần tìm. | Tìm thấy đúng khách hàng với mã tương ứng trong danh sách. | **Passed** | Automated<br>`test/admin/customers_search.test.js` |
| **TC_ADMIN_004** | Tìm kiếm khách hàng theo tên tiếng Việt có dấu | Khách hàng họ "Nguyễn" có trong CSDL | 1. Gửi request `GET /api/customers?q=Nguyễn&limit=100`. | Trả về mã HTTP 200, danh sách chứa các khách hàng có tên chứa từ khóa "Nguyễn". | Tìm kiếm tiếng Việt có dấu hoạt động chính xác. | **Passed** | Automated<br>`test/admin/customers_search.test.js` |
| **TC_ADMIN_005** | Phân trang danh sách khách hàng | CSDL có trên 100 khách hàng | 1. Gửi request lấy trang 1, trang 2, trang 3 với `limit=50`. | Mỗi trang trả về tối đa 50 bản ghi. Khách hàng ở các trang không bị trùng lặp ID. | Phân trang đúng kích thước, dữ liệu giữa các trang độc lập. | **Passed** | Automated<br>`test/admin/customers_search.test.js` |
| **TC_ADMIN_006** | Thêm mới khách hàng với thông tin hợp lệ | Mã KH và mã công tơ chưa từng tồn tại | 1. Gửi `POST /api/customers` với đầy đủ họ tên, mã KH, số điện thoại, địa chỉ, mã công tơ. | Trả về mã HTTP 201, dữ liệu khách hàng được tạo thành công trong CSDL SQLite. | Khách hàng được tạo mới với đầy đủ thông tin cung cấp. | **Passed** | Automated<br>`test/admin/customers_crud.test.js` |
| **TC_ADMIN_007** | Bắt lỗi trùng lặp mã công tơ khi thêm mới | Mã công tơ đã có người sử dụng trong CSDL | 1. Gửi `POST /api/customers` với mã công tơ trùng với khách hàng đã có. | Trả về mã HTTP 400, thông báo lỗi "mã công tơ đã tồn tại". Không tạo bản ghi mới. | Nhận mã 400, CSDL không bị thêm bản ghi trùng lặp. | **Passed** | Automated<br>`test/admin/customers_crud.test.js` |
| **TC_ADMIN_008** | Cập nhật thông tin khách hàng đã tồn tại | Khách hàng đã có trong CSDL | 1. Gửi `PUT /api/customers/:id` với số điện thoại và địa chỉ mới. | Trả về mã HTTP 200. Khi truy vấn lại theo ID, thông tin mới đã được cập nhật. | Cập nhật thành công, dữ liệu mới được lưu chính xác vào DB. | **Passed** | Automated<br>`test/admin/customers_crud.test.js` |
| **TC_ADMIN_009** | Cập nhật biểu giá 6 bậc EVN và thuế VAT | Đang đăng nhập quyền Admin | 1. Gửi `PUT /api/tariffs` đổi giá bậc 1 thành 1900 đ/kWh và VAT 10%.<br>2. Lấy lại biểu giá. | Trả về HTTP 200, danh sách bậc giá mới phản ánh đúng đơn giá 1900 và VAT 10%. | Biểu giá và thuế được cập nhật đúng giá trị mới. | **Passed** | Automated<br>`test/admin/tariffs.test.js` |
| **TC_ADMIN_010** | Tính tiền điện tự động theo biểu giá và VAT mới | Biểu giá đã đổi thành bậc 1 = 1900 và VAT = 10% | 1. Tính tiền cho sản lượng 50 kWh với cấu hình mới. | Tiền trước thuế = 50 * 1900 = 95.000 đ. Thuế VAT 10% = 9.500 đ. Tổng tiền = 104.500 đ. | Kết quả tính toán khớp chính xác 104.500 đ theo cấu hình động mới. | **Passed** | Automated<br>`test/admin/tariffs.test.js` |
| **TC_ADMIN_011** | Đăng xuất khỏi tài khoản Quản trị viên | Đang ở Cổng Admin | 1. Nhấn nút "Đăng xuất" trên thanh menu. | Xóa token quản trị khỏi bộ nhớ trình duyệt, đưa người dùng quay lại màn hình tra cứu khách hàng. | Token bị hủy, giao diện chuyển về cổng người dùng. | **Passed** | Manual (UI) |

---

## 6. Danh sách ca kiểm thử Trung tâm Điều hành Ngành điện (Admin Executive Dashboard)

Phụ trách: **Bùi Văn Đại (MSV: 23010366 - Tester 2)**

| Mã ca kiểm thử | Tên và mục tiêu kiểm thử | Tiền điều kiện | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Loại kiểm thử & File |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC_ADMIN_012** | Tổng hợp 5 chỉ số Bento KPI qua API Dashboard | CSDL có 27.580 bản ghi qua 49 kỳ | 1. Gửi request `GET /api/stats/dashboard`.<br>2. Kiểm tra các trường dữ liệu trả về trong object `overall`. | Trả về HTTP 200. Có đầy đủ 5 chỉ số: tổng sản lượng `total_kwh`, tổng doanh thu `total_revenue`, tỷ lệ thu hồi `recovery_rate`, nợ tồn đọng `total_unpaid`, bình quân `avg_kwh_per_customer`. | API trả về đầy đủ 5 chỉ số tổng hợp chuẩn xác, thời gian phản hồi dưới 180ms. | **Passed** | Automated / API Test<br>`routes/stats.js` |
| **TC_ADMIN_013** | Hiển thị 4 biểu đồ Chart.js trực quan trên Dashboard | Đang ở tab "Dashboard Giám Sát" | 1. Mở trang Dashboard.<br>2. Quan sát hiển thị 4 biểu đồ tương tác: Combo cột/đường, cột tăng trưởng MoM, Doughnut 6 bậc, Stacked Bar công nợ. | 4 biểu đồ Chart.js render thành công, hiển thị đầy đủ nhãn trục, chú giải (legend) và tooltip khi rê chuột vào các điểm dữ liệu. | 4 biểu đồ vẽ mượt mà, tương tác nhạy bén, không có lỗi console. | **Passed** | Manual (UI) |
| **TC_ADMIN_014** | Drill-down xem chi tiết kỳ và Top 20 khách hàng nợ cước | Đang ở bảng số liệu 49 kỳ trên Dashboard | 1. Bấm nút "Chi tiết kỳ" tại kỳ `2026-03`.<br>2. Hệ thống gọi `GET /api/stats/period/2026-03`. | Modal hiển thị phân nhóm hộ tiêu thụ và danh sách tối đa 20 khách hàng có số tiền nợ cước cao nhất trong kỳ, hiển thị rõ họ tên, SĐT và số tiền nợ. | Dữ liệu nợ được sắp xếp giảm dần theo số tiền, thông tin khách hàng chính xác. | **Passed** | Automated / API Test<br>`routes/stats.js` |
| **TC_ADMIN_015** | Admin tra cứu phân tích cá nhân không cần số điện thoại | Đang đăng nhập Quản trị viên | 1. Nhập `KH0001` vào thanh tra cứu cá nhân trên Dashboard.<br>2. Bấm "Phân tích cá nhân".<br>3. Kiểm tra gọi `GET /api/readings/customer/KH0001?admin=true`. | Mở khóa toàn bộ thông tin cá nhân (SĐT, địa chỉ, mã công tơ) và toàn bộ lịch sử 4 năm mà không yêu cầu nhập SĐT. Hiện banner Admin có nút quay lại Dashboard. | Quyền Admin mở khóa trọn vẹn dữ liệu, nút quay lại Dashboard hoạt động chuẩn xác. | **Passed** | Manual (UI / API) |

---

## 7. Danh sách ca kiểm thử đơn vị thuật toán tính tiền điện (Unit Testing)

Phụ trách: **Bùi Văn Đại (MSV: 23010366 - Tester 2)**

| Mã ca kiểm thử | Mô tả ca kiểm thử | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Loại kiểm thử & File |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC_CALC_001** | Tính tiền cho sản lượng 0 kWh | `kwh = 0` | Tiền trước thuế: 0 đ, VAT: 0 đ, Tổng tiền: 0 đ. | `subtotal = 0`, `vatAmount = 0`, `total = 0`. | **Passed** | Automated<br>`test/admin/calculator.test.js` |
| **TC_CALC_002** | Tính tiền điện 50 kWh nằm trọn trong Bậc 1 | `kwh = 50`, bậc 1: 1.893 đ, VAT: 8% | Tiền trước thuế: 50 * 1893 = 94.650 đ. Thuế VAT: 7.572 đ. Tổng: 102.222 đ. | `subtotal = 94650`, `vatAmount = 7572`, `total = 102222`. | **Passed** | Automated<br>`test/admin/calculator.test.js` |
| **TC_CALC_003** | Tính tiền điện 250 kWh qua 4 bậc thang lũy kế | `kwh = 250`, VAT: 8% | Bậc 1: 50 * 1893 = 94.650 đ<br>Bậc 2: 50 * 1956 = 97.800 đ<br>Bậc 3: 100 * 2271 = 227.100 đ<br>Bậc 4: 50 * 2860 = 143.000 đ<br>Tổng trước thuế: 562.550 đ. VAT: 45.004 đ. Tổng: 607.554 đ. | `subtotal = 562550`, `vatRate = 8`, `vatAmount = 45004`, `total = 607554`. | **Passed** | Automated<br>`test/admin/calculator.test.js` |

---

## 8. Danh sách ca kiểm thử Bảo mật, Hiệu năng, Thanh toán và Giao diện Flat UI

Phụ trách: **Đàm Anh Pháp & Bùi Văn Đại**

| Mã ca kiểm thử | Hạng mục | Mục tiêu và mô tả | Các bước thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Loại kiểm thử |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **TC_SEC_001** | Bảo mật API | Ngăn chặn xem lén dữ liệu riêng tư bằng cách gọi API trực tiếp | 1. Dùng cURL gửi `GET /api/readings/customer/KH0001` không kèm `phone`.<br>2. Kiểm tra JSON trả về. | Payload JSON chỉ có họ tên và mã khách hàng, tuyệt đối không có các trường `phone`, `address`, `meter_code`. Không thể vượt rào xem lén thông tin. | Dữ liệu nhạy cảm được loại bỏ hoàn toàn khỏi JSON ở tầng backend. | **Passed** | Manual (cURL Test) |
| **TC_SEC_002** | Làm sạch chuỗi | Chuẩn hóa số điện thoại chống sai lệch định dạng (dấu cách, gạch nối) | 1. Nhập số điện thoại có dấu gạch nối: `088-498-0616` để xác thực với số `0884980616` trong DB. | Backend tự động loại bỏ các ký tự không phải số, so khớp thành công và mở khóa thông tin. | So khớp chính xác, xác thực thành công. | **Passed** | Automated<br>`test/customer/phone_auth.test.js` |
| **TC_SEC_003** | Phân quyền Admin | Xác thực cờ `admin=true` mở khóa hồ sơ cá nhân | 1. Gửi request `GET /api/readings/customer/KH0001?admin=true`.<br>2. Kiểm tra payload JSON. | Trả về `is_authenticated: true`, kèm toàn bộ địa chỉ, mã công tơ và lịch sử các kỳ. | Mở khóa thành công theo đúng quyền Quản trị viên. | **Passed** | Manual / API Test |
| **TC_PERF_001** | Hiệu năng | Đo tốc độ truy vấn thống kê toàn hệ thống trên 27.580 bản ghi | 1. Gửi `GET /api/stats/dashboard`.<br>2. Đo thời gian phản hồi bằng DevTools Network. | Thời gian phản hồi $\le 200$ms trên CSDL 1.000 khách hàng và 27.580 bản ghi chỉ số. | Thời gian phản hồi thực tế đo được từ 75ms đến 145ms. | **Passed** | Manual (DevTools) |
| **TC_PAY_001** | Thanh toán | Tạo URL thanh toán VNPAY Sandbox có chữ ký băm bảo mật | 1. Gửi `POST /api/payment/create-vnpay-url` kèm mã kỳ hóa đơn chưa đóng. | Backend tính đúng số tiền, sinh chữ ký HMAC-SHA512 hợp lệ và trả về đường link cổng VNPAY Sandbox. | Nhận được link VNPAY với đầy đủ tham số và chữ ký `vnp_SecureHash`. | **Passed** | Manual / API Test |
| **TC_PAY_002** | Thanh toán | Tạo yêu cầu thanh toán PayOS và hiển thị mã VietQR | 1. Gửi `POST /api/payment/create-payos-url` kèm mã kỳ hóa đơn chưa đóng. | Backend tạo chữ ký HMAC-SHA256, gọi cổng PayOS thành công, trả về `checkoutUrl`, mã `qrCode` và thông tin số tài khoản. | Modal hiển thị mã VietQR rõ nét, có thể quét được qua app ngân hàng. | **Passed** | Manual / API Test |
| **TC_PAY_003** | Thanh toán | Mô phỏng gạch nợ tức thì phục vụ kiểm thử nhanh (Test Bypass) | 1. Bấm nút "Mô phỏng thanh toán VNPAY Sandbox" tại hóa đơn chưa đóng.<br>2. Kiểm tra trạng thái hóa đơn. | Gửi `POST /api/payment/simulate`, backend cập nhật hóa đơn thành `PAID` với mã giao dịch sinh tự động. | Hóa đơn chuyển ngay sang trạng thái "Đã thanh toán". | **Passed** | Manual (UI) |
| **TC_UI_001** | Thiết kế Flat UI | Kiểm tra bố cục phẳng, tối giản và phông chữ kỹ thuật | 1. Mở trang chủ và cổng khách hàng.<br>2. Kiểm tra font Geist, JetBrains Mono cho các con số tiền/kWh, nền canvas `#FAFAFA` và viền `#EAEAEA`. | Giao diện phẳng, tinh tế, các con số hiển thị chuẩn tabular numbers thẳng hàng, không có bóng đổ màu mè. | Toàn bộ các thành phần hiển thị sắc sảo, đúng ngôn ngữ thiết kế. | **Passed** | Manual (UI) |
| **TC_UI_002** | Thiết kế Flat UI | Kiểm tra màu sắc nhãn trạng thái pastel nhạt | 1. Quan sát nhãn trạng thái các hóa đơn: Đã thanh toán, Chưa đóng tiền, Chấm dứt hợp đồng. | Nhãn Đã thanh toán mang màu xanh pastel nhạt (`#EDF3EC`), Chưa đóng màu vàng pastel nhạt (`#FDF6E7`), Chấm dứt màu đỏ pastel nhạt (`#FDEBEC`). | Màu sắc nhã nhặn, tương phản cao, dễ đọc theo tiêu chuẩn thiết kế. | **Passed** | Manual (UI) |

---

## 9. Đánh giá kết quả thực thi và kết luận

1. **Mức độ bao phủ và chất lượng phần mềm:**
   - Đã thiết kế và thực thi đầy đủ **41/41 ca kiểm thử** cho cả hai phân hệ Khách hàng và Quản trị viên, đạt tỷ lệ **100% Passed**.
   - Bộ kịch bản kiểm thử tự động gồm 23 bài test được tách thành các file chuyên biệt theo từng chức năng trong 2 thư mục `server/test/customer/` và `server/test/admin/`.
2. **Tính ổn định của hệ thống:**
   - Cấu hình cờ `--test-concurrency=1` trong `server/package.json` giải quyết triệt để lỗi xung đột ghi file SQLite (`database is locked`) trên hệ điều hành Windows. Toàn bộ kịch bản kiểm thử có thể thực thi lặp lại ổn định nhiều lần.
3. **Mức độ hoàn thiện các tính năng mới:**
   - Trung tâm Điều hành Ngành điện (Admin Executive Dashboard) hoạt động mượt mà, tổng hợp chính xác dữ liệu 49 kỳ trên 27.580 bản ghi với 5 thẻ Bento KPI và 4 biểu đồ Chart.js.
   - Cổng thanh toán trực tuyến đa kênh (PayOS VietQR, VNPAY Sandbox, Test Simulation) hoạt động tin cậy, gạch nợ tức thì và đồng bộ trạng thái hóa đơn theo thời gian thực.
   - Cơ chế bảo mật thông tin cá nhân 2 lớp bảo vệ nghiêm ngặt quyền riêng tư của khách hàng, đồng thời hỗ trợ phân quyền quản trị viên mở khóa tra cứu khi cần điều tra kỹ thuật.
