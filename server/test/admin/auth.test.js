import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { authRouter } from '../../src/routes/auth.js';
import { initDatabase } from '../../src/db.js';

/**
 * Module Admin: Xác Thực Quản Trị Viên
 * Tham chiếu tài liệu: docs/Test_Cases_Chi_Tiet.md
 */
describe('Admin - Xác thực và đăng nhập', () => {
  let app;
  let server;
  let baseUrl;

  before(async () => {
    initDatabase();

    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);

    await new Promise((resolve, reject) => {
      server = app.listen(0, '127.0.0.1', () => {
        baseUrl = `http://127.0.0.1:${server.address().port}/api/auth`;
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

  test('TC_ADMIN_001: Đăng nhập với mật khẩu đúng', async () => {
    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'admin',
        password: 'admin123'
      })
    });

    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.role, 'admin');
    assert.ok(data.token);
    assert.equal(data.user.name, 'Quản trị viên EVN');
  });

  test('TC_ADMIN_002: Đăng nhập với mật khẩu sai', async () => {
    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'admin',
        password: 'sai_mat_khau'
      })
    });

    assert.equal(res.status, 401);

    const data = await res.json();
    assert.equal(data.error, 'Mật khẩu quản trị viên không chính xác');
  });
});
