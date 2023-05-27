import {type Happening, type User} from "@prisma/client";

import {prisma} from "../client";

export const getHappeningBySlug = async (slug: Happening["slug"]) => {
  return await prisma.happening.findUnique({
    where: {slug},
    include: {
      questions: true,
      studentGroups: true,
    },
  });
};

export const isUserRegistered = async (id: User["id"], slug: Happening["slug"]) => {
  const registration = await prisma.registration.findUnique({
    where: {
      userId_happeningSlug: {
        happeningSlug: slug,
        userId: id,
      },
    },
  });

  return registration?.status === "REGISTERED";
};
