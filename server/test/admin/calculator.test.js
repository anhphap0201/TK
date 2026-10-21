import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateElectricityBill } from '../../src/calculator.js';

/**
 * Module Admin: Kiểm Thử Thuật Toán Tính Tiền Điện 6 Bậc EVN
 * Tham chiếu tài liệu: docs/HUONG_DAN_TESTER_2.md
 */
describe('Admin - Thuật toán tính tiền điện 6 bậc (calculateElectricityBill)', () => {
  test('Tính tiền điện 0 kWh -> Tổng tiền bằng 0', () => {
    const result = calculateElectricityBill(0);

    assert.equal(result.kwh, 0);
    assert.equal(result.subtotal, 0);
    assert.equal(result.vatAmount, 0);
    assert.equal(result.total, 0);
  });

  test('Tính tiền điện 50 kWh thuộc bậc 1', () => {
    const result = calculateElectricityBill(50);

    assert.equal(result.subtotal, 94650);
    assert.equal(result.vatAmount, 7572);
    assert.equal(result.total, 102222);

    assert.equal(result.tiers.length, 6);
    assert.equal(result.tiers[0].kwh, 50);
  });

  test('Tính tiền điện 250 kWh qua 4 bậc đầu tiên', () => {
    const result = calculateElectricityBill(250);

    // Bậc 1: 50 * 1893 = 94.650
    // Bậc 2: 50 * 1956 = 97.800
    // Bậc 3: 100 * 2271 = 227.100
    // Bậc 4: 50 * 2860 = 143.000

    assert.equal(result.kwh, 250);
    assert.equal(result.subtotal, 562550);
    assert.equal(result.vatRate, 8);
    assert.equal(result.vatAmount, 45004);
    assert.equal(result.total, 607554);

    assert.equal(result.tiers.length, 6);
    assert.equal(result.tiers[0].kwh, 50);
    assert.equal(result.tiers[1].kwh, 50);
    assert.equal(result.tiers[2].kwh, 100);
    assert.equal(result.tiers[3].kwh, 50);
  });
});
