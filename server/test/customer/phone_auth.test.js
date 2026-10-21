import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { readingsRouter } from '../../src/routes/readings.js';
import { db, initDatabase } from '../../src/db.js';

/**
 * Module Khách Hàng: Xác Thực Số Điện Thoại & Bảo Mật 2 Lớp
 * Tham chiếu tài liệu: docs/Test_Cases_Chi_Tiet.md
 */
describe('Khách Hàng - Xác thực số điện thoại và bảo mật 2 lớp', () => {
  let app;
  let server;
  let baseUrl;
  let sampleCust;

  before(async () => {
    initDatabase();

    app = express();
    app.use(express.json());
    app.use('/api/readings', readingsRouter);

    await new Promise((resolve, reject) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}/api/readings`;
        resolve();
      });
      server.on('error', reject);
    });

    sampleCust = db.prepare('SELECT * FROM customers WHERE customer_code = ?').get('KH0001');
    assert.ok(sampleCust, 'Cơ sở dữ liệu phải có khách hàng KH0001 để kiểm thử');
  });

  after(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close(err => (err ? reject(err) : resolve()));
      });
    }
  });

  test('TC_LOOKUP_007: Xác thực đúng SĐT chính chủ -> Mở khóa toàn bộ thông tin cá nhân & lịch sử các kỳ', async () => {
    const cleanPhone = sampleCust.phone;
    const res = await fetch(`${baseUrl}/customer/${sampleCust.customer_code}?phone=${encodeURIComponent(cleanPhone)}`);
    assert.equal(res.status, 200);

    const data = await res.json();

    // Cờ xác thực chuyển sang true
    assert.equal(data.is_authenticated, true, 'Xác thực đúng SĐT thì is_authenticated phải là true');

    // Toàn bộ thông tin cá nhân được mở khóa đầy đủ
    assert.equal(data.customer.phone, sampleCust.phone, 'Số điện thoại phải hiển thị chính xác');
    assert.equal(data.customer.address, sampleCust.address, 'Địa chỉ phải hiển thị đầy đủ');
    assert.equal(data.customer.meter_code, sampleCust.meter_code, 'Mã công tơ phải hiển thị đầy đủ');

    // Mở khóa trọn bộ lịch sử nhiều kỳ
    assert.ok(data.readings.length > 1, `Khách hàng phải có nhiều kỳ lịch sử (thực tế: ${data.readings.length})`);
    assert.equal(data.summary.total_readings, data.readings.length);
  });

  test('TC_LOOKUP_008: Xác thực sai số điện thoại -> Giữ nguyên khóa và trả về dữ liệu bảo vệ', async () => {
    const wrongPhone = '0999888777';
    const res = await fetch(`${baseUrl}/customer/${sampleCust.customer_code}?phone=${wrongPhone}`);
    assert.equal(res.status, 200);

    const data = await res.json();

    // Không mở khóa
    assert.equal(data.is_authenticated, false, 'Sai số điện thoại thì is_authenticated phải là false');
    assert.equal(data.customer.phone, undefined, 'Không được lộ số điện thoại thật');
    assert.equal(data.customer.address, undefined, 'Không được lộ địa chỉ');
    assert.equal(data.readings.length, 1, 'Chỉ trả về 1 hóa đơn kỳ này, không lộ lịch sử');
  });

  test('TC_SEC_002: Chuẩn hóa số điện thoại chống sai lệch định dạng (dấu cách, gạch nối)', async () => {
    const rawDigits = sampleCust.phone.replace(/\D/g, '');
    const formattedPhone = `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 6)}-${rawDigits.slice(6)}`;

    const res = await fetch(`${baseUrl}/customer/${sampleCust.customer_code}?phone=${encodeURIComponent(formattedPhone)}`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.is_authenticated, true, 'Hệ thống phải tự lọc bỏ dấu gạch nối và xác thực thành công');
  });
});
