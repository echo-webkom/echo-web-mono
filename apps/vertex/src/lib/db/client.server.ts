import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@echo-webkom/db/schemas';
import { DATABASE_URL } from '$env/static/private';

const pg = postgres(DATABASE_URL);
export const db = drizzle(pg, {
	schema,
	casing: 'snake_case'
});
