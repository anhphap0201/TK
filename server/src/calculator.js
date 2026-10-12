/**
 * Tính toán tiền điện sinh hoạt theo biểu giá luỹ kế 6 bậc của EVN
 */

export const DEFAULT_TARIFFS = [
  { tier: 1, min_kwh: 0, max_kwh: 50, rate: 1893, name: "Bậc 1 (0 - 50 kWh)" },
  { tier: 2, min_kwh: 50, max_kwh: 100, rate: 1956, name: "Bậc 2 (51 - 100 kWh)" },
  { tier: 3, min_kwh: 100, max_kwh: 200, rate: 2271, name: "Bậc 3 (101 - 200 kWh)" },
  { tier: 4, min_kwh: 200, max_kwh: 300, rate: 2860, name: "Bậc 4 (201 - 300 kWh)" },
  { tier: 5, min_kwh: 300, max_kwh: 400, rate: 3197, name: "Bậc 5 (301 - 400 kWh)" },
  { tier: 6, min_kwh: 400, max_kwh: null, rate: 3302, name: "Bậc 6 (Từ 401 kWh trở lên)" },
];

export const DEFAULT_VAT_RATE = 8; // %

/**
 * Tính chi tiết tiền điện theo biểu giá bậc thang
 * @param {number} kwh - Tổng số kWh tiêu thụ
 * @param {Array} tariffs - Danh sách biểu giá theo bậc
 * @param {number} vatRate - Tỷ lệ thuế VAT (%)
 */
export function calculateElectricityBill(kwh, tariffs = DEFAULT_TARIFFS, vatRate = DEFAULT_VAT_RATE) {
  const safeKwh = Math.max(0, Number(kwh) || 0);
  let remainingKwh = safeKwh;
  let subtotal = 0;

  const sortedTariffs = [...tariffs].sort((a, b) => a.tier - b.tier);

  const tiersBreakdown = sortedTariffs.map((t) => {
    let tierKwh = 0;
    if (remainingKwh > 0) {
      if (t.max_kwh === null || t.max_kwh === undefined) {
        tierKwh = remainingKwh;
      } else {
        const capacity = t.max_kwh - t.min_kwh;
        tierKwh = Math.min(remainingKwh, capacity);
      }
      remainingKwh -= tierKwh;
    }

    const amount = Math.round(tierKwh * t.rate);
    subtotal += amount;

    return {
      tier: t.tier,
      name: t.name,
      min_kwh: t.min_kwh,
      max_kwh: t.max_kwh,
      rate: t.rate,
      kwh: Number(tierKwh.toFixed(2)),
      amount,
    };
  });

  const safeVatRate = Number(vatRate) || 0;
  const vatAmount = Math.round((subtotal * safeVatRate) / 100);
  const total = subtotal + vatAmount;

  return {
    kwh: Number(safeKwh.toFixed(2)),
    subtotal,
    vatRate: safeVatRate,
    vatAmount,
    total,
    tiers: tiersBreakdown,
  };
}
