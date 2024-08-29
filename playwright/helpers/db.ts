import pg from "pg";

const { Pool } = pg;

export const getDatabase = () => {
  return new Pool({
    connectionString: process.env.DATABASE_URL!,
  });
};
