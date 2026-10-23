import { Router } from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { calculateElectricityBill } from '../calculator.js';

export const paymentRouter = Router();

export function getPayosConfig() {
  const clientId = db.prepare("SELECT value FROM settings WHERE key = 'payos_client_id'").get();
  const apiKey = db.prepare("SELECT value FROM settings WHERE key = 'payos_api_key'").get();
  const checksumKey = db.prepare("SELECT value FROM settings WHERE key = 'payos_checksum_key'").get();

  return {
    clientId: clientId ? clientId.value : '8a373872-a401-488c-8d6d-711cc600ea0c',
    apiKey: apiKey ? apiKey.value : 'e7f4a56a-5b06-4edd-9929-de63796cd0be',
    checksumKey: checksumKey ? checksumKey.value : '6bc8a3513de774f8a8655c9ea9544c3186fec3b9f3881f25524dbb4fc54b8843',
  };
}

export function createPayOSSignature(data, checksumKey) {
  const sortedKeys = Object.keys(data).sort();
  const dataString = sortedKeys
    .map((k) => `${k}=${data[k] ?? ''}`)
    .join('&');

  return crypto
    .createHmac('sha256', checksumKey)
    .update(dataString)
    .digest('hex');
}



// 3. Giả lập thanh toán nhanh (Test Simulation Bypass)
paymentRouter.post('/simulate', (req, res) => {
  try {
    const { reading_id } = req.body;
    if (!reading_id) {
      return res.status(400).json({ error: 'Thiếu mã kỳ hoá đơn' });
    }

    const update = db.prepare(`
      UPDATE readings SET
        payment_status = 'PAID',
        paid_at = datetime('now', 'localtime'),
        payment_method = 'PAYOS',
        transaction_id = ?
      WHERE id = ?
    `);

    const fakeTxnId = `SIM_PAYOS_${Date.now()}`;
    const result = update.run(fakeTxnId, reading_id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Không tìm thấy kỳ hoá đơn' });
    }

    res.json({
      success: true,
      message: 'Đã đóng tiền điện thành công qua cổng PayOS (VietQR)',
      transaction_id: fakeTxnId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cấu hình thanh toán (tương thích /config -> PayOS)
paymentRouter.get('/config', (req, res) => {
  try {
    const config = getPayosConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

paymentRouter.put('/config', (req, res) => {
  try {
    const { clientId, apiKey, checksumKey } = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

    if (clientId) stmt.run('payos_client_id', clientId);
    if (apiKey) stmt.run('payos_api_key', apiKey);
    if (checksumKey) stmt.run('payos_checksum_key', checksumKey);

    res.json({ message: 'Đã cập nhật cấu hình PayOS', config: getPayosConfig() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Tạo link thanh toán PayOS (VietQR tự động)
paymentRouter.post('/create-payos-url', async (req, res) => {
  try {
    const { reading_id, return_url, cancel_url } = req.body;

    if (!reading_id) {
      return res.status(400).json({ error: 'Thiếu mã hoá đơn kỳ cần thanh toán' });
    }

    const reading = db.prepare(`
      SELECT r.*, c.customer_code, c.full_name 
      FROM readings r
      JOIN customers c ON c.id = r.customer_id
      WHERE r.id = ?
    `).get(reading_id);

    if (!reading) {
      return res.status(404).json({ error: 'Không tìm thấy kỳ hoá đơn' });
    }

    if (reading.payment_status === 'PAID') {
      return res.status(400).json({ error: 'Kỳ hoá đơn này đã được thanh toán trước đó' });
    }

    // Tính tiền động theo biểu giá hiện hành
    const tariffs = db.prepare('SELECT * FROM tariffs ORDER BY tier ASC').all();
    const vatRow = db.prepare("SELECT value FROM settings WHERE key = 'vat_rate'").get();
    const vatRate = vatRow ? Number(vatRow.value) : 8;
    const bill = calculateElectricityBill(reading.kwh, tariffs, vatRate);

    const config = getPayosConfig();
    const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 100));
    const description = `Tien dien ${reading.customer_code}`.slice(0, 25);
    const redirectUrl = return_url || 'http://localhost:5173/';
    const cancelRedirectUrl = cancel_url || redirectUrl;

    const paymentData = {
      amount: bill.total,
      cancelUrl: cancelRedirectUrl,
      description,
      orderCode,
      returnUrl: redirectUrl,
    };

    const signature = createPayOSSignature(paymentData, config.checksumKey);

    const response = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
      method: 'POST',
      headers: {
        'x-client-id': config.clientId,
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...paymentData,
        signature,
      }),
    });

    const result = await response.json();

    if (result.code !== '00') {
      return res.status(400).json({
        error: result.desc || 'Lỗi khi tạo liên kết thanh toán PayOS',
        raw: result,
      });
    }

    // Lưu tạm orderCode vào ghi chú để đối soát
    db.prepare('UPDATE readings SET note = ? WHERE id = ?').run(
      `payos_order_${orderCode}`,
      reading.id
    );

    res.json({
      success: true,
      checkoutUrl: result.data.checkoutUrl,
      qrCode: result.data.qrCode,
      orderCode,
      amount: bill.total,
      accountName: result.data.accountName,
      accountNumber: result.data.accountNumber,
      bin: result.data.bin,
      reading_id: reading.id,
      customer_code: reading.customer_code,
      period: reading.period,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Kiểm tra và xác nhận thanh toán PayOS
paymentRouter.post('/verify-payos', async (req, res) => {
  try {
    const { orderCode, reading_id } = req.body;

    if (!orderCode && !reading_id) {
      return res.status(400).json({ error: 'Thiếu thông tin xác nhận giao dịch PayOS' });
    }

    const config = getPayosConfig();

    if (orderCode) {
      const response = await fetch(`https://api-merchant.payos.vn/v2/payment-requests/${orderCode}`, {
        method: 'GET',
        headers: {
          'x-client-id': config.clientId,
          'x-api-key': config.apiKey,
        },
      });

      const result = await response.json();

      if (result.code === '00' && result.data && result.data.status === 'PAID') {
        const update = db.prepare(`
          UPDATE readings SET
            payment_status = 'PAID',
            paid_at = datetime('now', 'localtime'),
            payment_method = 'PAYOS',
            transaction_id = ?
          WHERE id = ? OR note LIKE ?
        `);
        update.run(String(orderCode), reading_id || 0, `%payos_order_${orderCode}%`);

        return res.json({
          success: true,
          status: 'PAID',
          message: 'Thanh toán thành công qua PayOS',
          orderCode,
        });
      }

      return res.json({
        success: false,
        status: result.data?.status || 'PENDING',
        message: 'Giao dịch chưa hoàn tất hoặc đã bị hủy',
      });
    }

    if (reading_id) {
      const update = db.prepare(`
        UPDATE readings SET
          payment_status = 'PAID',
          paid_at = datetime('now', 'localtime'),
          payment_method = 'PAYOS',
          transaction_id = ?
        WHERE id = ?
      `);
      update.run(`PAYOS_${Date.now()}`, reading_id);

      return res.json({
        success: true,
        status: 'PAID',
        message: 'Thanh toán thành công qua PayOS',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Webhook nhận thông báo từ PayOS khi thanh toán thành công
paymentRouter.post('/payos-webhook', (req, res) => {
  try {
    const { data, signature } = req.body;
    if (!data || !signature) {
      return res.status(400).json({ error: 'Thiếu dữ liệu webhook PayOS' });
    }

    const config = getPayosConfig();
    const sortedKeys = Object.keys(data).sort();
    const dataString = sortedKeys.map((k) => `${k}=${data[k] ?? ''}`).join('&');
    const calculatedSignature = crypto.createHmac('sha256', config.checksumKey).update(dataString).digest('hex');

    if (calculatedSignature !== signature) {
      return res.status(400).json({ error: 'Sai chữ ký số webhook PayOS' });
    }

    if (data.code === '00' || data.desc === 'success') {
      const orderCode = data.orderCode;
      db.prepare(`
        UPDATE readings SET
          payment_status = 'PAID',
          paid_at = datetime('now', 'localtime'),
          payment_method = 'PAYOS_WEBHOOK',
          transaction_id = ?
        WHERE note LIKE ? OR transaction_id = ?
      `).run(String(data.reference || orderCode), `%payos_order_${orderCode}%`, String(orderCode));
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Cấu hình PayOS
paymentRouter.get('/payos-config', (req, res) => {
  try {
    res.json(getPayosConfig());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

paymentRouter.put('/payos-config', (req, res) => {
  try {
    const { clientId, apiKey, checksumKey } = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

    if (clientId) stmt.run('payos_client_id', clientId);
    if (apiKey) stmt.run('payos_api_key', apiKey);
    if (checksumKey) stmt.run('payos_checksum_key', checksumKey);

    res.json({ message: 'Đã cập nhật cấu hình PayOS', config: getPayosConfig() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
