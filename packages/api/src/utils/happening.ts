import {type PrismaClient} from "@echo-webkom/db";

export const userIsAlreadyRegistered = async (
  prisma: PrismaClient,
  happeningSlug: string,
  userId: string,
) => {
  const isAlreadyRegistered = await prisma.registration.findUnique({
    where: {
      userId_happeningSlug: {
        happeningSlug,
        userId,
      },
    },
  });

  return isAlreadyRegistered !== null;
};
