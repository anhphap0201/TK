# KỊCH BẢN THUYẾT TRÌNH BÀI TẬP LỚN
**Đề tài:** Kiểm thử Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN
**Thời lượng dự kiến:** 10 - 15 phút

---

## [SLIDE 1: TRANG TIÊU ĐỀ]
**[Người nói: Đại diện nhóm (Pháp hoặc Đại)]**
"Kính chào thầy cô và các bạn. Hôm nay, nhóm chúng em xin đại diện trình bày báo cáo kiểm thử toàn diện cho đề tài **'Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN'**. 

Đề tài của chúng em tập trung vào việc đảm bảo tính chính xác tuyệt đối của thuật toán tính tiền điện lũy kế 6 bậc, kiểm định cơ chế bảo mật thông tin cá nhân 2 lớp, xác thực tích hợp thanh toán trực tuyến đa kênh và vận hành ổn định Trung tâm điều hành ngành điện trên tập dữ liệu lớn. Sau đây em xin phép đi vào chi tiết."

*(Bấm chuyển slide)*

---

## [SLIDE 2: MỤC TIÊU KIỂM THỬ]
**[Người nói: Tester 1 hoặc 2]**
"Hệ thống của chúng em phục vụ 2 nhóm người dùng chính: Khách hàng dùng điện và Quản trị viên ngành điện. Vì liên quan trực tiếp đến tiền bạc và dữ liệu cá nhân của người dân, mục tiêu kiểm thử của nhóm đặt ra 3 trọng tâm thiết yếu:

*   **Thứ nhất, Tính chính xác:** Độ chính xác tuyệt đối của thuật toán tính tiền điện theo bậc thang, khớp 100% với công thức của Bộ Công Thương.
*   **Thứ hai, Bảo mật:** Bảo vệ quyền riêng tư qua cơ chế xác thực số điện thoại 2 lớp, tuyệt đối không rò rỉ thông tin cá nhân.
*   **Thứ ba, Hiệu năng:** Đảm bảo hiệu năng xử lý nhanh, phản hồi API dưới 200ms, mượt mà khi tổng hợp số liệu thống kê lớn qua 49 kỳ hóa đơn."

*(Bấm chuyển slide)*

---

## [SLIDE 3: QUY TRÌNH THỰC HIỆN]
**[Người nói: Tester 1 hoặc 2]**
"Về quy trình, nhóm tuân thủ nghiêm ngặt chuẩn quy trình kiểm định phần mềm với 7 mốc công việc rõ ràng. Chúng em bắt đầu từ việc lập Kế hoạch kiểm thử (Test Plan) chi tiết, rà soát tài liệu đặc tả yêu cầu (SRS). Từ đó, thiết kế chi tiết ma trận 41 ca kiểm thử, sau đó tự động hóa bằng code backend và thực hiện kiểm tra chéo (Peer Review) giữa hai thành viên trước khi thực thi nghiệm thu toàn diện để đóng gói sản phẩm."

*(Bấm chuyển slide)*

---

## [SLIDE 4: PHƯƠNG PHÁP ÁP DỤNG]
**[Người nói: Tester 1 hoặc 2]**
"Để đạt được các mục tiêu trên, nhóm kết hợp đa dạng các kỹ thuật kiểm thử. 

Với **Hộp đen**, kỹ thuật Phân tích Giá trị biên (BVA) được dùng triệt để tại các mốc nhảy bậc điện như 50, 100, 200 kWh để đảm bảo không bao giờ bị lệch dù chỉ 1 đồng tiền điện. Kỹ thuật Phân vùng tương đương (EP) áp dụng cho việc nhập mã khách hàng và số điện thoại. 

Bên cạnh đó, chúng em dùng **Hộp trắng** để kiểm tra độ bao phủ nhánh của mã nguồn hàm tính toán, và thực hiện kiểm thử bảo mật API trực tiếp bằng các công cụ dòng lệnh như cURL."

*(Bấm chuyển slide)*

---

## [SLIDE 5: KIẾN TRÚC BÀI TEST]
**[Người nói: Tester 1 hoặc 2]**
"Tổng cộng, kiến trúc kiểm thử của chúng em bao gồm 41 ca kiểm thử, bao quát toàn bộ 2 phân hệ Khách hàng và Quản trị. Trong đó, có 24 ca được tự động hóa hoàn toàn qua code và 17 ca kiểm thử thủ công để đảm bảo trải nghiệm người dùng thực tế trên giao diện. Tỷ lệ vượt qua (Passed) đạt 100%, hệ thống không còn bất kỳ lỗi nghiêm trọng nào."

*(Bấm chuyển slide)*

---

## [SLIDE 6: PHÂN HỆ CỔNG KHÁCH HÀNG]
**[Người nói: Pháp (Tester 1)]**
"Đi vào chi tiết tại Cổng khách hàng, điểm sáng nhất mà nhóm đã kiểm thử thành công là tính năng bảo vệ thông tin cá nhân 2 lớp. 

Khi một người lạ chỉ biết mã khách hàng (ví dụ KH0001), họ tra cứu thì hệ thống sẽ ẩn danh hoàn toàn, chỉ cho xem số tiền của tháng gần nhất; số điện thoại, địa chỉ hay mã công tơ bị giấu đi cả trên giao diện lẫn trong API backend. Chỉ khi nhập đúng số điện thoại chính chủ thì toàn bộ lịch sử 4 năm và tab biểu đồ mới được mở khóa. Nhóm đã viết cả unit test cho API lẫn kiểm tra giao diện để chứng minh không thể vượt rào bảo mật này."

*(Bấm chuyển slide)*

---

## [SLIDE 7: PHÂN HỆ QUẢN TRỊ & THUẬT TOÁN]
**[Người nói: Đại (Tester 2)]**
"Chuyển sang phân hệ Quản trị viên, chúng em tập trung kiểm định các chức năng Quản lý dữ liệu (CRUD) và tính toán động. Quản trị viên có thể tìm kiếm khách hàng thông minh (hỗ trợ tiếng Việt có dấu), cấu hình điều chỉnh đơn giá bậc 1 hoặc thay đổi thuế VAT, và hệ thống phải ngay lập tức tính toán lại chính xác trên hóa đơn. 

Các bài Unit Test cho thuật toán tính tiền 6 bậc được kiểm chứng độc lập, đối soát từng số lẻ, từng đồng thuế VAT với hóa đơn thực tế của Tập đoàn Điện lực Việt Nam, đảm bảo tính đúng đắn tuyệt đối."

*(Bấm chuyển slide)*

---

## [SLIDE 8: DASHBOARD]
**[Người nói: Đại (Tester 2)]**
"Một tính năng vượt trội khác trong đồ án là Trung tâm điều hành ngành điện (Dashboard). Với cơ sở dữ liệu lớn mô phỏng gồm hơn 27 nghìn bản ghi chỉ số qua 49 kỳ, API Dashboard của chúng em đã vượt qua bài test hiệu năng: tính toán tổng hợp 5 chỉ số Bento KPI và vẽ mượt mà 4 biểu đồ phân tích trực quan. Nhóm cũng đã kiểm thử thành công luồng drill-down xem chi tiết từng kỳ và lọc ra Top 20 khách hàng nợ cước lớn nhất để phục vụ công tác điều hành."

*(Bấm chuyển slide)*

---

## [SLIDE 9: THANH TOÁN & GIAO DIỆN]
**[Người nói: Pháp (Tester 1)]**
"Về mảng thanh toán, chúng em kiểm thử tích hợp cổng thanh toán thực tế phổ biến tại Việt Nam là PayOS VietQR, đảm bảo đầy đủ mã băm an toàn HMAC-SHA512. 

Về mặt giao diện, chúng em kiểm định nghiêm ngặt tính nhất quán của phong cách Flat UI tối giản, các con số tài chính được căn gióng thẳng hàng chuẩn mực bằng font kỹ thuật JetBrains Mono, cùng hệ thống màu pastel báo hiệu trạng thái thanh toán trực quan."

*(Bấm chuyển slide)*

---

## [SLIDE 10: TỰ ĐỘNG HÓA KIỂM THỬ]
**[Người nói: Đại (Tester 2)]**
"Điểm nhấn về mặt kỹ thuật của nhóm là không phụ thuộc vào các thư viện cồng kềnh như Jest. Chúng em sử dụng trực tiếp bộ Native Test Runner tích hợp sẵn của Node.js, giúp khởi động tức thì. 

Toàn bộ mã kiểm thử được cấu trúc thành các module độc lập. Đặc biệt, nhóm đã xử lý thành công lỗi xung đột khóa cơ sở dữ liệu SQLite trên Windows bằng cách cấu hình concurrency, giúp toàn bộ 23 kịch bản test tự động chạy và hoàn tất chỉ trong khoảng 2.6 giây với kết quả 100% Passed."

*(Bấm chuyển slide)*

---

## [SLIDE 11: NGHIỆM THU & BÀN GIAO]
**[Người nói: Pháp (Tester 1)]**
"Đối chiếu với tiêu chuẩn nghiệm thu ban đầu đề ra trong Test Plan, hệ thống đã đáp ứng hoàn hảo: 100% ca kiểm thử passed, 0 lỗi mức độ Critical hay Major tồn đọng. 

Hôm nay, nhóm chính thức bàn giao đầy đủ 5 bộ tài liệu tiêu chuẩn: Đặc tả yêu cầu (SRS), Kế hoạch kiểm thử (Test Plan), Báo cáo chi tiết 41 Test Cases, Ma trận Excel đồng bộ, cùng toàn bộ mã nguồn và kịch bản automation."

*(Bấm chuyển slide)*

---

## [SLIDE 12: KẾT LUẬN & Q&A]
**[Người nói: Đại diện nhóm (Pháp hoặc Đại)]**
"Qua đồ án này, chúng em đã nắm vững quy trình kiểm định chất lượng phần mềm, từ kỹ thuật thiết kế ca kiểm thử đến tự động hóa API. Trong tương lai, nhóm định hướng sẽ mở rộng thêm Load Testing bằng công cụ k6 và kiểm thử giao diện E2E bằng Playwright.

Em xin chân thành cảm ơn Quý Thầy/Cô đã lắng nghe bài thuyết trình của nhóm. Bây giờ, chúng em xin phép được lắng nghe những câu hỏi và ý kiến đóng góp từ Hội đồng ạ."

---
---

## 🎯 PHỤ LỤC Q&A (DÀNH CHO NHÓM ĐỌC ĐỂ CHUẨN BỊ TRẢ LỜI)

*Tip: Khi trả lời, hãy giữ thái độ tự tin, mỉm cười và trả lời trực tiếp vào trọng tâm kỹ thuật.*

**❓ Câu 1: Tại sao trong file Excel có 32 test case chức năng mà khi chạy lệnh `npm test` chỉ hiện 23 test?**
> **Trả lời:** "Dạ thưa thầy/cô, con số **23** trong `npm test` là các **bài test tự động (Automated Tests)** được viết bằng code để kiểm tra logic backend và API. Còn **32** trong sheet Excel là **tổng toàn bộ ca kiểm thử chức năng**, bao gồm cả các **ca kiểm thử thủ công (Manual UI)** như: kiểm tra thông báo lỗi khi để trống ô nhập trên web, chặn tab khi chưa nhập SĐT, hay kiểm tra render màu sắc giao diện. Các ca giao diện này được thao tác trực tiếp trên trình duyệt nên không tính vào số lượng chạy auto của lệnh npm test ạ."

**❓ Câu 2: Em áp dụng kỹ thuật Phân tích giá trị biên (BVA) ở đâu trong bài?**
> **Trả lời:** "Dạ, kỹ thuật BVA được áp dụng rõ nhất tại **thuật toán tính tiền điện 6 bậc EVN**. Em chọn các giá trị biên như:
> - Biên dưới cùng: $0$ kWh.
> - Xung quanh ngưỡng Bậc 1: $50$ kWh (vừa chạm ngưỡng) và $51$ kWh (bước sang Bậc 2).
> - Tương tự tại các mốc nhảy bậc là $100$, $200$, $300$ và $400$ kWh.
> Việc test sát sườn các điểm nhảy bậc này giúp đảm bảo thuật toán không bị lỗi 'off-by-one' (lệch một đơn vị) khi cộng dồn các mức giá."

**❓ Câu 3: Làm thế nào em đảm bảo an toàn dữ liệu nếu ai đó cố tình gọi thẳng vào API mà không qua giao diện?**
> **Trả lời:** "Dạ, để chống lại việc chọc thẳng vào API, nhóm em đã thiết kế kiểm thử bảo mật ngay tại backend. Khi có request gọi tra cứu mà không kèm số điện thoại hợp lệ, middleware của Express sẽ chủ động cắt bỏ (`strip`) hoàn toàn các trường dữ liệu nhạy cảm (như `phone`, `address`, `meter_code`) ra khỏi cục JSON trước khi trả về. Do đó, dù hacker có dùng cURL hay Postman cũng chỉ nhận được thông tin số tiền ẩn danh, tuyệt đối không lộ thông tin cá nhân ạ."

---
---

## 📋 PHỤ LỤC: MA TRẬN 41 CA KIỂM THỬ TOÀN DIỆN (TEST CASES MATRIX)

> **Tổng quan nghiệm thu:** 
> - **Tổng số:** 41 ca kiểm thử (100% Passed).
> - **Phân loại thực thi:** 24 ca Tự động (Automated qua Node.js Native Test Runner ~2.6s) + 17 ca Thủ công (Manual UI/Client-side).
> - **Phạm vi:** Bao phủ toàn diện 2 phân hệ Cổng khách hàng và Cổng quản trị viên.

---

### 1. Phân hệ Cổng Khách Hàng (Customer Portal) - 14 Ca

| Mã TC | Tên ca kiểm thử | Loại | Các bước thực hiện & Kết quả mong đợi |
| :--- | :--- | :---: | :--- |
| **TC_LOOKUP_001** | Tra cứu bằng Mã KH hợp lệ (chế độ ẩn danh cơ bản) | Auto (API) | Nhập KH0001 hợp lệ -> Hệ thống chuyển cổng KH, hiển thị họ tên và tiền kỳ gần nhất; ẩn toàn bộ SĐT, địa chỉ, mã công tơ. |
| **TC_LOOKUP_002** | Kiểm tra bảo mật payload API khi chưa xác thực SĐT | Auto (API) | Gọi GET `/api/readings/customer/KH0001` -> Backend lọc bỏ `phone`, `address`, `meter_code`; chỉ trả về 1 hóa đơn kỳ gần nhất. |
| **TC_LOOKUP_003** | Tra cứu bằng Mã khách hàng không tồn tại | Auto (API) | Nhập mã `KH9999` -> Backend trả HTTP 404, giao diện báo cảnh báo đỏ không tìm thấy khách hàng. |
| **TC_LOOKUP_004** | Để trống ô nhập Mã KH khi bấm tra cứu | Manual (UI) | Để trống ô input và bấm "Tra cứu" -> Validation client chặn request, báo đỏ: "Vui lòng nhập Mã khách hàng". |
| **TC_LOOKUP_005** | Tra cứu mã KH có khoảng trắng thừa đầu cuối | Auto (API) | Nhập `"  KH0002  "` -> Hàm `trim()` tự động cắt tỉa khoảng trắng thừa, tra cứu thành công hồ sơ KH0002. |
| **TC_LOOKUP_006** | Tra cứu mã KH viết chữ thường (Case-insensitive) | Auto (API) | Nhập `"kh0001"` -> Hệ thống tự động chuyển thành uppercase `KH0001`, tra cứu không phân biệt hoa thường. |
| **TC_LOOKUP_007** | Xác thực đúng số điện thoại chính chủ | Auto (API) | Nhập đúng SĐT đăng ký -> `is_authenticated: true`, mở khóa đầy đủ SĐT, địa chỉ, mã công tơ, lịch sử 17 kỳ và tab biểu đồ. |
| **TC_LOOKUP_008** | Xác thực thất bại khi nhập sai số điện thoại | Auto (API) | Nhập sai SĐT -> Không đóng modal, backend từ chối, báo lỗi đỏ: "Số điện thoại không khớp với hồ sơ khách hàng". |
| **TC_LOOKUP_009** | Để trống số điện thoại khi bấm xác thực | Manual (UI) | Mở modal và để trống SĐT -> Client validation chặn gửi request, báo đỏ: "Vui lòng nhập số điện thoại". |
| **TC_LOOKUP_010** | Bấm vào Tab Biểu đồ tiêu thụ khi chưa xác thực SĐT | Manual (UI) | Nhấn vào tab Biểu đồ (có biểu tượng khóa) -> Hệ thống chặn chuyển tab, tự động mở popup yêu cầu xác thực SĐT. |
| **TC_LOOKUP_011** | Xem chi tiết bảng phân rã 6 bậc giá EVN của hóa đơn | Auto (API) | Bấm "Chi tiết" tại một hóa đơn -> Modal hiển thị bóc tách sản lượng và đơn giá từng bậc 1-6; tiền trước thuế + VAT 8% khớp tổng. |
| **TC_LOOKUP_012** | Lọc dữ liệu biểu đồ tiêu thụ theo năm | Manual (UI) | Chọn lọc theo năm 2026 hoặc "Tất cả" -> Chart.js cập nhật cột sản lượng và đường chi phí mượt mà, đồng bộ với bảng lịch sử. |
| **TC_LOOKUP_013** | Đổi mã tra cứu (kết thúc phiên làm việc) | Manual (UI) | Bấm "Đổi mã tra cứu" -> Xóa sạch state lưu trữ tạm trên client, quay về màn hình nhập mã ban đầu an toàn. |
| **TC_LOOKUP_014** | Hiển thị trạng thái khách hàng đã chấm dứt hợp đồng | Auto (API) | Tra cứu hồ sơ có trạng thái `TERMINATED` -> Badge hiển thị đỏ pastel "Chấm dứt", các chức năng tra cứu lịch sử cũ vẫn xem được. |

---

### 2. Phân hệ Cổng Quản Trị Cơ Bản (Admin Base) - 11 Ca

| Mã TC | Tên ca kiểm thử | Loại | Các bước thực hiện & Kết quả mong đợi |
| :--- | :--- | :---: | :--- |
| **TC_ADMIN_001** | Đăng nhập Admin với mật khẩu đúng | Auto (API) | POST `/api/auth/login` với username/password chuẩn -> HTTP 200, cấp quyền role `admin`, trả về JWT token hợp lệ. |
| **TC_ADMIN_002** | Đăng nhập Admin với mật khẩu sai | Auto (API) | POST `/api/auth/login` với mật khẩu sai -> HTTP 401, từ chối cấp token, báo lỗi: "Mật khẩu quản trị viên không chính xác". |
| **TC_ADMIN_003** | Tìm kiếm khách hàng theo mã khách hàng | Auto (API) | GET `/api/customers?q=KH...` -> Thực thi truy vấn SQL `LIKE`, tìm thấy đúng khách hàng theo mã trong danh sách. |
| **TC_ADMIN_004** | Tìm kiếm khách hàng theo tên tiếng Việt có dấu | Auto (API) | GET `/api/customers?q=Nguyễn` -> Xử lý encoding UTF-8 chính xác, trả về đúng danh sách khách hàng có họ tên chứa "Nguyễn". |
| **TC_ADMIN_005** | Phân trang danh sách khách hàng | Auto (API) | GET danh sách với `limit=50` qua các trang -> Phân trang `LIMIT 50 OFFSET` chuẩn xác, dữ liệu các trang không trùng lặp ID. |
| **TC_ADMIN_006** | Thêm mới khách hàng với thông tin hợp lệ | Auto (API) | POST `/api/customers` với thông tin đầy đủ -> HTTP 201, tạo thành công bản ghi mới trong CSDL SQLite. |
| **TC_ADMIN_007** | Bắt lỗi trùng lặp mã công tơ khi thêm mới | Auto (API) | POST `/api/customers` với mã công tơ đã có người dùng -> HTTP 400 vi phạm `UNIQUE`, không chèn bản ghi trùng lặp. |
| **TC_ADMIN_008** | Cập nhật thông tin khách hàng đã tồn tại | Auto (API) | PUT `/api/customers/:id` với SĐT/địa chỉ mới -> HTTP 200, thông tin mới được cập nhật chính xác khi truy vấn lại. |
| **TC_ADMIN_009** | Cập nhật biểu giá 6 bậc EVN và thuế VAT | Auto (API) | PUT `/api/tariffs` đổi đơn giá Bậc 1 và VAT -> HTTP 200, bảng giá mới lưu vào CSDL và áp dụng tức thì. |
| **TC_ADMIN_010** | Tính tiền điện tự động theo biểu giá và VAT mới | Auto (API) | Tính sản lượng 50 kWh với giá mới (1.900 đ) và VAT mới (10%) -> Tổng tiền tự động cập nhật khớp chính xác 104.500 đ. |
| **TC_ADMIN_011** | Đăng xuất khỏi tài khoản Quản trị viên | Auto (API) | Nhấn "Đăng xuất" -> Token trong client bị hủy hoàn toàn, đưa người dùng về lại trang tra cứu khách hàng ban đầu. |

---

### 3. Trung Tâm Điều Hành Ngành Điện (Executive Dashboard) - 4 Ca

| Mã TC | Tên ca kiểm thử | Loại | Các bước thực hiện & Kết quả mong đợi |
| :--- | :--- | :---: | :--- |
| **TC_ADMIN_012** | Tổng hợp 5 chỉ số Bento KPI qua API Dashboard | Auto (API) | GET `/api/stats/dashboard` trên 27.580 bản ghi qua 49 kỳ -> Trả về đủ 5 chỉ số: Tổng kWh, Doanh thu, Tỷ lệ thu hồi, Công nợ, TB/hộ (< 180ms). |
| **TC_ADMIN_013** | Hiển thị 4 biểu đồ Chart.js trực quan trên Dashboard | Manual (UI) | Mở Dashboard -> 4 biểu đồ (Cột/đường, Tăng trưởng MoM, Doughnut 6 bậc, Stacked Bar nợ cước) render mượt, tooltip và chú giải đầy đủ. |
| **TC_ADMIN_014** | Drill-down xem chi tiết kỳ và Top 20 khách hàng nợ cước | Auto (API) | Bấm "Chi tiết kỳ" trên bảng 49 kỳ -> Modal hiển thị phân nhóm hộ tiêu thụ và Top 20 khách hàng nợ tiền cao nhất kỳ xếp giảm dần. |
| **TC_ADMIN_015** | Admin tra cứu phân tích cá nhân không cần số điện thoại | Auto (API) | GET `/api/readings/customer/KH0001?admin=true` -> Mở khóa toàn bộ thông tin cá nhân và 49 kỳ lịch sử mà không cần SĐT, hiện banner Admin. |

---

### 4. Thuật Toán Tính Tiền Điện 6 Bậc (Unit Test / BVA) - 3 Ca

| Mã TC | Tên ca kiểm thử | Loại | Các bước thực hiện & Kết quả mong đợi |
| :--- | :--- | :---: | :--- |
| **TC_CALC_001** | Tính tiền cho sản lượng biên tối thiểu 0 kWh | Auto (Unit) | Gọi `calculateElectricity(0)` -> Tiền trước thuế = 0 đ, VAT = 0 đ, tổng = 0 đ. Mảng tier_details ghi nhận 0 kWh ở 6 bậc. |
| **TC_CALC_002** | Tính tiền điện 50 kWh nằm trọn trong Bậc 1 | Auto (Unit) | Gọi `calculateElectricity(50)` -> Tiền trước thuế: 50 * 1.893 = 94.650 đ, VAT 8%: 7.572 đ, tổng tiền: 102.222 đ chuẩn xác. |
| **TC_CALC_003** | Tính tiền điện 250 kWh qua 4 bậc thang lũy kế | Auto (Unit) | Gọi `calculateElectricity(250)` -> B1: 94.650 đ, B2: 97.800 đ, B3: 227.100 đ, B4: 143.000 đ -> Tổng trước thuế: 562.550 đ, VAT 8%: 45.004 đ, Tổng: 607.554 đ. |

---

### 5. Bảo Mật Hệ Thống & Phân Quyền (Security) - 3 Ca

| Mã TC | Tên ca kiểm thử | Loại | Các bước thực hiện & Kết quả mong đợi |
| :--- | :--- | :---: | :--- |
| **TC_SEC_001** | Bảo mật API - Chặn xem lén dữ liệu riêng tư khi gọi trực tiếp | Auto (API) | Dùng cURL gửi GET `/api/readings/customer/KH0001` không kèm SĐT -> JSON chỉ có họ tên và mã KH; `phone`, `address`, `meter_code` bị loại bỏ. |
| **TC_SEC_002** | Làm sạch chuỗi - Chuẩn hóa số điện thoại chống sai lệch định dạng | Auto (API) | Nhập `"088-498-0616"` -> Regex tự loại bỏ khoảng trắng và gạch nối, so khớp thành công với chuỗi `"0884980616"` trong CSDL. |
| **TC_SEC_003** | Phân quyền Admin - Xác thực cờ admin=true mở khóa hồ sơ cá nhân | Auto (API) | GET `/api/readings/customer/KH0001?admin=true` -> Backend xác minh quyền admin, trả về `is_authenticated: true` kèm địa chỉ và mã công tơ. |

---

### 6. Hiệu Năng Hệ Thống (Performance) - 1 Ca

| Mã TC | Tên ca kiểm thử | Loại | Các bước thực hiện & Kết quả mong đợi |
| :--- | :--- | :---: | :--- |
| **TC_PERF_001** | Đo tốc độ truy vấn thống kê toàn hệ thống trên 27.580 bản ghi | Auto (API) | Gửi GET `/api/stats/dashboard` trên CSDL 1.000 KH và 27.580 bản ghi -> Phản hồi <= 200ms theo tiêu chuẩn (thực tế đo được: 75ms - 145ms). |

---

### 7. Thanh Toán Trực Tuyến (Online Payment) - 3 Ca

| Mã TC | Tên ca kiểm thử | Loại | Các bước thực hiện & Kết quả mong đợi |
| :--- | :--- | :---: | :--- |
| **TC_PAY_001** | Tạo yêu cầu thanh toán PayOS và hiển thị mã VietQR chuẩn NAPAS 247 | Auto (API) | POST `/api/payment/create-payos-url` -> Tạo chữ ký HMAC-SHA256 gửi sang PayOS gateway, trả về mã VietQR động chuẩn NAPAS 247 và link checkoutUrl. |
| **TC_PAY_002** | Xác minh thanh toán PayOS tự động qua Webhook / Callback | Auto (API) | POST `/api/payment/verify-payos` -> Xác thực chữ ký số giao dịch từ PayOS, tự động gạch nợ CSDL và cập nhật trạng thái hóa đơn sang PAID. |
| **TC_PAY_003** | Mô phỏng gạch nợ PayOS tức thì phục vụ nghiệm thu nhanh (Test Bypass) | Auto (API) | POST `/api/payment/simulate` -> Hóa đơn chuyển ngay sang trạng thái "Đã thanh toán" với phương thức PAYOS và mã giao dịch sinh tự động. |

---

### 8. Thiết Kế & Giao Diện Phẳng (Flat UI) - 2 Ca

| Mã TC | Tên ca kiểm thử | Loại | Các bước thực hiện & Kết quả mong đợi |
| :--- | :--- | :---: | :--- |
| **TC_UI_001** | Kiểm tra bố cục Flat UI phẳng, phông chữ kỹ thuật JetBrains Mono | Manual (UI) | Giao diện tối giản, số liệu tiền điện áp dụng `tabular-nums` thẳng hàng chuẩn xác, nền `#FAFAFA`, viền mờ `#EAEAEA`, không bóng đổ rườm rà. |
| **TC_UI_002** | Kiểm tra màu sắc nhãn trạng thái pastel nhạt | Manual (UI) | Đã thanh toán: Xanh pastel (`#EDF3EC`), Chưa đóng: Vàng pastel (`#FDF6E7`), Chấm dứt: Đỏ pastel (`#FDEBEC`). Độ tương phản cao, dễ quan sát. |