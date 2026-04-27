import { defineConfig } from 'drizzle-kit';

console.log('SQLITE_DB_PATH >>> ', process.env.SQLITE_DB_PATH);
const isTurso = !!process.env.TURSO_CONNECTION_URL;

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: isTurso ? 'turso' : 'sqlite',
  dbCredentials: isTurso
    ? {
        url: process.env.TURSO_CONNECTION_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: process.env.SQLITE_DB_PATH || './data/sqlite.db',
      },
});

