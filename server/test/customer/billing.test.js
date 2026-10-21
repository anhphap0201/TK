import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { readingsRouter } from '../../src/routes/readings.js';
import { db, initDatabase } from '../../src/db.js';

/**
 * Module Khách Hàng: Bóc Tách Chi Tiết Hóa Đơn & Bậc Giá EVN
 * Tham chiếu tài liệu: docs/Test_Cases_Chi_Tiet.md
 */
describe('Khách Hàng - Chi tiết hóa đơn và phân tách 6 bậc EVN', () => {
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

  test('TC_LOOKUP_011: Mỗi kỳ hóa đơn trả về đều phải chứa bảng phân tích 6 bậc EVN hợp lệ', async () => {
    const res = await fetch(`${baseUrl}/customer/${sampleCust.customer_code}?phone=${sampleCust.phone}`);
    const data = await res.json();

    const firstReading = data.readings[0];
    assert.ok(firstReading, 'Phải có bản ghi hóa đơn');
    assert.ok(Array.isArray(firstReading.tier_details), 'Hóa đơn phải có tier_details dạng mảng');
    assert.equal(firstReading.tier_details.length, 6, 'Biểu giá phải có đủ 6 bậc');

    // Tổng tiền thanh toán = tiền trước thuế + tiền VAT
    assert.equal(
      firstReading.total_amount,
      firstReading.subtotal + firstReading.vat_amount,
      'Tổng tiền phải bằng subtotal + vat_amount'
    );
  });
});
