import { createDatabase, createPool } from "./create";

export const db = createDatabase(createPool());
