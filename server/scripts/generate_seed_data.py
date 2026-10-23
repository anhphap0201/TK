import sqlite3
import random
import os
import sys
from datetime import datetime, date

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


# Đường dẫn database
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/electricity.db'))
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

# Họ và tên mẫu Việt Nam
HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"]
DEM = ["Văn", "Thị", "Đức", "Hoàng", "Minh", "Hữu", "Tuấn", "Ngọc", "Xuân", "Đình", "Quang", "Anh", "Thành", "Hải"]
TEN = ["An", "Bình", "Cường", "Dũng", "Giang", "Hải", "Hùng", "Huy", "Khánh", "Linh", "Long", "Minh", "Nam", "Phong", "Phúc", "Quân", "Sơn", "Thắng", "Thành", "Tuấn", "Tùng", "Việt", "Vy", "Yến", "Trang", "Mai", "Hương"]

DUONG = [
  "Giải Phóng", "Kim Mã", "Cầu Giấy", "Nguyễn Trãi", "Lê Văn Lương", "Trần Duy Hưng",
  "Hoàng Hoa Thám", "Đội Cấn", "Bà Triệu", "Phố Huế", "Hai Bà Trưng", "Nguyễn Huệ",
  "Lê Lợi", "Điện Biên Phủ", "Cách Mạng Tháng 8", "Võ Văn Kiệt", "Nguyễn Thị Minh Khai"
]

QUAN = ["Hoàn Kiếm", "Ba Đình", "Đống Đa", "Cầu Giấy", "Thanh Xuân", "Hai Bà Trưng", "Quận 1", "Quận 3", "Quận 10", "Bình Thạnh", "Hải Châu", "Ninh Kiều"]
THANH_PHO = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng"]

def random_name():
    return f"{random.choice(HO)} {random.choice(DEM)} {random.choice(TEN)}"

def random_phone():
    prefixes = ["090", "091", "098", "097", "088", "086", "070", "079", "038", "039"]
    return f"{random.choice(prefixes)}{random.randint(1000000, 9999999)}"

def random_address():
    so_nha = random.randint(1, 450)
    return f"Số {so_nha}, Phố {random.choice(DUONG)}, Quận {random.choice(QUAN)}, {random.choice(THANH_PHO)}"

def generate_data(num_customers=1000):
    print(f"Đang kết nối database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Tạo bảng nếu chưa có
    cursor.executescript("""
    PRAGMA foreign_keys = OFF;
    DROP TABLE IF EXISTS readings;
    DROP TABLE IF EXISTS meters;
    DROP TABLE IF EXISTS customers;
    PRAGMA foreign_keys = ON;

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
    """)

    # Seed tariffs nếu chưa có
    cursor.execute("SELECT COUNT(*) FROM tariffs")
    if cursor.fetchone()[0] == 0:
        tariffs = [
            (1, 0, 50, 1893, "Bậc 1 (0 - 50 kWh)"),
            (2, 50, 100, 1956, "Bậc 2 (51 - 100 kWh)"),
            (3, 100, 200, 2271, "Bậc 3 (101 - 200 kWh)"),
            (4, 200, 300, 2860, "Bậc 4 (201 - 300 kWh)"),
            (5, 300, 400, 3197, "Bậc 5 (301 - 400 kWh)"),
            (6, 400, None, 3302, "Bậc 6 (Từ 401 kWh trở lên)")
        ]
        cursor.executemany("INSERT INTO tariffs (tier, min_kwh, max_kwh, rate, name) VALUES (?, ?, ?, ?, ?)", tariffs)

    # Seed settings nếu chưa có
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('vat_rate', '8')")
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_password', 'admin123')")
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('payos_client_id', '8a373872-a401-488c-8d6d-711cc600ea0c')")
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('payos_api_key', 'e7f4a56a-5b06-4edd-9929-de63796cd0be')")
    cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES ('payos_checksum_key', '6bc8a3513de774f8a8655c9ea9544c3186fec3b9f3881f25524dbb4fc54b8843')")

    # Xoá dữ liệu cũ nếu muốn tái tạo sạch
    cursor.execute("DELETE FROM readings")
    cursor.execute("DELETE FROM customers")

    # Thời điểm hiện tại: 2026-10
    now = datetime(2026, 10, 1)
    # Khoảng 4 năm trước: 2022-10
    start_boundary = datetime(2022, 10, 1)

    # Tạo danh sách các tháng từ 2022-10 đến 2026-10
    all_months = []
    curr = start_boundary
    while curr <= now:
        all_months.append((curr.year, curr.month))
        # Sang tháng tiếp
        if curr.month == 12:
            curr = datetime(curr.year + 1, 1, 1)
        else:
            curr = datetime(curr.year, curr.month + 1, 1)

    total_months_count = len(all_months)

    print(f"Bắt đầu sinh dữ liệu cho {num_customers} khách hàng...")

    customers_data = []
    readings_data = []

    # Chọn ngẫu nhiên đúng 20 khách hàng chấm dứt hợp đồng trong tổng số num_customers
    terminated_cust_ids = set(random.sample(range(1, num_customers + 1), min(20, num_customers)))

    for cust_id in range(1, num_customers + 1):
        cust_code = f"KH{cust_id:04d}"
        meter_code = f"CT{cust_id:04d}"
        name = random_name()
        phone = random_phone()
        address = random_address()
        status = 'TERMINATED' if cust_id in terminated_cust_ids else 'ACTIVE'

        # Chọn tháng bắt đầu hợp đồng ngẫu nhiên trong 4 năm
        start_month_idx = random.randint(0, total_months_count - 6) # ít nhất có 6 tháng lịch sử
        start_year, start_month = all_months[start_month_idx]
        contract_date = f"{start_year:04d}-{start_month:02d}-{random.randint(1, 25):02d}"

        customers_data.append((
            cust_id,
            cust_code,
            name,
            phone,
            address,
            meter_code,
            contract_date,
            status,
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ))

        # Mỗi gia đình có mức tiêu thụ cơ sở cố định (150 - 450 kWh)
        baseline_kwh = random.randint(150, 450)
        current_meter_index = random.randint(100, 3000)

        # Quyết định trạng thái thanh toán của 2 kỳ gần nhất (2026-09 và 2026-10)
        # Kỳ <= 2026-08: 100% PAID
        # Kỳ 2026-09: ~20% chưa đóng
        # Kỳ 2026-10: Nếu kỳ 09 chưa đóng -> BẮT BUỘC chưa đóng (không thể tháng 9 nợ mà tháng 10 đóng)
        #             Nếu kỳ 09 đã đóng -> ~75% chưa đóng (kỳ hiện tại)
        sep_2026_unpaid = (random.random() < 0.20)
        if sep_2026_unpaid:
            oct_2026_unpaid = True
        else:
            oct_2026_unpaid = (random.random() < 0.75)

        # Sinh lịch sử các tháng từ start_month_idx đến hiện tại
        for m_idx in range(start_month_idx, total_months_count):
            year, month = all_months[m_idx]
            period = f"{year:04d}-{month:02d}"
            reading_date = f"{year:04d}-{month:02d}-20"

            # Dao động 20 - 100 số quanh mức cố định baseline_kwh của gia đình đó
            delta = random.randint(20, 100) * random.choice([-1, 1])
            new_kwh = baseline_kwh + delta

            # Tháng hè (5, 6, 7, 8): nắng nóng cao điểm -> tăng 10% - 30%
            if month in [5, 6, 7, 8]:
                summer_boost = random.uniform(1.10, 1.30)
                new_kwh = int(new_kwh * summer_boost)

            # Giữ biên độ hợp lý
            actual_kwh = max(50, min(850, new_kwh))

            prev_index = current_meter_index
            current_index = prev_index + actual_kwh
            current_meter_index = current_index

            # Trạng thái thanh toán theo quy tắc chặt chẽ:
            # - Tất cả các tháng <= 2026-08 đã thanh toán xong
            # - Kỳ 2026-09 và 2026-10 tuân theo logic tuần tự đã tính trước
            if year == 2026 and month == 9:
                is_unpaid = sep_2026_unpaid
            elif year == 2026 and month == 10:
                is_unpaid = oct_2026_unpaid
            else:
                is_unpaid = False

            if is_unpaid:
                payment_status = 'UNPAID'
                paid_at = None
                payment_method = None
                txn_id = None
            else:
                payment_status = 'PAID'
                paid_at = f"{year:04d}-{month:02d}-25 10:30:00"
                payment_method = random.choice(['PAYOS', 'PAYOS', 'TRANSFER', 'CASH'])
                txn_id = f"TXN{year}{month:02d}{random.randint(100000, 999999)}"

            readings_data.append((
                cust_id,
                period,
                reading_date,
                prev_index,
                current_index,
                actual_kwh,
                payment_status,
                paid_at,
                payment_method,
                txn_id,
                None,
                datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            ))

    print(f"Đang ghi {len(customers_data)} khách hàng vào database...")
    cursor.executemany("""
    INSERT INTO customers (id, customer_code, full_name, phone, address, meter_code, contract_start_date, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, customers_data)

    print(f"Đang ghi {len(readings_data)} bản ghi chỉ số kWh vào database...")
    cursor.executemany("""
    INSERT INTO readings (customer_id, period, reading_date, prev_index, current_index, kwh, payment_status, paid_at, payment_method, transaction_id, note, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, readings_data)

    conn.commit()
    conn.close()

    print(f"Đã hoàn thành! Sinh thành công {len(customers_data)} khách hàng và {len(readings_data)} kỳ chỉ số điện!")

if __name__ == '__main__':
    generate_data(1000)
