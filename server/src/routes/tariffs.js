import { Router } from 'express';
import { db } from '../db.js';

export const tariffsRouter = Router();

tariffsRouter.get('/', (req, res) => {
  try {
    const tariffs = db.prepare('SELECT * FROM tariffs ORDER BY tier ASC').all();
    const vatSetting = db.prepare('SELECT value FROM settings WHERE key = ?').get('vat_rate');
    res.json({
      tariffs,
      vat_rate: vatSetting ? Number(vatSetting.value) : 8,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

tariffsRouter.put('/', (req, res) => {
  try {
    const { tariffs, vat_rate } = req.body;

    if (Array.isArray(tariffs)) {
      const updateTariff = db.prepare('UPDATE tariffs SET rate = ?, name = ? WHERE tier = ?');
      for (const t of tariffs) {
        updateTariff.run(Number(t.rate), t.name, Number(t.tier));
      }
    }

    if (vat_rate !== undefined) {
      const updateSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
      updateSetting.run('vat_rate', String(vat_rate));
    }

    const updatedTariffs = db.prepare('SELECT * FROM tariffs ORDER BY tier ASC').all();
    const updatedVat = db.prepare('SELECT value FROM settings WHERE key = ?').get('vat_rate');

    res.json({
      message: 'Cập nhật biểu giá thành công',
      tariffs: updatedTariffs,
      vat_rate: Number(updatedVat.value),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
