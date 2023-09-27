import { prisma, type User } from "@echo-webkom/db";

export async function getUserById(id: User["id"]) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserRegistrations(id: User["id"]) {
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
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}
