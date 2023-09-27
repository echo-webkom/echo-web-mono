import { prisma, type Registration } from "@echo-webkom/db";

import { type Result } from "./utils";

export async function getRegistrationBySlug(
  slug: Registration["happeningSlug"],
): Promise<Result<Array<Registration>>> {
  try {
    const data = await prisma.registration.findMany({
      where: {
        happeningSlug: slug,
      },
    });

    return {
      data,
    };
  } catch {
    return {
      error: "Failed to get registration",
    };
  }
}

export async function getRegistrationBySlugAndUserId(
  slug: Registration["happeningSlug"],
  userId: Registration["userId"],
): Promise<Result<Registration | null>> {
  try {
    const data = await prisma.registration.findUnique({
      where: {
        userId_happeningSlug: {
          happeningSlug: slug,
          userId,
        },
      },
    });

    return {
      data,
    };
  } catch {
    return {
      error: "Failed to get registration",
    };
  }
}
