import Database from 'better-sqlite3';

const sqlite = new Database('sqlite.db');

console.log('Migrating existing positions for todos...');

try {
  // 1. Manually add the column to bypass drizzle-kit crash
  sqlite.exec(`ALTER TABLE todos ADD COLUMN "position" integer DEFAULT 0`);
  console.log('Added position column successfully.');
} catch (err: any) {
  if (!err.message.includes('duplicate column name')) {
    throw err;
  }
}

// 2. Convert ISO string created_at to milliseconds and update position
sqlite.exec(`
  UPDATE todos 
  SET "position" = CAST(strftime('%s', created_at) AS INTEGER) * 1000 
  WHERE "position" = 0 OR "position" IS NULL
`);

console.log('Migration completed successfully.');
