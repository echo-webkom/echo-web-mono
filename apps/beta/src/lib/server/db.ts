import { createPool, createDatabase } from '@echo-webkom/db/create';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

export const pool = createPool();
export const db = createDatabase(pool);
