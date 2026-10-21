import { Router } from 'express';
import { db } from '../db.js';
import { calculateElectricityBill } from '../calculator.js';

export const statsRouter = Router();

function getCurrentTariffsAndVat() {
  const tariffs = db.prepare('SELECT * FROM tariffs ORDER BY tier ASC').all();
  const vatRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('vat_rate');
  const vatRate = vatRow ? Number(vatRow.value) : 8;
  return { tariffs, vatRate };
}

// GET /api/stats/dashboard?year=2026
// Trả về số liệu phân tích tổng quan ngành điện, chuỗi thời gian, cơ cấu bậc và tăng trưởng
statsRouter.get('/dashboard', (req, res) => {
  try {
    const { year } = req.query;
    const { tariffs, vatRate } = getCurrentTariffsAndVat();

    // Lấy danh sách tất cả các năm có trong hệ thống
    const allPeriods = db.prepare('SELECT DISTINCT period FROM readings ORDER BY period ASC').all().map((p) => p.period);
    const availableYears = Array.from(new Set(allPeriods.map((p) => p.substring(0, 4)))).sort().reverse();

    // Query các bản ghi theo năm (hoặc tất cả)
    let query = `
      SELECT r.id, r.period, r.kwh, r.payment_status 
      FROM readings r
    `;
    const params = [];
    if (year && year !== 'ALL') {
      // Lấy thêm 1 tháng cuối của năm trước để tính tăng trưởng MoM cho tháng 1 chính xác
      const prevYearLastPeriod = `${Number(year) - 1}-12`;
      query += ' WHERE r.period LIKE ? OR r.period = ?';
      params.push(`${year}%`, prevYearLastPeriod);
    }
    query += ' ORDER BY r.period ASC';

    const rows = db.prepare(query).all(...params);

    const monthlyMap = new Map();
    let overallKwh = 0;
    let overallRevenue = 0;
    let overallPaid = 0;
    let overallUnpaid = 0;
    let overallTiersKwh = [0, 0, 0, 0, 0, 0];
    let overallTiersAmount = [0, 0, 0, 0, 0, 0];

    for (const r of rows) {
      if (!monthlyMap.has(r.period)) {
        monthlyMap.set(r.period, {
          period: r.period,
          total_readings: 0,
          paid_readings: 0,
          unpaid_readings: 0,
          total_kwh: 0,
          total_amount: 0,
          paid_amount: 0,
          unpaid_amount: 0,
          tier_kwh: [0, 0, 0, 0, 0, 0],
          tier_amount: [0, 0, 0, 0, 0, 0],
        });
      }

      const m = monthlyMap.get(r.period);
      m.total_readings += 1;
      m.total_kwh += r.kwh;

      const bill = calculateElectricityBill(r.kwh, tariffs, vatRate);
      m.total_amount += bill.total;

      if (r.payment_status === 'PAID') {
        m.paid_readings += 1;
        m.paid_amount += bill.total;
      } else {
        m.unpaid_readings += 1;
        m.unpaid_amount += bill.total;
      }

      for (let i = 0; i < 6; i++) {
        if (bill.tiers[i]) {
          m.tier_kwh[i] += bill.tiers[i].kwh;
          m.tier_amount[i] += bill.tiers[i].amount;
        }
      }

      // Chỉ tính vào overall nếu kỳ thuộc năm đang chọn (bỏ kỳ đệm của năm trước)
      const belongsToFilter = !year || year === 'ALL' || r.period.startsWith(year);
      if (belongsToFilter) {
        overallKwh += r.kwh;
        overallRevenue += bill.total;
        if (r.payment_status === 'PAID') {
          overallPaid += bill.total;
        } else {
          overallUnpaid += bill.total;
        }
        for (let i = 0; i < 6; i++) {
          if (bill.tiers[i]) {
            overallTiersKwh[i] += bill.tiers[i].kwh;
            overallTiersAmount[i] += bill.tiers[i].amount;
          }
        }
      }
    }

    const rawList = Array.from(monthlyMap.values());
    for (let i = 0; i < rawList.length; i++) {
      const cur = rawList[i];
      cur.avg_kwh = cur.total_readings ? Number((cur.total_kwh / cur.total_readings).toFixed(1)) : 0;
      cur.collection_rate = cur.total_amount ? Number(((cur.paid_amount / cur.total_amount) * 100).toFixed(1)) : 0;
      cur.total_kwh = Number(cur.total_kwh.toFixed(1));

      if (i > 0) {
        const prev = rawList[i - 1];
        cur.kwh_growth_pct = prev.total_kwh
          ? Number((((cur.total_kwh - prev.total_kwh) / prev.total_kwh) * 100).toFixed(2))
          : 0;
        cur.revenue_growth_pct = prev.total_amount
          ? Number((((cur.total_amount - prev.total_amount) / prev.total_amount) * 100).toFixed(2))
          : 0;
      } else {
        cur.kwh_growth_pct = 0;
        cur.revenue_growth_pct = 0;
      }
    }

    // Lọc lại danh sách tháng theo năm hiển thị
    const filteredMonthly = rawList.filter((m) => !year || year === 'ALL' || m.period.startsWith(year));

    // Thống kê tổng quan khách hàng
    const customerStats = db.prepare(`
      SELECT 
        COUNT(*) as total_customers,
        SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active_customers,
        SUM(CASE WHEN status = 'TERMINATED' THEN 1 ELSE 0 END) as terminated_customers
      FROM customers
    `).get();

    const collectionRate = overallRevenue > 0 ? Number(((overallPaid / overallRevenue) * 100).toFixed(1)) : 0;
    const avgConsumption = customerStats.active_customers > 0 ? Number((overallKwh / customerStats.active_customers).toFixed(1)) : 0;

    // Tăng trưởng của kỳ mới nhất
    const latestMonth = filteredMonthly[filteredMonthly.length - 1] || null;

    res.json({
      summary: {
        total_customers: customerStats.total_customers,
        active_customers: customerStats.active_customers,
        terminated_customers: customerStats.terminated_customers,
        total_kwh: Number(overallKwh.toFixed(1)),
        total_revenue: overallRevenue,
        total_paid: overallPaid,
        total_unpaid: overallUnpaid,
        collection_rate: collectionRate,
        avg_kwh_per_customer: avgConsumption,
        latest_period: latestMonth ? latestMonth.period : null,
        latest_kwh_growth: latestMonth ? latestMonth.kwh_growth_pct : 0,
        latest_revenue_growth: latestMonth ? latestMonth.revenue_growth_pct : 0,
      },
      years: availableYears,
      selected_year: year || (availableYears[0] || 'ALL'),
      monthly: filteredMonthly,
      overall_tiers: {
        kwh: overallTiersKwh.map((v) => Number(v.toFixed(1))),
        amount: overallTiersAmount,
        names: tariffs.map((t) => t.name),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats/period/:period
// Chi tiết chuyên sâu của 1 kỳ cụ thể (cơ cấu bậc, top công nợ)
statsRouter.get('/period/:period', (req, res) => {
  try {
    const { period } = req.params;
    const { tariffs, vatRate } = getCurrentTariffsAndVat();

    const readings = db.prepare(`
      SELECT 
        r.id, r.period, r.reading_date, r.prev_index, r.current_index, r.kwh, r.payment_status,
        c.customer_code, c.full_name, c.phone, c.address, c.meter_code
      FROM readings r
      JOIN customers c ON r.customer_id = c.id
      WHERE r.period = ?
      ORDER BY r.kwh DESC
    `).all(period);

    if (readings.length === 0) {
      return res.status(404).json({ error: `Không có dữ liệu cho kỳ ${period}` });
    }

    let totalKwh = 0;
    let totalRevenue = 0;
    let paidAmount = 0;
    let unpaidAmount = 0;
    let paidCount = 0;
    let unpaidCount = 0;
    const tierKwh = [0, 0, 0, 0, 0, 0];
    const tierAmount = [0, 0, 0, 0, 0, 0];
    const unpaidList = [];

    // Phân loại mức tiêu thụ hộ gia đình: <100 kWh (Tiết kiệm), 101-300 kWh (Trung bình), >300 kWh (Cao)
    let lowConsumers = 0;
    let midConsumers = 0;
    let highConsumers = 0;

    for (const r of readings) {
      totalKwh += r.kwh;
      const bill = calculateElectricityBill(r.kwh, tariffs, vatRate);
      totalRevenue += bill.total;

      if (r.kwh <= 100) lowConsumers++;
      else if (r.kwh <= 300) midConsumers++;
      else highConsumers++;

      if (r.payment_status === 'PAID') {
        paidCount++;
        paidAmount += bill.total;
      } else {
        unpaidCount++;
        unpaidAmount += bill.total;
        unpaidList.push({
          id: r.id,
          customer_code: r.customer_code,
          full_name: r.full_name,
          phone: r.phone,
          address: r.address,
          meter_code: r.meter_code,
          kwh: r.kwh,
          total_amount: bill.total,
        });
      }

      for (let i = 0; i < 6; i++) {
        if (bill.tiers[i]) {
          tierKwh[i] += bill.tiers[i].kwh;
          tierAmount[i] += bill.tiers[i].amount;
        }
      }
    }

    // Sắp xếp danh sách nợ theo số tiền giảm dần
    unpaidList.sort((a, b) => b.total_amount - a.total_amount);

    res.json({
      period,
      total_readings: readings.length,
      paid_count: paidCount,
      unpaid_count: unpaidCount,
      total_kwh: Number(totalKwh.toFixed(1)),
      total_revenue: totalRevenue,
      paid_amount: paidAmount,
      unpaid_amount: unpaidAmount,
      collection_rate: totalRevenue > 0 ? Number(((paidAmount / totalRevenue) * 100).toFixed(1)) : 0,
      avg_kwh: Number((totalKwh / readings.length).toFixed(1)),
      consumption_brackets: {
        low: lowConsumers,   // <= 100 kWh
        mid: midConsumers,   // 101-300 kWh
        high: highConsumers, // > 300 kWh
      },
      tiers: {
        kwh: tierKwh.map((v) => Number(v.toFixed(1))),
        amount: tierAmount,
        names: tariffs.map((t) => t.name),
      },
      top_unpaid: unpaidList.slice(0, 20),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
