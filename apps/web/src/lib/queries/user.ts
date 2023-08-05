import {prisma, type User} from "@echo-webkom/db";

export const getUserById = async (id: User["id"]) => {
  return await prisma.user.findUnique({
    where: {id},
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
  return await prisma.user.findMany();
};
