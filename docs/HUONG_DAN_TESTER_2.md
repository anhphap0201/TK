# HƯỚNG DẪN VIẾT BỘ TEST CASE TỰ ĐỘNG (DÀNH CHO TESTER 2)
## Phụ trách: Module Quản Trị Khách Hàng, Biểu Giá EVN & Tính Toán Tiền Điện

Tài liệu này hướng dẫn chi tiết cho thành viên thứ 2 trong nhóm cách viết file kiểm thử tự động `server/test/admin_tariffs.test.js` để kiểm thử các ca kiểm thử thuộc phần **Admin & Tính toán** theo đúng tài liệu [`docs/Test_Cases_Chi_Tiet.md`](../docs/Test_Cases_Chi_Tiet.md).

---

## 1. Mục Tiêu Kiểm Thử Của Tester 2

Tester 2 phụ trách 2 mảng chính:
1. **Kiểm thử đơn vị thuật toán tính tiền điện 6 bậc EVN & Thuế VAT** (Hàm `calculateElectricityBill` trong `server/src/calculator.js`).
2. **Kiểm thử tích hợp các API Quản trị viên (Admin)**:
   - Đăng nhập Admin thành công / thất bại (`TC_ADMIN_001`, `TC_ADMIN_002`).
   - Tìm kiếm và phân trang danh sách khách hàng (`TC_ADMIN_003`, `TC_ADMIN_005`).
   - Thêm mới khách hàng và bắt lỗi trùng lặp mã công tơ (`TC_ADMIN_006`, `TC_ADMIN_007`).
   - Cập nhật biểu giá 6 bậc và thuế VAT, kiểm tra tính toán động (`TC_ADMIN_009`, `TC_ADMIN_010`).

---

## 2. File Cần Tạo: `server/test/admin_tariffs.test.js`

Tạo mới file tại đường dẫn: `server/test/admin_tariffs.test.js` với mẫu code hoàn chỉnh sau đây:

```javascript
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { calculateElectricityBill } from '../src/calculator.js';
import { authRouter } from '../src/routes/auth.js';
import { customersRouter } from '../src/routes/customers.js';
import { tariffsRouter } from '../src/routes/tariffs.js';
import { db } from '../src/db.js';

describe('Module Admin & Tính Toán: Quản Trị Khách Hàng, Biểu Giá & Thuật Toán 6 Bậc', () => {
  let app;
  let server;
  let baseUrl;

  before(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
    app.use('/api/customers', customersRouter);
    app.use('/api/tariffs', tariffsRouter);

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}/api`;
        resolve();
      });
    });
  });

  after(() => {
    if (server) server.close();
  });

  // ==========================================
  // NHÓM 1: KIỂM THỬ THUẬT TOÁN TÍNH TOÁN 6 BẬC EVN
  // ==========================================
  describe('Kiểm thử thuật toán tính tiền điện (calculator.js)', () => {
    test('Tính tiền cho sản lượng 0 kWh -> Tiền điện bằng 0 đ', () => {
      const res = calculateElectricityBill(0);
      assert.equal(res.kwh, 0);
      assert.equal(res.subtotal, 0);
      assert.equal(res.total, 0);
    });

    test('Tính tiền trong phạm vi Bậc 1 (50 kWh đầu tiên, giá 1.893 đ/kWh, VAT 8%)', () => {
      const res = calculateElectricityBill(50);
      // Tiền trước thuế = 50 * 1893 = 94.650 đ
      assert.equal(res.subtotal, 94650);
      // Thuế VAT 8% = round(94650 * 0.08) = 7.572 đ
      assert.equal(res.vatAmount, 7572);
      // Tổng tiền = 94.650 + 7.572 = 102.222 đ
      assert.equal(res.total, 102222);
    });

    test('Tính tiền lũy kế nhiều bậc (VD: 250 kWh rơi vào bậc 1, 2, 3, 4)', () => {
      const res = calculateElectricityBill(250);
      assert.equal(res.kwh, 250);
      // Bậc 1 (50 kWh): 50 * 1893 = 94.650 đ
      // Bậc 2 (50 kWh): 50 * 1956 = 97.800 đ
      // Bậc 3 (100 kWh): 100 * 2271 = 227.100 đ
      // Bậc 4 (50 kWh): 50 * 2860 = 143.000 đ
      // Tổng subtotal = 94.650 + 97.800 + 227.100 + 143.000 = 562.550 đ
      assert.equal(res.subtotal, 562550);
      assert.equal(res.vatAmount, Math.round(562550 * 0.08));
      assert.equal(res.total, res.subtotal + res.vatAmount);
    });
  });

  // ==========================================
  // NHÓM 2: KIỂM THỬ XÁC THỰC ADMIN
  // ==========================================
  describe('Kiểm thử Đăng nhập Admin (auth.js)', () => {
    test('TC_ADMIN_001: Đăng nhập Admin với mật khẩu đúng (admin123) -> Cấp token thành công', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'admin', password: 'admin123' })
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.role, 'admin');
      assert.ok(data.token, 'Phải có token ủy quyền cho admin');
    });

    test('TC_ADMIN_002: Đăng nhập Admin với mật khẩu sai -> Trả về lỗi 401', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'admin', password: 'sai_mat_khau' })
      });
      assert.equal(res.status, 401);
      const data = await res.json();
      assert.match(data.error, /không chính xác/i);
    });
  });

  // ==========================================
  // NHÓM 3: KIỂM THỬ QUẢN LÝ KHÁCH HÀNG
  // ==========================================
  describe('Kiểm thử Quản lý khách hàng (customers.js)', () => {
    test('TC_ADMIN_003: Tìm kiếm khách hàng theo từ khóa (Mã KH)', async () => {
      const res = await fetch(`${baseUrl}/customers?q=KH0001`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(data.data.length >= 1, 'Phải tìm thấy khách hàng KH0001');
      assert.equal(data.data[0].customer_code, 'KH0001');
    });

    test('TC_ADMIN_005: Phân trang danh sách khách hàng (mặc định 50 khách/trang)', async () => {
      const res = await fetch(`${baseUrl}/customers?page=1&limit=50`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.pagination.page, 1);
      assert.equal(data.pagination.limit, 50);
      assert.equal(data.data.length, 50);
      assert.ok(data.pagination.total >= 1000, 'Tổng số khách hàng phải >= 1000');
    });

    test('TC_ADMIN_007: Bắt lỗi khi thêm khách hàng có mã công tơ đã tồn tại (UNIQUE constraint)', async () => {
      const existingMeter = 'CT0001';
      const res = await fetch(`${baseUrl}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_code: 'KH_DUPLICATE_TEST',
          full_name: 'Test Duplicate',
          phone: '0912345678',
          meter_code: existingMeter,
          address: 'Hà Nội'
        })
      });
      assert.equal(res.status, 500); // SQLite báo lỗi UNIQUE constraint
      const data = await res.json();
      assert.ok(data.error);
    });
  });

  // ==========================================
  // NHÓM 4: KIỂM THỬ CẤU HÌNH BIỂU GIÁ EVN
  // ==========================================
  describe('Kiểm thử Cấu hình biểu giá EVN (tariffs.js)', () => {
    test('TC_ADMIN_009: Lấy danh sách 6 bậc biểu giá hiện hành', async () => {
      const res = await fetch(`${baseUrl}/tariffs`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.tariffs.length, 6, 'Phải có đúng 6 bậc giá');
      assert.equal(data.vat_rate, 8, 'Thuế VAT mặc định là 8%');
    });
  });
});
```

---

## 3. Cách Chạy Kiểm Thử

Mở cửa sổ dòng lệnh (Terminal / PowerShell) tại thư mục gốc của dự án `KT/` và chạy:

```bash
npm --prefix server test
```

### Kết quả mong đợi khi chạy thành công:
Hệ thống sẽ chạy cả 2 file test:
1. `server/test/customer_lookup.test.js` (Phần Tester 1 phụ trách).
2. `server/test/admin_tariffs.test.js` (Phần Tester 2 phụ trách).

Tất cả các ca kiểm thử sẽ in ra dấu tích xanh `✔` với kết quả **100% Passed**.
