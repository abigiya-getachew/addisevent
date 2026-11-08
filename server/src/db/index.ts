import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env');
}

const sql = postgres(process.env.DATABASE_URL!, {
  max: 10,
  prepare: false,
});

export const db = drizzle(sql, { schema });
export { schema };