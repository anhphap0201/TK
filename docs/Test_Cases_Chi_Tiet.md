# Trường Đại học Phenikaa
## Khoa Công nghệ Thông tin
### Bài tập lớn: Đánh giá và kiểm định chất lượng phần mềm

---

# TÀI LIỆU THIẾT KẾ TEST CASES CHI TIẾT
## Đề tài: Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN

---

## 1. Cover Page & Thông Tin Dự Án

| Thuộc tính | Giá trị chi tiết |
| :--- | :--- |
| **Tên dự án:** | Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN |
| **Mã tài liệu:** | TC-EVN-LOOKUP-V1 |
| **Ngày lập:** | 12/10/2026 |
| **Phiên bản:** | 1.0 |
| **Tác giả (Author):** | Nhóm Kiểm Thử Phenikaa |
| **Người đánh giá (Reviewed by):** | Giảng viên hướng dẫn môn học |
| **Người phê duyệt (Approved by):** | Bộ môn Kiểm thử & Đảm bảo chất lượng |
| **Tổng số Test Cases:** | **25 Test Cases** (Bao gồm Functional, Security và Performance) |
| **Phạm vi kiểm thử:** | - Chức năng 1: Tra cứu tiền điện & Xác thực số điện thoại bảo mật.<br>- Chức năng 2: Quản trị khách hàng & Cấu hình biểu giá EVN.<br>*(Không bao gồm kiểm thử cổng thanh toán VNPAY)* |

---

## 2. Bảng Thuật Ngữ & Từ Viết Tắt (Glossary)

| Từ viết tắt | Tên đầy đủ | Giải thích ý nghĩa |
| :--- | :--- | :--- |
| **TC** | Test Case | Ca kiểm thử |
| **Mã KH** | Mã khách hàng | Mã định danh duy nhất của khách hàng (VD: `KH0001`) |
| **SĐT** | Số điện thoại | Số điện thoại di động đăng ký hợp đồng dùng điện |
| **Admin** | Administrator | Tài khoản có quyền quản trị tối cao của hệ thống |
| **EVN** | Electricity Vietnam | Tập đoàn Điện lực Việt Nam |
| **VAT** | Value Added Tax | Thuế giá trị gia tăng (mặc định 8%) |
| **BVA** | Boundary Value Analysis | Kỹ thuật phân tích giá trị biên |
| **EP** | Equivalence Partitioning | Kỹ thuật phân vùng tương đương |

---

## 3. Thống Kê Tổng Hợp Kết Quả Thực Thi (Execution Summary)

| Trạng thái | Số lượng Test Cases | Tỷ lệ (%) |
| :--- | :---: | :---: |
| **Passed (Đạt)** | 25 | 100% |
| **Failed (Không đạt)** | 0 | 0% |
| **Not Run (Chưa chạy)** | 0 | 0% |
| **Blocked (Bị chặn)** | 0 | 0% |
| **Tổng cộng** | **25** | **100%** |

---

## 4. Danh Sách Chi Tiết Các Ca Kiểm Thử Chức Năng (Functional Test Cases)

### Module 1: Tra Cứu Tiền Điện & Phân Quyền Bảo Mật Qua Số Điện Thoại (Cổng Khách Hàng)

| Test Case ID | Phân loại | Tên ca kiểm thử & Mô tả | Tiền điều kiện (Preconditions) | Các bước thực hiện (Test Procedures) | Dữ liệu kiểm thử (Test Data) | Kết quả mong đợi (Expected Result) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC_LOOKUP_001** | Function / Positive | Tra cứu hợp lệ bằng Mã khách hàng (Chế độ ẩn danh cơ bản) | Hệ thống đang chạy, DB có khách hàng `KH0001` | 1. Mở trang chủ.<br>2. Nhập Mã KH vào ô tra cứu.<br>3. Bấm "Tra cứu". | Mã KH: `KH0001` | - Chuyển sang màn hình Customer Portal.<br>- Hiển thị đúng Họ tên khách hàng và Mã KH `KH0001`.<br>- Hiển thị trạng thái hợp đồng: "Hợp đồng: Đang hiệu lực".<br>- Hiển thị hóa đơn tháng hiện tại (kỳ `2026-10`).<br>- **Ẩn toàn bộ SĐT, Địa chỉ, Mã công tơ**.<br>- Có banner thông báo đang ở chế độ bảo vệ dữ liệu. | **Passed** |
| **TC_LOOKUP_002** | Security / Function | Kiểm tra tính bảo mật dữ liệu ở mức độ chỉ nhập Mã KH | Khách hàng `KH0001` đang hiển thị trên giao diện | 1. Mở Chrome DevTools (F12) $\rightarrow$ Tab Network.<br>2. Kiểm tra response của API `GET /api/readings/customer/KH0001`. | Endpoint: `/api/readings/customer/KH0001` | - Payload trả về có `is_authenticated: false`.<br>- Các trường `phone`, `address`, `meter_code` hoàn toàn không xuất hiện trong JSON response.<br>- Mảng `readings` chỉ có duy nhất 1 bản ghi kỳ hiện tại. | **Passed** |
| **TC_LOOKUP_003** | Function / Negative | Tra cứu bằng Mã khách hàng không tồn tại | Hệ thống đang hoạt động bình thường | 1. Nhập mã KH không có trong DB.<br>2. Bấm "Tra cứu". | Mã KH: `KH9999` | - Hệ thống hiển thị hộp cảnh báo màu đỏ: *"Không tìm thấy mã khách hàng "KH9999". Vui lòng kiểm tra lại..."*.<br>- Không chuyển màn hình. | **Passed** |
| **TC_LOOKUP_004** | Function / Negative | Để trống ô Mã khách hàng khi bấm Tra cứu | Trang chủ tra cứu đang mở | 1. Để trống ô nhập Mã KH.<br>2. Bấm "Tra cứu". | Mã KH: `""` (Rỗng) | - Hiển thị thông báo lỗi màu đỏ: *"Vui lòng nhập Mã khách hàng"*.<br>- Không gửi request lên server. | **Passed** |
| **TC_LOOKUP_005** | Function / Boundary | Tra cứu với Mã KH có chứa khoảng trắng thừa ở đầu và cuối | DB có khách hàng `KH0002` | 1. Nhập Mã KH có dấu cách trước và sau.<br>2. Bấm "Tra cứu". | Mã KH: `"  KH0002  "` | - Hệ thống tự động cắt tỉa (trim) khoảng trắng thừa.<br>- Tra cứu và mở Portal của khách hàng `KH0002` thành công. | **Passed** |
| **TC_LOOKUP_006** | Function / Equivalence | Tra cứu với Mã KH bằng chữ in thường | DB có khách hàng `KH0015` | 1. Nhập Mã KH bằng chữ thường.<br>2. Bấm "Tra cứu". | Mã KH: `kh0015` | - Hệ thống xử lý không phân biệt chữ hoa/thường (Case-insensitive).<br>- Tra cứu và hiển thị chính xác thông tin của khách hàng `KH0015`. | **Passed** |
| **TC_LOOKUP_007** | Function / Positive | Xác thực SĐT thành công để mở khóa toàn bộ lịch sử | Đang ở Portal `KH0001` (chưa xác thực) | 1. Bấm nút "Nhập SĐT xem lịch sử".<br>2. Modal xác thực hiện lên.<br>3. Nhập đúng số điện thoại của `KH0001`.<br>4. Bấm "Xác thực & Mở khóa". | SĐT: `0884980616` | - Modal tự động đóng.<br>- Thông báo thành công màu xanh xuất hiện.<br>- Hiển thị đầy đủ Địa chỉ, Số điện thoại và Số công tơ.<br>- Bảng lịch sử hiển thị toàn bộ 17 kỳ hóa đơn.<br>- Tab "Biểu đồ tiêu thụ" được mở khóa. | **Passed** |
| **TC_LOOKUP_008** | Function / Negative | Xác thực thất bại khi nhập sai số điện thoại | Đang ở Portal `KH0001` (chưa xác thực) | 1. Bấm nút "Nhập SĐT xem lịch sử".<br>2. Nhập số điện thoại sai/không khớp.<br>3. Bấm "Xác thực & Mở khóa". | SĐT: `0912345678` | - Modal không đóng.<br>- Hiển thị thông báo lỗi: *"Số điện thoại không chính xác. Vui lòng kiểm tra lại!"*.<br>- Dữ liệu lịch sử và thông tin cá nhân vẫn tiếp tục bị khóa an toàn. | **Passed** |
| **TC_LOOKUP_009** | Function / Negative | Để trống số điện thoại khi bấm xác thực | Modal xác thực SĐT đang mở | 1. Để trống trường số điện thoại.<br>2. Bấm "Xác thực & Mở khóa". | SĐT: `""` | - Báo lỗi màu đỏ: *"Vui lòng nhập số điện thoại"*.<br>- Không gửi request xác thực. | **Passed** |
| **TC_LOOKUP_010** | Function / Security | Kiểm tra hành vi bấm vào Tab "Biểu đồ tiêu thụ" khi chưa xác thực SĐT | Đang ở Portal `KH0001` chưa xác thực SĐT | 1. Bấm trực tiếp vào Tab "Biểu đồ tiêu thụ" (có icon ổ khóa). | N/A | - Hệ thống chặn không cho vào tab biểu đồ.<br>- Tự động mở Modal "Xác Thực Số Điện Thoại" yêu cầu người dùng xác minh trước. | **Passed** |
| **TC_LOOKUP_011** | Function / Positive | Xem chi tiết bảng phân rã 6 bậc giá của một hóa đơn | Đang ở bảng lịch sử tiền điện | 1. Bấm nút "Chi tiết" tại kỳ hóa đơn bất kỳ.<br>2. Quan sát modal chi tiết. | Kỳ: `2026-10` | - Modal chi tiết hiển thị đầy đủ bảng phân bổ sản lượng và đơn giá từng bậc từ bậc 1 đến bậc 6.<br>- Hiển thị đúng tiền trước thuế, thuế VAT 8% và tổng tiền thanh toán. | **Passed** |
| **TC_LOOKUP_012** | Function / Positive | Lọc biểu đồ tiêu thụ theo năm sau khi đã mở khóa | Đã xác thực SĐT thành công, đang ở Tab Biểu đồ | 1. Bấm chọn năm "2026".<br>2. Bấm chọn năm "2025".<br>3. Bấm chọn "Tất cả". | Các bộ lọc năm | - Biểu đồ cột và đường cập nhật mượt mà tương ứng với các kỳ của năm được chọn.<br>- Số liệu khớp chính xác với bảng lịch sử. | **Passed** |
| **TC_LOOKUP_013** | Function / Positive | Đổi mã tra cứu (Đăng xuất khỏi phiên khách hàng) | Đang ở màn hình Customer Portal | 1. Bấm nút "Đổi mã tra cứu" ở góc trên bên phải. | N/A | - Quay trở lại màn hình form nhập mã ban đầu.<br>- Xóa sạch dữ liệu khách hàng cũ khỏi bộ nhớ tạm. | **Passed** |
| **TC_LOOKUP_014** | Function / Boundary | Hiển thị nhãn hợp đồng đối với khách hàng đã chấm dứt | Khách hàng có `status = 'TERMINATED'` trong DB | 1. Tra cứu khách hàng có mã chấm dứt hợp đồng.<br>2. Quan sát huy hiệu trạng thái. | Mã KH chấm dứt (VD: 1 trong 20 khách ngẫu nhiên) | - Huy hiệu hợp đồng hiển thị màu đỏ nhạt: *"Hợp đồng: Đã chấm dứt"*.<br>- Các chức năng tra cứu lịch sử vẫn xem được bình thường. | **Passed** |

---

### Module 2: Quản Trị Khách Hàng & Cấu Hình Biểu Giá EVN (Cổng Quản Trị Viên)

| Test Case ID | Phân loại | Tên ca kiểm thử & Mô tả | Tiền điều kiện (Preconditions) | Các bước thực hiện (Test Procedures) | Dữ liệu kiểm thử (Test Data) | Kết quả mong đợi (Expected Result) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC_ADMIN_001** | Function / Positive | Đăng nhập Admin thành công với mật khẩu đúng | Trang chủ tra cứu đang mở | 1. Nhập `admin` vào ô Mã KH.<br>2. Trường mật khẩu tự động hiển thị.<br>3. Nhập mật khẩu đúng.<br>4. Bấm "Đăng nhập quản trị". | Code: `admin`<br>Password: `admin123` | - Đăng nhập thành công.<br>- Điều hướng vào màn hình Quản Trị Viên (Admin Portal).<br>- Hiển thị danh sách khách hàng và các nút tiện ích quản lý. | **Passed** |
| **TC_ADMIN_002** | Function / Negative | Đăng nhập Admin thất bại với mật khẩu sai | Đang ở ô nhập mật khẩu Admin | 1. Nhập `admin`.<br>2. Nhập mật khẩu sai.<br>3. Bấm "Đăng nhập quản trị". | Code: `admin`<br>Password: `sai_mat_khau` | - Hệ thống từ chối truy cập, trả về mã lỗi 401.<br>- Hiển thị cảnh báo lỗi: *"Mật khẩu quản trị viên không chính xác"*. | **Passed** |
| **TC_ADMIN_003** | Function / Positive | Tìm kiếm khách hàng theo Mã KH thời gian thực | Đang ở trang Admin Portal | 1. Nhập chuỗi tìm kiếm vào ô tìm kiếm danh sách khách hàng. | Từ khóa: `KH005` | - Bảng danh sách lập tức lọc ra các khách hàng có mã chứa `KH005` (VD: `KH0005`, `KH0050`...).<br>- Số lượng hiển thị chính xác. | **Passed** |
| **TC_ADMIN_004** | Function / Positive | Tìm kiếm khách hàng theo tên người dùng | Đang ở trang Admin Portal | 1. Nhập tên tiếng Việt vào ô tìm kiếm. | Từ khóa: `Nguyễn` | - Danh sách hiển thị toàn bộ khách hàng có họ hoặc tên chứa chữ `Nguyễn`. | **Passed** |
| **TC_ADMIN_005** | Function / Positive | Chuyển trang trong bảng danh sách khách hàng (Pagination) | Đang ở trang Admin Portal (có 1.000 khách) | 1. Cuộn xuống cuối bảng.<br>2. Bấm nút "Trang sau" (Next).<br>3. Bấm chuyển đến trang 3. | Phân trang: limit=50 | - Bảng tải đúng khách hàng từ số 51 - 100 cho trang 2, và từ 101 - 150 cho trang 3.<br>- Không bị giật lag hay lệch số thứ tự. | **Passed** |
| **TC_ADMIN_006** | Function / Positive | Thêm mới một khách hàng hợp lệ | Đang ở trang Admin Portal | 1. Bấm nút "Thêm khách hàng".<br>2. Điền đầy đủ thông tin.<br>3. Bấm "Thêm khách hàng". | Mã KH: `KH9991`<br>Tên: `Trần Văn Test`<br>SĐT: `0988776655`<br>Công tơ: `CT9991`<br>Địa chỉ: `Hà Nội` | - Modal đóng lại, hiển thị thông báo thành công.<br>- Khách hàng mới xuất hiện ngay trên bảng danh sách.<br>- Dữ liệu được lưu vĩnh viễn vào SQLite. | **Passed** |
| **TC_ADMIN_007** | Function / Negative | Thêm khách hàng với Mã công tơ đã tồn tại | Đang ở modal Thêm khách hàng | 1. Nhập thông tin với Mã công tơ trùng với khách khác (`CT0001`).<br>2. Bấm Lưu. | Mã công tơ: `CT0001` (đã có) | - Hệ thống bắt lỗi ràng buộc `UNIQUE` từ database.<br>- Hiển thị thông báo lỗi trùng lặp mã công tơ, không cho phép lưu. | **Passed** |
| **TC_ADMIN_008** | Function / Positive | Chỉnh sửa thông tin khách hàng đã có | Có khách hàng `KH9991` trên danh sách | 1. Bấm nút "Sửa" ở dòng `KH9991`.<br>2. Đổi số điện thoại và địa chỉ.<br>3. Bấm "Cập nhật". | SĐT mới: `0911223344`<br>Địa chỉ: `Đà Nẵng` | - Bảng cập nhật ngay thông tin mới.<br>- Truy vấn lại DB dữ liệu đã thay đổi chính xác. | **Passed** |
| **TC_ADMIN_009** | Function / Positive | Cấu hình và cập nhật Biểu giá EVN 6 bậc | Đang ở trang Admin Portal | 1. Bấm nút "Biểu giá EVN".<br>2. Sửa đơn giá Bậc 1 thành `1900` đ/kWh.<br>3. Đổi thuế VAT thành `10%`.<br>4. Bấm "Lưu biểu giá". | Bậc 1: `1900`<br>VAT: `10` | - Lưu thành công, hệ thống thông báo cập nhật biểu giá hoàn tất.<br>- Bảng `tariffs` và `settings` trong SQLite được cập nhật giá trị mới. | **Passed** |
| **TC_ADMIN_010** | Function / Positive | Kiểm tra tính toán động sau khi cập nhật Biểu giá EVN | Đã đổi thuế VAT thành 10% ở TC_ADMIN_009 | 1. Thoát trang Admin.<br>2. Tra cứu khách hàng bất kỳ.<br>3. Mở xem chi tiết hóa đơn. | Mã KH: `KH0001` | - Hóa đơn tự động tính lại theo Bậc 1 mới (`1900` đ/kWh) và thuế VAT mới (`10%`).<br>- Minh chứng tính toán động (Dynamic calculation) hoạt động hoàn hảo. | **Passed** |
| **TC_ADMIN_011** | Function / Positive | Đăng xuất khỏi tài khoản Quản trị viên | Đang ở màn hình Admin Portal | 1. Bấm nút "Thoát" ở góc phải màn hình. | N/A | - Hủy bỏ token quản trị trong bộ nhớ.<br>- Trở về giao diện màn hình tra cứu công cộng ban đầu. | **Passed** |

---

## 5. Danh Sách Chi Tiết Các Ca Kiểm Thử Bảo Mật & Hiệu Năng (Security & Performance)

| Test Case ID | Phân loại | Tên ca kiểm thử & Mô tả | Tiền điều kiện (Preconditions) | Các bước thực hiện (Test Procedures) | Dữ liệu kiểm thử (Test Data) | Kết quả mong đợi (Expected Result) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC_SEC_001** | Security | Kiểm tra cơ chế chống bypass xem thông tin bằng cách gọi API trực tiếp | Server đang chạy | 1. Dùng công cụ cURL / Postman gửi request `GET` đến `/api/readings/customer/KH0001` mà không đính kèm tham số `phone`.<br>2. Kiểm tra dữ liệu JSON nhận về. | URL: `http://localhost:5000/api/readings/customer/KH0001` | - Trả về HTTP 200.<br>- Đối tượng `customer` chỉ chứa: `id`, `customer_code`, `full_name`, `status`.<br>- Hoàn toàn không có trường `phone`, `address`, `meter_code`.<br>- Không thể hack hoặc xem lén thông tin cá nhân. | **Passed** |
| **TC_SEC_002** | Security | Kiểm tra cơ chế chuẩn hóa số điện thoại chống sai lệch định dạng | Server đang chạy | 1. Gửi request xác thực với số điện thoại có dấu cách hoặc dấu gạch nối (VD: `088 498 0616` hoặc `088-498-0616`). | Phone: `"088-498-0616"` | - Backend tự động làm sạch ký tự không phải số và so khớp chính xác.<br>- Xác thực thành công không bị từ chối oan uổng. | **Passed** |
| **TC_PERF_001** | Performance | Kiểm tra thời gian phản hồi khi tra cứu khách hàng có lịch sử dài | CSDL có 1.000 khách hàng và 27.580 kỳ chỉ số | 1. Gửi request tra cứu khách hàng có lịch sử 4 năm (40+ kỳ).<br>2. Đo thời gian phản hồi API (Response Time). | Khách hàng có 40+ kỳ chỉ số điện | - Thời gian xử lý của Backend $\le 150$ms.<br>- Toàn bộ thời gian load và render trên trình duyệt $\le 300$ms.<br>- Hệ thống phản hồi mượt mà, không giật lag. | **Passed** |

---

## 6. Kết Luận & Đánh Giá Chất Lượng

- **Độ bao phủ kiểm thử (Test Coverage):** Đã bao phủ $100\%$ các luồng nghiệp vụ chính, luồng phụ và luồng ngoại lệ của 2 chức năng trọng tâm: Cổng tra cứu bảo mật khách hàng và Cổng quản trị biểu giá EVN.
- **Tính ổn định & Chất lượng hệ thống:** Hệ thống đáp ứng xuất sắc các tiêu chí về tính toàn vẹn dữ liệu, độ chính xác trong tính toán số tiền điện bậc thang và tuân thủ chuẩn mực bảo mật quyền riêng tư của công dân.
