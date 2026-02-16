const days = (n: number) => n * 24 * 60 * 60 * 1000;

export const futureDate = (daysFromNow: number) =>
  new Date(Date.now() + days(daysFromNow)).toISOString();

export const pastDate = (daysAgo: number) => new Date(Date.now() - days(daysAgo)).toISOString();

export const ref = (id: string, _key?: string) => ({ _type: "reference" as const, _ref: id, _key });
