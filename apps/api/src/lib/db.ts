import { createDatabase, createPool } from "@echo-webkom/db/create";

const pool = createPool();
export const db = createDatabase(pool);
