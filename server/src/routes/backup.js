import { Router } from 'express';
import { db } from '../db.js';

export const backupRouter = Router();

backupRouter.get('/export', (req, res) => {
  try {
    const customers = db.prepare('SELECT * FROM customers').all();
    const readings = db.prepare('SELECT * FROM readings').all();
    const tariffs = db.prepare('SELECT * FROM tariffs').all();
    const settings = db.prepare('SELECT * FROM settings').all();

    const data = {
      version: '2.0',
      exported_at: new Date().toISOString(),
      customers,
      readings,
      tariffs,
      settings,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="tra_cuu_tien_dien_backup.json"');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

backupRouter.post('/import', (req, res) => {
  try {
    const { customers, readings, tariffs, settings, mode = 'replace' } = req.body;

    if (!Array.isArray(customers) && !Array.isArray(readings)) {
      return res.status(400).json({ error: 'File sao lưu không hợp lệ' });
    }

    if (mode === 'replace') {
      db.exec('DELETE FROM readings; DELETE FROM customers;');
    }

    if (Array.isArray(customers)) {
      const insertCustomer = db.prepare(`
        INSERT OR REPLACE INTO customers (
          id, customer_code, full_name, phone, address, meter_code, contract_start_date, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const c of customers) {
        insertCustomer.run(
          c.id,
          c.customer_code,
          c.full_name,
          c.phone || null,
          c.address || null,
          c.meter_code || null,
          c.contract_start_date || '2023-01-01',
          c.status || 'ACTIVE',
          c.created_at || null
        );
      }
    }

    if (Array.isArray(readings)) {
      const insertReading = db.prepare(`
        INSERT OR REPLACE INTO readings (
          id, customer_id, period, reading_date, prev_index, current_index, kwh,
          payment_status, paid_at, payment_method, transaction_id, note, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const r of readings) {
        insertReading.run(
          r.id,
          r.customer_id,
          r.period,
          r.reading_date,
          r.prev_index,
          r.current_index,
          r.kwh,
          r.payment_status || 'UNPAID',
          r.paid_at || null,
          r.payment_method || null,
          r.transaction_id || null,
          r.note || null,
          r.created_at || null
        );
      }
    }

    if (Array.isArray(tariffs)) {
      const updateTariff = db.prepare('UPDATE tariffs SET rate = ?, name = ? WHERE tier = ?');
      for (const t of tariffs) {
        updateTariff.run(t.rate, t.name, t.tier);
      }
    }

    if (Array.isArray(settings)) {
      const setStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
      for (const s of settings) {
        setStmt.run(s.key, s.value);
      }
    }

    res.json({ message: 'Khôi phục dữ liệu thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
