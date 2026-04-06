import { defineConfig } from 'drizzle-kit';

console.log('SQLITE_DB_PATH >>> ', process.env.SQLITE_DB_PATH);
export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.SQLITE_DB_PATH || './data/sqlite.db',
  },
});
