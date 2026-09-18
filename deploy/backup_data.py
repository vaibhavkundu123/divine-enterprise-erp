import os
import sqlite3
import zipfile
from datetime import datetime
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "app.db"
BACKUP_DIR = DATA_DIR / "backups"
BACKUP_DIR.mkdir(parents=True, exist_ok=True)

MAX_BACKUPS_TO_KEEP = 30

def create_online_backup():
    """
    Creates a consistent SQLite backup using the Online Backup API,
    safely handling concurrent read/write operations without locking.
    """
    if not DB_PATH.exists():
        print(f"[ERROR] Database file not found at {DB_PATH}")
        return

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    temp_db_backup = BACKUP_DIR / f"app_temp_{timestamp}.db"
    zip_backup_path = BACKUP_DIR / f"enterprise_backup_{timestamp}.zip"

    print(f"[{timestamp}] Initiating zero-lock SQLite online backup...")

    # 1. Online SQLite Backup
    src_conn = sqlite3.connect(str(DB_PATH))
    dst_conn = sqlite3.connect(str(temp_db_backup))

    try:
        with dst_conn:
            src_conn.backup(dst_conn, pages=100)
        print("[OK] SQLite memory-to-disk online page sync completed.")
    finally:
        dst_conn.close()
        src_conn.close()

    # 2. Package into compressed ZIP archive with CSVs
    print(f"Packaging into compressed archive: {zip_backup_path.name}...")
    with zipfile.ZipFile(zip_backup_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(temp_db_backup, arcname="app.db")

        # Also backup flat CSV files in data/
        for csv_file in DATA_DIR.glob("*.csv"):
            zipf.write(csv_file, arcname=csv_file.name)

    # Remove temporary raw db file
    if temp_db_backup.exists():
        temp_db_backup.unlink()

    print(f"[SUCCESS] Backup archive created: {zip_backup_path} ({zip_backup_path.stat().st_size / 1024:.1f} KB)")

    # 3. Retention pruning
    prune_old_backups()

def prune_old_backups(max_keep: int = MAX_BACKUPS_TO_KEEP):
    archives = sorted(list(BACKUP_DIR.glob("enterprise_backup_*.zip")), key=os.path.getmtime)
    if len(archives) > max_keep:
        to_delete = archives[: len(archives) - max_keep]
        print(f"Pruning {len(to_delete)} older backup archive(s)...")
        for old_f in to_delete:
            old_f.unlink()
            print(f" - Removed: {old_f.name}")

if __name__ == "__main__":
    create_online_backup()
