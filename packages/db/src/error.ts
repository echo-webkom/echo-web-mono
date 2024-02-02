import { LibsqlError } from "@libsql/client";

export const isDatabaseError = (error: unknown): error is LibsqlError => {
  return error instanceof LibsqlError;
};

export const SQLITE_CONSTRAINT_UNIQUE = "2067";
