export const cacheKeyFactory = {
  spots: "posts",
  registrations: (id: string) => `registration-${id}`,
};
