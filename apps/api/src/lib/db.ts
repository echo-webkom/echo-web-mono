import { createDatabase, createPool } from "@echo-webkom/db/create";

export const client = createPool();
export const db = createDatabase(client);
