import os
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

# URL-encode password in case it contains special characters
encoded_password = quote_plus(DB_PASSWORD)

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
)

# SQLAlchemy Engine
# Note: pool_pre_ping ensures connections are alive before using them
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base for models
# IMPORTANT: Base.metadata.create_all(bind=engine) MUST NEVER BE CALLED.
# Tables are already created manually in MySQL Workbench.
Base = declarative_base()


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
    Tests the connection to the existing MySQL database.
    Returns (success: bool, message: str)
    """
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT DATABASE();"))
            current_db = result.scalar()
            return True, f"Successfully connected to database: {current_db}"
    except Exception as e:
        return False, f"Database connection failed: {str(e)}"

