
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';

import { calculateElectricityBill } from '../src/calculator.js';
import { authRouter } from '../src/routes/auth.js';
import { customersRouter } from '../src/routes/customers.js';
import { tariffsRouter } from '../src/routes/tariffs.js';
import { db, initDatabase } from '../src/db.js';

/**
 * PHẦN 2: BỘ KIỂM THỬ QUẢN TRỊ KHÁCH HÀNG,
 * BIỂU GIÁ EVN VÀ THUẬT TOÁN TÍNH TIỀN ĐIỆN
 *
 * Phụ trách: Tester 2
 * Tham chiếu: docs/Test_Cases_Chi_Tiet.md
 */

describe('Module Admin: Quản lý khách hàng, biểu giá và tính tiền điện', () => {
  let app;
  let server;
  let baseUrl;
  let sampleCust;

  before(async () => {
    // 1. Khởi tạo database và các bảng mặc định
    initDatabase();

    // 2. Khởi tạo server test nội bộ
    app = express();
    app.use(express.json());

    app.use('/api/auth', authRouter);
    app.use('/api/customers', customersRouter);
    app.use('/api/tariffs', tariffsRouter);

    await new Promise((resolve, reject) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}/api`;
        resolve();
      });

      server.on('error', reject);
    });

    // 3. Lấy khách hàng mẫu từ database
    sampleCust = db.prepare(
      'SELECT * FROM customers WHERE customer_code = ?'
    ).get('KH0001');

    assert.ok(
      sampleCust,
      'Database phải có khách hàng KH0001 để kiểm thử'
    );
  });

  after(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  });

  // ==================================================
  // PHẦN 1: KIỂM THỬ THUẬT TOÁN TÍNH TIỀN ĐIỆN
  // ==================================================

  describe('Kiểm thử thuật toán calculateElectricityBill()', () => {
    test('Tính tiền điện 0 kWh -> Tổng tiền bằng 0', () => {
      const result = calculateElectricityBill(0);

      assert.equal(result.kwh, 0);
      assert.equal(result.subtotal, 0);
      assert.equal(result.vatAmount, 0);
      assert.equal(result.total, 0);
    });

    test('Tính tiền điện 50 kWh thuộc bậc 1', () => {
      const result = calculateElectricityBill(50);

      assert.equal(result.subtotal, 94650);
      assert.equal(result.vatAmount, 7572);
      assert.equal(result.total, 102222);

      assert.equal(result.tiers.length, 6);
      assert.equal(result.tiers[0].kwh, 50);
    });

    test('Tính tiền điện 250 kWh qua 4 bậc đầu tiên', () => {
      const result = calculateElectricityBill(250);

      // Bậc 1: 50 * 1893 = 94.650
      // Bậc 2: 50 * 1956 = 97.800
      // Bậc 3: 100 * 2271 = 227.100
      // Bậc 4: 50 * 2860 = 143.000

      assert.equal(result.kwh, 250);
      assert.equal(result.subtotal, 562550);
      assert.equal(result.vatRate, 8);
      assert.equal(result.vatAmount, 45004);
      assert.equal(result.total, 607554);

      assert.equal(result.tiers.length, 6);
      assert.equal(result.tiers[0].kwh, 50);
      assert.equal(result.tiers[1].kwh, 50);
      assert.equal(result.tiers[2].kwh, 100);
      assert.equal(result.tiers[3].kwh, 50);
    });
  });

  // ==================================================
  // PHẦN 2: KIỂM THỬ ĐĂNG NHẬP ADMIN
  // ==================================================

  describe('Kiểm thử xác thực Admin', () => {
    test('TC_ADMIN_001: Đăng nhập đúng mật khẩu -> Trả về token', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: 'admin',
          password: 'admin123'
        })
      });

      assert.equal(res.status, 200);

      const data = await res.json();

      assert.equal(data.role, 'admin');
      assert.equal(data.token, 'admin-authorized-token');
      assert.ok(data.user);
    });

    test('TC_ADMIN_002: Đăng nhập sai mật khẩu -> Trả về HTTP 401', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: 'admin',
          password: 'sai_mat_khau'
        })
      });

      assert.equal(res.status, 401);

      const data = await res.json();

      assert.ok(data.error);
      assert.match(data.error, /không chính xác/i);
    });
  });

  // ==================================================
  // PHẦN 3: KIỂM THỬ QUẢN LÝ KHÁCH HÀNG
  // ==================================================

  describe('Kiểm thử quản lý khách hàng', () => {
    test('TC_ADMIN_003: Tìm kiếm khách hàng theo mã KH', async () => {
      const res = await fetch(
        `${baseUrl}/customers?q=${sampleCust.customer_code}`
      );

      assert.equal(res.status, 200);

      const data = await res.json();

      assert.ok(Array.isArray(data.data));
      assert.ok(data.data.length >= 1);

      assert.ok(
        data.data.some(
          (customer) =>
            customer.customer_code === sampleCust.customer_code
        )
      );
    });

    test('TC_ADMIN_005: Phân trang danh sách khách hàng', async () => {
      const res = await fetch(
        `${baseUrl}/customers?page=1&limit=50`
      );

      assert.equal(res.status, 200);

      const data = await res.json();

      assert.equal(data.pagination.page, 1);
      assert.equal(data.pagination.limit, 50);
      assert.ok(data.data.length <= 50);
      assert.equal(
        data.data.length,
        Math.min(50, data.pagination.total)
      );

      assert.ok(data.pagination.total >= 1000);
      assert.equal(
        data.pagination.totalPages,
        Math.ceil(data.pagination.total / 50)
      );
    });

    test('TC_ADMIN_006: Thêm khách hàng mới thành công', async () => {
      const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;

      const customer = {
        customer_code: `KH_TEST_${uniqueId}`,
        full_name: 'Khach Hang Test',
        phone: '0912345678',
        address: 'Ha Noi',
        meter_code: `CT_TEST_${uniqueId}`,
        contract_start_date: '2026-01-01'
      };

      let createdCustomer;

      try {
        const res = await fetch(`${baseUrl}/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(customer)
        });

        assert.equal(res.status, 201);

        const data = await res.json();
        createdCustomer = data;

        assert.ok(data.id);
        assert.equal(data.customer_code, customer.customer_code);
        assert.equal(data.full_name, customer.full_name);
        assert.equal(data.phone, customer.phone);
        assert.equal(data.meter_code, customer.meter_code);
      } finally {
        // Dọn dữ liệu test để không ảnh hưởng lần chạy sau
        db.prepare(
          'DELETE FROM customers WHERE customer_code = ?'
        ).run(customer.customer_code);
      }
    });

    test('TC_ADMIN_007: Thêm khách hàng với mã công tơ đã tồn tại', async () => {
      // Lấy một mã công tơ đang tồn tại trong database
      const existingMeter = db.prepare(`
        SELECT meter_code
        FROM customers
        WHERE meter_code IS NOT NULL
        LIMIT 1
      `).get();

      assert.ok(
        existingMeter,
        'Database phải có ít nhất một mã công tơ để kiểm thử trùng lặp'
      );

      const customer = {
        customer_code: `KH_DUP_${Date.now()}`,
        full_name: 'Khach Hang Trung Ma Cong To',
        phone: '0912345678',
        address: 'Ha Noi',
        meter_code: existingMeter.meter_code
      };

      const res = await fetch(`${baseUrl}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
      });

      // customers.js trả HTTP 400 khi vi phạm UNIQUE
      assert.equal(res.status, 400);

      const data = await res.json();

      assert.match(data.error, /đã tồn tại/i);

      // Không được tạo khách hàng mới khi mã công tơ bị trùng
      const created = db.prepare(
        'SELECT * FROM customers WHERE customer_code = ?'
      ).get(customer.customer_code);

      assert.equal(created, undefined);
    });
  });

  // ==================================================
  // PHẦN 4: KIỂM THỬ BIỂU GIÁ EVN VÀ VAT
  // ==================================================

  describe('Kiểm thử cấu hình biểu giá EVN', () => {
    test('TC_ADMIN_009: Lấy danh sách 6 bậc giá và thuế VAT', async () => {
      const res = await fetch(`${baseUrl}/tariffs`);

      assert.equal(res.status, 200);

      const data = await res.json();

      assert.equal(data.tariffs.length, 6);
      assert.equal(data.vat_rate, 8);

      // Các bậc giá phải được sắp xếp tăng dần
      for (let i = 0; i < data.tariffs.length; i++) {
        assert.equal(data.tariffs[i].tier, i + 1);
      }

      assert.equal(data.tariffs[0].rate, 1893);
      assert.equal(data.tariffs[1].rate, 1956);
      assert.equal(data.tariffs[2].rate, 2271);
      assert.equal(data.tariffs[3].rate, 2860);
      assert.equal(data.tariffs[4].rate, 3197);
      assert.equal(data.tariffs[5].rate, 3302);
    });

    test('TC_ADMIN_010: Cập nhật biểu giá và VAT, sau đó kiểm tra tính toán', async () => {
      // Lưu cấu hình ban đầu để khôi phục sau khi test
      const originalResponse = await fetch(`${baseUrl}/tariffs`);

      assert.equal(originalResponse.status, 200);

      const originalData = await originalResponse.json();

      const originalTariffs = originalData.tariffs.map((tariff) => ({
        tier: tariff.tier,
        rate: tariff.rate,
        name: tariff.name
      }));

      const originalVat = originalData.vat_rate;

      try {
        // Thay đổi nhẹ giá từng bậc và VAT để kiểm tra API PUT
        const changedTariffs = originalTariffs.map((tariff) => ({
          ...tariff,
          rate: tariff.rate + 1
        }));

        const changedVat = originalVat + 1;

        const updateResponse = await fetch(`${baseUrl}/tariffs`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tariffs: changedTariffs,
            vat_rate: changedVat
          })
        });

        assert.equal(updateResponse.status, 200);

        const updatedData = await updateResponse.json();

        assert.equal(updatedData.vat_rate, changedVat);
        assert.equal(updatedData.tariffs.length, 6);

        for (let i = 0; i < changedTariffs.length; i++) {
          assert.equal(
            updatedData.tariffs[i].rate,
            changedTariffs[i].rate
          );
        }

        // Tính toán với cấu hình vừa cập nhật
        const bill = calculateElectricityBill(
          250,
          updatedData.tariffs,
          updatedData.vat_rate
        );

        const expectedSubtotal =
          50 * changedTariffs[0].rate +
          50 * changedTariffs[1].rate +
          100 * changedTariffs[2].rate +
          50 * changedTariffs[3].rate;

        const expectedVat = Math.round(
          expectedSubtotal * changedVat / 100
        );

        assert.equal(bill.subtotal, expectedSubtotal);
        assert.equal(bill.vatRate, changedVat);
        assert.equal(bill.vatAmount, expectedVat);
        assert.equal(bill.total, expectedSubtotal + expectedVat);
      } finally {
        // Luôn khôi phục biểu giá và VAT ban đầu
        const restoreResponse = await fetch(`${baseUrl}/tariffs`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tariffs: originalTariffs,
            vat_rate: originalVat
          })
        });

        assert.equal(
          restoreResponse.status,
          200,
          'Phải khôi phục được biểu giá và VAT ban đầu'
        );
      }
    });
  });
});
