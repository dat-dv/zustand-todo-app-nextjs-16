import fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { ENV_SERVER } from '@/config/server.config';

import * as schema from './schema';

const globalForSqlite = global as unknown as { sqlite: Database.Database | undefined };

const dbPath = ENV_SERVER.SQLITE_DB_PATH || './data/sqlite.db';

// Ensure parent directory exists for SQLite
const dbDir = path.dirname(path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath));
if (dbDir !== '.' && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = globalForSqlite.sqlite ?? new Database(dbPath);

if (process.env.NODE_ENV !== 'production') {
  globalForSqlite.sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
