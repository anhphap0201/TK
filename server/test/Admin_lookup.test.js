import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';

import { calculateElectricityBill } from '../src/calculator.js';
import { authRouter } from '../src/routes/auth.js';
import { customersRouter } from '../src/routes/customers.js';
import { tariffsRouter } from '../src/routes/tariffs.js';

describe('Module Admin - Quản lý khách hàng và biểu giá EVN', () => {
    let app;
    let server;
    let baseUrl;

    const uniqueId = () => `${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    before(async () => {
        app = express();
        app.use(express.json());

        app.use('/api/auth', authRouter);
        app.use('/api/customers', customersRouter);
        app.use('/api/tariffs', tariffsRouter);

        await new Promise((resolve, reject) => {
            server = app.listen(0, '127.0.0.1', () => {
                baseUrl = `http://127.0.0.1:${server.address().port}/api`;
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

    // Hàm hỗ trợ gửi request HTTP
    async function request(path, options = {}) {
        return fetch(`${baseUrl}${path}`, {
            ...options,
            headers: {
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                ...options.headers,
            },
        });
    }

    // Hàm tạo khách hàng test
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

        const res = await request('/customers', {
            method: 'POST',
            body: JSON.stringify(customer),
        });

        const resText = await res.clone().text();
        assert.equal(res.status, 201, `Tạo KH thất bại: HTTP ${res.status} - ${resText}`);
        return res.json();
    }

    async function deleteCustomer(id) {
        if (id === undefined || id === null) return;

        const res = await request(`/customers/${id}`, {
            method: 'DELETE',
        });

        assert.ok(
            [200, 404].includes(res.status),
            `Không thể dọn dữ liệu kiểm thử: HTTP ${res.status}`
        );
    }

    // ==================================================
    // NHÓM 1: ĐĂNG NHẬP ADMIN
    // ==================================================

    describe('Admin - Đăng nhập', () => {
        test('TC_ADMIN_001: Đăng nhập với mật khẩu đúng', async () => {
            const res = await request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    code: 'admin',
                    password: 'admin123',
                }),
            });

            assert.equal(res.status, 200);

            const data = await res.json();

            assert.equal(data.role, 'admin');
            assert.ok(data.token);
            assert.equal(data.user.name, 'Quản trị viên EVN');
        });

        test('TC_ADMIN_002: Đăng nhập với mật khẩu sai', async () => {
            const res = await request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    code: 'admin',
                    password: 'sai_mat_khau',
                }),
            });

            assert.equal(res.status, 401);

            const data = await res.json();

            assert.equal(
                data.error,
                'Mật khẩu quản trị viên không chính xác'
            );
        });
    });

    // ==================================================
    // NHÓM 2: TÌM KIẾM VÀ PHÂN TRANG
    // ==================================================

    describe('Admin - Tìm kiếm và phân trang khách hàng', () => {
        test('TC_ADMIN_003: Tìm kiếm khách hàng theo mã KH', async () => {
            const searchKey = `KH005_${uniqueId()}`;
            const customer = await createCustomer({
                customer_code: searchKey,
            });

            try {
                const res = await request(`/customers?q=${searchKey}`);

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
                const res = await request('/customers?q=Nguyễn');

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
            const page1Res = await request('/customers?page=1&limit=50');
            const page2Res = await request('/customers?page=2&limit=50');
            const page3Res = await request('/customers?page=3&limit=50');

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

    // ==================================================
    // NHÓM 3: THÊM VÀ SỬA KHÁCH HÀNG
    // ==================================================

    describe('Admin - Quản lý thông tin khách hàng', () => {
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

                const res = await request(`/customers/${customer.id}`);

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

                const res = await request('/customers', {
                    method: 'POST',
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

                const res = await request(`/customers/${customer.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(updatedInfo),
                });

                assert.equal(res.status, 200);

                const updated = await res.json();

                assert.equal(updated.phone, '0911223344');
                assert.equal(updated.address, 'Đà Nẵng');

                const verifyRes = await request(`/customers/${customer.id}`);

                assert.equal(verifyRes.status, 200);

                const saved = await verifyRes.json();

                assert.equal(saved.phone, '0911223344');
                assert.equal(saved.address, 'Đà Nẵng');
            } finally {
                await deleteCustomer(customer?.id);
            }
        });
    });

    // ==================================================
    // NHÓM 4: CẤU HÌNH BIỂU GIÁ EVN
    // ==================================================

    describe('Admin - Cấu hình biểu giá EVN', () => {
        test('TC_ADMIN_009: Cập nhật giá bậc 1 và VAT', async () => {
            const initialRes = await request('/tariffs');
            assert.equal(initialRes.status, 200);

            const initial = await initialRes.json();

            assert.equal(initial.tariffs.length, 6);

            try {
                const newTariffs = initial.tariffs.map(t => ({
                    tier: t.tier,
                    name: t.name,
                    rate: t.tier === 1 ? 1900 : t.rate,
                }));

                const res = await request('/tariffs', {
                    method: 'PUT',
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

                const verifyRes = await request('/tariffs');
                assert.equal(verifyRes.status, 200);

                const saved = await verifyRes.json();

                assert.equal(
                    saved.tariffs.find(t => t.tier === 1).rate,
                    1900
                );
                assert.equal(saved.vat_rate, 10);
            } finally {
                await request('/tariffs', {
                    method: 'PUT',
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
            const initialRes = await request('/tariffs');
            assert.equal(initialRes.status, 200);

            const initial = await initialRes.json();

            try {
                const changedTariffs = initial.tariffs.map(t => ({
                    tier: t.tier,
                    name: t.name,
                    rate: t.tier === 1 ? 1900 : t.rate,
                }));

                const updateRes = await request('/tariffs', {
                    method: 'PUT',
                    body: JSON.stringify({
                        tariffs: changedTariffs,
                        vat_rate: 10,
                    }),
                });

                assert.equal(updateRes.status, 200);

                const currentRes = await request('/tariffs');
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
                await request('/tariffs', {
                    method: 'PUT',
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
});