import { revalidateTag } from "next/cache";

export const cacheKeyFactory = {
  registrationsHappening: (id: string) => `registration-happening-${id}`,
  registrationsUser: (id: string) => `registration-user-${id}`,
};

export const revalidateRegistrations = (happeningId: string, userId: string) => {
  revalidateTag(cacheKeyFactory.registrationsHappening(happeningId), "max");
  revalidateTag(cacheKeyFactory.registrationsUser(userId), "max");
};
