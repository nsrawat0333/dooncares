import os
from urllib.parse import urlparse, quote_plus, unquote
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback to local SQLite if DATABASE_URL is not set
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./dooncares.db"

# Render / Heroku compatibility fix for postgres:// URL prefix
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Safely escape special characters in password if PostgreSQL URL is provided
if DATABASE_URL.startswith("postgresql://"):
    try:
        url_obj = urlparse(DATABASE_URL)
        if url_obj.password:
            raw_password = unquote(url_obj.password)
            safe_password = quote_plus(raw_password)
            username = url_obj.username or "postgres"
            hostname = url_obj.hostname or "localhost"
            port = url_obj.port or 5432
            dbname = url_obj.path.lstrip('/') or "DoonCares_db"
            DATABASE_URL = f"postgresql://{username}:{safe_password}@{hostname}:{port}/{dbname}"
    except Exception as e:
        print(f"[DB WARN] URL parsing warning: {e}")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

print(f"[DB INFO] Target database URL configured: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
    # Test connection
    with engine.connect() as conn:
        print("[DB SUCCESS] Successfully connected to PostgreSQL database!")
except Exception as db_err:
    print(f"[DB WARN] Could not connect to PostgreSQL: {db_err}")
    print("[DB INFO] Falling back to local SQLite database so server can run smoothly...")
    DATABASE_URL = "sqlite:///./dooncares.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
