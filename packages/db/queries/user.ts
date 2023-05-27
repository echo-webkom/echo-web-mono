import {type User} from "@prisma/client";

import {prisma} from "../client";

export const getUserById = async (id: User["id"]) => {
  return await prisma.user.findUnique({
    where: {id},
    include: {
      studentGroups: true,
    },
  });
};

export const getUserRegistrations = async (id: User["id"]) => {
  return await prisma.registration.findMany({
    where: {
      userId: id,
    },
    include: {
      happening: {
        select: {
          slug: true,
          date: true,
          title: true,
          type: true,
        },
      },
    },
    orderBy: {
      happening: {
        date: "desc",
      },
    },
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    include: {
      studentGroups: true,
    },
  });
};
