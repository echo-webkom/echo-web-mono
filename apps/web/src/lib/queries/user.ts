import { Prisma, prisma, type User } from "@echo-webkom/db";

import { type Result } from "./utils";

export async function getUserById(id: User["id"]): Promise<Result<User | null>> {
  try {
    const data = await prisma.user.findUnique({
      where: { id },
    });

    return {
      data,
    };
  } catch {
    return {
      error: "Failed to get user",
    };
  }
}

const registrationWithHappenings = Prisma.validator<Prisma.RegistrationDefaultArgs>()({
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
});

type RegistrationWithHappenings = Prisma.RegistrationGetPayload<typeof registrationWithHappenings>;

export async function getUserRegistrations(
  id: User["id"],
): Promise<Result<Array<RegistrationWithHappenings>>> {
  try {
    const data = await prisma.registration.findMany({
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

    return {
      data,
    };
  } catch {
    return {
      error: "Failed to get user registrations",
    };
  }
}

export async function getAllUsers(): Promise<Result<Array<User>>> {
  try {
    const data = await prisma.user.findMany();

    return {
      data,
    };
  } catch {
    return {
      error: "Failed to get all users",
    };
  }
}
