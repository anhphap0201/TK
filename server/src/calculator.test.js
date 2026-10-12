import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateElectricityBill, DEFAULT_TARIFFS } from './calculator.js';

test('calculates 0 kWh correctly', () => {
  const result = calculateElectricityBill(0);
  assert.equal(result.kwh, 0);
  assert.equal(result.subtotal, 0);
  assert.equal(result.vatAmount, 0);
  assert.equal(result.total, 0);
});

test('calculates tier 1 correctly (50 kWh)', () => {
  const result = calculateElectricityBill(50, DEFAULT_TARIFFS, 8);
  assert.equal(result.kwh, 50);
  assert.equal(result.tiers[0].kwh, 50);
  assert.equal(result.tiers[0].amount, 50 * 1893);
  assert.equal(result.subtotal, 94650);
  assert.equal(result.vatAmount, Math.round(94650 * 0.08));
  assert.equal(result.total, 94650 + Math.round(94650 * 0.08));
});

test('calculates multi-tier correctly (250 kWh)', () => {
  // 50 * 1893 + 50 * 1956 + 100 * 2271 + 50 * 2860
  // = 94650 + 97800 + 227100 + 143000 = 562550
  const result = calculateElectricityBill(250, DEFAULT_TARIFFS, 8);
  assert.equal(result.kwh, 250);
  assert.equal(result.tiers[0].kwh, 50);
  assert.equal(result.tiers[1].kwh, 50);
  assert.equal(result.tiers[2].kwh, 100);
  assert.equal(result.tiers[3].kwh, 50);
  assert.equal(result.subtotal, 562550);
  assert.equal(result.vatAmount, Math.round(562550 * 0.08));
  assert.equal(result.total, 562550 + Math.round(562550 * 0.08));
});
