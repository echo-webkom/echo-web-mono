export const xpToLevel = (xp: number) => {
  return Math.round(Math.sqrt(xp / 200));
};

export const levelToXp = (level: number) => {
  return 200 * level * level;
};

export const calculateXpFromHappening = (amountOfRegistered: number, cost: number, type: number){
  return Math.round(((amountOfRegistered**1.5)/10 + (cost / 5) + type))
}