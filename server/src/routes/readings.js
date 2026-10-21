import { Router } from 'express';
import { db } from '../db.js';
import { calculateElectricityBill } from '../calculator.js';

export const readingsRouter = Router();

function getCurrentTariffsAndVat() {
  const tariffs = db.prepare('SELECT * FROM tariffs ORDER BY tier ASC').all();
  const vatRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('vat_rate');
  const vatRate = vatRow ? Number(vatRow.value) : 8;
  return { tariffs, vatRate };
}

// Tra cứu lịch sử tiền điện theo Mã khách hàng hoặc Customer ID
// TÍNH TOÁN ĐỘNG (Dynamic Calculation) tại thời điểm tra cứu
readingsRouter.get('/customer/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;

    // Tìm khách hàng theo ID hoặc customer_code
    let customer = null;
    if (/^\d+$/.test(identifier)) {
      customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(identifier);
    } else {
      customer = db.prepare('SELECT * FROM customers WHERE UPPER(customer_code) = UPPER(?)').get(identifier);
    }

    if (!customer) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin khách hàng' });
    }

    const rawReadings = db.prepare(`
      SELECT * FROM readings 
      WHERE customer_id = ? 
      ORDER BY period DESC, id DESC
    `).all(customer.id);

    const { tariffs, vatRate } = getCurrentTariffsAndVat();
    const phoneQuery = req.query.phone ? String(req.query.phone).trim() : null;
    const adminQuery = req.query.admin === 'true' || req.headers['x-admin-token'] || req.headers['authorization'];

    // Kiểm tra quyền truy cập:
    // 1. Quản trị viên (admin=true) có toàn quyền xem lịch sử và thông số cá nhân
    // 2. Khách hàng chính chủ (xác thực số điện thoại)
    const isAuthenticated = Boolean(
      adminQuery || (
        phoneQuery && customer.phone && (
          phoneQuery === customer.phone.trim() ||
          phoneQuery.replace(/\D/g, '') === customer.phone.replace(/\D/g, '')
        )
      )
    );

    // Tính toán động tiền điện từng kỳ
    let unpaidTotalAmount = 0;
    let unpaidCount = 0;
    let totalKwh = 0;

    const computedReadings = rawReadings.map((r) => {
      const bill = calculateElectricityBill(r.kwh, tariffs, vatRate);
      totalKwh += r.kwh;

      if (r.payment_status === 'UNPAID') {
        unpaidCount += 1;
        unpaidTotalAmount += bill.total;
      }

      return {
        ...r,
        subtotal: bill.subtotal,
        vat_rate: bill.vatRate,
        vat_amount: bill.vatAmount,
        total_amount: bill.total,
        tier_details: bill.tiers,
      };
    });

    const latestReading = computedReadings[0] || null;

    if (!isAuthenticated) {
      // Khi chỉ nhập Mã KH:
      // - Chỉ hiển thị Tên, Mã khách hàng, Trạng thái (không lộ SĐT, Địa chỉ, Mã công tơ)
      // - Chỉ trả về hóa đơn kỳ hiện tại (tháng đấy), không cho xem lịch sử cũ
      const currentMonthReadings = latestReading ? [latestReading] : [];
      const currentUnpaidAmount = latestReading && latestReading.payment_status === 'UNPAID' ? latestReading.total_amount : 0;
      const currentUnpaidCount = latestReading && latestReading.payment_status === 'UNPAID' ? 1 : 0;

      return res.json({
        is_authenticated: false,
        customer: {
          id: customer.id,
          customer_code: customer.customer_code,
          full_name: customer.full_name,
          status: customer.status,
        },
        summary: {
          unpaid_count: currentUnpaidCount,
          unpaid_total_amount: currentUnpaidAmount,
          latest_reading: latestReading,
          total_readings: 1,
        },
        readings: currentMonthReadings,
      });
    }

    // Đã nhập đúng số điện thoại: cho phép xem toàn bộ thông tin cá nhân và đầy đủ lịch sử
    const avgKwh = rawReadings.length > 0 ? Number((totalKwh / rawReadings.length).toFixed(1)) : 0;

    res.json({
      is_authenticated: true,
      customer,
      summary: {
        total_readings: rawReadings.length,
        total_kwh: Number(totalKwh.toFixed(1)),
        avg_kwh: avgKwh,
        unpaid_count: unpaidCount,
        unpaid_total_amount: unpaidTotalAmount,
        latest_reading: latestReading,
      },
      readings: computedReadings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Thêm bản ghi chỉ số mới cho khách hàng
readingsRouter.post('/', (req, res) => {
  try {
    const { customer_id, period, reading_date, prev_index, current_index, kwh, note } = req.body;

    if (!customer_id || !reading_date) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    let actualKwh = 0;
    const prevNum = parseFloat(prev_index) || 0;
    const currNum = parseFloat(current_index) || 0;

    if (kwh !== undefined && kwh !== null && kwh !== '') {
      actualKwh = Math.max(0, parseFloat(kwh));
    } else {
      actualKwh = Math.max(0, currNum - prevNum);
    }

    const safePeriod = period || reading_date.substring(0, 7);

    const insert = db.prepare(`
      INSERT INTO readings (
        customer_id, period, reading_date, prev_index, current_index, kwh, note
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      customer_id,
      safePeriod,
      reading_date,
      prevNum,
      currNum,
      actualKwh,
      note?.trim() || null
    );

    const created = db.prepare('SELECT * FROM readings WHERE id = ?').get(result.lastInsertRowid);
    const { tariffs, vatRate } = getCurrentTariffsAndVat();
    const bill = calculateElectricityBill(created.kwh, tariffs, vatRate);

    res.status(201).json({
      ...created,
      subtotal: bill.subtotal,
      vat_rate: bill.vatRate,
      vat_amount: bill.vatAmount,
      total_amount: bill.total,
      tier_details: bill.tiers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Cập nhật bản ghi
readingsRouter.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { period, reading_date, prev_index, current_index, kwh, payment_status, note } = req.body;

    const prevNum = parseFloat(prev_index) || 0;
    const currNum = parseFloat(current_index) || 0;
    const actualKwh = kwh !== undefined ? parseFloat(kwh) : Math.max(0, currNum - prevNum);

    const update = db.prepare(`
      UPDATE readings SET
        period = ?,
        reading_date = ?,
        prev_index = ?,
        current_index = ?,
        kwh = ?,
        payment_status = COALESCE(?, payment_status),
        note = ?
      WHERE id = ?
    `);

    const result = update.run(
      period,
      reading_date,
      prevNum,
      currNum,
      actualKwh,
      payment_status || null,
      note?.trim() || null,
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bản ghi' });
    }

    const updated = db.prepare('SELECT * FROM readings WHERE id = ?').get(id);
    const { tariffs, vatRate } = getCurrentTariffsAndVat();
    const bill = calculateElectricityBill(updated.kwh, tariffs, vatRate);

    res.json({
      ...updated,
      subtotal: bill.subtotal,
      vat_rate: bill.vatRate,
      vat_amount: bill.vatAmount,
      total_amount: bill.total,
      tier_details: bill.tiers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Xoá bản ghi
readingsRouter.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const del = db.prepare('DELETE FROM readings WHERE id = ?');
    const result = del.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bản ghi' });
    }

    res.json({ message: 'Đã xoá bản ghi thành công', id: Number(id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
