import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { tariffsRouter } from '../../src/routes/tariffs.js';
import { calculateElectricityBill } from '../../src/calculator.js';
import { initDatabase } from '../../src/db.js';

/**
 * Module Admin: Cấu Hình Biểu Giá EVN & VAT
 * Tham chiếu tài liệu: docs/Test_Cases_Chi_Tiet.md
 */
describe('Admin - Cấu hình biểu giá EVN và VAT', () => {
  let app;
  let server;
  let baseUrl;

  before(async () => {
    initDatabase();

    app = express();
    app.use(express.json());
    app.use('/api/tariffs', tariffsRouter);

    await new Promise((resolve, reject) => {
      server = app.listen(0, '127.0.0.1', () => {
        baseUrl = `http://127.0.0.1:${server.address().port}/api/tariffs`;
        resolve();
      });
      server.on('error', reject);
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close(err => (err ? reject(err) : resolve()));
      });
    }
  });

  test('TC_ADMIN_009: Cập nhật giá bậc 1 và VAT', async () => {
    const initialRes = await fetch(baseUrl);
    assert.equal(initialRes.status, 200);

    const initial = await initialRes.json();
    assert.equal(initial.tariffs.length, 6);

    try {
      const newTariffs = initial.tariffs.map(t => ({
        tier: t.tier,
        name: t.name,
        rate: t.tier === 1 ? 1900 : t.rate,
      }));

      const res = await fetch(baseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tariffs: newTariffs,
          vat_rate: 10,
        }),
      });

      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.message, 'Cập nhật biểu giá thành công');
      assert.equal(data.tariffs.length, 6);
      assert.equal(
        data.tariffs.find(t => t.tier === 1).rate,
        1900
      );
      assert.equal(data.vat_rate, 10);

      const verifyRes = await fetch(baseUrl);
      assert.equal(verifyRes.status, 200);

      const saved = await verifyRes.json();
      assert.equal(
        saved.tariffs.find(t => t.tier === 1).rate,
        1900
      );
      assert.equal(saved.vat_rate, 10);
    } finally {
      await fetch(baseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tariffs: initial.tariffs.map(t => ({
            tier: t.tier,
            name: t.name,
            rate: t.rate,
          })),
          vat_rate: initial.vat_rate,
        }),
      });
    }
  });

  test('TC_ADMIN_010: Tính tiền điện với biểu giá và VAT mới', async () => {
    const initialRes = await fetch(baseUrl);
    assert.equal(initialRes.status, 200);

    const initial = await initialRes.json();

    try {
      const changedTariffs = initial.tariffs.map(t => ({
        tier: t.tier,
        name: t.name,
        rate: t.tier === 1 ? 1900 : t.rate,
      }));

      const updateRes = await fetch(baseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tariffs: changedTariffs,
          vat_rate: 10,
        }),
      });

      assert.equal(updateRes.status, 200);

      const currentRes = await fetch(baseUrl);
      assert.equal(currentRes.status, 200);

      const current = await currentRes.json();

      const bill = calculateElectricityBill(
        50,
        current.tariffs,
        current.vat_rate
      );

      assert.equal(bill.kwh, 50);
      assert.equal(bill.subtotal, 95000);
      assert.equal(bill.vatRate, 10);
      assert.equal(bill.vatAmount, 9500);
      assert.equal(bill.total, 104500);
    } finally {
      await fetch(baseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tariffs: initial.tariffs.map(t => ({
            tier: t.tier,
            name: t.name,
            rate: t.rate,
          })),
          vat_rate: initial.vat_rate,
        }),
      });
    }
  });
});
