import 'server-only';
import { z } from 'zod';

export const serverEnvSchema = z.object({
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),

  SQLITE_DB_PATH: z.string().min(1).default('sqlite.db'),

  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  IS_DEBUG: z
    .string()
    .optional()
    .default('false')
    .transform((v) => v === 'true'),
});

const parsed = serverEnvSchema.safeParse({
  JWT_SECRET: process.env.JWT_SECRET,
  SQLITE_DB_PATH: process.env.SQLITE_DB_PATH,
  NODE_ENV: process.env.NODE_ENV,
  IS_DEBUG: process.env.IS_DEBUG,
});

if (!parsed.success) {
  console.error('❌ Invalid SERVER env:', parsed.error.flatten());
  throw new Error('Invalid server environment variables');
}

export const ENV_SERVER = Object.assign(parsed.data, {
  NODE_ENV: process.env.NODE_ENV,
  IS_PROD: parsed.data.NODE_ENV === 'production',
  IS_DEV: parsed.data.NODE_ENV === 'development',
  IS_DEBUG: parsed.data.IS_DEBUG,
});
