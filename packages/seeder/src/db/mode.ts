export const SeedMode = {
  PROD: "prod",
  DEV: "dev",
  TEST: "test",
} as const;

export type SeedMode = (typeof SeedMode)[keyof typeof SeedMode];

export const isSeedMode = (mode: string): mode is SeedMode => {
  return Object.values(SeedMode).includes(mode as SeedMode);
};
