import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { ENV_SERVER } from '@/config/server.config';

import * as schema from './schema';

const globalForSqlite = global as unknown as { sqlite: Database.Database | undefined };
const sqlite = globalForSqlite.sqlite ?? new Database(ENV_SERVER.SQLITE_DB_PATH || 'sqlite.db');

if (process.env.NODE_ENV !== 'production') {
  globalForSqlite.sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
