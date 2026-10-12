import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { readingsRouter } from '../src/routes/readings.js';
import { db } from '../src/db.js';

/**
 * PHẦN 1: BỘ KIỂM THỬ CHỨC NĂNG TRA CỨU TIỀN ĐIỆN & BẢO MẬT 2 LỚP (KHÁCH HÀNG)
 * Phụ trách: Tester 1 (Bạn)
 * Tham chiếu tài liệu: docs/Test_Cases_Chi_Tiet.md (Nhóm TC_LOOKUP_xxx, TC_SEC_xxx)
 */
describe('Module Khách Hàng: Tra Cứu Tiền Điện & Phân Quyền Bảo Mật SĐT', () => {
  let app;
  let server;
  let baseUrl;
  let sampleCust;

  before(async () => {
    // 1. Khởi tạo server test nội bộ
    app = express();
    app.use(express.json());
    app.use('/api/readings', readingsRouter);

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}/api/readings`;
        resolve();
      });
    });

    // 2. Lấy 1 khách hàng mẫu từ database để test
    sampleCust = db.prepare('SELECT * FROM customers WHERE customer_code = ?').get('KH0001');
    assert.ok(sampleCust, 'Cơ sở dữ liệu phải có khách hàng KH0001');
  });

  after(() => {
    if (server) server.close();
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
    const lowerCode = sampleCust.customer_code.toLowerCase(); // ví dụ: "kh0001"
    const res = await fetch(`${baseUrl}/customer/${lowerCode}`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.customer.customer_code, sampleCust.customer_code);
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

    // Mở khóa trọn bộ lịch sử nhiều kỳ (khách hàng có nhiều hơn 1 kỳ)
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
    // Thử truyền định dạng có gạch nối hoặc khoảng trắng: "088-498-0616"
    const rawDigits = sampleCust.phone.replace(/\D/g, '');
    const formattedPhone = `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 6)}-${rawDigits.slice(6)}`;

    const res = await fetch(`${baseUrl}/customer/${sampleCust.customer_code}?phone=${encodeURIComponent(formattedPhone)}`);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.is_authenticated, true, 'Hệ thống phải tự lọc bỏ dấu gạch nối và xác thực thành công');
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
