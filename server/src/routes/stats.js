import { Router } from 'express';
import { db } from '../db.js';

export const statsRouter = Router();

statsRouter.get('/', (req, res) => {
  try {
    const { meter_id } = req.query;

    let query = `
      SELECT 
        period,
        COUNT(id) as count,
        SUM(kwh) as total_kwh,
        SUM(total_amount) as total_amount,
        SUM(subtotal) as total_subtotal,
        SUM(vat_amount) as total_vat
      FROM readings
    `;
    const params = [];

    if (meter_id) {
      query += ' WHERE meter_id = ?';
      params.push(meter_id);
    }

    query += ' GROUP BY period ORDER BY period ASC LIMIT 24';

    const monthlyStats = db.prepare(query).all(...params);

    // Tổng quan chung
    let overallQuery = `
      SELECT 
        COUNT(id) as total_readings,
        COALESCE(SUM(kwh), 0) as total_kwh,
        COALESCE(SUM(total_amount), 0) as total_amount,
        COALESCE(AVG(kwh), 0) as avg_kwh,
        COALESCE(AVG(total_amount), 0) as avg_amount
      FROM readings
    `;
    if (meter_id) {
      overallQuery += ' WHERE meter_id = ?';
    }
    const overall = db.prepare(overallQuery).get(...params);

    res.json({
      summary: {
        total_readings: overall.total_readings,
        total_kwh: Number(overall.total_kwh.toFixed(1)),
        total_amount: Math.round(overall.total_amount),
        avg_kwh: Number(overall.avg_kwh.toFixed(1)),
        avg_amount: Math.round(overall.avg_amount),
      },
      monthly: monthlyStats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
