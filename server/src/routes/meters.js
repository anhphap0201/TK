import { Router } from 'express';
import { db } from '../db.js';

export const metersRouter = Router();

// Lấy danh sách công tơ kèm số lượng bản ghi và lần ghi gần nhất
metersRouter.get('/', (req, res) => {
  try {
    const meters = db.prepare(`
      SELECT 
        m.*,
        COUNT(r.id) as readings_count,
        MAX(r.reading_date) as last_reading_date,
        (
          SELECT r2.current_index 
          FROM readings r2 
          WHERE r2.meter_id = m.id 
          ORDER BY r2.reading_date DESC, r2.id DESC 
          LIMIT 1
        ) as last_index
      FROM meters m
      LEFT JOIN readings r ON r.meter_id = m.id
      GROUP BY m.id
      ORDER BY m.id ASC
    `).all();

    res.json(meters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm công tơ mới
metersRouter.post('/', (req, res) => {
  try {
    const { name, code, location, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Tên công tơ không được để trống' });
    }

    const insert = db.prepare(`
      INSERT INTO meters (name, code, location, description)
      VALUES (?, ?, ?, ?)
    `);
    const result = insert.run(name.trim(), code?.trim() || null, location?.trim() || null, description?.trim() || null);

    const newMeter = db.prepare('SELECT * FROM meters WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newMeter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật công tơ
metersRouter.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, location, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Tên công tơ không được để trống' });
    }

    const update = db.prepare(`
      UPDATE meters
      SET name = ?, code = ?, location = ?, description = ?
      WHERE id = ?
    `);
    const result = update.run(name.trim(), code?.trim() || null, location?.trim() || null, description?.trim() || null, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Không tìm thấy công tơ' });
    }

    const updatedMeter = db.prepare('SELECT * FROM meters WHERE id = ?').get(id);
    res.json(updatedMeter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xoá công tơ
metersRouter.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const del = db.prepare('DELETE FROM meters WHERE id = ?');
    const result = del.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Không tìm thấy công tơ' });
    }

    res.json({ message: 'Đã xoá công tơ thành công', id: Number(id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
