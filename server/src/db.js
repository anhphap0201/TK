import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DEFAULT_TARIFFS, DEFAULT_VAT_RATE } from './calculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'electricity.db');
export const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tariffs (
      id INTEGER PRIMARY KEY,
      tier INTEGER NOT NULL UNIQUE,
      min_kwh INTEGER NOT NULL,
      max_kwh INTEGER,
      rate INTEGER NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_code TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      meter_code TEXT UNIQUE,
      contract_start_date TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      period TEXT NOT NULL,
      reading_date TEXT NOT NULL,
      prev_index REAL NOT NULL,
      current_index REAL NOT NULL,
      kwh REAL NOT NULL,
      payment_status TEXT DEFAULT 'UNPAID',
      paid_at TEXT,
      payment_method TEXT,
      transaction_id TEXT,
      note TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(customer_code);
    CREATE INDEX IF NOT EXISTS idx_readings_customer_id ON readings(customer_id);
    CREATE INDEX IF NOT EXISTS idx_readings_period ON readings(period);
  `);

  // Default tariffs
  const tariffCountStmt = db.prepare('SELECT COUNT(*) as count FROM tariffs');
  const tariffCount = tariffCountStmt.get();
  if (tariffCount.count === 0) {
    const insertTariff = db.prepare(`
      INSERT INTO tariffs (tier, min_kwh, max_kwh, rate, name)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const t of DEFAULT_TARIFFS) {
      insertTariff.run(t.tier, t.min_kwh, t.max_kwh, t.rate, t.name);
    }
  }

  // Default settings
  const defaultSettings = [
    { key: 'vat_rate', value: String(DEFAULT_VAT_RATE) },
    { key: 'admin_password', value: 'admin123' },
    { key: 'vnp_tmn_code', value: 'CGXZLS0Z' },
    { key: 'vnp_hash_secret', value: 'XNBCJFAKAZQSGTARRLTXNMVNILVAZKRQ' },
    { key: 'vnp_url', value: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html' },
  ];

  const settingStmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const s of defaultSettings) {
    settingStmt.run(s.key, s.value);
  }
}
