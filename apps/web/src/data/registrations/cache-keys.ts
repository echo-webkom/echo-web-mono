export const cacheKeyFactory = {
  registrationsHappening: (id: string) => `registration-happening-${id}`,
  registrationsUser: (id: string) => `registration-user-${id}`,
};
