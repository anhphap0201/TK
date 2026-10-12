import { Router } from 'express';
import { db } from '../db.js';

export const customersRouter = Router();

// Lấy danh sách khách hàng (hỗ trợ tìm kiếm, phân trang)
customersRouter.get('/', (req, res) => {
  try {
    const { q, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(10, parseInt(limit) || 50));
    const offset = (pageNum - 1) * limitNum;

    let countQuery = 'SELECT COUNT(*) as total FROM customers';
    let dataQuery = `
      SELECT 
        c.*,
        (
          SELECT COUNT(*) FROM readings r WHERE r.customer_id = c.id
        ) as total_readings,
        (
          SELECT COUNT(*) FROM readings r WHERE r.customer_id = c.id AND r.payment_status = 'UNPAID'
        ) as unpaid_count
      FROM customers c
    `;
    const params = [];

    if (q && q.trim()) {
      const searchTerm = `%${q.trim()}%`;
      countQuery += ' WHERE customer_code LIKE ? OR full_name LIKE ? OR phone LIKE ? OR meter_code LIKE ?';
      dataQuery += ' WHERE c.customer_code LIKE ? OR c.full_name LIKE ? OR c.phone LIKE ? OR c.meter_code LIKE ?';
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    dataQuery += ' ORDER BY c.id ASC LIMIT ? OFFSET ?';

    const countRow = db.prepare(countQuery).get(...params);
    const total = countRow ? countRow.total : 0;

    const customers = db.prepare(dataQuery).all(...params, limitNum, offset);

    res.json({
      data: customers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chi tiết khách hàng
customersRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    if (!customer) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm khách hàng mới
customersRouter.post('/', (req, res) => {
  try {
    const { customer_code, full_name, phone, address, meter_code, contract_start_date } = req.body;

    if (!customer_code || !customer_code.trim()) {
      return res.status(400).json({ error: 'Mã khách hàng không được để trống' });
    }
    if (!full_name || !full_name.trim()) {
      return res.status(400).json({ error: 'Tên khách hàng không được để trống' });
    }

    const today = new Date().toISOString().split('T')[0];
    const contractDate = contract_start_date || today;

    const insert = db.prepare(`
      INSERT INTO customers (customer_code, full_name, phone, address, meter_code, contract_start_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      customer_code.trim().toUpperCase(),
      full_name.trim(),
      phone?.trim() || null,
      address?.trim() || null,
      meter_code?.trim() || null,
      contractDate
    );

    const created = db.prepare('SELECT * FROM customers WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Mã khách hàng hoặc mã công tơ đã tồn tại trên hệ thống' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật khách hàng
customersRouter.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { customer_code, full_name, phone, address, meter_code, status } = req.body;

    const update = db.prepare(`
      UPDATE customers SET
        customer_code = ?,
        full_name = ?,
        phone = ?,
        address = ?,
        meter_code = ?,
        status = ?
      WHERE id = ?
    `);

    const result = update.run(
      customer_code.trim().toUpperCase(),
      full_name.trim(),
      phone?.trim() || null,
      address?.trim() || null,
      meter_code?.trim() || null,
      status || 'ACTIVE',
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    const updated = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xoá khách hàng
customersRouter.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const del = db.prepare('DELETE FROM customers WHERE id = ?');
    const result = del.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    res.json({ message: 'Đã xoá khách hàng thành công', id: Number(id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
