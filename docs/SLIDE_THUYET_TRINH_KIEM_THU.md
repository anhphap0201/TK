# KỊCH BẢN & NỘI DUNG SLIDE THUYẾT TRÌNH BÀI TẬP LỚN
## Môn học: Đánh giá và kiểm định chất lượng phần mềm
### Đề tài: Kiểm thử Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN

---

## 📌 HƯỚNG DẪN DÀNH CHO BẠN (ĐỌC TRƯỚC KHI THUYẾT TRÌNH)
- Bộ slide gồm **12 slide** chuẩn hóa theo thời lượng thuyết trình 10 - 15 phút.
- Mỗi slide có 3 phần:
  1. **Nội dung hiển thị trên Slide:** Ngắn gọn, gạch đầu dòng, số liệu rõ ràng.
  2. **Lời thoại mẫu (Script):** Bạn chỉ cần đọc theo hoặc nói ý tương tự, cực kỳ tự tin và đúng thuật ngữ chuyên môn.
  3. **Mẹo trả lời câu hỏi phản biện (Q&A):** Các câu thầy cô hay vặn nhất và câu trả lời ăn điểm tuyệt đối.

---

# SLIDE 1: TRANG TIÊU ĐỀ (TITLE SLIDE)

### 🖥️ Nội dung trên Slide:
- **Trường Đại học Phenikaa – Khoa Công nghệ Thông tin**
- **Báo cáo Bài tập lớn:** Đánh giá và kiểm định chất lượng phần mềm
- **Đề tài:** KẾ HOẠCH VÀ KẾT QUẢ KIỂM THỬ HỆ THỐNG TRA CỨU TIỀN ĐIỆN & QUẢN TRỊ BIỂU GIÁ EVN
- **Nhóm sinh viên thực hiện:**
  - **Đàm Anh Pháp (MSV: 23010360) – Tester 1:** Phụ trách Cổng Khách hàng, Bảo mật SĐT 2 lớp, Thanh toán trực tuyến (PayOS VietQR, VNPAY) & Flat UI.
  - **Bùi Văn Đại (MSV: 23010366) – Tester 2:** Phụ trách Cổng Quản trị, Thuật toán tính tiền 6 bậc, Admin Executive Dashboard & Phân tích hồ sơ.
- **Giảng viên hướng dẫn:** Bộ môn Đảm bảo chất lượng & Kiểm thử phần mềm

### 🗣️ Lời thoại thuyết trình:
> "Kính chào thầy cô và các bạn. Hôm nay, nhóm chúng em xin đại diện trình bày báo cáo kiểm thử toàn diện cho đề tài **'Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN'**. Đề tài của chúng em tập trung vào việc đảm bảo tính chính xác tuyệt đối của thuật toán tính tiền điện lũy kế 6 bậc, kiểm định cơ chế bảo mật thông tin cá nhân 2 lớp, xác thực tích hợp thanh toán trực tuyến đa kênh và vận hành ổn định Trung tâm điều hành ngành điện trên tập dữ liệu lớn. Sau đây em xin phép đi vào chi tiết."

---

# SLIDE 2: TỔNG QUAN HỆ THỐNG & MỤC TIÊU KIỂM THỬ

### 🖥️ Nội dung trên Slide:
- **Đối tượng kiểm thử (AUT - Application Under Test):** Hệ thống Web phân hệ kép:
  1. **Customer Portal:** Tra cứu hóa đơn, bảo vệ thông tin 2 lớp, phân tích 6 bậc giá EVN, biểu đồ tiêu thụ 4 năm, thanh toán trực tuyến PayOS/VNPAY.
  2. **Admin Portal:** Quản lý khách hàng (CRUD), cấu hình biểu giá 6 bậc và thuế VAT động, Executive Dashboard (5 chỉ số Bento KPI, 4 biểu đồ Chart.js, Top 20 nợ cước).
- **Mục tiêu kiểm thử hàng đầu:**
  - **Tính chính xác (Accuracy):** 100% hóa đơn khớp công thức bán lẻ điện sinh hoạt của Bộ Công Thương.
  - **Bảo mật (Security):** Tuyệt đối không rò rỉ SĐT, địa chỉ, mã công tơ ở chế độ ẩn danh.
  - **Hiệu năng & Ổn định (Performance & Reliability):** Thời gian phản hồi API Dashboard $< 200$ms trên 27.580 bản ghi; bộ test tự động lặp lại ổn định 100%.

### 🗣️ Lời thoại thuyết trình:
> "Hệ thống của chúng em phục vụ 2 nhóm người dùng: Khách hàng dùng điện và Quản trị viên ngành điện. Vì liên quan trực tiếp đến tiền bạc và dữ liệu cá nhân của người dân, mục tiêu kiểm thử của nhóm đặt ra 3 trọng tâm:
> Thứ nhất là độ chính xác tuyệt đối của thuật toán tính tiền điện theo bậc thang.
> Thứ hai là bảo vệ quyền riêng tư qua cơ chế xác thực số điện thoại 2 lớp.
> Thứ ba là đảm bảo hiệu năng xử lý nhanh, mượt mà khi tổng hợp số liệu thống kê lớn qua 49 kỳ hóa đơn."

---

# SLIDE 3: QUY TRÌNH & LỊCH TRÌNH CÔNG VIỆC (TEST WORKFLOW)

### 🖥️ Nội dung trên Slide:
- **Lịch trình 7 mốc chuẩn mực (Milestones theo mẫu môn học):**
  1. **Lập kế hoạch (Test Planning):** Soạn thảo `Test_Plan_Kiem_Thu.md` v1.2, phân chia tài nguyên và tiêu chí dừng.
  2. **Rà soát tài liệu (SRS Review):** Đối chiếu đặc tả yêu cầu, biểu giá EVN và cổng thanh toán.
  3. **Thiết kế Test Cases:** Xây dựng ma trận ca kiểm thử trên Excel và tài liệu chi tiết.
  4. **Triển khai kịch bản tự động:** Viết mã nguồn test tự động độc lập với Node.js Test Runner.
  5. **Đánh giá & Review chéo (Peer Review):** Tester 1 và Tester 2 rà soát chéo test case của nhau.
  6. **Thực thi kiểm thử (Execution):** Chạy 23 test tự động và kiểm thử thủ công tích hợp/UI.
  7. **Tổng kết & Đóng gói:** Lập báo cáo nghiệm thu và chuẩn hóa tài liệu PDF/Excel.

### 🗣️ Lời thoại thuyết trình:
> "Về quy trình, nhóm tuân thủ nghiêm ngặt chuẩn quy trình kiểm định phần mềm với 7 mốc công việc rõ ràng. Chúng em bắt đầu từ việc lập Kế hoạch kiểm thử (Test Plan), rà soát tài liệu yêu cầu (SRS), thiết kế chi tiết 41 ca kiểm thử, sau đó tự động hóa bằng code backend và thực hiện kiểm tra chéo (Peer Review) giữa hai thành viên trước khi thực thi nghiệm thu toàn diện."

---

# SLIDE 4: PHƯƠNG PHÁP & KỸ THUẬT KIỂM THỬ ÁP DỤNG

### 🖥️ Nội dung trên Slide:
- **Kỹ thuật Kiểm thử Hộp đen (Black-box Testing):**
  - **Phân tích giá trị biên (BVA):** Rà soát các điểm chuyển bậc điện: $0$ kWh (biên dưới), $50$ kWh (biên Bậc 1), $51$ kWh, $100$ kWh (Bậc 2), $200$ kWh (Bậc 3), $300$ kWh, $400$ kWh.
  - **Phân vùng tương đương (EP):** Mã KH hợp lệ (`KH0001`), không tồn tại (`KH9999`), chuỗi rỗng; SĐT đúng/sai định dạng.
- **Kỹ thuật Kiểm thử Hộp trắng (White-box Testing):**
  - Bao phủ nhánh điều kiện (Branch Coverage) của hàm `calculateElectricityBill` với 6 vòng lặp bậc giá và làm tròn số học tiền tệ.
- **Kiểm thử Bảo mật (Security Testing):**
  - Kiểm định trực tiếp API payload bằng cURL: xác thực dữ liệu nhạy cảm đã bị strip bỏ tại tầng backend khi cờ `is_authenticated = false`.
- **Kiểm thử Hiệu năng (Performance Testing):**
  - Đo thời gian phản hồi thực tế của API Dashboard trên 27.580 bản ghi.

### 🗣️ Lời thoại thuyết trình:
> "Nhóm kết hợp cả hai phương pháp Hộp đen và Hộp trắng. Với Hộp đen, kỹ thuật Giá trị biên (BVA) được dùng triệt để tại các mốc nhảy bậc điện như 50 kWh, 100 kWh, 200 kWh để không bao giờ bị lệch dù chỉ 1 đồng tiền điện. Kỹ thuật Phân vùng tương đương (EP) áp dụng cho việc nhập mã khách hàng và số điện thoại. Bên cạnh đó, chúng em dùng Hộp trắng để kiểm tra độ bao phủ mã nguồn hàm tính toán và kiểm thử bảo mật API trực tiếp bằng các công cụ dòng lệnh."

---

# SLIDE 5: KIẾN TRÚC BỘ TEST CASES (TỔNG HỢP 41 CA KIỂM THỬ)

### 🖥️ Nội dung trên Slide:
- **Quy mô toàn hệ thống:** **41 ca kiểm thử (100% Passed)**
  - **24 ca Tự động hóa / API:** Chạy bằng mã lệnh, tự động assert kết quả.
  - **17 ca Thủ công (Manual UI):** Kiểm định giao diện Flat UI, đồ thị Chart.js và thao tác form.
- **Bảng phân bổ hạng mục kiểm thử:**

| Phân hệ / Hạng mục | Số lượng TCs | Tự động hóa | Thủ công / API | Tỷ lệ Đạt |
| :--- | :---: | :---: | :---: | :---: |
| **Cổng Khách hàng (Customer Portal)** | 14 | 7 | 7 | **100%** |
| **Cổng Quản trị viên (Admin Base)** | 11 | 10 | 1 | **100%** |
| **Admin Executive Dashboard** | 4 | 2 | 2 | **100%** |
| **Thuật toán tính tiền điện (Unit Test)** | 3 | 3 | 0 | **100%** |
| **Bảo mật và Hiệu năng** | 4 | 1 | 3 | **100%** |
| **Thanh toán trực tuyến (PayOS, VNPAY)** | 3 | 1 | 2 | **100%** |
| **Giao diện Flat UI / Modern Minimal** | 2 | 0 | 2 | **100%** |

### 🗣️ Lời thoại thuyết trình:
> "Tổng cộng chúng em đã thiết kế và thực thi 41 ca kiểm thử, bao quát toàn bộ 2 phân hệ Khách hàng và Quản trị. Trong đó, 24 ca được tự động hóa qua code và 17 ca kiểm thử thủ công để đảm bảo trải nghiệm người dùng trên màn hình. Tỷ lệ vượt qua đạt 100%, không còn bất kỳ lỗi nghiêm trọng nào."

---

# SLIDE 6: PHÂN HỆ 1 – KIỂM THỬ CỔNG KHÁCH HÀNG (CUSTOMER PORTAL)

### 🖥️ Nội dung trên Slide:
- **Trọng tâm kiểm thử:**
  - `TC_LOOKUP_001 & 002`: Tra cứu ẩn danh -> Chỉ hiển thị 1 kỳ hóa đơn gần nhất; SĐT, địa chỉ, mã công tơ bị giấu hoàn toàn cả trên giao diện lẫn trong JSON response của API.
  - `TC_LOOKUP_003 & 004`: Bắt lỗi mã khách hàng không tồn tại (HTTP 404) và chặn để trống ô nhập.
  - `TC_LOOKUP_005 & 006`: Hỗ trợ tự động cắt khoảng trắng thừa (`trim`) và không phân biệt hoa thường (`kh0001` tương đương `KH0001`).
  - `TC_LOOKUP_007 & 008`: Xác thực SĐT chính chủ mở khóa toàn bộ 17 kỳ hóa đơn và tab biểu đồ; nhập sai SĐT duy trì khóa an toàn.
  - `TC_LOOKUP_011`: Bóc tách chi tiết 6 bậc giá EVN, kiểm tra tiền trước thuế + thuế VAT 8% = Tổng thanh toán.

### 🗣️ Lời thoại thuyết trình:
> "Tại Cổng khách hàng, điểm sáng nhất là tính năng bảo vệ thông tin cá nhân 2 lớp. Khi người lạ chỉ biết mã KH0001, họ chỉ xem được tháng này tiền điện là bao nhiêu, hoàn toàn không xem được số điện thoại hay địa chỉ nhà. Chỉ khi nhập đúng số điện thoại chính chủ thì toàn bộ lịch sử 4 năm và tab biểu đồ mới được mở khóa. Nhóm đã viết cả unit test cho API lẫn kiểm tra giao diện để chứng minh không thể vượt rào bảo mật này."

---

# SLIDE 7: PHÂN HỆ 2 – KIỂM THỬ CỔNG QUẢN TRỊ & THUẬT TOÁN TÍNH TIỀN

### 🖥️ Nội dung trên Slide:
- **Kiểm định Cổng Quản trị (Admin Portal):**
  - `TC_ADMIN_001 & 002`: Đăng nhập cấp JWT Token hợp lệ, bắt lỗi mật khẩu sai HTTP 401.
  - `TC_ADMIN_003 & 004`: Tìm kiếm khách hàng theo mã và hỗ trợ tìm kiếm tiếng Việt có dấu chuẩn xác (Unicode).
  - `TC_ADMIN_005`: Phân trang danh sách khách hàng chuẩn 50 bản ghi/trang.
  - `TC_ADMIN_006 & 007`: Thêm khách hàng mới, kiểm tra bắt lỗi trùng lặp mã công tơ (UNIQUE constraint).
  - `TC_ADMIN_009 & 010`: Cập nhật biểu giá và VAT động -> Kiểm tra công thức tự động tính tiền theo giá mới.
- **Unit Test Thuật toán tính tiền điện 6 bậc (`calculator.js`):**
  - $0$ kWh $\rightarrow 0$ đ.
  - $50$ kWh (Trọn Bậc 1) $\rightarrow 94.650$ đ + VAT 8% $\rightarrow \mathbf{102.222}$ đ.
  - $250$ kWh (Lũy kế 4 bậc) $\rightarrow 562.550$ đ + VAT 8% $\rightarrow \mathbf{607.554}$ đ.

### 🗣️ Lời thoại thuyết trình:
> "Ở phân hệ Quản trị viên, chúng em tập trung kiểm định các chức năng CRUD và tính toán động. Quản trị viên có thể điều chỉnh đơn giá bậc 1 hoặc thay đổi thuế VAT từ 8% lên 10%, và hệ thống phải ngay lập tức tính toán lại chính xác trên hóa đơn. Các bài unit test cho thuật toán tính tiền được kiểm chứng độc lập, đối soát từng số lẻ với hóa đơn thực tế của Tập đoàn Điện lực Việt Nam."

---

# SLIDE 8: ĐIỂM SÁNG – ADMIN EXECUTIVE DASHBOARD & PHÂN TÍCH

### 🖥️ Nội dung trên Slide:
- **Trung tâm Điều hành Ngành điện (Admin Executive Dashboard):**
  - `TC_ADMIN_012`: Tổng hợp **5 chỉ số Bento KPI** qua API `/api/stats/dashboard` trên **27.580 bản ghi qua 49 kỳ**:
    1. Tổng sản lượng điện tiêu thụ (`total_kwh`)
    2. Tổng doanh thu phát sinh (`total_revenue`)
    3. Tỷ lệ thu hồi tiền điện (`recovery_rate`)
    4. Công nợ chưa thu hồi (`total_unpaid`)
    5. Mức tiêu thụ bình quân/hộ (`avg_kwh_per_customer`)
  - `TC_ADMIN_013`: Render mượt mà **4 biểu đồ Chart.js**: Combo sản lượng/doanh thu, cột tăng trưởng MoM %, Doughnut cơ cấu 6 bậc, Stacked Bar công nợ.
  - `TC_ADMIN_014`: Drill-down kỳ chi tiết và truy vấn Top 20 khách hàng nợ cước lớn nhất kỳ.
  - `TC_ADMIN_015`: Quyền Admin tra cứu cá nhân không cần SĐT phục vụ hỗ trợ kỹ thuật.

### 🗣️ Lời thoại thuyết trình:
> "Một tính năng vượt trội trong đồ án là Trung tâm điều hành ngành điện. Với cơ sở dữ liệu lớn gồm hơn 27 nghìn bản ghi chỉ số, API Dashboard của chúng em tính toán tổng hợp 5 chỉ số KPI và vẽ 4 biểu đồ phân tích trực quan. Nhóm đã kiểm thử luồng drill-down xem chi tiết từng kỳ và lọc ra Top 20 khách hàng nợ cước lớn nhất để phục vụ công tác điều hành thu hồi nợ."

---

# SLIDE 9: KIỂM THỬ THANH TOÁN ĐA KÊNH & GIAO DIỆN FLAT UI

### 🖥️ Nội dung trên Slide:
- **Kiểm thử Cổng thanh toán trực tuyến:**
  - `TC_PAY_001`: Sinh URL thanh toán VNPAY Sandbox đi kèm chữ ký bảo mật **HMAC-SHA512**.
  - `TC_PAY_002`: Tích hợp **PayOS**, sinh mã **VietQR** chuẩn NAPAS 247, quét thanh toán trực tiếp qua App ngân hàng.
  - `TC_PAY_003`: Chức năng **Mô phỏng thanh toán (Test Bypass)** giúp gạch nợ tức thì phục vụ demo và kiểm thử nhanh.
- **Kiểm thử Chuẩn hóa Giao diện Flat UI / Modern Minimal:**
  - `TC_UI_001`: Kiểm tra tính nhất quán phông chữ kỹ thuật Geist, số liệu JetBrains Mono (`tabular-nums` thẳng hàng), nền `#FAFAFA`, viền phẳng `#EAEAEA`.
  - `TC_UI_002`: Kiểm tra bảng màu nhãn trạng thái pastel nhạt: Đã thanh toán (Xanh `#EDF3EC`), Chưa đóng (Vàng `#FDF6E7`), Chấm dứt (Đỏ `#FDEBEC`).

### 🗣️ Lời thoại thuyết trình:
> "Về thanh toán, chúng em kiểm thử tích hợp cả 2 cổng thanh toán thực tế phổ biến tại Việt Nam là PayOS VietQR và VNPAY Sandbox với đầy đủ mã băm an toàn HMAC. Đồng thời nhóm xây dựng một nút 'Mô phỏng thanh toán nhanh' để giảng viên có thể kiểm thử ngay lập tức mà không cần dùng tài khoản thật. Về mặt giao diện, chúng em kiểm định tính nhất quán của phong cách thiết kế phẳng Flat UI, các con số tài chính được căn gióng thẳng hàng bằng font JetBrains Mono."

---

# SLIDE 10: TỰ ĐỘNG HÓA KIỂM THỬ (AUTOMATION TEST SUITE)

### 🖥️ Nội dung trên Slide:
- **Công nghệ kiểm thử tự động:**
  - Tận dụng bộ chạy kiểm thử chính chủ **Node.js Native Test Runner (`node:test`)** và thư viện khẳng định nghiêm ngặt **`node:assert/strict`**.
  - **Không phụ thuộc thư viện bên ngoài nặng nề** (như Jest hay Mocha), khởi động tức thì.
- **Cấu trúc phân tách 2 thư mục độc lập:**
  - `server/test/customer/`: `lookup.test.js`, `phone_auth.test.js`, `billing.test.js`.
  - `server/test/admin/`: `auth.test.js`, `customers_search.test.js`, `customers_crud.test.js`, `tariffs.test.js`, `calculator.test.js`.
- **Tối ưu hóa kỹ thuật đặc thù:**
  - Cấu hình cờ `--test-concurrency=1` giải quyết triệt để lỗi khóa file SQLite (`database is locked`) trên hệ điều hành Windows.
  - **Thời gian thực thi toàn bộ 23 bài test:** Chỉ mất **~2.6 giây**, tỷ lệ Passed 100%.

### 🗣️ Lời thoại thuyết trình:
> "Điểm đặc biệt trong giải pháp kỹ thuật của nhóm là chúng em không dùng các thư viện cồng kềnh như Jest, mà sử dụng trực tiếp Node.js Test Runner tích hợp sẵn từ Node 20+. Toàn bộ mã kiểm thử được tách thành 2 thư mục rõ ràng tương ứng với 2 bạn Tester. Nhóm đã xử lý thành công lỗi xung đột cơ sở dữ liệu SQLite trên Windows bằng cấu hình concurrency, giúp 23 kịch bản test tự động chạy chỉ trong chưa đầy 3 giây với kết quả 100% Passed."

---

# SLIDE 11: TỔNG KẾT KẾT QUẢ & TIÊU CHUẨN NGHIỆM THU

### 🖥️ Nội dung trên Slide:
- **Tiêu chuẩn nghiệm thu đề ra:**
  - Tỷ lệ ca kiểm thử đạt kết quả Passed: **100% (41/41 TCs)**.
  - Số lượng lỗi mức độ Critical & Major: **0 lỗi tồn đọng**.
  - Lệnh `npm test` backend chạy thành công không có lỗi.
  - Lệnh `npm run build` frontend biên dịch trơn tru.
- **Sản phẩm bàn giao đầy đủ (Deliverables):**
  1. `docs/SRS_Dac_Ta_Yeu_Cau.md` & `.pdf`: Tài liệu Đặc tả yêu cầu v1.2.0.
  2. `docs/Test_Plan_Kiem_Thu.md` & `.pdf`: Kế hoạch kiểm thử chuẩn mẫu v1.2.
  3. `docs/Test_Cases_Chi_Tiet.md` & `.pdf`: Báo cáo 41 ca kiểm thử chi tiết.
  4. `docs/Test_Case_Template.xlsx`: File bảng tính ma trận test case được điền đầy đủ 5 sheet bằng công cụ `markitdown`.
  5. Bộ mã nguồn và kịch bản test tự động hoàn chỉnh.

### 🗣️ Lời thoại thuyết trình:
> "Đối chiếu với tiêu chuẩn nghiệm thu ban đầu, hệ thống đã đáp ứng vượt mức mong đợi: 100% ca kiểm thử passed, không còn lỗi nghiêm trọng nào. Nhóm bàn giao đầy đủ bộ tài liệu gồm SRS, Test Plan, Test Cases chi tiết dạng Markdown, PDF và bảng tính Excel hoàn chỉnh đồng bộ với mã nguồn."

---

# SLIDE 12: KẾT LUẬN & HỎI ĐÁP (Q&A)

### 🖥️ Nội dung trên Slide:
- **Bài học kinh nghiệm thu được:**
  - Nắm vững quy trình thiết kế và quản lý ca kiểm thử chuyên nghiệp.
  - Thành thạo kỹ thuật kiểm thử biên, phân vùng tương đương và tự động hóa API.
  - Hiểu sâu về tính toàn vẹn dữ liệu và bảo mật thông tin cá nhân người dùng.
- **Định hướng phát triển:**
  - Mở rộng kiểm thử tải (Load Testing / Stress Testing) với công cụ k6.
  - Bổ sung kiểm thử giao diện E2E tự động hóa bằng Playwright.
- **Lời cảm ơn:**
  - Xin chân thành cảm ơn Quý Thầy/Cô đã lắng nghe và hướng dẫn nhóm!
  - Nhóm sẵn sàng lắng nghe câu hỏi và nhận xét từ Hội đồng.

### 🗣️ Lời thoại thuyết trình:
> "Qua bài tập lớn này, chúng em đã nắm vững quy trình kiểm định chất lượng phần mềm từ lý thuyết đến thực hành thực tế. Em xin chân thành cảm ơn thầy cô đã lắng nghe bài thuyết trình của nhóm. Bây giờ, chúng em xin phép được lắng nghe những câu hỏi và ý kiến đóng góp từ thầy cô ạ."

---

## 🎯 BỘ CÂU HỎI VẤN ĐÁP THẦY CÔ HAY HỎI & CÂU TRẢ LỜI MẪU

#### ❓ Câu 1: Tại sao trong file Excel có 32 test case chức năng mà khi chạy lệnh `npm test` chỉ hiện 23 test?
> **Trả lời tự tin:**
> "Dạ thưa thầy/cô, con số **23** trong `npm test` là các **bài test tự động (Automated Tests)** được viết bằng code để kiểm tra logic tính tiền và API backend. Còn **32** trong sheet Function Test Cases là **toàn bộ ca kiểm thử chức năng**, bao gồm cả **12 ca kiểm thử thủ công trên giao diện người dùng (Manual UI)** như kiểm tra thông báo lỗi khi để trống ô nhập, kiểm tra chặn tab khi chưa nhập SĐT hay kiểm tra render màu sắc nhãn pastel. Các ca thao tác trực tiếp trên trình duyệt thì được kiểm thử thủ công và ghi nhận vào tài liệu ạ."

#### ❓ Câu 2: Em áp dụng kỹ thuật Phân tích giá trị biên (BVA) ở đâu trong bài?
> **Trả lời tự tin:**
> "Dạ, em áp dụng BVA rõ nhất tại **thuật toán tính tiền điện 6 bậc EVN**. Em chọn các giá trị biên:
> - Biên dưới cùng: $0$ kWh.
> - Biên Bậc 1: $50$ kWh (ngay sát ngưỡng chuyển bậc) và $51$ kWh (bước sang Bậc 2).
> - Tương tự tại các ngưỡng $100$ kWh, $200$ kWh, $300$ kWh và $400$ kWh.
> Việc kiểm thử biên giúp đảm bảo tại thời điểm chuyển giao giữa 2 bậc giá, hệ thống không bị cộng thừa hay tính sai đơn giá của bậc kế tiếp."

#### ❓ Câu 3: Làm thế nào em đảm bảo an toàn dữ liệu khách hàng nếu ai đó cố tình gọi thẳng vào API mà không qua giao diện?
> **Trả lời tự tin:**
> "Dạ, nhóm em đã thực hiện kiểm thử bảo mật tầng API (test case `TC_LOOKUP_002` và `TC_SEC_001`). Khi gọi API `GET /api/readings/customer/KH0001` mà không có số điện thoại xác thực, tầng backend Express chủ động cắt bỏ (`strip`) hoàn toàn các trường `phone`, `address` và `meter_code` ra khỏi JSON trước khi trả về. Do đó, dù có dùng cURL hay Postman can thiệp mạng cũng tuyệt đối không thể xem lén được dữ liệu cá nhân ạ."
