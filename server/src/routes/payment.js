import { Router } from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { calculateElectricityBill } from '../calculator.js';

export const paymentRouter = Router();

function getVnpayConfig() {
  const tmnCode = db.prepare("SELECT value FROM settings WHERE key = 'vnp_tmn_code'").get();
  const hashSecret = db.prepare("SELECT value FROM settings WHERE key = 'vnp_hash_secret'").get();
  const url = db.prepare("SELECT value FROM settings WHERE key = 'vnp_url'").get();

  return {
    vnp_TmnCode: tmnCode ? tmnCode.value : 'CGXZLS0Z',
    vnp_HashSecret: hashSecret ? hashSecret.value : 'XNBCJFAKAZQSGTARRLTXNMVNILVAZKRQ',
    vnp_Url: url ? url.value : 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  };
}

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

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${y}${m}${d}${h}${mi}${s}`;
}

// 1. Tạo URL thanh toán VNPAY Sandbox
paymentRouter.post('/create-vnpay-url', (req, res) => {
  try {
    const { reading_id, return_url } = req.body;

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

    // Tính tiền động theo biểu giá hiện tại
    const tariffs = db.prepare('SELECT * FROM tariffs ORDER BY tier ASC').all();
    const vatRow = db.prepare("SELECT value FROM settings WHERE key = 'vat_rate'").get();
    const vatRate = vatRow ? Number(vatRow.value) : 8;
    const bill = calculateElectricityBill(reading.kwh, tariffs, vatRate);

    const config = getVnpayConfig();
    const date = new Date();
    const createDate = formatDate(date);
    const orderId = `${reading.id}_${Date.now()}`;
    const amount = bill.total * 100; // VNPAY tính theo đơn vị hào (x100)
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const redirectUrl = return_url || 'http://localhost:5173/';

    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: config.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan tien dien ky ${reading.period} KH ${reading.customer_code}`,
      vnp_OrderType: 'billpayment',
      vnp_Amount: amount,
      vnp_ReturnUrl: redirectUrl,
      vnp_IpAddr: typeof ipAddr === 'string' ? ipAddr.split(',')[0].trim() : '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    // Sắp xếp params theo alphabet theo chuẩn VNPAY
    const sortedKeys = Object.keys(vnp_Params).sort();
    const sortedParams = {};
    for (const key of sortedKeys) {
      sortedParams[key] = encodeURIComponent(String(vnp_Params[key])).replace(/%20/g, '+');
    }

    const signData = Object.keys(sortedParams)
      .map((k) => `${k}=${sortedParams[k]}`)
      .join('&');

    const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    const paymentUrl = `${config.vnp_Url}?${signData}&vnp_SecureHash=${signed}`;

    res.json({
      paymentUrl,
      orderId,
      amount: bill.total,
      period: reading.period,
      customer_code: reading.customer_code,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Xác nhận thanh toán từ VNPAY Return URL (callback)
paymentRouter.post('/vnpay-return', (req, res) => {
  try {
    const vnp_Params = { ...req.body };
    const secureHash = vnp_Params.vnp_SecureHash;

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const config = getVnpayConfig();

    // Sắp xếp params
    const sortedKeys = Object.keys(vnp_Params).sort();
    const sortedParams = {};
    for (const key of sortedKeys) {
      sortedParams[key] = encodeURIComponent(String(vnp_Params[key])).replace(/%20/g, '+');
    }

    const signData = Object.keys(sortedParams)
      .map((k) => `${k}=${sortedParams[k]}`)
      .join('&');

    const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
      return res.status(400).json({ success: false, error: 'Chữ ký số không hợp lệ (Checksum failed)' });
    }

    const responseCode = vnp_Params.vnp_ResponseCode;
    const txnRef = vnp_Params.vnp_TxnRef; // Format: readingId_timestamp
    const readingId = txnRef.split('_')[0];

    if (responseCode === '00') {
      const update = db.prepare(`
        UPDATE readings SET
          payment_status = 'PAID',
          paid_at = datetime('now', 'localtime'),
          payment_method = 'VNPAY',
          transaction_id = ?
        WHERE id = ?
      `);
      update.run(vnp_Params.vnp_TransactionNo || txnRef, readingId);

      return res.json({
        success: true,
        message: 'Thanh toán thành công qua VNPAY',
        reading_id: Number(readingId),
        transaction_no: vnp_Params.vnp_TransactionNo,
      });
    } else {
      return res.json({
        success: false,
        error: `Giao dịch không thành công (Mã lỗi VNPAY: ${responseCode})`,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
        payment_method = 'VNPAY_SANDBOX',
        transaction_id = ?
      WHERE id = ?
    `);

    const fakeTxnId = `SIM_VNP_${Date.now()}`;
    const result = update.run(fakeTxnId, reading_id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Không tìm thấy kỳ hoá đơn' });
    }

    res.json({
      success: true,
      message: 'Đã đóng tiền điện thành công qua VNPAY Sandbox',
      transaction_id: fakeTxnId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Lấy & Cập nhật cấu hình VNPAY Sandbox
paymentRouter.get('/config', (req, res) => {
  try {
    const config = getVnpayConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

paymentRouter.put('/config', (req, res) => {
  try {
    const { vnp_TmnCode, vnp_HashSecret, vnp_Url } = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

    if (vnp_TmnCode) stmt.run('vnp_tmn_code', vnp_TmnCode);
    if (vnp_HashSecret) stmt.run('vnp_hash_secret', vnp_HashSecret);
    if (vnp_Url) stmt.run('vnp_url', vnp_Url);

    res.json({ message: 'Đã cập nhật cấu hình VNPAY', config: getVnpayConfig() });
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
