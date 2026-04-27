import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import { ENV_SERVER } from '@/config/server.config';

import * as schema from './schema';

const client = createClient({
  url: ENV_SERVER.TURSO_CONNECTION_URL || `file:${ENV_SERVER.SQLITE_DB_PATH}`,
  authToken: ENV_SERVER.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

