export const xpToLevel = (xp: number) => {
  return Math.round(Math.sqrt(xp / 200));
};

export const levelToXp = (level: number) => {
  return 200 * level * level;
};
