import { LibsqlError } from "@libsql/client";

export const isDatabaseError = (error: unknown): error is LibsqlError => {
  return error instanceof LibsqlError && "code" in error;
};

export const SQLITE_CONSTRAINT_UNIQUE = "2067";
