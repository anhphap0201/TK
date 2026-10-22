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