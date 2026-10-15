# Trường Đại học Phenikaa
## Khoa Công nghệ Thông tin
### Bài tập lớn: Đánh giá và kiểm định chất lượng phần mềm

---

# TÀI LIỆU THIẾT KẾ TEST CASES CHI TIẾT
## Đề tài: Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN

---

## 1. Cover Page & Thông Tin Dự Án (Sheet: Cover page)

| Thuộc tính | Giá trị chi tiết |
| :--- | :--- |
| **Tên dự án:** | Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN |
| **Mã tài liệu:** | TC-EVN-LOOKUP-V1 |
| **Ngày lập:** | 12/10/2026 |
| **Phiên bản:** | 1.0 |
| **Tác giả (Author):** | **Tester 1 (Tôi)** - Phụ trách Cổng Tra Cứu Khách Hàng & Bảo Mật SĐT |
| **Thành viên phối hợp:** | **Tester 2** - Phụ trách Cổng Quản Trị Khách Hàng & Biểu Giá EVN |
| **Người đánh giá (Reviewed by):** | Giảng viên hướng dẫn môn học |
| **Người phê duyệt (Approved by):** | Bộ môn Kiểm thử & Đảm bảo chất lượng |
| **Phạm vi tài liệu của tôi:** | Toàn bộ các ca kiểm thử thuộc **Module 1 (Tra cứu tiền điện & Bảo mật 2 lớp)**, các ca **Security** và **Performance** liên quan đến Cổng khách hàng. |

### Lịch sử cập nhật (Revision History)

| Date | Version | Description | Author |
| :---: | :---: | :--- | :--- |
| 12/10/2026 | 1.0 | Thiết kế và thực thi chi tiết 17 ca kiểm thử (14 Functional + 2 Security + 1 Performance) cho Module Tra Cứu Khách Hàng | Tester 1 (Tôi) |

### Tài liệu tham khảo (References)

| Tên tài liệu | Phiên bản | Đường dẫn lưu trữ |
| :--- | :---: | :--- |
| Đặc tả yêu cầu phần mềm (SRS) | 1.0 | `docs/SRS_Dac_Ta_Yeu_Cau.md` |
| Kế hoạch kiểm thử (Test Plan) | 1.0 | `docs/Test_Plan_Kiem_Thu.md` |
| Kịch bản kiểm thử tự động Node.js | 1.0 | `server/test/customer_lookup.test.js` |
| Biểu mẫu thiết kế ca kiểm thử chuẩn | - | `docs/Test_Case_Template.xlsx` |

### Lịch sử thực thi kiểm thử (Execution History)

| Date of Execution | Executed by | Build Under Test | Kết quả tổng thể |
| :---: | :--- | :--- | :---: |
| 12/10/2026 | Tester 1 (Tôi) | Node.js 24 + Express + Vue 3 SPA | **17/17 Passed (100%)** |

---

## 2. Bảng Thuật Ngữ & Từ Viết Tắt (Sheet: Glossary)

| Thuật ngữ / Từ viết tắt | Tên đầy đủ tiếng Anh | Ý nghĩa tiếng Việt |
| :--- | :--- | :--- |
| **TC** | Test Case | Ca kiểm thử |
| **Mã KH** | Customer Code | Mã khách hàng định danh duy nhất (VD: `KH0001`) |
| **SĐT** | Phone Number | Số điện thoại chính chủ ký hợp đồng mua bán điện |
| **EVN** | Electricity Vietnam | Tập đoàn Điện lực Việt Nam |
| **VAT** | Value Added Tax | Thuế giá trị gia tăng (mặc định 8%) |
| **BVA** | Boundary Value Analysis | Kỹ thuật phân tích giá trị biên |
| **EP** | Equivalence Partitioning | Kỹ thuật phân vùng tương đương |
| **AUT** | Application Under Test | Hệ thống phần mềm đang được kiểm thử |
| **Automated** | Automated Test | Kiểm thử tự động bằng mã lệnh qua test runner |
| **Manual** | Manual Test | Kiểm thử thủ công trên giao diện người dùng |

---

## 3. Thống Kê Tổng Hợp Kết Quả Thực Thi (Execution Summary)

### Bảng tổng hợp phần việc do Tôi (Tester 1) thực hiện:

| Hạng mục kiểm thử | Tổng số TCs | Passed | Failed | Not Run | Tỷ lệ Đạt (%) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Chức năng Tra cứu khách hàng (Function)** | 14 | 14 | 0 | 0 | **100%** |
| **Bảo mật dữ liệu (Security)** | 2 | 2 | 0 | 0 | **100%** |
| **Hiệu năng hệ thống (Performance)** | 1 | 1 | 0 | 0 | **100%** |
| **Tổng cộng (Tester 1 phụ trách)** | **17** | **17** | **0** | **0** | **100%** |

*Ghi chú:*
- **7 Test Cases** được tự động hóa hoàn toàn bằng script `server/test/customer_lookup.test.js` và chạy đạt qua lệnh `npm --prefix server test`.
- **10 Test Cases** được kiểm thử thủ công nghiêm ngặt trên giao diện web và công cụ cURL/DevTools.

---

## 4. Danh Sách Chi Tiết Ca Kiểm Thử Chức Năng (Sheet: Function Test Cases)

### Module 1: Tra Cứu Tiền Điện & Phân Quyền Bảo Mật Qua Số Điện Thoại (Phần Tôi Phụ Trách)

| Category | Test Case ID | Test Case Description | Steps to Perform | Step Expected Result | Test Case Expected Result | Status | Loại kiểm thử |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **Search / Basic** | **TC_LOOKUP_001** | Tra cứu hợp lệ bằng Mã khách hàng (Chế độ ẩn danh cơ bản) | 1. Mở trang chủ.<br>2. Nhập `KH0001` vào ô tra cứu.<br>3. Bấm "Tra cứu". | 1. Form tra cứu sẵn sàng.<br>2. Nhận diện chuỗi `KH0001`.<br>3. Điều hướng sang Customer Portal. | - Chuyển sang màn hình Customer Portal.<br>- Hiển thị đúng Họ tên khách hàng và Mã KH `KH0001`.<br>- Trạng thái hợp đồng: "Đang hiệu lực".<br>- Hiển thị hóa đơn tháng hiện tại (kỳ `2026-10`).<br>- **Ẩn toàn bộ SĐT, Địa chỉ, Mã công tơ**.<br>- Banner hiển thị: Chế độ bảo mật. | **Passed** | Automated (`customer_lookup.test.js`) |
| **Security / Data** | **TC_LOOKUP_002** | Kiểm tra tính bảo mật dữ liệu API ở mức độ chỉ nhập Mã KH | 1. Mở DevTools (F12) $\rightarrow$ Tab Network.<br>2. Gửi request `GET /api/readings/customer/KH0001`.<br>3. Kiểm tra JSON response. | 1. Bắt gói tin request.<br>2. Trả về mã HTTP 200.<br>3. Đối chiếu các trường dữ liệu. | - Payload có `is_authenticated: false`.<br>- Các trường `phone`, `address`, `meter_code` hoàn toàn không có trong JSON response.<br>- Mảng `readings` chỉ có duy nhất 1 bản ghi kỳ hiện tại, không lộ lịch sử cũ. | **Passed** | Automated (`customer_lookup.test.js`) |
| **Search / Validation** | **TC_LOOKUP_003** | Tra cứu bằng Mã khách hàng không tồn tại | 1. Nhập `KH9999` vào ô tra cứu.<br>2. Bấm "Tra cứu". | 1. Nhập mã không có trong CSDL.<br>2. Backend trả về mã lỗi HTTP 404. | - Hệ thống hiển thị hộp cảnh báo màu đỏ: *"Không tìm thấy thông tin khách hàng"*.<br>- Không chuyển màn hình, giữ nguyên giao diện tra cứu. | **Passed** | Automated (`customer_lookup.test.js`) |
| **Input / Validation** | **TC_LOOKUP_004** | Để trống ô Mã khách hàng khi bấm Tra cứu | 1. Để trống ô nhập Mã KH.<br>2. Bấm "Tra cứu". | 1. Ô nhập rỗng `""`.<br>2. Bắt sự kiện click. | - Hiển thị thông báo lỗi màu đỏ: *"Vui lòng nhập Mã khách hàng"*.<br>- Hệ thống không gửi request lên máy chủ. | **Passed** | Manual (UI) |
| **Input / Boundary** | **TC_LOOKUP_005** | Tra cứu với Mã KH có chứa khoảng trắng thừa ở đầu và cuối | 1. Nhập `"  KH0002  "`.<br>2. Bấm "Tra cứu". | 1. Nhập chuỗi có space thừa.<br>2. Client tự động cắt tỉa `trim()`. | - Hệ thống tự động cắt tỉa khoảng trắng thừa.<br>- Tra cứu và mở Portal của khách hàng `KH0002` thành công bình thường. | **Passed** | Manual (UI) |
| **Input / Equivalence** | **TC_LOOKUP_006** | Tra cứu với Mã KH bằng chữ in thường (Case-insensitive) | 1. Nhập `kh0001` bằng chữ thường.<br>2. Bấm "Tra cứu". | 1. Nhập chữ thường.<br>2. Backend xử lý truy vấn `UPPER(customer_code) = UPPER(?)`. | - Hệ thống xử lý không phân biệt chữ hoa/thường.<br>- Tra cứu thành công và hiển thị chính xác thông tin khách hàng `KH0001`. | **Passed** | Automated (`customer_lookup.test.js`) |
| **Auth / Verification** | **TC_LOOKUP_007** | Xác thực SĐT đúng mở khóa toàn bộ thông tin cá nhân & lịch sử | 1. Đang ở Portal `KH0001`, bấm "Nhập SĐT xem lịch sử".<br>2. Nhập SĐT chính chủ `0884980616`.<br>3. Bấm "Xác thực & Mở khóa". | 1. Modal mở ra.<br>2. Nhập số điện thoại chuẩn.<br>3. Gửi `GET /api/readings/customer/KH0001?phone=...`. | - Modal tự động đóng, hiển thị thông báo thành công.<br>- Hiển thị đầy đủ Địa chỉ, Số điện thoại và Số công tơ.<br>- Bảng lịch sử nạp toàn bộ 17 kỳ hóa đơn.<br>- Tab "Biểu đồ tiêu thụ" được mở khóa hoàn toàn. | **Passed** | Automated (`customer_lookup.test.js`) |
| **Auth / Verification** | **TC_LOOKUP_008** | Xác thực thất bại khi nhập sai số điện thoại | 1. Đang ở Portal `KH0001`, mở modal nhập SĐT.<br>2. Nhập SĐT sai `0999888777`.<br>3. Bấm "Xác thực & Mở khóa". | 1. Modal mở ra.<br>2. Nhập SĐT không khớp.<br>3. Backend trả `is_authenticated: false`. | - Modal không đóng.<br>- Hiển thị cảnh báo đỏ: *"Số điện thoại không khớp với hồ sơ khách hàng"*.<br>- Dữ liệu lịch sử và thông tin cá nhân vẫn tiếp tục bị khóa an toàn. | **Passed** | Automated (`customer_lookup.test.js`) |
| **Input / Validation** | **TC_LOOKUP_009** | Để trống số điện thoại khi bấm xác thực | 1. Mở modal xác thực SĐT.<br>2. Để trống ô nhập SĐT.<br>3. Bấm "Xác thực & Mở khóa". | 1. Modal hiển thị ô trống.<br>2. Nhấn nút gửi. | - Báo lỗi màu đỏ: *"Vui lòng nhập số điện thoại"*.<br>- Không gửi request xác thực lên máy chủ. | **Passed** | Manual (UI) |
| **Navigation / Security** | **TC_LOOKUP_010** | Bấm vào Tab "Biểu đồ tiêu thụ" khi chưa xác thực SĐT | 1. Đang ở Portal `KH0001` chưa xác thực SĐT.<br>2. Bấm vào tab "Biểu đồ tiêu thụ" (có icon ổ khóa). | 1. Tab hiển thị trạng thái có ổ khóa.<br>2. Kích hoạt sự kiện bấm tab. | - Hệ thống chặn không cho vào tab biểu đồ.<br>- Tự động kích hoạt mở modal "Xác Thực Số Điện Thoại" yêu cầu người dùng xác minh trước. | **Passed** | Manual (UI) |
| **Billing / Calculation** | **TC_LOOKUP_011** | Xem chi tiết bảng phân rã 6 bậc giá EVN của một hóa đơn | 1. Tại bảng lịch sử, bấm nút "Chi tiết" ở kỳ bất kỳ.<br>2. Quan sát modal chi tiết bảng giá. | 1. Nhấn nút Chi tiết.<br>2. Modal hiện thông tin bóc tách từng bậc điện. | - Modal chi tiết hiển thị đầy đủ bảng phân bổ sản lượng và đơn giá từng bậc từ bậc 1 đến bậc 6.<br>- Tiền trước thuế, thuế VAT 8% và tổng tiền thanh toán khớp chính xác theo công thức. | **Passed** | Automated (`customer_lookup.test.js`) |
| **Chart / Filter** | **TC_LOOKUP_012** | Lọc biểu đồ tiêu thụ theo năm sau khi đã mở khóa | 1. Đã mở khóa SĐT, chuyển sang tab Biểu đồ.<br>2. Bấm chọn nút "2026".<br>3. Bấm chọn "Tất cả". | 1. Tab biểu đồ hiển thị.<br>2. Bấm lọc năm 2026.<br>3. Bấm lọc Tất cả. | - Biểu đồ cột sản lượng và đường chi phí cập nhật mượt mà tương ứng với các kỳ của năm được chọn.<br>- Số liệu khớp chính xác với bảng lịch sử. | **Passed** | Manual (UI) |
| **Session / Logout** | **TC_LOOKUP_013** | Đổi mã tra cứu (Đăng xuất khỏi phiên khách hàng) | 1. Đang ở màn hình Customer Portal.<br>2. Bấm nút "Đổi mã tra cứu" ở góc trên bên phải. | 1. Quan sát nút Đổi mã tra cứu.<br>2. Click nút. | - Quay trở lại màn hình form nhập mã ban đầu.<br>- Xóa sạch dữ liệu khách hàng và số điện thoại tạm lưu khỏi bộ nhớ client. | **Passed** | Manual (UI) |
| **Status / Display** | **TC_LOOKUP_014** | Hiển thị nhãn hợp đồng đối với khách hàng đã chấm dứt | 1. Tra cứu khách hàng có trạng thái `TERMINATED` trong DB.<br>2. Quan sát huy hiệu hợp đồng. | 1. Tra cứu mã khách hàng đã hủy hợp đồng.<br>2. Load trang Portal. | - Huy hiệu trạng thái hợp đồng hiển thị màu đỏ nhạt: *"Hợp đồng: Đã chấm dứt"*.<br>- Các chức năng tra cứu lịch sử vẫn xem bình thường. | **Passed** | Manual (UI) |

---

### Module 2: Quản Trị Khách Hàng & Cấu Hình Biểu Giá EVN (Phần Do Tester 2 Phụ Trách)

> **Ghi chú phân công công việc:**  
> Module này thuộc phạm vi trách nhiệm của **Thành viên 2 (Tester 2)** theo phân công bài tập lớn. Để đảm bảo tính độc lập và trung thực trong báo cáo, danh sách thiết kế test case chi tiết và kết quả thực thi kiểm thử cho phần Admin sẽ do Tester 2 tự hoàn thiện theo hướng dẫn tại [`docs/HUONG_DAN_TESTER_2.md`](HUONG_DAN_TESTER_2.md).  
> **Tester 1 (Tôi) không ghi nhận hay can thiệp vào phần việc của thành viên khác.**

*Các nhóm ca kiểm thử do Tester 2 chịu trách nhiệm:*
- `TC_ADMIN_001`, `TC_ADMIN_002`: Đăng nhập quản trị viên đúng/sai mật khẩu (`auth.js`).
- `TC_ADMIN_003`, `TC_ADMIN_004`: Tìm kiếm khách hàng theo Mã KH, Họ tên (`customers.js`).
- `TC_ADMIN_005`: Phân trang danh sách khách hàng (`customers.js`).
- `TC_ADMIN_006`, `TC_ADMIN_007`: Thêm khách hàng mới và bắt lỗi trùng lặp mã công tơ (`customers.js`).
- `TC_ADMIN_008`: Chỉnh sửa thông tin khách hàng (`customers.js`).
- `TC_ADMIN_009`, `TC_ADMIN_010`: Cấu hình biểu giá EVN 6 bậc, thuế VAT và kiểm tra tính toán động (`tariffs.js`).
- `TC_ADMIN_011`: Đăng xuất khỏi tài khoản Admin.

---

## 5. Danh Sách Chi Tiết Ca Kiểm Thử Bảo Mật & Hiệu Năng (Sheet: Security_Performance)

| Category | Test Case ID | Test Case Description | Steps to Perform | Step Expected Result | Test Case Expected Result | Status | Loại kiểm thử |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **Security / API** | **TC_SEC_001** | Chống bypass xem thông tin bằng cách gọi API trực tiếp | 1. Dùng cURL / Postman gửi `GET /api/readings/customer/KH0001` không có tham số `phone`.<br>2. Kiểm tra JSON response. | 1. Gửi HTTP GET request thô.<br>2. Phân tích đối tượng `customer` và `readings`. | - Trả về mã HTTP 200.<br>- Đối tượng `customer` chỉ chứa: `id`, `customer_code`, `full_name`, `status`.<br>- Hoàn toàn không có các trường `phone`, `address`, `meter_code`.<br>- Không thể hack hoặc xem lén thông tin công dân. | **Passed** | Manual (cURL / API Test) |
| **Security / Sanitization** | **TC_SEC_002** | Chuẩn hóa số điện thoại chống sai lệch định dạng (dấu cách, gạch nối) | 1. Gửi request xác thực với chuỗi SĐT có gạch nối: `088-498-0616`.<br>2. Đối chiếu với SĐT lưu trong DB là `0884980616`. | 1. Truyền tham số phone định dạng cách quãng.<br>2. Backend áp dụng `phoneQuery.replace(/\D/g, '')`. | - Backend tự động lọc bỏ toàn bộ ký tự không phải số và so khớp chính xác.<br>- Xác thực thành công `is_authenticated: true`, mở khóa dữ liệu chuẩn xác. | **Passed** | Automated (`customer_lookup.test.js`) |
| **Performance / Load** | **TC_PERF_001** | Kiểm tra thời gian phản hồi khi tra cứu khách hàng có lịch sử dài (40+ kỳ) | 1. Gửi request tra cứu khách hàng có lịch sử dài trong CSDL 1.000 khách và 27.580 kỳ.<br>2. Đo thời gian phản hồi API (Response Time). | 1. Thực hiện query qua CSDL lớn.<br>2. Ghi nhận thời gian đo bằng DevTools / console.time. | - Thời gian xử lý Backend $\le 150$ms.<br>- Toàn bộ thời gian load và render trên giao diện $\le 300$ms.<br>- Ứng dụng phản hồi mượt mà, không xảy ra hiện tượng đứng trang. | **Passed** | Manual (Chrome DevTools Network) |

---

## 6. Kết Luận & Đánh Giá Chất Lượng

- **Mức độ hoàn thành của tôi (Tester 1):** Đã thiết kế và thực thi đầy đủ **17/17 ca kiểm thử** thuộc phân hệ Tra Cứu Khách Hàng & Bảo Mật SĐT, đạt tỷ lệ **100% Passed**.
- **Chất lượng kiểm thử tự động:** Script `server/test/customer_lookup.test.js` bao phủ toàn diện các ca kiểm thử trọng yếu (TC_LOOKUP_001, 002, 003, 006, 007, 008, 011 và TC_SEC_002), chạy hoàn hảo với Node.js Test Runner không có bất kỳ lỗi nào.
- **Tính an toàn và bảo mật:** Cơ chế phân quyền 2 lớp bảo vệ nghiêm ngặt quyền riêng tư công dân, đáp ứng trọn vẹn đặc tả yêu cầu trong tài liệu SRS.
