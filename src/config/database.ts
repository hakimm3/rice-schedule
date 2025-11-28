import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import type BetterSqlite3 from 'better-sqlite3';

dotenv.config();

// SQLite database path - use /tmp for serverless (Vercel)
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel 
  ? '/tmp/rice_app.db' 
  : (process.env.DB_PATH || path.join(__dirname, '../../data/rice_app.db'));

// Ensure data directory exists (only for local)
if (!isVercel) {
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

// Create SQLite database connection
export const db: BetterSqlite3.Database = new Database(dbPath, { 
  verbose: isVercel ? undefined : console.log 
});

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
const initSchema = () => {
  db.exec(`
    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      last_buy_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Create transactions table
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      kg REAL NOT NULL,
      price REAL NOT NULL,
      prove_image TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

    -- Create triggers for updated_at
    CREATE TRIGGER IF NOT EXISTS update_users_updated_at
    AFTER UPDATE ON users
    BEGIN
      UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

    CREATE TRIGGER IF NOT EXISTS update_transactions_updated_at
    AFTER UPDATE ON transactions
    BEGIN
      UPDATE transactions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `);
};

// Test database connection
export const testConnection = async () => {
  try {
    initSchema();
    console.log('✅ SQLite database connected successfully');
    console.log('📁 Database location:', dbPath);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Graceful shutdown
process.on('exit', () => db.close());
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
