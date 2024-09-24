/**
 * PostgresError is hærk to work with. Just check if it has a code property.
 * We can deduct enough information from that.
 *
 * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export type PostgresIshError = {
  code: string;
};

export const isPostgresIshError = (e: unknown): e is PostgresIshError => {
  if (typeof e !== "object" || e === null) {
    return false;
  }

  return "code" in e && e instanceof Error;
};
