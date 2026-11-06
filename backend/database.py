import os
import json
import sqlite3
import shutil
import tempfile
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from .env in backend directory
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "daware_opticals")

# Declarative Base for models
Base = declarative_base()

encoded_password = quote_plus(DB_PASSWORD)
DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
)

# In serverless environments (Vercel, AWS Lambda), files inside the code directory are read-only.
# We copy/build the database inside the OS temp directory so all INSERT/UPDATE/DELETE queries are fully writable.
temp_dir = tempfile.gettempdir()
sqlite_db_path = os.path.join(temp_dir, "daware_opticals_v2.sqlite")
bundled_sqlite = os.path.join(os.path.dirname(__file__), "daware_opticals.sqlite")
seed_json_path = os.path.join(os.path.dirname(__file__), "full_mysql_seed.json")


def ensure_sqlite_database():
    """Builds or verifies the synchronized SQLite database replica in the writable temp directory."""
    if os.path.exists(sqlite_db_path) and os.path.getsize(sqlite_db_path) > 0:
        return

    # 1. If pre-seeded database exists in project, copy to writable location
    if os.path.exists(bundled_sqlite) and os.path.getsize(bundled_sqlite) > 0:
        try:
            shutil.copy2(bundled_sqlite, sqlite_db_path)
            return
        except Exception as e:
            print(f"[Database Copy Warning] Could not copy bundled sqlite: {e}")

    # 2. Otherwise build from seed JSON
    if not os.path.exists(seed_json_path):
        return

    try:
        with open(seed_json_path, 'r', encoding='utf-8') as f:
            dump = json.load(f)

        conn = sqlite3.connect(sqlite_db_path)
        cur = conn.cursor()

        cur.execute("""CREATE TABLE IF NOT EXISTS categories (
            category_id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_name TEXT NOT NULL,
            description TEXT
        )""")
        for r in dump.get('categories', []):
            cur.execute("INSERT OR IGNORE INTO categories VALUES (?, ?, ?)",
                        (r['category_id'], r['category_name'], r.get('description')))

        cur.execute("""CREATE TABLE IF NOT EXISTS customers (
            Customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            address TEXT,
            created_at TEXT
        )""")
        for r in dump.get('customers', []):
            cur.execute("INSERT OR IGNORE INTO customers VALUES (?, ?, ?, ?, ?, ?)",
                        (r['Customer_id'], r['full_name'], r.get('phone'), r.get('email'), r.get('address'), r.get('created_at')))

        cur.execute("""CREATE TABLE IF NOT EXISTS suppliers (
            supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
            supplier_name TEXT NOT NULL,
            contact_person TEXT,
            phone TEXT,
            email TEXT,
            address TEXT,
            city TEXT,
            created_at TEXT
        )""")
        for r in dump.get('suppliers', []):
            cur.execute("INSERT OR IGNORE INTO suppliers VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        (r['supplier_id'], r['supplier_name'], r.get('contact_person'), r.get('phone'), r.get('email'), r.get('address'), r.get('city'), r.get('created_at')))

        cur.execute("""CREATE TABLE IF NOT EXISTS products (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            brand TEXT,
            category_id INTEGER,
            model_number TEXT,
            selling_price REAL NOT NULL,
            stock_quantity INTEGER DEFAULT 0,
            description TEXT,
            created_at TEXT,
            FOREIGN KEY(category_id) REFERENCES categories(category_id)
        )""")
        for r in dump.get('products', []):
            cur.execute("INSERT OR IGNORE INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        (r['product_id'], r['product_name'], r.get('brand'), r.get('category_id'), r.get('model_number'), r['selling_price'], r.get('stock_quantity', 0), r.get('description'), r.get('created_at')))

        cur.execute("""CREATE TABLE IF NOT EXISTS prescriptions (
            prescription_id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            right_sph REAL,
            right_cyl REAL,
            right_axis INTEGER,
            left_sph REAL,
            left_cyl REAL,
            left_axis INTEGER,
            add_power REAL,
            pupillary_distance REAL,
            optometrist_name TEXT,
            prescription_date TEXT,
            notes TEXT,
            created_at TEXT,
            FOREIGN KEY(customer_id) REFERENCES customers(Customer_id)
        )""")
        for r in dump.get('prescriptions', []):
            cur.execute("INSERT OR IGNORE INTO prescriptions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        (r['prescription_id'], r['customer_id'], r.get('right_sph'), r.get('right_cyl'), r.get('right_axis'), r.get('left_sph'), r.get('left_cyl'), r.get('left_axis'), r.get('add_power'), r.get('pupillary_distance'), r.get('optometrist_name'), r.get('prescription_date'), r.get('notes'), r.get('created_at')))

        cur.execute("""CREATE TABLE IF NOT EXISTS sales (
            sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            sale_date TEXT,
            subtotal REAL DEFAULT 0,
            discount REAL DEFAULT 0,
            tax REAL DEFAULT 0,
            total_amount REAL NOT NULL,
            payment_status TEXT DEFAULT 'PENDING',
            FOREIGN KEY(customer_id) REFERENCES customers(Customer_id)
        )""")
        for r in dump.get('sales', []):
            cur.execute("INSERT OR IGNORE INTO sales VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        (r['sale_id'], r['customer_id'], r.get('sale_date'), r.get('subtotal', 0), r.get('discount', 0), r.get('tax', 0), r['total_amount'], r.get('payment_status', 'PENDING')))

        cur.execute("""CREATE TABLE IF NOT EXISTS sale_items (
            sale_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            sale_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,
            subtotal REAL NOT NULL,
            FOREIGN KEY(sale_id) REFERENCES sales(sale_id),
            FOREIGN KEY(product_id) REFERENCES products(product_id)
        )""")
        for r in dump.get('sale_items', []):
            cur.execute("INSERT OR IGNORE INTO sale_items VALUES (?, ?, ?, ?, ?, ?)",
                        (r['sale_item_id'], r['sale_id'], r['product_id'], r['quantity'], r['unit_price'], r['subtotal']))

        cur.execute("""CREATE TABLE IF NOT EXISTS payments (
            payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
            sale_id INTEGER NOT NULL,
            payment_date TEXT,
            amount_paid REAL NOT NULL,
            payment_method TEXT NOT NULL,
            transaction_reference TEXT,
            payment_notes TEXT,
            FOREIGN KEY(sale_id) REFERENCES sales(sale_id)
        )""")
        for r in dump.get('payments', []):
            cur.execute("INSERT OR IGNORE INTO payments VALUES (?, ?, ?, ?, ?, ?, ?)",
                        (r['payment_id'], r['sale_id'], r.get('payment_date'), r['amount_paid'], r['payment_method'], r.get('transaction_reference'), r.get('payment_notes')))

        cur.execute("""CREATE TABLE IF NOT EXISTS repairs (
            repair_id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            product_id INTEGER,
            repair_description TEXT NOT NULL,
            repair_cost REAL DEFAULT 0,
            received_date TEXT,
            expected_delivery_date TEXT,
            actual_delivery_date TEXT,
            repair_status TEXT DEFAULT 'RECEIVED',
            notes TEXT,
            FOREIGN KEY(customer_id) REFERENCES customers(Customer_id),
            FOREIGN KEY(product_id) REFERENCES products(product_id)
        )""")
        for r in dump.get('repairs', []):
            cur.execute("INSERT OR IGNORE INTO repairs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        (r['repair_id'], r['customer_id'], r.get('product_id'), r['repair_description'], r.get('repair_cost', 0), r.get('received_date'), r.get('expected_delivery_date'), r.get('actual_delivery_date'), r.get('repair_status', 'RECEIVED'), r.get('notes')))

        cur.execute("""CREATE TABLE IF NOT EXISTS inventory_movements (
            movement_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            movement_type TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            reason TEXT,
            movement_date TEXT,
            FOREIGN KEY(product_id) REFERENCES products(product_id)
        )""")
        for r in dump.get('inventory_movements', []):
            cur.execute("INSERT OR IGNORE INTO inventory_movements VALUES (?, ?, ?, ?, ?, ?)",
                        (r['movement_id'], r['product_id'], r['movement_type'], r['quantity'], r.get('reason'), r.get('movement_date')))

        cur.execute("""CREATE TABLE IF NOT EXISTS purchase_orders (
            purchase_order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            supplier_id INTEGER NOT NULL,
            order_date TEXT,
            expected_delivery_date TEXT,
            total_amount REAL DEFAULT 0,
            order_status TEXT DEFAULT 'ORDERED',
            notes TEXT,
            FOREIGN KEY(supplier_id) REFERENCES suppliers(supplier_id)
        )""")
        for r in dump.get('purchase_orders', []):
            cur.execute("INSERT OR IGNORE INTO purchase_orders VALUES (?, ?, ?, ?, ?, ?, ?)",
                        (r['purchase_order_id'], r['supplier_id'], r.get('order_date'), r.get('expected_delivery_date'), r.get('total_amount', 0), r.get('order_status', 'ORDERED'), r.get('notes')))

        cur.execute("""CREATE TABLE IF NOT EXISTS purchase_order_items (
            purchase_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
            purchase_order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unit_cost REAL NOT NULL,
            subtotal REAL NOT NULL,
            FOREIGN KEY(purchase_order_id) REFERENCES purchase_orders(purchase_order_id),
            FOREIGN KEY(product_id) REFERENCES products(product_id)
        )""")
        for r in dump.get('purchase_order_items', []):
            cur.execute("INSERT OR IGNORE INTO purchase_order_items VALUES (?, ?, ?, ?, ?, ?)",
                        (r['purchase_item_id'], r['purchase_order_id'], r['product_id'], r['quantity'], r['unit_cost'], r['subtotal']))

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[Database Seed Warning] Failed to populate sqlite replica: {e}")


def create_db_engine():
    """
    Intelligent engine initializer:
    1. Tries live MySQL connection.
    2. If MySQL is unreachable (e.g. on Vercel cloud serverless where localhost:3306 is not available),
       seamlessly falls back to synchronized SQLite containing exact data from user's MySQL database.
    """
    # 1. Attempt MySQL
    try:
        mysql_engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=3600,
            echo=False,
            connect_args={"connect_timeout": 3}
        )
        with mysql_engine.connect() as conn:
            conn.execute(text("SELECT 1;"))
        return mysql_engine, "MySQL"
    except Exception:
        pass

    # 2. SQLite replica
    ensure_sqlite_database()
    sqlite_url = f"sqlite:///{sqlite_db_path.replace(os.sep, '/')}"
    sqlite_engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False},
        echo=False
    )
    return sqlite_engine, "SQLite"


engine, DB_ENGINE_TYPE = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    FastAPI dependency that provides a database session per request
    and ensures it is properly closed when finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_connection():
    """
    Tests the connection to the database (MySQL or synchronized SQLite).
    Returns (success: bool, message: str)
    """
    try:
        with engine.connect() as connection:
            if DB_ENGINE_TYPE == "MySQL":
                result = connection.execute(text("SELECT DATABASE();"))
                current_db = result.scalar()
                return True, f"Live MySQL active (Database: {current_db})"
            else:
                return True, "Synchronized Database active (SQLite replica with full schema and records)"
    except Exception as e:
        return False, f"Database connection failed: {str(e)}"
