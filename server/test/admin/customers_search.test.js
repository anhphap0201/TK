import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { customersRouter } from '../../src/routes/customers.js';
import { initDatabase } from '../../src/db.js';

/**
 * Module Admin: Tìm Kiếm & Phân Trang Khách Hàng
 * Tham chiếu tài liệu: docs/Test_Cases_Chi_Tiet.md
 */
describe('Admin - Tìm kiếm và phân trang khách hàng', () => {
  let app;
  let server;
  let baseUrl;

  const uniqueId = () => `${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  before(async () => {
    initDatabase();

    app = express();
    app.use(express.json());
    app.use('/api/customers', customersRouter);

    await new Promise((resolve, reject) => {
      server = app.listen(0, '127.0.0.1', () => {
        baseUrl = `http://127.0.0.1:${server.address().port}/api/customers`;
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

  async function createCustomer(overrides = {}) {
    const id = uniqueId();
    const customer = {
      customer_code: `KH_TEST_${id}`,
      full_name: 'Khach Hang Test',
      phone: '0988776655',
      address: 'Ha Noi',
      meter_code: `CT_TEST_${id}`,
      ...overrides,
    };

    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });

    const resText = await res.clone().text();
    assert.equal(res.status, 201, `Tạo KH thất bại: HTTP ${res.status} - ${resText}`);
    return res.json();
  }

  async function deleteCustomer(id) {
    if (id === undefined || id === null) return;
    const res = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    assert.ok(
      [200, 404].includes(res.status),
      `Không thể dọn dữ liệu kiểm thử: HTTP ${res.status}`
    );
  }

  test('TC_ADMIN_003: Tìm kiếm khách hàng theo mã KH', async () => {
    const searchKey = `KH005_${uniqueId()}`;
    const customer = await createCustomer({
      customer_code: searchKey,
    });

    try {
      const res = await fetch(`${baseUrl}?q=${searchKey}`);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.ok(Array.isArray(data.data));
      assert.ok(
        data.data.some(c => c.id === customer.id),
        'Không tìm thấy khách hàng phù hợp với từ khóa'
      );
    } finally {
      await deleteCustomer(customer.id);
    }
  });

  test('TC_ADMIN_004: Tìm kiếm khách hàng theo tên tiếng Việt', async () => {
    const customer = await createCustomer({
      full_name: `Nguyễn Văn Test ${uniqueId()}`,
    });

    try {
      const res = await fetch(`${baseUrl}?q=${encodeURIComponent('Nguyễn')}&limit=100`);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.ok(
        data.data.some(c => c.id === customer.id),
        'Không tìm thấy khách hàng có tên Nguyễn'
      );
    } finally {
      await deleteCustomer(customer.id);
    }
  });

  test('TC_ADMIN_005: Phân trang danh sách khách hàng', async () => {
    const page1Res = await fetch(`${baseUrl}?page=1&limit=50`);
    const page2Res = await fetch(`${baseUrl}?page=2&limit=50`);
    const page3Res = await fetch(`${baseUrl}?page=3&limit=50`);

    assert.equal(page1Res.status, 200);
    assert.equal(page2Res.status, 200);
    assert.equal(page3Res.status, 200);

    const page1 = await page1Res.json();
    const page2 = await page2Res.json();
    const page3 = await page3Res.json();

    assert.equal(page1.pagination.page, 1);
    assert.equal(page2.pagination.page, 2);
    assert.equal(page3.pagination.page, 3);

    assert.equal(page1.pagination.limit, 50);
    assert.equal(page2.pagination.limit, 50);
    assert.equal(page3.pagination.limit, 50);

    assert.ok(page1.data.length <= 50);
    assert.ok(page2.data.length <= 50);
    assert.ok(page3.data.length <= 50);

    if (page1.pagination.total >= 100) {
      const ids1 = page1.data.map(c => c.id);
      const ids2 = page2.data.map(c => c.id);
      const ids3 = page3.data.map(c => c.id);

      assert.equal(
        ids1.some(id => ids2.includes(id)),
        false,
        'Trang 1 và trang 2 bị trùng khách hàng'
      );

      assert.equal(
        ids2.some(id => ids3.includes(id)),
        false,
        'Trang 2 và trang 3 bị trùng khách hàng'
      );
    }
  });
});
