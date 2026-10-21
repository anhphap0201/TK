import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { readingsRouter } from '../../src/routes/readings.js';
import { db, initDatabase } from '../../src/db.js';

/**
 * Module Khách Hàng: Tra Cứu Thông Tin Cơ Bản
 * Tham chiếu tài liệu: docs/Test_Cases_Chi_Tiet.md
 */
describe('Khách Hàng - Tra cứu thông tin cơ bản', () => {
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

  test('TC_LOOKUP_001 & TC_LOOKUP_002: Tra cứu chỉ bằng Mã KH -> Ẩn thông tin cá nhân và chỉ trả 1 kỳ gần nhất', async () => {
    const res = await fetch(`${baseUrl}/customer/${sampleCust.customer_code}`);
    assert.equal(res.status, 200, 'HTTP Status phải là 200');

    const data = await res.json();

    // Kiểm tra cờ xác thực
    assert.equal(data.is_authenticated, false, 'Khi chỉ nhập Mã KH, cờ is_authenticated phải là false');

    // Kiểm tra thông tin cơ bản được phép hiển thị
    assert.equal(data.customer.customer_code, sampleCust.customer_code);
    assert.equal(data.customer.full_name, sampleCust.full_name);
    assert.equal(data.customer.status, sampleCust.status);

    // KIỂM TRA BẢO MẬT: Tuyệt đối không để lộ SĐT, Địa chỉ, Mã công tơ
    assert.equal(data.customer.phone, undefined, 'Trường phone phải bị ẩn khỏi API response');
    assert.equal(data.customer.address, undefined, 'Trường address phải bị ẩn khỏi API response');
    assert.equal(data.customer.meter_code, undefined, 'Trường meter_code phải bị ẩn khỏi API response');

    // Kiểm tra số lượng kỳ hóa đơn: chỉ duy nhất kỳ tháng này
    assert.equal(data.readings.length, 1, 'Chỉ được phép trả về duy nhất 1 hóa đơn kỳ gần nhất');
    assert.equal(data.readings[0].period, data.summary.latest_reading.period);
  });

  test('TC_LOOKUP_003: Tra cứu với Mã khách hàng không tồn tại -> Báo lỗi 404 thân thiện', async () => {
    const res = await fetch(`${baseUrl}/customer/KH9999`);
    assert.equal(res.status, 404, 'Mã không tồn tại phải trả về mã lỗi 404');

    const data = await res.json();
    assert.ok(data.error, 'Phải có trường error mô tả nguyên nhân');
    assert.match(data.error, /Không tìm thấy/i, 'Nội dung thông báo phải báo không tìm thấy khách hàng');
  });

  test('TC_LOOKUP_006: Tra cứu không phân biệt chữ hoa / chữ thường (Case-insensitive)', async () => {
    const lowerCode = sampleCust.customer_code.toLowerCase();
    const res = await fetch(`${baseUrl}/customer/${lowerCode}`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.customer.customer_code, sampleCust.customer_code);
  });
});
