import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TURSO_CONNECTION_URL = process.env.TURSO_CONNECTION_URL || `file:${process.env.SQLITE_DB_PATH || './data/sqlite.db'}`;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
const MIGRATIONS_FOLDER = path.join(__dirname, '../drizzle');

const main = async () => {
  console.log('>>> LibSQL Migration Protocol Initialized...');
  console.log(`>>> Target URL: ${TURSO_CONNECTION_URL}`);

  const client = createClient({
    url: TURSO_CONNECTION_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  const db = drizzle(client);

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

