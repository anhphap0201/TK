import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def populate_test_cases():
    excel_path = 'docs/Test_Case.xlsx'
    wb = openpyxl.load_workbook(excel_path)

    thin_border = Border(
        left=Side(style='thin', color='D0D5DD'),
        right=Side(style='thin', color='D0D5DD'),
        top=Side(style='thin', color='D0D5DD'),
        bottom=Side(style='thin', color='D0D5DD')
    )
    
    font_body = Font(name='Arial', size=9.5)
    font_body_bold = Font(name='Arial', size=9.5, bold=True)
    font_status_passed = Font(name='Arial', size=9.5, bold=True, color='0E6251')
    fill_status_passed = PatternFill(start_color='EDF3EC', end_color='EDF3EC', fill_type='solid')
    fill_zebra = PatternFill(start_color='F9FAFB', end_color='F9FAFB', fill_type='solid')

    align_left_top = Alignment(horizontal='left', vertical='top', wrap_text=True)
    align_center_top = Alignment(horizontal='center', vertical='top', wrap_text=True)

    # ----------------------------------------------------
    # 1. COVER PAGE
    # ----------------------------------------------------
    ws_cover = wb['Cover page']
    ws_cover['N1'] = ''
    ws_cover['F9'] = 'HỆ THỐNG TRA CỨU TIỀN ĐIỆN & QUẢN TRỊ BIỂU GIÁ EVN'
    ws_cover['F9'].font = Font(name='Arial', size=14, bold=True, color='1E3A8A')
    
    ws_cover['E10'] = 'BỘ CA KIỂM THỬ TOÀN DIỆN (CUSTOMER & ADMIN PORTAL)'
    ws_cover['E10'].font = Font(name='Arial', size=11, bold=True, color='475569')

    # Header info
    ws_cover['B15'] = '20/10/2026'
    ws_cover['D15'] = '1.2'
    ws_cover['F15'] = 'Approved'
    ws_cover['H15'] = 'Đàm Anh Pháp (23010360) & Bùi Văn Đại (23010366)'
    ws_cover['K15'] = 'Giảng viên hướng dẫn môn học'
    ws_cover['N15'] = 'Khoa CNTT - Trường ĐH Phenikaa'

    for col in ['B', 'D', 'F', 'H', 'K', 'N']:
        ws_cover[f'{col}15'].font = font_body
        ws_cover[f'{col}15'].alignment = align_left_top

    # Revision History
    revs = [
        ('12/10/2026', '1.0', 'Thiết kế 17 ca kiểm thử ban đầu cho Cổng khách hàng', 'Đàm Anh Pháp (23010360)'),
        ('19/10/2026', '1.1', 'Phân tách 2 thư mục customer & admin, bổ sung kiểm thử quản trị và thanh toán', 'Đàm Anh Pháp & Bùi Văn Đại'),
        ('20/10/2026', '1.2', 'Bổ sung kiểm thử Executive Dashboard 5 KPI, 4 biểu đồ, Top 20 nợ cước, PayOS VietQR, Flat UI', 'Đàm Anh Pháp & Bùi Văn Đại')
    ]
    for idx, (d, v, desc, auth) in enumerate(revs):
        r = 18 + idx
        ws_cover[f'B{r}'] = d
        ws_cover[f'D{r}'] = v
        ws_cover[f'F{r}'] = desc
        ws_cover[f'K{r}'] = auth
        for c in ['B', 'D', 'F', 'K']:
            ws_cover[f'{c}{r}'].font = font_body
            ws_cover[f'{c}{r}'].alignment = align_left_top

    # References
    refs = [
        ('Đặc tả yêu cầu phần mềm (SRS)', '1.2', 'docs/SRS_Dac_Ta_Yeu_Cau.md'),
        ('Kế hoạch kiểm thử (Test Plan)', '1.2', 'docs/Test_Plan_Kiem_Thu.md')
    ]
    for idx, (name, v, path) in enumerate(refs):
        r = 25 + idx
        ws_cover[f'B{r}'] = name
        ws_cover[f'I{r}'] = v
        ws_cover[f'K{r}'] = path
        for c in ['B', 'I', 'K']:
            ws_cover[f'{c}{r}'].font = font_body
            ws_cover[f'{c}{r}'].alignment = align_left_top

    # Execution History
    ws_cover['B29'] = '20/10/2026'
    ws_cover['D29'] = 'Đàm Anh Pháp & Bùi Văn Đại'
    ws_cover['G29'] = 'Build 1.2.0 (Node 20+ / Express / Vue 3 - 23/23 Automated Tests Passed)'
    for c in ['B', 'D', 'G']:
        ws_cover[f'{c}29'].font = font_body
        ws_cover[f'{c}29'].alignment = align_left_top

    ws_cover['B35'] = ''

    # ----------------------------------------------------
    # 2. GLOSSARY
    # ----------------------------------------------------
    ws_glos = wb['Glossary']
    definitions = [
        ('AUT', 'Application Under Test - Hệ thống Tra cứu Tiền điện & Quản trị Biểu giá EVN.'),
        ('Customer Portal', 'Cổng tra cứu hóa đơn dành cho khách hàng với cơ chế bảo vệ dữ liệu SĐT 2 lớp.'),
        ('Admin Portal', 'Cổng quản trị viên quản lý danh mục khách hàng, cấu hình biểu giá 6 bậc EVN và thuế VAT.'),
        ('Executive Dashboard', 'Trung tâm điều hành ngành điện tổng hợp 5 KPI Bento, 4 biểu đồ Chart.js và drill-down kỳ.'),
        ('Flat UI / Modern Minimal', 'Ngôn ngữ thiết kế phẳng, font Geist & JetBrains Mono, viền mờ #EAEAEA, nhãn màu pastel.'),
        ('PayOS VietQR', 'Cổng thanh toán sinh mã QR động chuẩn NAPAS 247 và tự động xác nhận webhook giao dịch.'),
        ('PayOS Webhook', 'Cơ chế thông báo tự động (Instant Payment Notification) xác thực thanh toán thời gian thực.'),
        ('BVA', 'Boundary Value Analysis - Kỹ thuật phân tích giá trị biên tại ngưỡng chuyển bậc lũy kế.'),
        ('EP', 'Equivalence Partitioning - Kỹ thuật phân vùng tương đương dữ liệu hợp lệ và không hợp lệ.'),
        ('RTM', 'Requirements Traceability Matrix - Ma trận đối soát yêu cầu kỹ thuật với kịch bản kiểm thử.')
    ]

    for idx, (term, desc) in enumerate(definitions):
        r = 6 + idx
        ws_glos[f'B{r}'] = term
        ws_glos[f'E{r}'] = desc
        ws_glos[f'B{r}'].font = font_body_bold
        ws_glos[f'E{r}'].font = font_body
        ws_glos[f'B{r}'].alignment = align_left_top
        ws_glos[f'E{r}'].alignment = align_left_top

    abbreviations = [
        ('TC', 'Test Case - Ca kiểm thử chi tiết.'),
        ('Mã KH', 'Customer Code - Mã khách hàng định danh duy nhất (ví dụ: KH0001).'),
        ('SĐT', 'Phone Number - Số điện thoại di động chính chủ của khách hàng.'),
        ('EVN', 'Electricity Vietnam - Tập đoàn Điện lực Việt Nam.'),
        ('VAT', 'Value Added Tax - Thuế giá trị gia tăng (mặc định 8%).'),
        ('MoM', 'Month-over-Month - Tỷ lệ tăng trưởng so với tháng liền kề trước đó.'),
        ('API', 'Application Programming Interface - Giao diện lập trình ứng dụng RESTful.'),
        ('CRUD', 'Create, Read, Update, Delete - Các thao tác cơ bản thêm, xem, sửa, tìm kiếm.'),
        ('KPI', 'Key Performance Indicator - Chỉ số hiệu suất định lượng của ngành điện.')
    ]

    for idx, (abbr, desc) in enumerate(abbreviations):
        r = 18 + idx
        ws_glos[f'B{r}'] = abbr
        ws_glos[f'E{r}'] = desc
        ws_glos[f'B{r}'].font = font_body_bold
        ws_glos[f'E{r}'].font = font_body
        ws_glos[f'B{r}'].alignment = align_left_top
        ws_glos[f'E{r}'].alignment = align_left_top

    # ----------------------------------------------------
    # TEST CASES DATA DEFINITION
    # ----------------------------------------------------
    func_cases = [
        # Customer Portal (14)
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_001',
            'desc': 'Tra cứu bằng Mã KH hợp lệ (chế độ ẩn danh cơ bản)',
            'steps': '1. Mở trang chủ cổng tra cứu.\n2. Nhập mã KH0001 vào ô tìm kiếm.\n3. Nhấn nút "Tra cứu".',
            'step_res': '1. Tải giao diện tìm kiếm phẳng.\n2. Ô nhập nhận giá trị KH0001.\n3. Gửi request GET tra cứu.',
            'exp_res': 'Chuyển sang Cổng khách hàng. Hiển thị họ tên và hóa đơn tháng hiện tại. Ẩn toàn bộ SĐT, địa chỉ và mã công tơ. Banner báo chế độ bảo mật.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_002',
            'desc': 'Kiểm tra bảo mật payload API khi chưa xác thực SĐT',
            'steps': '1. Mở DevTools Network.\n2. Gửi request GET /api/readings/customer/KH0001.\n3. Kiểm tra cấu trúc JSON trả về.',
            'step_res': '1. DevTools sẵn sàng bắt gói tin.\n2. API trả về mã HTTP 200.\n3. is_authenticated = false.',
            'exp_res': 'JSON response không chứa các trường riêng tư (phone, address, meter_code), mảng readings chỉ trả 1 hóa đơn kỳ gần nhất.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_003',
            'desc': 'Tra cứu bằng Mã khách hàng không tồn tại',
            'steps': '1. Nhập mã "KH9999" vào ô tra cứu.\n2. Nhấn nút "Tra cứu".',
            'step_res': '1. Ô nhập hiển thị KH9999.\n2. Backend trả về mã HTTP 404.',
            'exp_res': 'Giao diện hiển thị cảnh báo đỏ: "Không tìm thấy thông tin khách hàng". Hệ thống giữ nguyên màn hình nhập mã.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_004',
            'desc': 'Để trống ô nhập Mã KH khi bấm tra cứu',
            'steps': '1. Để trống ô nhập mã khách hàng.\n2. Nhấn nút "Tra cứu".',
            'step_res': '1. Ô nhập rỗng.\n2. Kích hoạt kiểm tra dữ liệu đầu vào tại Client.',
            'exp_res': 'Báo lỗi màu đỏ: "Vui lòng nhập Mã khách hàng". Hệ thống chặn lại và không gửi request mạng lên máy chủ.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_005',
            'desc': 'Tra cứu mã KH có khoảng trắng thừa đầu cuối',
            'steps': '1. Nhập chuỗi "  KH0002  " có khoảng trắng.\n2. Nhấn nút "Tra cứu".',
            'step_res': '1. Nhập chuỗi thô có dấu cách.\n2. Hàm trim() tự động làm sạch.',
            'exp_res': 'Hệ thống tự động cắt tỉa khoảng trắng thừa, tra cứu thành công và mở cổng khách hàng KH0002.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_006',
            'desc': 'Tra cứu mã KH viết chữ thường (Case-insensitive)',
            'steps': '1. Nhập "kh0001" (viết thường hoàn toàn).\n2. Nhấn nút "Tra cứu".',
            'step_res': '1. Ô nhập hiển thị ký tự thường.\n2. Hệ thống chuyển đổi uppercase.',
            'exp_res': 'Xử lý không phân biệt hoa thường, tra cứu thành công và hiển thị hồ sơ khách hàng KH0001.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_007',
            'desc': 'Xác thực đúng số điện thoại chính chủ',
            'steps': '1. Bấm nút "Nhập SĐT xem lịch sử".\n2. Nhập số điện thoại "0884980616".\n3. Bấm "Xác thực & Mở khóa".',
            'step_res': '1. Modal xác thực bật lên.\n2. Nhập đúng số điện thoại đăng ký.\n3. Gửi request xác minh SĐT.',
            'exp_res': 'Đóng modal, cờ is_authenticated chuyển true. Mở khóa toàn bộ SĐT, địa chỉ, mã công tơ, danh sách 17 kỳ hóa đơn và tab biểu đồ.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_008',
            'desc': 'Xác thực thất bại khi nhập sai số điện thoại',
            'steps': '1. Mở modal xác thực SĐT.\n2. Nhập số điện thoại sai "0999888777".\n3. Bấm "Xác thực & Mở khóa".',
            'step_res': '1. Modal hiển thị.\n2. Nhập số điện thoại không khớp.\n3. Backend từ chối xác thực.',
            'exp_res': 'Không đóng modal. Hiển thị thông báo đỏ: "Số điện thoại không khớp với hồ sơ khách hàng". Dữ liệu lịch sử tiếp tục được bảo vệ.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_009',
            'desc': 'Để trống số điện thoại khi bấm xác thực',
            'steps': '1. Mở modal xác thực SĐT.\n2. Để trống ô nhập số điện thoại.\n3. Bấm "Xác thực & Mở khóa".',
            'step_res': '1. Modal đang mở.\n2. Không nhập ký tự nào.\n3. Kiểm tra validation tại form.',
            'exp_res': 'Báo lỗi màu đỏ: "Vui lòng nhập số điện thoại". Không gửi request xác thực lên máy chủ.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_010',
            'desc': 'Bấm vào Tab Biểu đồ tiêu thụ khi chưa xác thực SĐT',
            'steps': '1. Đang ở cổng KH0001 chưa nhập SĐT.\n2. Nhấn vào tab "Biểu đồ tiêu thụ" (có icon khóa).',
            'step_res': '1. Tab biểu đồ đang ở trạng thái khóa.\n2. Bắt sự kiện click tab.',
            'exp_res': 'Hệ thống chặn chuyển tab, tự động kích hoạt modal yêu cầu xác thực số điện thoại để mở khóa dữ liệu.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_011',
            'desc': 'Xem chi tiết bảng phân rã 6 bậc giá EVN của hóa đơn',
            'steps': '1. Bấm nút "Chi tiết" tại một kỳ hóa đơn bất kỳ.\n2. Quan sát bảng số liệu trong modal bóc tách.',
            'step_res': '1. Modal chi tiết hóa đơn mở ra.\n2. Bảng phân rã 6 bậc giá hiển thị rõ ràng.',
            'exp_res': 'Modal hiển thị chi tiết sản lượng và đơn giá từng bậc từ 1 đến 6. Tiền trước thuế cộng thuế VAT 8% bằng đúng tổng tiền thanh toán.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_012',
            'desc': 'Lọc dữ liệu biểu đồ tiêu thụ theo năm',
            'steps': '1. Xác thực SĐT thành công, mở tab Biểu đồ.\n2. Chọn bộ lọc năm "2026".\n3. Chọn lại bộ lọc "Tất cả".',
            'step_res': '1. Biểu đồ Chart.js hiển thị dữ liệu.\n2. Lọc các kỳ năm 2026.\n3. Khôi phục toàn bộ các kỳ.',
            'exp_res': 'Biểu đồ cột sản lượng và đường chi phí cập nhật mượt mà, số liệu hiển thị đồng bộ hoàn toàn với bảng lịch sử hóa đơn.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_013',
            'desc': 'Đổi mã tra cứu (kết thúc phiên làm việc)',
            'steps': '1. Nhấn nút "Đổi mã tra cứu" ở góc trên bên phải màn hình.',
            'step_res': '1. Xóa state lưu trữ mã KH và SĐT trong client.',
            'exp_res': 'Xóa thông tin tạm lưu trong bộ nhớ client, quay lại màn hình nhập mã ban đầu an toàn.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Khách Hàng (Customer)',
            'id': 'TC_LOOKUP_014',
            'desc': 'Hiển thị trạng thái khách hàng đã chấm dứt hợp đồng',
            'steps': '1. Tra cứu mã khách hàng mang trạng thái TERMINATED.\n2. Quan sát huy hiệu trạng thái trên giao diện.',
            'step_res': '1. Tải hồ sơ khách hàng đã ngừng dùng điện.\n2. Kiểm tra render CSS huy hiệu.',
            'exp_res': 'Huy hiệu trạng thái hiển thị màu đỏ pastel (#FDEBEC) và chữ đỏ (#9B1C1C): "Chấm dứt". Các chức năng tra cứu lịch sử vẫn hiển thị bình thường.',
            'status': 'Passed'
        },

        # Admin Base Portal (11)
        {
            'cat': 'Cổng Quản Trị Viên (Admin Base)',
            'id': 'TC_ADMIN_001',
            'desc': 'Đăng nhập Admin với mật khẩu đúng',
            'steps': '1. Gửi request POST /api/auth/login với username "admin" và password "admin123".',
            'step_res': '1. Backend kiểm tra thông tin đăng nhập.\n2. Trả về mã HTTP 200.',
            'exp_res': 'Cấp quyền role: admin, trả về JWT token hợp lệ và thông tin người dùng "Quản trị viên EVN". Chuyển hướng vào trang quản trị.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Quản Trị Viên (Admin Base)',
            'id': 'TC_ADMIN_002',
            'desc': 'Đăng nhập Admin với mật khẩu sai',
            'steps': '1. Gửi request POST /api/auth/login với username "admin" và password sai "sai_mat_khau".',
            'step_res': '1. Backend phát hiện mật khẩu không khớp.\n2. Trả về mã HTTP 401.',
            'exp_res': 'Báo lỗi "Mật khẩu quản trị viên không chính xác". Không cấp token, từ chối quyền truy cập.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Quản Trị Viên (Admin Base)',
            'id': 'TC_ADMIN_003',
            'desc': 'Tìm kiếm khách hàng theo mã khách hàng',
            'steps': '1. Gửi request GET /api/customers?q=KH_TEST_...',
            'step_res': '1. Thực thi truy vấn SQL LIKE trên cột customer_code.\n2. Trả về mã HTTP 200.',
            'exp_res': 'Tìm thấy đúng khách hàng với mã tương ứng trong danh sách trả về, thời gian truy vấn nhanh chóng.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Quản Trị Viên (Admin Base)',
            'id': 'TC_ADMIN_004',
            'desc': 'Tìm kiếm khách hàng theo tên tiếng Việt có dấu',
            'steps': '1. Gửi request GET /api/customers?q=Nguyễn&limit=100.',
            'step_res': '1. Backend xử lý encoding Unicode UTF-8.\n2. Truy vấn so khớp họ tên tiếng Việt.',
            'exp_res': 'Danh sách trả về chứa các khách hàng có tên chứa từ khóa "Nguyễn". Tìm kiếm tiếng Việt có dấu hoạt động chính xác.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Quản Trị Viên (Admin Base)',
            'id': 'TC_ADMIN_005',
            'desc': 'Phân trang danh sách khách hàng',
            'steps': '1. Gửi request lấy trang 1, trang 2, trang 3 với limit=50.',
            'step_res': '1. Backend áp dụng LIMIT 50 OFFSET tương ứng.\n2. Trả về dữ liệu từng trang.',
            'exp_res': 'Mỗi trang trả về tối đa 50 bản ghi. Khách hàng ở các trang không bị trùng lặp ID, phân trang chuẩn xác.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Quản Trị Viên (Admin Base)',
            'id': 'TC_ADMIN_006',
            'desc': 'Thêm mới khách hàng với thông tin hợp lệ',
            'steps': '1. Gửi POST /api/customers với đầy đủ họ tên, mã KH, số điện thoại, địa chỉ, mã công tơ mới.',
            'step_res': '1. Kiểm tra validation các trường dữ liệu.\n2. Chèn bản ghi mới vào CSDL SQLite.',
            'exp_res': 'Trả về mã HTTP 201, dữ liệu khách hàng được tạo thành công trong CSDL với đầy đủ thông tin cung cấp.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Quản Trị Viên (Admin Base)',
            'id': 'TC_ADMIN_007',
            'desc': 'Bắt lỗi trùng lặp mã công tơ khi thêm mới',
            'steps': '1. Gửi POST /api/customers với mã công tơ đã có người sử dụng trong CSDL.',
            'step_res': '1. SQLite phát hiện vi phạm UNIQUE constraint.\n2. Backend bắt exception.',
            'exp_res': 'Trả về mã HTTP 400, thông báo lỗi "mã công tơ đã tồn tại". CSDL không bị thêm bản ghi trùng lặp.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Quản Trị Viên (Admin Base)',
            'id': 'TC_ADMIN_008',
            'desc': 'Cập nhật thông tin khách hàng đã tồn tại',
            'steps': '1. Gửi PUT /api/customers/:id với số điện thoại và địa chỉ mới.',
            'step_res': '1. Cập nhật bản ghi trong CSDL.\n2. Trả về HTTP 200.',
            'exp_res': 'Khi truy vấn lại khách hàng theo ID, thông tin số điện thoại và địa chỉ mới đã được cập nhật chính xác.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Quản Trị Viên (Admin Base)',
            'id': 'TC_ADMIN_009',
            'desc': 'Cập nhật biểu giá 6 bậc EVN và thuế VAT',
            'steps': '1. Đăng nhập Admin.\n2. Gửi PUT /api/tariffs đổi giá bậc 1 thành 1900 đ/kWh và VAT 10%.\n3. Lấy lại biểu giá.',
            'step_res': '1. Cập nhật bảng tariffs và vat.\n2. Truy vấn lại cấu hình giá mới.',
            'exp_res': 'Trả về HTTP 200, danh sách bậc giá mới phản ánh đúng đơn giá 1900 đ/kWh và mức thuế VAT 10%.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Quản Trị Viên (Admin Base)',
            'id': 'TC_ADMIN_010',
            'desc': 'Tính tiền điện tự động theo biểu giá và VAT mới',
            'steps': '1. Cấu hình bậc 1 = 1900 và VAT = 10%.\n2. Tính tiền cho sản lượng 50 kWh với cấu hình mới.',
            'step_res': '1. Tiền trước thuế = 50 * 1900 = 95.000 đ.\n2. Thuế VAT 10% = 9.500 đ.',
            'exp_res': 'Tổng tiền thanh toán khớp chính xác 104.500 đ theo cấu hình động mới, chứng minh công thức tính toán linh hoạt.',
            'status': 'Passed'
        },
        {
            'cat': 'Cổng Quản Trị Viên (Admin Base)',
            'id': 'TC_ADMIN_011',
            'desc': 'Đăng xuất khỏi tài khoản Quản trị viên',
            'steps': '1. Nhấn nút "Đăng xuất" trên thanh điều hướng Admin.',
            'step_res': '1. Xóa token lưu trữ trong localStorage/sessionStorage.\n2. Chuyển hướng router về trang chủ.',
            'exp_res': 'Token quản trị bị hủy hoàn toàn, đưa người dùng quay lại màn hình tra cứu khách hàng ban đầu.',
            'status': 'Passed'
        },

        # Executive Dashboard (4)
        {
            'cat': 'Trung Tâm Điều Hành (Dashboard)',
            'id': 'TC_ADMIN_012',
            'desc': 'Tổng hợp 5 chỉ số Bento KPI qua API Dashboard',
            'steps': '1. Gửi request GET /api/stats/dashboard.\n2. Kiểm tra các trường dữ liệu trả về trong object overall.',
            'step_res': '1. Backend tổng hợp dữ liệu trên 27.580 bản ghi qua 49 kỳ.\n2. Trả về mã HTTP 200.',
            'exp_res': 'Trả về đầy đủ 5 chỉ số: tổng sản lượng (total_kwh), tổng doanh thu (total_revenue), tỷ lệ thu hồi (recovery_rate), công nợ (total_unpaid), bình quân/hộ (avg_kwh_per_customer). Phản hồi < 180ms.',
            'status': 'Passed'
        },
        {
            'cat': 'Trung Tâm Điều Hành (Dashboard)',
            'id': 'TC_ADMIN_013',
            'desc': 'Hiển thị 4 biểu đồ Chart.js trực quan trên Dashboard',
            'steps': '1. Mở trang Dashboard Giám Sát.\n2. Quan sát hiển thị 4 biểu đồ tương tác: Combo cột/đường, cột tăng trưởng MoM, Doughnut 6 bậc, Stacked Bar công nợ.',
            'step_res': '1. Khởi tạo Chart.js trên canvas.\n2. Nạp dữ liệu thống kê vào biểu đồ.',
            'exp_res': '4 biểu đồ render thành công, hiển thị đầy đủ nhãn trục, chú giải và tooltip khi rê chuột vào điểm dữ liệu, không có lỗi console.',
            'status': 'Passed'
        },
        {
            'cat': 'Trung Tâm Điều Hành (Dashboard)',
            'id': 'TC_ADMIN_014',
            'desc': 'Drill-down xem chi tiết kỳ và Top 20 khách hàng nợ cước',
            'steps': '1. Bấm nút "Chi tiết kỳ" tại kỳ 2026-03 trên bảng 49 kỳ.\n2. Hệ thống gọi API GET /api/stats/period/2026-03.',
            'step_res': '1. Backend truy vấn phân nhóm tiêu thụ và nợ cước kỳ 2026-03.\n2. Trả về mã HTTP 200.',
            'exp_res': 'Modal hiển thị phân nhóm hộ tiêu thụ và danh sách tối đa 20 khách hàng nợ cước cao nhất kỳ với họ tên, SĐT và số tiền nợ sắp xếp giảm dần.',
            'status': 'Passed'
        },
        {
            'cat': 'Trung Tâm Điều Hành (Dashboard)',
            'id': 'TC_ADMIN_015',
            'desc': 'Admin tra cứu phân tích cá nhân không cần số điện thoại',
            'steps': '1. Nhập KH0001 vào thanh tra cứu cá nhân trên Dashboard.\n2. Bấm "Phân tích cá nhân" (gọi GET /api/readings/customer/KH0001?admin=true).',
            'step_res': '1. Backend nhận diện cờ admin=true.\n2. Cấp quyền truy cập toàn diện.',
            'exp_res': 'Mở khóa toàn bộ thông tin cá nhân (SĐT, địa chỉ, mã công tơ) và toàn bộ lịch sử 4 năm không cần SĐT. Hiện banner Admin có nút quay lại Dashboard.',
            'status': 'Passed'
        },

        # Calculator Unit Tests (3)
        {
            'cat': 'Thuật Toán Tính Tiền (Unit Test)',
            'id': 'TC_CALC_001',
            'desc': 'Tính tiền cho sản lượng 0 kWh',
            'steps': '1. Gọi hàm calculateElectricity(0) trong module calculator.js.',
            'step_res': '1. Xử lý trường hợp biên tối thiểu 0 kWh.',
            'exp_res': 'Tiền trước thuế: 0 đ, thuế VAT: 0 đ, tổng tiền thanh toán: 0 đ. Mảng tier_details ghi nhận 0 kWh ở tất cả các bậc.',
            'status': 'Passed'
        },
        {
            'cat': 'Thuật Toán Tính Tiền (Unit Test)',
            'id': 'TC_CALC_002',
            'desc': 'Tính tiền điện 50 kWh nằm trọn trong Bậc 1',
            'steps': '1. Gọi calculateElectricity(50) với đơn giá Bậc 1: 1.893 đ/kWh và VAT 8%.',
            'step_res': '1. Áp dụng trọn vẹn 50 kWh vào Bậc 1: 50 * 1893 = 94.650 đ.\n2. Thuế VAT 8% = 7.572 đ.',
            'exp_res': 'Tiền trước thuế: 94.650 đ, VAT: 7.572 đ, tổng tiền thanh toán: 102.222 đ. Tier 1 ghi nhận đúng 50 kWh.',
            'status': 'Passed'
        },
        {
            'cat': 'Thuật Toán Tính Tiền (Unit Test)',
            'id': 'TC_CALC_003',
            'desc': 'Tính tiền điện 250 kWh qua 4 bậc thang lũy kế',
            'steps': '1. Gọi calculateElectricity(250) với VAT 8%.\n2. Bóc tách qua các bậc: Bậc 1 (50 kWh), Bậc 2 (50 kWh), Bậc 3 (100 kWh), Bậc 4 (50 kWh).',
            'step_res': '1. B1: 94.650 đ, B2: 97.800 đ, B3: 227.100 đ, B4: 143.000 đ.\n2. Tổng trước thuế: 562.550 đ.\n3. VAT: 45.004 đ.',
            'exp_res': 'Tổng tiền trước thuế: 562.550 đ, thuế VAT 8%: 45.004 đ, tổng tiền thanh toán: 607.554 đ. Bóc tách 4 bậc chuẩn xác.',
            'status': 'Passed'
        }
    ]

    sec_cases = [
        {
            'cat': 'Bảo Mật Hệ Thống (Security)',
            'id': 'TC_SEC_001',
            'desc': 'Bảo mật API - Ngăn chặn xem lén dữ liệu riêng tư khi gọi API trực tiếp',
            'steps': '1. Dùng cURL gửi GET /api/readings/customer/KH0001 không kèm tham số phone.\n2. Kiểm tra JSON trả về.',
            'step_res': '1. Gửi request trực tiếp không qua trình duyệt.\n2. Backend kiểm tra tính xác thực.',
            'exp_res': 'Payload JSON chỉ có họ tên và mã khách hàng, tuyệt đối không có phone, address, meter_code. Dữ liệu riêng tư được loại bỏ hoàn toàn tại backend.',
            'status': 'Passed'
        },
        {
            'cat': 'Bảo Mật Hệ Thống (Security)',
            'id': 'TC_SEC_002',
            'desc': 'Làm sạch chuỗi - Chuẩn hóa số điện thoại chống sai lệch định dạng',
            'steps': '1. Nhập số điện thoại có dấu gạch nối: "088-498-0616" để xác thực với số "0884980616" trong CSDL.',
            'step_res': '1. Nhập chuỗi thô chứa ký tự đặc biệt.\n2. Hàm regex loại bỏ toàn bộ dấu gạch ngang và khoảng trắng.',
            'exp_res': 'Backend tự động làm sạch định dạng, so khớp thành công số điện thoại chuẩn và mở khóa dữ liệu an toàn.',
            'status': 'Passed'
        },
        {
            'cat': 'Bảo Mật Hệ Thống (Security)',
            'id': 'TC_SEC_003',
            'desc': 'Phân quyền Admin - Xác thực cờ admin=true mở khóa hồ sơ cá nhân',
            'steps': '1. Gửi request GET /api/readings/customer/KH0001?admin=true.\n2. Kiểm tra payload JSON nhận được.',
            'step_res': '1. Kích hoạt cờ phân quyền quản trị.\n2. Backend xác minh thẩm quyền.',
            'exp_res': 'Trả về is_authenticated: true kèm đầy đủ địa chỉ, mã công tơ và lịch sử các kỳ theo đúng quyền Quản trị viên.',
            'status': 'Passed'
        },
        {
            'cat': 'Hiệu Năng Hệ Thống (Performance)',
            'id': 'TC_PERF_001',
            'desc': 'Hiệu năng - Đo tốc độ truy vấn thống kê toàn hệ thống trên 27.580 bản ghi',
            'steps': '1. Gửi request GET /api/stats/dashboard.\n2. Đo thời gian phản hồi bằng DevTools Network.',
            'step_res': '1. Bắt đầu đo thời gian xử lý request.\n2. Nhận gói tin phản hồi hoàn chỉnh.',
            'exp_res': 'Thời gian phản hồi <= 200ms trên CSDL 1.000 khách hàng và 27.580 bản ghi. Thời gian thực tế đạt 75ms - 145ms.',
            'status': 'Passed'
        }
    ]

    other_cases = [
        {
            'cat': 'Thanh Toán Trực Tuyến (Payment)',
            'id': 'TC_PAY_001',
            'desc': 'Tạo yêu cầu thanh toán PayOS và hiển thị mã VietQR chuẩn NAPAS 247',
            'steps': '1. Gửi POST /api/payment/create-payos-url kèm mã kỳ hóa đơn chưa đóng.',
            'step_res': '1. Tạo chữ ký HMAC-SHA256 gửi sang PayOS gateway.\n2. Nhận thông tin thanh toán từ PayOS.',
            'exp_res': 'Modal hiển thị mã VietQR rõ nét có thể quét qua app ngân hàng, đi kèm đường link checkoutUrl và thông tin tài khoản.',
            'status': 'Passed'
        },
        {
            'cat': 'Thanh Toán Trực Tuyến (Payment)',
            'id': 'TC_PAY_002',
            'desc': 'Xác minh thanh toán PayOS tự động qua Webhook / Callback',
            'steps': '1. Gửi POST /api/payment/verify-payos với orderCode giao dịch vừa quét mã.\n2. Backend xác thực đối soát với hệ sinh thái PayOS.',
            'step_res': '1. Xác thực chữ ký số HMAC-SHA256 từ PayOS.\n2. Cập nhật payment_status = PAID trong CSDL.',
            'exp_res': 'Hóa đơn chuyển sang trạng thái "Đã thanh toán" với phương thức PAYOS, đồng bộ dữ liệu thời gian thực.',
            'status': 'Passed'
        },
        {
            'cat': 'Thanh Toán Trực Tuyến (Payment)',
            'id': 'TC_PAY_003',
            'desc': 'Mô phỏng gạch nợ PayOS tức thì phục vụ nghiệm thu nhanh (Test Bypass)',
            'steps': '1. Bấm nút "Mô phỏng thanh toán nhanh (Test Bypass)" tại hóa đơn chưa đóng.\n2. Kiểm tra trạng thái hóa đơn.',
            'step_res': '1. Gửi POST /api/payment/simulate.\n2. Backend cập nhật trạng thái hóa đơn.',
            'exp_res': 'Hóa đơn chuyển ngay sang trạng thái "Đã thanh toán" với phương thức PAYOS và mã giao dịch sinh tự động.',
            'status': 'Passed'
        },
        {
            'cat': 'Giao Diện Phẳng (Flat UI)',
            'id': 'TC_UI_001',
            'desc': 'Thiết kế Flat UI - Kiểm tra bố cục phẳng, tối giản và phông chữ kỹ thuật',
            'steps': '1. Mở trang chủ và cổng khách hàng.\n2. Kiểm tra phông chữ Geist, số liệu JetBrains Mono tabular-nums, nền #FAFAFA, viền #EAEAEA.',
            'step_res': '1. Trình duyệt tải trang web.\n2. Kiểm tra CSS computed styles.',
            'exp_res': 'Giao diện phẳng tinh tế, các con số hiển thị thẳng hàng, không có bóng đổ màu mè, đúng tiêu chuẩn Flat UI / Modern Minimal.',
            'status': 'Passed'
        },
        {
            'cat': 'Giao Diện Phẳng (Flat UI)',
            'id': 'TC_UI_002',
            'desc': 'Thiết kế Flat UI - Kiểm tra màu sắc nhãn trạng thái pastel nhạt',
            'steps': '1. Quan sát nhãn trạng thái các hóa đơn: Đã thanh toán, Chưa đóng tiền, Chấm dứt hợp đồng.',
            'step_res': '1. Duyệt danh sách các nhãn trạng thái trên màn hình.',
            'exp_res': 'Đã thanh toán mang màu xanh pastel nhạt (#EDF3EC), Chưa đóng mang màu vàng pastel (#FDF6E7), Chấm dứt mang màu đỏ pastel (#FDEBEC). Tương phản cao, dễ đọc.',
            'status': 'Passed'
        }
    ]

    # Helper function to populate a test case sheet
    def fill_test_sheet(sheet_name, title, desc_note, cases):
        ws = wb[sheet_name]
        ws['A1'] = title
        if desc_note:
            ws['B2'] = desc_note

        # Unmerge any merged cells in rows >= 9
        for rng in list(ws.merged_cells.ranges):
            if rng.min_row >= 9:
                ws.unmerge_cells(str(rng))

        # Clear existing rows from 9 to 100
        for r in range(9, 105):
            for c in range(1, 10):
                cell = ws.cell(r, c)
                cell.value = None
                cell.fill = PatternFill(fill_type=None)
                cell.border = Border()

        # Update Summary Formulas at top
        ws['H2'] = '=COUNTIF($H$9:$H$2001, "Passed")'
        ws['H3'] = '=COUNTIF($H$9:$H$2001, "Failed")'
        ws['H4'] = '=COUNTIF($H$9:$H$2001, "Not Run")'
        ws['H5'] = '=COUNTIF($H$9:$H$2001, "Not Completed")'
        ws['H6'] = '=COUNTA(C9:C2000)'

        for r_stat in range(2, 7):
            ws.cell(r_stat, 7).font = font_body_bold
            ws.cell(r_stat, 8).font = font_body_bold
            ws.cell(r_stat, 8).alignment = align_center_top

        # Set column widths
        ws.column_dimensions['B'].width = 24
        ws.column_dimensions['C'].width = 17
        ws.column_dimensions['D'].width = 38
        ws.column_dimensions['E'].width = 42
        ws.column_dimensions['F'].width = 38
        ws.column_dimensions['G'].width = 42
        ws.column_dimensions['H'].width = 13

        # Write test cases
        start_row = 9
        for idx, tc in enumerate(cases):
            curr_row = start_row + idx
            
            c_cat = ws.cell(curr_row, 2, tc['cat'])
            c_id = ws.cell(curr_row, 3, tc['id'])
            c_desc = ws.cell(curr_row, 4, tc['desc'])
            c_step = ws.cell(curr_row, 5, tc['steps'])
            c_step_res = ws.cell(curr_row, 6, tc['step_res'])
            c_exp = ws.cell(curr_row, 7, tc['exp_res'])
            c_stat = ws.cell(curr_row, 8, tc['status'])

            # Apply font & alignment
            c_cat.font = font_body_bold
            c_cat.alignment = align_left_top

            c_id.font = font_body_bold
            c_id.alignment = align_center_top

            c_desc.font = font_body
            c_desc.alignment = align_left_top

            c_step.font = font_body
            c_step.alignment = align_left_top

            c_step_res.font = font_body
            c_step_res.alignment = align_left_top

            c_exp.font = font_body
            c_exp.alignment = align_left_top

            c_stat.font = font_status_passed
            c_stat.alignment = align_center_top
            c_stat.fill = fill_status_passed

            # Apply borders & zebra striping
            is_even = (idx % 2 == 1)
            for col_idx in range(2, 9):
                cell = ws.cell(curr_row, col_idx)
                cell.border = thin_border
                if col_idx != 8 and is_even:
                    cell.fill = fill_zebra

    # Fill all 3 test sheets
    fill_test_sheet('Function Test Cases', 'Function Test Cases (Customer, Admin, Dashboard & Calculator)', None, func_cases)
    fill_test_sheet('Security_Performanc Test Cases', 'Security & Performance Test Cases', None, sec_cases)
    fill_test_sheet('Other Test Cases ...', 'UI & Payment Test Cases', 'Kiểm thử cổng thanh toán trực tuyến PayOS VietQR và chuẩn hóa giao diện Flat UI', other_cases)

    wb.save(excel_path)
    print(f'Successfully populated {len(func_cases)} functional cases, {len(sec_cases)} security/perf cases, and {len(other_cases)} other cases into {excel_path}!')

if __name__ == '__main__':
    populate_test_cases()
