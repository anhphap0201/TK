import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { customersRouter } from '../../src/routes/customers.js';
import { initDatabase } from '../../src/db.js';

/**
 * Module Admin: Thêm & Quản Lý Thông Tin Khách Hàng
 * Tham chiếu tài liệu: docs/Test_Cases_Chi_Tiet.md
 */
describe('Admin - Quản lý thông tin khách hàng (CRUD)', () => {
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

  test('TC_ADMIN_006: Thêm khách hàng hợp lệ', async () => {
    let customer;

    try {
      customer = await createCustomer({
        full_name: 'Trần Văn Test',
        phone: '0988776655',
        address: 'Hà Nội',
      });

      assert.ok(customer.id);
      assert.match(customer.customer_code, /^KH_TEST_/);
      assert.equal(customer.full_name, 'Trần Văn Test');
      assert.equal(customer.address, 'Hà Nội');

      const res = await fetch(`${baseUrl}/${customer.id}`);
      assert.equal(res.status, 200);

      const saved = await res.json();
      assert.equal(saved.customer_code, customer.customer_code);
      assert.equal(saved.full_name, 'Trần Văn Test');
      assert.equal(saved.phone, '0988776655');
    } finally {
      await deleteCustomer(customer?.id);
    }
  });

  test('TC_ADMIN_007: Từ chối mã công tơ bị trùng', async () => {
    let original;

    try {
      original = await createCustomer();

      const duplicate = {
        customer_code: `KH_DUP_${uniqueId()}`,
        full_name: 'Khach Hang Trung Cong To',
        phone: '0911223344',
        address: 'Ha Noi',
        meter_code: original.meter_code,
      };

      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicate),
      });

      assert.equal(res.status, 400);

      const data = await res.json();
      assert.match(data.error, /mã công tơ đã tồn tại/i);
    } finally {
      await deleteCustomer(original?.id);
    }
  });

  test('TC_ADMIN_008: Cập nhật thông tin khách hàng', async () => {
    let customer;

    try {
      customer = await createCustomer();

      const updatedInfo = {
        customer_code: customer.customer_code,
        full_name: customer.full_name,
        phone: '0911223344',
        address: 'Đà Nẵng',
        meter_code: customer.meter_code,
        status: 'ACTIVE',
      };

      const res = await fetch(`${baseUrl}/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInfo),
      });

      assert.equal(res.status, 200);

      const updated = await res.json();
      assert.equal(updated.phone, '0911223344');
      assert.equal(updated.address, 'Đà Nẵng');

      const verifyRes = await fetch(`${baseUrl}/${customer.id}`);
      assert.equal(verifyRes.status, 200);

      const saved = await verifyRes.json();
      assert.equal(saved.phone, '0911223344');
      assert.equal(saved.address, 'Đà Nẵng');
    } finally {
      await deleteCustomer(customer?.id);
    }
  });
});
