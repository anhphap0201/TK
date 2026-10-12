import { Router } from 'express';
import { db } from '../db.js';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  try {
    const { code, password } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: 'Vui lòng nhập mã khách hàng hoặc mã quản trị' });
    }

    const cleanCode = code.trim();

    // Trường hợp nhập "admin"
    if (cleanCode.toLowerCase() === 'admin') {
      if (!password) {
        return res.json({
          role: 'admin',
          requirePassword: true,
          message: 'Vui lòng nhập mật khẩu quản trị viên',
        });
      }

      const adminPassRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('admin_password');
      const expectedPass = adminPassRow ? adminPassRow.value : 'admin123';

      if (password !== expectedPass) {
        return res.status(401).json({ error: 'Mật khẩu quản trị viên không chính xác' });
      }

      return res.json({
        role: 'admin',
        token: 'admin-authorized-token',
        user: { name: 'Quản trị viên EVN' },
      });
    }

    // Trường hợp là Mã khách hàng
    const customer = db.prepare(`
      SELECT * FROM customers 
      WHERE UPPER(customer_code) = UPPER(?)
    `).get(cleanCode);

    if (!customer) {
      return res.status(404).json({
        error: `Không tìm thấy mã khách hàng "${cleanCode}". Vui lòng kiểm tra lại trên hoá đơn hoặc nhập KH0001 để thử.`,
      });
    }

    return res.json({
      role: 'customer',
      customer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
