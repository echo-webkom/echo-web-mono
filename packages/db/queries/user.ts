import {type User} from "@prisma/client";

import {prisma} from "../client";

export const getUserById = async (id: User["id"]) => {
  return await prisma.user.findUnique({
    where: {id},
  });
};

export const getUserHappenings = async (id: User["id"]) => {
  return await prisma.happening.findMany({
    where: {
      registrations: {
        some: {
          userId: id,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};
