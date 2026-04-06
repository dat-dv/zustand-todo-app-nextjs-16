import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQLITE_DB_PATH = process.env.SQLITE_DB_PATH || './data/sqlite.db';
const MIGRATIONS_FOLDER = path.join(__dirname, '../drizzle');

/**
 * Migration execution environment
 */
const main = async () => {
  // Create directory if not exists
  const dbDir = path.dirname(SQLITE_DB_PATH);
  if (dbDir !== '.' && !fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const sqlite = new Database(SQLITE_DB_PATH);
  const db = drizzle(sqlite);

  console.log('>>> Standard Migration Protocol Initialized...');
  console.log(`>>> Target DB: ${SQLITE_DB_PATH}`);

  try {
    if (!fs.existsSync(MIGRATIONS_FOLDER)) {
      console.warn('>>> Warning: Migrations folder not found. Skipping migration.');
      process.exit(0);
    }

    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
    console.log('>>> Migration: OK (Database is up-to-date)');
    process.exit(0);
  } catch (err) {
    console.error('>>> Migration Error:', err);
    process.exit(1);
  }
};

main();
