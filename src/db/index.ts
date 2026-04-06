import fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { ENV_SERVER } from '@/config/server.config';

import * as schema from './schema';

const globalForSqlite = global as unknown as { sqlite: Database.Database | undefined };

// --- 1. Centralized Database Path Resolution ---
const getDbPath = () => {
  const envPath = ENV_SERVER.SQLITE_DB_PATH || '/app/data/sqlite.db';
  // Standardize: if relative, move to /app/data for persistence
  if (envPath.startsWith('./') || !path.isAbsolute(envPath)) {
    const fileName = path.basename(envPath);
    return path.join('/app/data', fileName);
  }
  return envPath;
};

const dbPath = getDbPath();
const dbDir = path.dirname(dbPath);

// --- 2. Guaranteed Directory Creation ---
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// --- 3. SQLite Connection ---
const sqlite = globalForSqlite.sqlite ?? new Database(dbPath);
if (process.env.NODE_ENV !== 'production') {
  globalForSqlite.sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });

// --- 4. Runtime Migrations (Architecture Cleanup) ---
try {
  const migrationsFolder = path.join(process.cwd(), 'drizzle');
  if (fs.existsSync(migrationsFolder)) {
    console.log(`>>> Starting Database Migrations (Path: ${dbPath})`);
    migrate(db, { migrationsFolder });
    console.log('>>> Database Migrations completed successfully.');
  } else {
    console.warn(`>>> Migrations folder not found at ${migrationsFolder}. Skipping.`);
  }
} catch (error) {
  console.error('❌ Database Migration failed:', error);
}
