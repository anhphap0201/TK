# BỘ CÂU HỎI VÀ TRẢ LỜI PHẢN BIỆN BÀI TẬP LỚN THEO TỪNG SLIDE
**Đề tài:** Kiểm thử Hệ Thống Tra Cứu Tiền Điện & Quản Trị Biểu Giá EVN  
**Sinh viên thực hiện:** Đàm Anh Pháp (23010360) & Bùi Văn Đại (23010366)  
**Giảng viên hướng dẫn & phản biện:** Mai Xuân Tráng, Nguyễn Chí Công  
**Quy mô tài liệu:** 60 câu hỏi & câu trả lời kỹ thuật chuyên sâu (5 câu hỏi cho mỗi slide trong 12 slide)

---

## SLIDE 1: TRANG TIÊU ĐỀ & GIỚI THIỆU
*(Slide 1: Báo cáo bài tập lớn - Kiểm định chất lượng Hệ thống tra cứu tiền điện & Quản trị biểu giá EVN)*

### ❓ Câu 1.1: Tại sao nhóm lại chọn đề tài hệ thống tính tiền điện và tra cứu hóa đơn EVN để làm bài tập lớn kiểm thử? Nghiệp vụ này có điểm gì phức tạp?
> **Trả lời:**  
> "Dạ thưa Thầy/Cô, nghiệp vụ tính tiền điện sinh hoạt bậc thang lũy kế theo quy định của Bộ Công Thương là bài toán tài chính có độ phức tạp cao về mặt **giá trị biên (Boundary Values)**. Tiền điện liên quan trực tiếp đến quyền lợi kinh tế của người dân, do đó hệ thống đòi hỏi độ chính xác tuyệt đối, sai lệch dù chỉ 1 đồng cũng gây khiếu nại. Ngoài ra, hệ thống yêu cầu cơ chế bảo vệ quyền riêng tư người dùng theo Nghị định bảo vệ dữ liệu cá nhân (ẩn danh số điện thoại, địa chỉ) và cần xử lý dữ liệu lớn (hàng chục nghìn kỳ hóa đơn), là bài toán thực tế lý tưởng để nhóm áp dụng trọn vẹn cả kiểm thử hộp đen, hộp trắng, kiểm thử bảo mật API và kiểm thử hiệu năng."

### ❓ Câu 1.2: Vai trò và sự phân công trách nhiệm cụ thể giữa hai bạn (Pháp và Đại) trong suốt dự án là gì?
> **Trả lời:**  
> "Dạ, nhóm phân công theo mô hình phối hợp và kiểm tra chéo (Peer Review):
> - **Đàm Anh Pháp (Tester 1 / Test Manager):** Phụ trách lập Kế hoạch kiểm thử (Test Plan), thiết kế và tự động hóa các ca kiểm thử cho Cổng khách hàng, kiểm định bảo mật 2 lớp API, tích hợp thanh toán trực tuyến PayOS VietQR và chuẩn hóa giao diện Flat UI.
> - **Bùi Văn Đại (Tester 2 / Test Designer):** Phụ trách rà soát đặc tả yêu cầu SRS, thiết kế và kiểm thử Cổng quản trị viên, kiểm thử đơn vị thuật toán tính tiền 6 bậc, kiểm thử hiệu năng Dashboard trên 27.580 bản ghi và thiết lập tối ưu hóa Node.js Native Test Runner.  
> Cả hai thành viên thực hiện rà soát chéo 100% test case và cùng thực thi nghiệm thu."

### ❓ Câu 1.3: Đối tượng sử dụng (Actors) chính của hệ thống là những ai, và hệ thống giải quyết vấn đề gì cho từng đối tượng?
> **Trả lời:**  
> "Dạ, hệ thống phục vụ 2 nhóm tác nhân:
> 1. **Khách hàng dùng điện:** Cần tra cứu nhanh số tiền điện phải đóng hàng tháng, xem chi tiết biểu giá bậc thang minh bạch, xem biểu đồ tiêu thụ 4 năm để tối ưu năng lượng và quét mã PayOS VietQR thanh toán tức thì mà không cần thủ tục đăng nhập rườm rà.
> 2. **Quản trị viên / Cán bộ ngành điện:** Cần quản lý danh bạ khách hàng, điều chỉnh biểu giá động theo quyết định của Nhà nước, và theo dõi sức khỏe tài chính toàn mạng lưới qua Dashboard tổng hợp 49 kỳ."

### ❓ Câu 1.4: Hệ thống được xây dựng trên stack công nghệ gì, và kiến trúc này ảnh hưởng như thế nào đến chiến lược kiểm thử?
> **Trả lời:**  
> "Dạ, phía Backend dùng **Node.js/Express** với CSDL **SQLite**, Frontend dùng **Vue 3 (Composition API)** với **Vite** và **Chart.js**. Kiến trúc Client-Server RESTful tách biệt này cho phép nhóm áp dụng chiến lược kiểm thử đa tầng: Tách biệt hoàn toàn tầng API tự động hóa (chạy bằng Node.js Native Runner kiểm thử endpoint/JSON response độc lập với UI) và tầng Giao diện người dùng (kiểm tra render, validation form, tương tác biểu đồ trực tiếp trên trình duyệt)."

### ❓ Câu 1.5: Hệ thống này là nhóm tự xây dựng mã nguồn hay lấy từ nguồn có sẵn để kiểm thử?
> **Trả lời:**  
> "Dạ, nhóm em tự thiết kế và phát triển toàn bộ hệ thống từ đầu theo mô hình chuẩn Client-Server để phục vụ trực tiếp cho môn học Kiểm định chất lượng phần mềm. Nhờ tự viết mã nguồn, nhóm hiểu sâu sắc cấu trúc dữ liệu, các hàm nghiệp vụ và điểm rẽ nhánh logic, từ đó có thể thực hiện kiểm thử hộp trắng (White-box testing) tới từng vòng lặp và kiểm thử hộp đen (Black-box testing) bao quát toàn bộ tài liệu đặc tả."

---

## SLIDE 2: MỤC TIÊU KIỂM THỬ
*(Slide 2: 3 trọng tâm kiểm thử - Tính chính xác công thức 6 bậc, Bảo mật thông tin cá nhân 2 lớp, Hiệu năng API < 200ms trên 27.580 bản ghi)*

### ❓ Câu 2.1: Tại sao nhóm đặt mục tiêu "Tính chính xác tuyệt đối" lên hàng đầu? Nhóm làm thế nào để đối soát và chứng minh thuật toán đúng 100% so với quy định Bộ Công Thương?
> **Trả lời:**  
> "Dạ, tiền điện là giao dịch tài chính pháp lý. Nhóm lấy biểu giá bán lẻ điện sinh hoạt chính thức gồm 6 bậc (Bậc 1: 1.893 đ đến Bậc 6: 3.302 đ) và thuế VAT 8% theo quyết định của Bộ Công Thương làm 'Oracle' (chuẩn đối soát). Nhóm thiết kế các bài Unit Test độc lập đối soát từng phép nhân, quy tắc cộng dồn lũy kế và làm tròn số học với các hóa đơn thực tế của EVN Hà Nội và EVN TP.HCM, đảm bảo sai số bằng 0."

### ❓ Câu 2.2: Mục tiêu "Bảo mật thông tin cá nhân 2 lớp" xuất phát từ yêu cầu thực tế nào trong bảo vệ dữ liệu?
> **Trả lời:**  
> "Dạ, trên nhiều cổng tra cứu hiện nay, nếu chỉ yêu cầu nhập Mã khách hàng (dãy số dễ đoán như KH0001, KH0002) thì bất kỳ ai cũng có thể tra cứu trộm số điện thoại, địa chỉ nhà riêng và thói quen sinh hoạt của người khác. Nhóm đặt mục tiêu bảo vệ dữ liệu cá nhân 2 lớp: Tầng 1 chỉ hiển thị thông tin ẩn danh và số tiền cần đóng kỳ gần nhất; Tầng 2 bắt buộc phải nhập đúng số điện thoại chính chủ đã đăng ký hợp đồng mới mở khóa thông tin cá nhân và lịch sử tiêu thụ 4 năm."

### ❓ Câu 2.3: Tiêu chí "Phản hồi API < 200ms trên 27.580 bản ghi" được đo lường bằng công cụ gì và trong điều kiện môi trường nào?
> **Trả lời:**  
> "Dạ, nhóm đo lường bằng 2 phương pháp:
> 1. Thư viện đo thời gian độ phân giải cao `process.hrtime.bigint()` ghi log trực tiếp tại backend để đo thời gian xử lý truy vấn SQL và tính toán nội bộ.
> 2. Network Tab trên Chrome DevTools để đo thời gian Round-trip Time (RTT).  
> Môi trường thử nghiệm chạy trên máy trạm cục bộ Core i5, RAM 32GB, CSDL SQLite chứa 1.000 khách hàng và 27.580 bản ghi hóa đơn qua 49 kỳ; kết quả thực tế đo được từ 75ms đến 145ms, vượt xa chỉ tiêu < 200ms."

### ❓ Câu 2.4: Nhóm có đặt mục tiêu kiểm thử về tính tương thích giao diện trên các thiết bị khác nhau không?
> **Trả lời:**  
> "Dạ có, nhóm đặt mục tiêu hệ thống hiển thị chính xác và không vỡ layout trên các trình duyệt hiện đại nhân Chromium (Chrome, Edge, Brave) và Firefox/Safari. Đồng thời kiểm tra tính đáp ứng (Responsive) trên màn hình máy tính bàn (1920x1080), laptop (1366x768) và máy tính bảng, đảm bảo các bảng dữ liệu và biểu đồ tự động co giãn trực quan."

### ❓ Câu 2.5: Nếu chính sách của Nhà nước điều chỉnh thuế VAT (ví dụ từ 8% lên 10%) hoặc đổi đơn giá bậc 1, mục tiêu kiểm thử của nhóm có bị ảnh hưởng không?
> **Trả lời:**  
> "Dạ không, nhóm đã đặt mục tiêu kiểm thử tính 'Động' của hệ thống (Dynamic Pricing Test). Biểu giá và thuế suất không bị hardcode trong mã nguồn mà lưu trữ trong CSDL và quản trị qua API. Nhóm đã có ca kiểm thử riêng biệt (`TC_ADMIN_009` và `TC_ADMIN_010`) chứng minh khi admin đổi giá bậc 1 lên 1.900đ và VAT lên 10%, hệ thống tự động tính toán lại hóa đơn chuẩn xác tức thì mà không cần viết lại code."

---

## SLIDE 3: QUY TRÌNH THỰC HIỆN
*(Slide 3: 6 bước quy trình - Lập kế hoạch, Rà soát SRS, Thiết kế ca kiểm thử trên Excel, Tự động hóa với Node.js, Thực thi kiểm thử, Đóng gói báo cáo)*

### ❓ Câu 3.1: Nhóm áp dụng quy trình kiểm thử theo mô hình nào (Thác nước, V-Model hay Agile/Scrum)?
> **Trả lời:**  
> "Dạ, nhóm áp dụng mô hình **V-Model cải tiến kết hợp vòng lặp ngắn**. Mỗi pha phát triển đều có pha kiểm thử tương ứng: Khi có Đặc tả yêu cầu (SRS) nhóm lập Kế hoạch kiểm thử (Test Plan); khi phân tích tính năng nhóm thiết kế Ma trận Test Cases; khi viết mã nguồn nhóm viết đồng thời Unit Test và API Automation Test. Cuối cùng thực thi kiểm thử tích hợp và hệ thống trước khi đóng gói nghiệm thu."

### ❓ Câu 3.2: Hoạt động "Rà soát đối chiếu đặc tả SRS và biểu giá EVN" đã giúp nhóm phát hiện ra những điểm mập mờ hay thiếu sót nào ban đầu?
> **Trả lời:**  
> "Dạ, quá trình rà soát (Static Testing) giúp nhóm phát hiện 3 điểm rủi ro lớn:
> 1. Cách làm tròn tiền thuế VAT: Cần làm tròn số học thông thường `Math.round()` thay vì cắt cụt để tránh lệch 1 đồng.
> 2. Quy tắc ranh giới bậc: Đúng 50 kWh thì tính trọn Bậc 1, kWh thứ 51 mới sang Bậc 2.
> 3. Trạng thái khách hàng đã chấm dứt hợp đồng (`TERMINATED`): Vẫn cần cho phép xem lịch sử cũ nhưng phải chặn tạo giao dịch thanh toán mới."

### ❓ Câu 3.3: Tại sao nhóm lại thiết kế Test Case trên Excel trước rồi mới viết mã tự động hóa thay vì viết code test luôn?
> **Trả lời:**  
> "Dạ, thiết kế ma trận trên Excel đóng vai trò là 'Bản vẽ kỹ thuật' (Blueprint). Excel giúp phân loại rõ ràng theo từng phân hệ, kiểm soát độ bao phủ (Traceability Matrix), phân định rõ ca nào chạy tự động (API/Unit) và ca nào chạy thủ công (UI/UX). Nếu nhảy vào viết code test ngay sẽ rất dễ bị sót các trường hợp ngoại lệ, trùng lặp kịch bản và không có tài liệu đối soát bàn giao cho hội đồng."

### ❓ Câu 3.4: Nhóm kiểm soát phiên bản (Version Control) và phân chia công việc trong quá trình kiểm thử như thế nào?
> **Trả lời:**  
> "Dạ, nhóm sử dụng Git/GitHub để quản lý toàn bộ mã nguồn ứng dụng và mã kiểm thử. Mỗi ca kiểm thử hoặc tính năng mới được tạo nhánh riêng (`feature/customer-test`, `feature/admin-test`), sau khi chạy pass 100% bài test trên máy cá nhân mới tạo Pull Request để thành viên còn lại Review chéo (Peer Review) rồi mới merge vào nhánh `main`."

### ❓ Câu 3.5: Tiêu chuẩn nào để nhóm quyết định dừng kiểm thử (Exit Criteria / Stop Testing Condition)?
> **Trả lời:**  
> "Dạ, nhóm tuân thủ nghiêm ngặt 4 tiêu chí dừng đã định nghĩa trong Test Plan:
> 1. 100% các ca kiểm thử trong phạm vi (41/41) được thực thi đầy đủ.
> 2. Tỷ lệ vượt qua đạt 100% (Passed).
> 3. Không còn bất kỳ lỗi nào ở mức Critical (nghiêm trọng) hoặc Major (lớn) chưa được xử lý.
> 4. Toàn bộ 5 bộ tài liệu kiểm thử được hoàn thiện đồng bộ."

---

## SLIDE 4: PHƯƠNG PHÁP ÁP DỤNG
*(Slide 4: Hộp đen: BVA tại 50, 100, 200 kWh; EP cho Mã KH, SĐT; Hộp trắng: Bao phủ nhánh 6 bậc; Bảo mật API cURL; Đo độ trễ Dashboard)*

### ❓ Câu 4.1: Phân tích Giá trị biên (BVA) khác gì với Phân vùng tương đương (EP)? Hãy lấy ví dụ cụ thể trong đồ án?
> **Trả lời:**  
> "Dạ, EP chia miền dữ liệu thành các vùng tương đương giả định hệ thống xử lý như nhau (ví dụ: vùng Mã KH hợp lệ định dạng `KHxxxx` và vùng không hợp lệ như chuỗi rỗng hoặc mã sai `KH9999`).  
> Còn BVA tập trung vào ranh giới chuyển tiếp giữa các vùng vì đây là nơi lập trình viên dễ viết sai dấu (`<` thành `<=`). Ví dụ tại ngưỡng Bậc 1: biên dưới là $0$ kWh, biên trên là $50$ kWh (thuộc B1: $50 \times 1.893$ đ) và $51$ kWh (thuộc B2: $50 \times 1.893 + 1 \times 1.956$ đ)."

### ❓ Câu 4.2: Nhóm đã kiểm thử Bao phủ nhánh (Branch Coverage) cho thuật toán tính tiền 6 bậc như thế nào? Có bao nhiêu nhánh logic cần kiểm tra?
> **Trả lời:**  
> "Dạ, vòng lặp duyệt 6 bậc giá có các nhánh rẽ:
> 1. Sản lượng $0$ kWh (không rơi vào bậc nào).
> 2. Sản lượng nhỏ hơn trần của bậc hiện tại (lấy phần còn lại và kết thúc).
> 3. Sản lượng vượt trần bậc hiện tại (lấy trọn vẹn dung lượng bậc và chuyển sang bậc kế tiếp).
> 4. Sản lượng vượt qua cả Bậc 5 (toàn bộ phần dư dồn vào Bậc 6 không giới hạn).  
> Nhóm thiết kế các bộ test case với sản lượng $0, 50, 80, 150, 250, 350, 500$ kWh để kích hoạt 100% các nhánh rẽ logic này."

### ❓ Câu 4.3: Tại sao nhóm lại dùng công cụ cURL/Postman để kiểm thử hộp đen API mà không test hết qua giao diện trình duyệt?
> **Trả lời:**  
> "Dạ, vì giao diện trình duyệt luôn có tầng Client Validation (ví dụ thuộc tính `maxlength`, hàm chặn submit). Kẻ tấn công hoặc người dùng nâng cao hoàn toàn có thể bỏ qua giao diện trình duyệt để gửi HTTP request trực tiếp bằng Postman/cURL hoặc script. Kiểm thử trực tiếp qua cURL giúp chứng minh Backend tự bảo vệ độc lập, không phụ thuộc vào frontend."

### ❓ Câu 4.4: Trong kiểm thử phân vùng tương đương (EP) cho số điện thoại, nhóm đã chia những phân vùng nào?
> **Trả lời:**  
> "Dạ, nhóm chia thành 4 phân vùng:
> 1. Phân vùng hợp lệ: Chuỗi 10 chữ số đúng với SĐT trong CSDL (ví dụ `0884980616`).
> 2. Phân vùng hợp lệ dạng thô: Có chứa khoảng trắng hoặc gạch ngang (ví dụ `088-498-0616`, ` 088 498 0616 `) - kiểm tra hàm regex làm sạch.
> 3. Phân vùng không hợp lệ về mặt giá trị: 10 chữ số nhưng sai số người khác.
> 4. Phân vùng không hợp lệ về định dạng: Chuỗi rỗng, chứa chữ cái, hoặc quá ngắn/quá dài."

### ❓ Câu 4.5: Nhóm có thực hiện kiểm thử đột biến (Mutation Testing) hoặc Stress Test không?
> **Trả lời:**  
> "Dạ, trong phạm vi đồ án, nhóm tập trung sâu vào Functional Testing, Boundary Testing, Security API và Benchmark truy vấn cục bộ. Kiểm thử đột biến và Stress Test quy mô lớn (sử dụng công cụ k6 mô phỏng hàng nghìn user đồng thời) được nhóm xác định rõ là hướng mở rộng tiếp theo trong tương lai khi đưa hệ thống lên hạ tầng đám mây."

---

## SLIDE 5: KIẾN TRÚC BÀI TEST (41 CA KIỂM THỬ)
*(Slide 5: 41 ca kiểm thử toàn hệ thống, 24 ca tự động API/Unit, 17 ca thủ công UI, 100% Passed)*

### ❓ Câu 5.1: Tại sao lại có sự phân chia 24 ca Tự động và 17 ca Thủ công? Tiêu chí nào quyết định một ca nên tự động hay nên thủ công?
> **Trả lời:**  
> "Dạ, tiêu chí của nhóm dựa trên **ROI (Hiệu quả đầu tư tự động hóa)** và **Bản chất kiểm thử**:
> - **Tự động (24 ca):** Áp dụng cho logic nghiệp vụ lõi backend, thuật toán tính tiền, xác thực bảo mật API, truy vấn CSDL, kiểm tra mã trạng thái HTTP (200, 400, 401, 404). Các ca này chạy lặp đi lặp lại rất nhanh trong 2.6s, đóng vai trò Regression Testing.
> - **Thủ công (17 ca):** Áp dụng cho các tính năng trực quan trên UI/UX như: kiểm tra tính thẳng hàng của font JetBrains Mono, hiệu ứng tooltip biểu đồ Chart.js, màu sắc nhãn pastel, modal popup, hành vi đóng mở tab. Tự động hóa UI cho 17 ca này tốn nhiều chi phí duy trì kịch bản Selenium/Playwright trong khi kiểm thử thủ công trực tiếp mang lại cảm nhận trực quan chính xác nhất."

### ❓ Câu 5.2: Tỷ lệ đạt 100% Passed có thực tế không? Trước đó nhóm có tìm thấy con bug nào không, và đã khắc phục ra sao?
> **Trả lời:**  
> "Dạ, tỷ lệ 100% là kết quả sau vòng kiểm thử hồi quy (Regression Testing) cuối cùng. Trong các vòng lặp trước, nhóm đã phát hiện 3 lỗi quan trọng:
> - *Lỗi 1:* SQLite bị khóa file trên Windows (`SQLITE_BUSY: database is locked`) khi các bài test tự động chạy song song. Khắc phục: Cấu hình `concurrency: 1` cho runner.
> - *Lỗi 2:* Tìm kiếm tiếng Việt có dấu bị sai do chuỗi mã hóa URL. Khắc phục: Chuẩn hóa `decodeURIComponent` và đối chiếu UTF-8.
> - *Lỗi 3:* Thuật toán tính thuế VAT ban đầu dùng hàm chia số thập phân gây lệch 1 đồng ở một số mức kWh lẻ. Khắc phục: Áp dụng chuẩn `Math.round(totalBeforeTax * 0.08)`."

### ❓ Câu 5.3: Bộ 41 ca kiểm thử này đã bao phủ được bao nhiêu phần trăm yêu cầu chức năng trong tài liệu SRS?
> **Trả lời:**  
> "Dạ, đạt độ bao phủ yêu cầu (Requirements Coverage) **100%**. Nhóm đã lập Ma trận đối soát yêu cầu (RTM - Requirements Traceability Matrix) trong tài liệu, kết nối từng điều khoản Use Case trong SRS (từ UC01 đến UC05) với các mã ca kiểm thử tương ứng (từ `TC_LOOKUP_001` đến `TC_UI_002`), không có bất kỳ chức năng nào trong SRS bị bỏ sót mà không có test case."

### ❓ Câu 5.4: Làm thế nào để nhóm đảm bảo các bài test tự động không phụ thuộc lẫn nhau (Test Independence)?
> **Trả lời:**  
> "Dạ, mỗi file test tự động đều sử dụng cơ chế thiết lập môi trường cô lập: Trước mỗi kịch bản test hoặc bộ test (`before/beforeEach`), CSDL SQLite được sao chép ra bản tạm hoặc làm sạch dữ liệu kiểm thử; các thao tác tạo/sửa bản ghi không làm ảnh hưởng đến dữ liệu của kịch bản chạy sau."

### ❓ Câu 5.5: 41 ca kiểm thử này được phân bổ cụ thể vào các phân hệ như thế nào?
> **Trả lời:**  
> "Dạ, 41 ca được chia thành 8 nhóm: Cổng khách hàng (14 ca), Cổng quản trị cơ bản (11 ca), Dashboard điều hành (4 ca), Thuật toán tính tiền (3 ca), Bảo mật hệ thống (3 ca), Hiệu năng truy vấn (1 ca), Cổng thanh toán PayOS (3 ca), Chuẩn hóa Flat UI (2 ca)."

---

## SLIDE 6: PHÂN HỆ: CỔNG KHÁCH HÀNG
*(Slide 6: Tra cứu ẩn danh, Xác thực SĐT 2 lớp, Chi tiết đơn giá 6 bậc và thuế VAT 8%)*

### ❓ Câu 6.1: Cơ chế tra cứu ẩn danh được hiện thực ở tầng giao diện hay tầng backend? Nếu kẻ xấu bypass giao diện thì sao?
> **Trả lời:**  
> "Dạ, được hiện thực triệt để tại **Backend** (API Controller trong `routes/readings.js`). Khi API nhận request tra cứu mà không có tham số `phone` hợp lệ đi kèm, câu truy vấn SQL chỉ lấy họ tên và hóa đơn kỳ gần nhất; các trường `phone`, `address`, `meter_code` và các kỳ lịch sử cũ bị loại bỏ hoàn toàn khỏi JSON payload trước khi gửi về client. Do đó, dù hacker dùng công cụ cURL hay Postman cũng không thể lấy được dữ liệu cá nhân nếu chưa nhập đúng SĐT."

### ❓ Câu 6.2: Nếu khách hàng nhập số điện thoại có khoảng trắng hoặc dấu gạch nối (ví dụ `088-498-0616` thay vì `0884980616`), hệ thống xử lý thế nào?
> **Trả lời:**  
> "Dạ, hệ thống đã được kiểm thử với ca `TC_SEC_002`. Backend áp dụng hàm làm sạch bằng Regular Expression `phone.replace(/\D/g, '')` để loại bỏ toàn bộ ký tự không phải chữ số trước khi so khớp với CSDL. Do đó người dùng nhập dấu cách hay dấu gạch nối thì hệ thống vẫn nhận diện chính xác và mở khóa an toàn."

### ❓ Câu 6.3: Ca kiểm thử `TC_LOOKUP_010` (Bấm vào tab Biểu đồ khi chưa xác thực SĐT) kiểm tra điều gì?
> **Trả lời:**  
> "Dạ, kiểm tra tính toàn vẹn của luồng UX/UI. Tab 'Biểu đồ tiêu thụ' chứa dữ liệu phân tích sản lượng 4 năm (dữ liệu riêng tư). Khi người dùng chưa xác thực SĐT, tab này có biểu tượng ổ khóa 🔒; nếu người dùng cố bấm vào, Vue 3 Router/State sẽ chặn kích hoạt tab và tự động hiển thị popup yêu cầu nhập SĐT để mở khóa."

### ❓ Câu 6.4: Bảng chi tiết hóa đơn phân rã 6 bậc giá EVN hiển thị những thông tin gì và kiểm tra độ lệch tiền ra sao?
> **Trả lời:**  
> "Dạ, bảng phân rã bóc tách rõ ràng: Sản lượng tiêu thụ thực tế rơi vào từng bậc (kWh), đơn giá của bậc đó theo biểu giá hiện hành, và thành tiền của từng bậc. Cột cuối cùng tính tổng tiền trước thuế, tiền thuế VAT 8% và tổng tiền thanh toán sau thuế. Kịch bản test `TC_LOOKUP_011` kiểm tra tổng tiền từng bậc cộng lại phải khớp chính xác 100% với số tiền ghi trên hóa đơn tổng."

### ❓ Câu 6.5: Khách hàng ở trạng thái `TERMINATED` (Chấm dứt hợp đồng) được hiển thị và kiểm thử như thế nào?
> **Trả lời:**  
> "Dạ, ca kiểm thử `TC_LOOKUP_014` kiểm tra khi tra cứu mã khách hàng đã chấm dứt hợp đồng, giao diện hiển thị nhãn đỏ pastel 'Chấm dứt hợp đồng' (`#FDEBEC`), người dùng vẫn có thể xem lại lịch sử các kỳ cũ để tra cứu nhưng các nút tạo thanh toán hoặc xuất hóa đơn mới sẽ bị vô hiệu hóa."

---

## SLIDE 7: PHÂN HỆ: CỔNG QUẢN TRỊ & THUẬT TOÁN
*(Slide 7: CRUD phân trang 50 bản ghi, Bắt lỗi trùng mã công tơ, Tìm kiếm tiếng Việt UTF-8, Biểu giá động, Unit test 250 kWh = 607.554 đ)*

### ❓ Câu 7.1: Hãy giải thích chi tiết phép tính Unit Test cho 250 kWh hiển thị trên slide (tại sao ra 607.554 đ)?
> **Trả lời:**  
> "Dạ, 250 kWh được bóc tách qua 4 bậc thang:
> - Bậc 1 (0 - 50 kWh): $50 \times 1.893 = 94.650$ đ.
> - Bậc 2 (51 - 100 kWh): $50 \times 1.956 = 97.800$ đ.
> - Bậc 3 (101 - 200 kWh): $100 \times 2.271 = 227.100$ đ.
> - Bậc 4 (201 - 300 kWh, thực tế dùng 50 kWh): $50 \times 2.860 = 143.000$ đ.
> - Tổng tiền trước thuế: $94.650 + 97.800 + 227.100 + 143.000 = 562.550$ đ.
> - Thuế VAT 8%: $562.550 \times 0.08 = 45.004$ đ.
> - Tổng tiền thanh toán: $562.550 + 45.004 = 607.554$ đ.  
> Unit Test `TC_CALC_003` kiểm tra kết quả này tự động và khớp từng chữ số."

### ❓ Câu 7.2: Kiểm thử tìm kiếm khách hàng bằng tiếng Việt có dấu (`TC_ADMIN_004`) cần lưu ý những rủi ro kỹ thuật nào?
> **Trả lời:**  
> "Dạ, có 2 rủi ro kỹ thuật lớn:
> 1. Lỗi Encoding UTF-8 khi truyền tham số qua URL query string (ví dụ từ 'Nguyễn' bị mã hóa URL hoặc lỗi font mojibake).
> 2. Cơ chế tìm kiếm không phân biệt hoa thường trong SQLite (`COLLATE NOCASE` mặc định chỉ hỗ trợ bảng mã ASCII, không hỗ trợ ký tự Unicode tiếng Việt).  
> Nhóm đã kiểm tra backend xử lý decode URL đúng chuẩn và truy vấn SQL bằng hàm chuẩn hóa để tìm chính xác cả 'nguyễn', 'Nguyễn' hay 'NGUYỄN'."

### ❓ Câu 7.3: Ca kiểm thử `TC_ADMIN_007` bắt lỗi trùng lặp mã công tơ hoạt động như thế nào?
> **Trả lời:**  
> "Dạ, mỗi công tơ điện chỉ được gắn duy nhất cho một hộ gia đình. Trong bảng CSDL `customers`, trường `meter_code` được thiết lập ràng buộc `UNIQUE`. Kịch bản `TC_ADMIN_007` cố tình gửi request thêm khách hàng mới với mã công tơ đã tồn tại; bài test xác nhận backend bắt được lỗi vi phạm ràng buộc toàn vẹn, rollback transaction và trả về mã lỗi HTTP 400 kèm thông báo rõ ràng cho admin thay vì gây crash máy chủ."

### ❓ Câu 7.4: Tính năng phân trang 50 khách hàng/trang được kiểm thử những trường hợp biên nào?
> **Trả lời:**  
> "Dạ, kịch bản `TC_ADMIN_005` kiểm thử:
> 1. Trang đầu tiên (`page=1`): Trả về đúng 50 bản ghi đầu tiên.
> 2. Chuyển sang `page=2`: Lấy từ bản ghi thứ 51 (`OFFSET 50`), không có bản ghi nào bị trùng lặp ID với trang 1.
> 3. Trang cuối cùng: Trả về số bản ghi thực tế còn lại và vô hiệu hóa nút 'Next'.
> 4. Truyền tham số trang âm hoặc vượt quá tổng số trang: Hệ thống tự ép về trang hợp lệ mà không lỗi 500."

### ❓ Câu 7.5: Quản trị viên đăng nhập vào hệ thống bằng phương thức xác thực nào và được kiểm thử bảo mật ra sao?
> **Trả lời:**  
> "Dạ, quản trị viên xác thực qua endpoint `/api/auth/login`. Nhóm kiểm thử 3 kịch bản:
> 1. Nhập đúng tài khoản/mật khẩu -> cấp mã xác thực JWT hoặc session role admin.
> 2. Nhập sai mật khẩu -> từ chối với HTTP 401 Unauthorized.
> 3. Khi gọi các API quản trị (`POST/PUT/DELETE`) mà không có token admin -> backend chặn với HTTP 403 Forbidden."

---

## SLIDE 8: DASHBOARD ĐIỀU HÀNH
*(Slide 8: 27.580 bản ghi qua 49 kỳ, 5 Bento KPI, 4 biểu đồ Chart.js, Top 20 nợ cước, Drill-down kỳ)*

### ❓ Câu 8.1: Dữ liệu 27.580 bản ghi qua 49 kỳ từ đâu mà có? Tại sao nhóm lại cần lượng dữ liệu lớn như vậy để kiểm thử?
> **Trả lời:**  
> "Dạ, nhóm đã xây dựng script sinh dữ liệu thực tế (Seed Data Script) mô phỏng 1.000 khách hàng sử dụng điện liên tục qua 49 kỳ (từ tháng 01/2022 đến tháng 01/2026), có các dạng biến thiên sản lượng theo mùa (mùa hè cao điểm, mùa đông thấp điểm). Lượng dữ liệu lớn này là bắt buộc để kiểm thử hiệu năng thực tế của thuật toán tổng hợp SQL (các hàm `SUM`, `AVG`, `COUNT`, `GROUP BY`) và kiểm tra độ chịu tải hiển thị của thư viện Chart.js."

### ❓ Câu 8.2: Hãy kể tên 5 chỉ số Bento KPI và ý nghĩa kiểm định của từng chỉ số?
> **Trả lời:**  
> "Dạ, 5 chỉ số Bento gồm:
> 1. **Tổng sản lượng tiêu thụ (kWh):** Kiểm tra cộng dồn 27.580 bản ghi.
> 2. **Tổng doanh thu phát sinh (VNĐ):** Kiểm tra phép tính lũy kế theo biểu giá.
> 3. **Tỷ lệ thu hồi cước (%):** Tỷ lệ tiền đã thu trên tổng doanh thu (đo lường hiệu quả tài chính).
> 4. **Tổng công nợ tồn đọng (VNĐ):** Tổng số tiền của các hóa đơn chưa thanh toán (`UNPAID`).
> 5. **Sản lượng bình quân (kWh/hộ):** Kiểm tra chia trung bình mẫu số khách hàng đang hoạt động."

### ❓ Câu 8.3: 4 biểu đồ Chart.js trực quan hóa những khía cạnh nào của ngành điện?
> **Trả lời:**  
> "Dạ, 4 biểu đồ gồm:
> 1. *Biểu đồ hỗn hợp Cột & Đường:* Diễn biến sản lượng kWh (cột) và doanh thu tiền điện (đường) theo thời gian.
> 2. *Biểu đồ Tăng trưởng MoM:* Tỷ lệ phần trăm tăng/giảm sản lượng so với tháng liền trước.
> 3. *Biểu đồ Doughnut:* Cơ cấu tỷ trọng sản lượng điện rơi vào từng bậc từ Bậc 1 đến Bậc 6.
> 4. *Biểu đồ Cột chồng (Stacked Bar):* Phân tích đối sánh giữa số tiền đã thanh toán và nợ cước theo từng năm."

### ❓ Câu 8.4: Tính năng "Drill-down chi tiết kỳ và Top 20 khách hàng nợ cước" được kiểm thử như thế nào?
> **Trả lời:**  
> "Dạ, kịch bản `TC_ADMIN_014` kiểm thử khi admin nhấp vào một kỳ cụ thể (ví dụ Kỳ 01/2026) trên bảng tổng hợp, hệ thống gọi API `/api/stats/period/2026-01` để lấy:
> 1. Phân nhóm khách hàng theo 3 mức tiêu thụ (thấp < 100 kWh, trung bình 100-300 kWh, cao > 300 kWh).
> 2. Danh sách Top 20 khách hàng chưa đóng tiền có số nợ lớn nhất sắp xếp giảm dần, kèm SĐT và địa chỉ để cán bộ ngành điện đôn đốc thu cước."

### ❓ Câu 8.5: Quản trị viên có thể xem hồ sơ cá nhân của khách hàng từ Dashboard mà không cần SĐT không (`TC_ADMIN_015`)?
> **Trả lời:**  
> "Dạ có. Đây là đặc quyền của Quản trị viên (Admin Privilege). Khi Admin tra cứu từ Dashboard, request được gửi kèm cờ xác thực `admin=true`. Backend nhận diện quyền quản trị sẽ tự động mở khóa toàn bộ thông tin cá nhân và 49 kỳ lịch sử mà không cần nhập SĐT, đồng thời hiển thị banner xanh thông báo 'Chế độ Quản trị viên' để phân biệt với chế độ khách hàng."

---

## SLIDE 9: THANH TOÁN & GIAO DIỆN
*(Slide 9: PayOS VietQR chuẩn NAPAS 247, Xác thực Webhook HMAC-SHA256, Flat UI, Font Geist/JetBrains Mono tabular-nums, Nhãn Pastel)*

### ❓ Câu 9.1: Cơ chế tích hợp và kiểm thử cổng thanh toán PayOS VietQR hoạt động như thế nào?
> **Trả lời:**  
> "Dạ, kịch bản `TC_PAY_001` và `TC_PAY_002` kiểm thử luồng thanh toán:
> 1. Khi khách hàng bấm 'Thanh toán', backend tạo chữ ký điện tử HMAC-SHA256 từ các tham số (số tiền, mã đơn, nội dung) gửi sang PayOS API Gateway.
> 2. PayOS trả về link và chuỗi VietQR chuẩn NAPAS 247; frontend hiển thị mã QR động rõ nét trên màn hình để quét app ngân hàng.
> 3. Khi thanh toán thành công, PayOS gửi Webhook (IPN) về backend; backend xác thực chữ ký số webhook và tự động cập nhật hóa đơn sang `PAID`."

### ❓ Câu 9.2: Tính năng "Mô phỏng thanh toán nhanh (Test Bypass)" (`TC_PAY_003`) phục vụ mục đích gì và có rủi ro bảo mật trên production không?
> **Trả lời:**  
> "Dạ, khi thuyết trình hoặc nghiệm thu đồ án, việc quét app ngân hàng chuyển tiền thật sẽ tốn thời gian và chi phí. Nhóm thiết kế nút 'Test Bypass' gửi POST `/api/payment/simulate` để giả lập quá trình gạch nợ tức thì phục vụ demo nghiệm thu nhanh. Về mặt bảo mật, endpoint này được bảo vệ bởi biến môi trường `NODE_ENV=development`; khi deploy lên môi trường Production, endpoint này sẽ tự động bị đóng hoàn toàn."

### ❓ Câu 9.3: Tại sao nhóm lại chọn phông chữ JetBrains Mono và thuộc tính `tabular-nums` cho số liệu tiền điện?
> **Trả lời:**  
> "Dạ, trong giao diện tài chính và hóa đơn, các con số thường xuyên biến động và hiển thị theo cột. Font chữ thông thường có độ rộng chữ số không đều nhau (số 1 hẹp hơn số 8), khiến các cột số bị lệch hàng zíc-zắc khó đọc. Phông chữ kỹ thuật JetBrains Mono kết hợp CSS `font-variant-numeric: tabular-nums` đảm bảo mọi chữ số từ 0 đến 9 đều có cùng độ rộng, giúp các cột số tiền và sản lượng thẳng hàng tăm tắp, đúng chuẩn hiển thị phần mềm tài chính chuyên nghiệp."

### ❓ Câu 9.4: Tiêu chuẩn màu sắc Pastel của các nhãn trạng thái được kiểm định nhằm mục đích gì?
> **Trả lời:**  
> "Dạ, ca kiểm thử `TC_UI_002` kiểm tra tính công thái học thị giác (Visual Ergonomics). Thay vì dùng màu đỏ/xanh chói lóa gây mỏi mắt người dùng, nhóm chuẩn hóa 3 mã màu pastel dịu mắt nhưng có độ tương phản đạt chuẩn WCAG:
> - Đã thanh toán: Nền xanh pastel `#EDF3EC`, chữ xanh đậm `#275A2C`.
> - Chưa thanh toán: Nền vàng pastel `#FDF6E7`, chữ nâu đậm `#744210`.
> - Chấm dứt: Nền đỏ pastel `#FDEBEC`, chữ đỏ đậm `#9B1C1C`."

### ❓ Câu 9.5: Nhóm kiểm thử tính năng Flat UI phẳng tối giản như thế nào?
> **Trả lời:**  
> "Dạ, ca kiểm thử `TC_UI_001` kiểm tra qua CSS computed styles: Loại bỏ hoàn toàn các hiệu ứng đổ bóng màu mè (`box-shadow` nhiều lớp), sử dụng nền canvas phẳng `#FAFAFA` và đường viền mảnh `#EAEAEA`. Đảm bảo giao diện tải nhẹ, hiện đại và tập trung tối đa vào thông tin hóa đơn của người dùng."

---

## SLIDE 10: TỰ ĐỘNG HÓA KIỂM THỬ
*(Slide 10: Node.js Native Test Runner ~2.6s, Không phụ thuộc Jest/Mocha, Tối ưu hóa SQLite concurrency=1, Phân tách module độc lập)*

### ❓ Câu 10.1: Tại sao nhóm lại chọn Node.js Native Test Runner (`node:test`) thay vì các framework phổ biến như Jest hay Mocha?
> **Trả lời:**  
> "Dạ, có 3 lý do vượt trội:
> 1. **Tốc độ khởi động:** Jest cần nạp cả hệ sinh thái Babel/v8 runtime ảo, mất 3 - 5 giây chỉ để khởi động runner; trong khi `node:test` tích hợp trực tiếp trong V8 engine của Node.js 20+, khởi động trong vài mili-giây.
> 2. **Zero-dependency:** Giảm thiểu dung lượng thư mục `node_modules`, tránh các lỗ hổng bảo mật chuỗi cung ứng (supply-chain vulnerabilities).
> 3. **Thời gian thực thi:** Toàn bộ 23 bài test backend chạy hoàn tất chỉ trong khoảng **2.6 giây**, tạo phản hồi tức thì cho lập trình viên."

### ❓ Câu 10.2: Hãy giải thích lỗi khóa CSDL SQLite (`SQLITE_BUSY: database is locked`) và cách nhóm đã khắc phục bằng `concurrency=1`?
> **Trả lời:**  
> "Dạ, SQLite là hệ CSDL dạng file (file-based database). Mặc định, Node.js Test Runner chạy các file test song song trên nhiều luồng để tăng tốc. Khi nhiều bài test đồng thời thực hiện thao tác ghi (`INSERT/UPDATE`) vào cùng 1 file CSDL SQLite, file bị khóa độc quyền khiến các bài test khác vấp phải lỗi `SQLITE_BUSY`. Nhóm đã cấu hình cờ `--test-concurrency=1` trong `package.json` để runner thực thi tuần tự từng file test, loại bỏ 100% tình trạng xung đột khóa mà vẫn đảm bảo tốc độ cực nhanh 2.6s."

### ❓ Câu 10.3: Mã nguồn kiểm thử được tổ chức cấu trúc như thế nào trong dự án?
> **Trả lời:**  
> "Dạ, thư mục `server/test/` được module hóa độc lập thành 2 nhánh rõ ràng:
> - `test/customer/`: Chứa các kịch bản tra cứu `lookup.test.js` và tính tiền `billing.test.js`.
> - `test/admin/`: Chứa các kịch bản đăng nhập `auth.test.js`, tìm kiếm `customers_search.test.js` và cập nhật biểu giá `tariffs.test.js`.  
> Cách phân tách này giúp các kịch bản độc lập, dễ bảo trì và có thể chạy riêng từng phân hệ bằng lệnh `npm run test:customer` hoặc `npm run test:admin`."

### ❓ Câu 10.4: Nhóm sử dụng thư viện nào để assert kết quả trong các bài test tự động?
> **Trả lời:**  
> "Dạ, nhóm dùng module native `node:assert/strict` của Node.js. Cung cấp các hàm kiểm tra nghiêm ngặt như `assert.strictEqual()`, `assert.deepStrictEqual()`, `assert.match()` và `assert.ok()`. Cơ chế strict assertion đảm bảo so sánh chặt chẽ cả về giá trị lẫn kiểu dữ liệu (ví dụ chuỗi `'50'` khác số nguyên `50`)."

### ❓ Câu 10.5: Kịch bản test tự động có thể tích hợp vào đường ống CI/CD (như GitHub Actions) được không?
> **Trả lời:**  
> "Dạ, hoàn toàn sẵn sàng. Vì chỉ sử dụng lệnh chuẩn `node --test`, không cần cài đặt thêm môi trường đặc biệt, kịch bản CI/CD trên GitHub Actions chỉ cần 1 bước `npm test`. Nếu có bất kỳ bài test nào bị failed, exit code sẽ khác 0 và GitHub Actions sẽ lập tức chặn không cho merge mã nguồn lỗi vào nhánh chính."

---

## SLIDE 11: NGHIỆM THU & BÀN GIAO
*(Slide 11: 100% Passed, 0 lỗi Critical/Major, Bàn giao SRS, Test Plan, Ma trận Excel, Báo cáo Word hợp nhất)*

### ❓ Câu 11.1: Nhóm phân loại mức độ nghiêm trọng của lỗi (Defect Severity) như thế nào trong đồ án?
> **Trả lời:**  
> "Dạ, nhóm áp dụng 4 cấp độ quốc tế:
> - **Critical (Khẩn cấp):** Hệ thống bị crash, sai lệch công thức tiền điện, rò rỉ dữ liệu cá nhân SĐT/địa chỉ.
> - **Major (Lớn):** Lỗi chức năng quan trọng (không tìm kiếm được khách hàng, không nạp được biểu đồ).
> - **Minor (Nhỏ):** Lỗi giao diện nhỏ, thông báo lỗi chưa mượt nhưng không ảnh hưởng tính năng.
> - **Trivial (Thấp):** Lỗi chính tả, khoảng cách dòng chưa tối ưu.  
> Tại thời điểm nghiệm thu, hệ thống đạt **0 lỗi Critical và 0 lỗi Major**."

### ❓ Câu 11.2: Bộ 5 sản phẩm bàn giao của nhóm gồm những gì và có mối liên hệ như thế nào?
> **Trả lời:**  
> "Dạ, 5 sản phẩm gồm:
> 1. *Đặc tả yêu cầu (SRS):* Định nghĩa hệ thống cần làm gì.
> 2. *Kế hoạch kiểm thử (Test Plan):* Định nghĩa cách thức, lịch trình và tài nguyên kiểm định.
> 3. *Ma trận ca kiểm thử (Excel):* Thiết kế chi tiết 41 ca kiểm thử.
> 4. *Báo cáo tổng hợp kiểm thử (Word hợp nhất):* Hợp nhất toàn diện SRS, Test Plan và 41 ca kiểm thử thành một tài liệu lưu trữ chính thức.
> 5. *Kho mã nguồn (Codebase & Automation Script):* Toàn bộ mã nguồn sản phẩm và kịch bản auto test."

### ❓ Câu 11.3: Làm thế nào để nhóm đảm bảo tính đồng bộ giữa tài liệu Word/Excel và mã nguồn thực tế?
> **Trả lời:**  
> "Dạ, nhóm duy trì ma trận đối soát RTM (Requirements Traceability Matrix). Mọi thay đổi trong mã nguồn (như bổ sung ca kiểm thử PayOS hay Dashboard) đều được cập nhật đồng thời mã ca kiểm thử (`TC_PAY_...`, `TC_ADMIN_...`) vào cả file Excel và bộ test tự động. Sau đó chạy script tự động đối soát để đảm bảo mã test trong tài liệu khớp 100% với tên kịch bản trong code."

### ❓ Câu 11.4: Nếu bàn giao hệ thống cho một đội Tester khác tiếp quản, họ cần bao lâu để có thể chạy và hiểu toàn bộ kịch bản kiểm thử của nhóm?
> **Trả lời:**  
> "Dạ, chỉ cần tối đa 5 - 10 phút. Nhờ kiến trúc không phụ thuộc thư viện ngoài, người tiếp quản chỉ cần clone repo, chạy `npm install` và gõ `npm test`. Toàn bộ log kết quả màu xanh hiển thị rõ ràng từng ca test bằng tiếng Việt. Ngoài ra, tài liệu Kế hoạch kiểm thử và Báo cáo đã hướng dẫn chi tiết từ cấu hình phần cứng, biến môi trường đến dữ liệu mẫu để chạy thử nghiệm."

### ❓ Câu 11.5: Sau khi nghiệm thu, nhóm có khuyến nghị (Recommendations) gì để bảo trì và nâng cấp hệ thống trong tương lai?
> **Trả lời:**  
> "Dạ, nhóm đưa ra 3 khuyến nghị:
> 1. Nâng cấp CSDL từ SQLite lên PostgreSQL khi số lượng khách hàng thực tế vượt quá 100.000 hộ.
> 2. Tích hợp thêm xác thực OTP qua SMS/Zalo ZNS thay vì chỉ kiểm tra số điện thoại tĩnh.
> 3. Bổ sung giám sát log thời gian thực (như Winston hoặc Sentry) để theo dõi các giao dịch thanh toán trực tuyến."

---

## SLIDE 12: KẾT LUẬN & Q&A
*(Slide 12: Tổng kết bài học kinh nghiệm, Hướng phát triển k6 Load Test & Playwright E2E)*

### ❓ Câu 12.1: Bài học kinh nghiệm lớn nhất mà nhóm rút ra được qua đề tài kiểm thử này là gì?
> **Trả lời:**  
> "Dạ, bài học lớn nhất là **'Kiểm thử càng sớm, chi phí sửa lỗi càng thấp' (Shift-Left Testing)**. Việc rà soát kỹ lưỡng tài liệu SRS và thiết kế giá trị biên ngay từ đầu giúp nhóm phát hiện sai sót trong thuật toán lũy kế trước khi viết giao diện. Ngoài ra, nhóm nhận thức rõ kiểm thử tự động không thể thay thế hoàn toàn kiểm thử thủ công, mà cả hai phải bổ trợ lẫn nhau để đạt chất lượng toàn diện."

### ❓ Câu 12.2: Nhóm dự định áp dụng công cụ k6 để Load Testing như thế nào trong tương lai?
> **Trả lời:**  
> "Dạ, công cụ k6 (viết kịch bản bằng JavaScript) cho phép mô phỏng tải thực tế: Nhóm sẽ viết script k6 mô phỏng hành vi của 500 đến 1.000 khách hàng đồng thời tra cứu tiền điện vào ngày phát hành hóa đơn (ngày 15 hàng tháng). Qua đó đo lường các chỉ số như Virtual Users (VUs), Requests Per Second (RPS), độ trễ p95 và tỷ lệ lỗi để tìm ra điểm nghẽn (bottleneck) của máy chủ Express."

### ❓ Câu 12.3: Tại sao nhóm lại chọn Playwright thay vì Selenium cho kiểm thử giao diện E2E trong tương lai?
> **Trả lời:**  
> "Dạ, Playwright hiện đại hơn Selenium ở 3 điểm:
> 1. Cơ chế Auto-waiting thông minh, tự động đợi các phần tử Vue 3 render xong mới click, không cần chèn lệnh `sleep` gây chậm bài test.
> 2. Hỗ trợ chạy headless browser cực nhanh trên đa trình duyệt (Chromium, Firefox, WebKit).
> 3. Tích hợp tính năng quay video, chụp ảnh bằng chứng tự động khi test case bị failed, rất thuận tiện cho báo cáo lỗi."

### ❓ Câu 12.4: Nếu có thêm thời gian 2 tuần nữa để hoàn thiện đồ án, nhóm sẽ ưu tiên làm thêm phần kiểm thử nào nhất?
> **Trả lời:**  
> "Dạ, nhóm sẽ ưu tiên 2 hạng mục:
> 1. Xây dựng bộ kiểm thử E2E tự động hóa hoàn toàn luồng thanh toán VietQR trên giao diện bằng Playwright Mock Server.
> 2. Kiểm thử bảo mật chuyên sâu (Security Penetration Testing) bằng công cụ OWASP ZAP để quét các lỗ hổng Injection, XSS và CSRF."

### ❓ Câu 12.5: Thầy cô có lời khen cho phần trình bày của nhóm, nhóm hãy tóm gọn lại thông điệp cốt lõi của đề tài trong 1 câu?
> **Trả lời:**  
> "Dạ: *'Đề tài của chúng em đã chứng minh rằng một quy trình kiểm thử bài bản, kết hợp chặt chẽ giữa kỹ thuật phân tích biên hộp đen và tự động hóa backend tốc độ cao, hoàn toàn có thể đảm bảo tính chính xác tuyệt đối và an toàn dữ liệu cho một hệ thống dịch vụ công tài chính quy mô lớn như EVN ạ.'*"

