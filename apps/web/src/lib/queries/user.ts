import {cache} from "react";
import {type User} from "@prisma/client";

import {prisma} from "@echo-webkom/db/client";

export const getUserById = cache(async (id: User["id"]) => {
  return await prisma.user.findUnique({
    where: {id},
  });
});

export const getUserRegistrations = cache(async (id: User["id"]) => {
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
});

export const getUserStudentGroups = cache(async (id: User["id"]) => {
  return await prisma.studentGroup.findMany({
    where: {
      users: {
        some: {
          id,
        },
      },
    },
  });
});

export const getAllUsers = cache(async () => {
  return await prisma.user.findMany();
});
